'use client';
import { useEffect, useRef } from 'react';

export default function EnergyField({ enabled }: { enabled: boolean }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const node = canvas.current;
    if (!node) return;
    const gl = node.getContext('webgl', {
      alpha: true,
      antialias: false,
      powerPreference: 'low-power',
    });
    if (!gl) return;
    const vsSource =
      'attribute vec2 position;void main(){gl_Position=vec4(position,0.,1.);}';
    const fsSource = `precision highp float;
  uniform vec2 resolution;uniform vec2 mouse;uniform float time;
  mat2 rot(float a){return mat2(cos(a),-sin(a),sin(a),cos(a));}
  float field(vec3 p){p.xy=rot(.42+sin(time*.15)*.12)*p.xy;p.yz=rot(1.02+mouse.y*.18)*p.yz;p.xz=rot(mouse.x*.18)*p.xz;return length(vec2(length(p.xz)-1.12,p.y))-.14;}
  void main(){vec2 uv=(gl_FragCoord.xy-.5*resolution)/resolution.y;vec3 ro=vec3(0.,0.,3.8);vec3 rd=normalize(vec3(uv*2.8,-3.));float d=0.;float h=1.;vec3 p;
   for(int i=0;i<48;i++){p=ro+rd*d;h=field(p);if(abs(h)<.001||d>7.)break;d+=h*.85;}
   vec3 col=vec3(.012,.012,.022);float glow=exp(-length(uv-vec2(.05,.02))*4.);col+=vec3(.07,.09,.36)*glow*.8;
   if(d<7.&&abs(h)<.005){vec2 e=vec2(.002,0.);vec3 n=normalize(vec3(field(p+e.xyy)-field(p-e.xyy),field(p+e.yxy)-field(p-e.yxy),field(p+e.yyx)-field(p-e.yyx)));vec3 r=reflect(rd,n);float spec=pow(max(dot(r,normalize(vec3(-.6,1.8,2.))),0.),34.);float spec2=pow(max(dot(r,normalize(vec3(1.5,-.8,2.))),0.),12.);float fres=pow(1.-max(dot(n,-rd),0.),2.);float bands=sin(r.y*13.+r.x*7.+time*.24)*.5+.5;col=mix(vec3(.07,.08,.2),vec3(.55,.64,.88),bands*.7);col+=vec3(.37,.38,1.)*spec2*1.7+vec3(1.,.9,1.)*spec*2.;col+=vec3(.95,.01,.52)*pow(max(r.x,0.),3.)+vec3(.18,.2,.8)*fres;}
   float grain=fract(sin(dot(gl_FragCoord.xy,vec2(12.98,78.23)))*43758.54)*.015;gl_FragColor=vec4(col+grain,1.);}`;
    const compile = (type: number, source: string) => {
      const s = gl.createShader(type);
      if (!s) return null;
      gl.shaderSource(s, source);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        gl.deleteShader(s);
        return null;
      }
      return s;
    };
    const vs = compile(gl.VERTEX_SHADER, vsSource),
      fs = compile(gl.FRAGMENT_SHADER, fsSource);
    if (!vs || !fs) return;
    const program = gl.createProgram()!;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    const activateProgram = gl.useProgram.bind(gl);
    activateProgram(program);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );
    const pos = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);
    const res = gl.getUniformLocation(program, 'resolution'),
      mp = gl.getUniformLocation(program, 'mouse'),
      tm = gl.getUniformLocation(program, 'time');
    let frame = 0,
      visible = true,
      tx = 0,
      ty = 0,
      x = 0,
      y = 0;
    const draw = (t: number) => {
      if (visible && !document.hidden) {
        x += (tx - x) * 0.04;
        y += (ty - y) * 0.04;
        gl.uniform2f(res, node.width, node.height);
        gl.uniform2f(mp, x, y);
        gl.uniform1f(tm, enabled ? t * 0.001 : 3);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      }
      if (enabled) frame = requestAnimationFrame(draw);
    };
    const resize = () => {
      const ratio = Math.min(devicePixelRatio, 1.1);
      node.width = Math.round(node.clientWidth * ratio);
      node.height = Math.round(node.clientHeight * ratio);
      gl.viewport(0, 0, node.width, node.height);
      if (!enabled) draw(0);
    };
    const pointer = (e: PointerEvent) => {
      tx = (e.clientX / innerWidth - 0.5) * 2;
      ty = (e.clientY / innerHeight - 0.5) * 2;
    };
    const observer = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
    });
    observer.observe(node);
    resize();
    draw(0);
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', pointer, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', pointer);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, [enabled]);
  return <canvas ref={canvas} className="energy-field" aria-hidden="true" />;
}
