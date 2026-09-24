export const deadzone = (n=0) => Math.abs(n)<0.14 ? 0 : Math.sign(n)*(Math.min(1,Math.abs(n))-.14)/.86;
export function readControls(keys, pads=[]) {
  const pad=Array.from(pads).find(p=>p?.connected && p.mapping==='standard');
  const unsupported=Array.from(pads).find(p=>p?.connected && p.mapping!=='standard');
  const k=(...names)=>names.some(n=>keys.has(n))?1:0;
  const b=i=>pad?.buttons[i]?.value||0;
  return {lookX:deadzone(pad?.axes[2]),lookY:deadzone(pad?.axes[3]), throttle:Math.max(-1,Math.min(1,k('KeyW','ArrowUp')-k('KeyS','ArrowDown')-deadzone(pad?.axes[1]))),
    steer:Math.max(-1,Math.min(1,k('KeyD','ArrowRight')-k('KeyA','ArrowLeft')+deadzone(pad?.axes[0]))),
    lift:Math.max(-1,Math.min(1,k('KeyE')-k('KeyQ')+b(7)-b(6))),
    grab:!!(k('KeyF')||b(0)>.5),drop:!!(k('KeyG')||b(1)>.5),recover:!!(k('KeyT')||b(4)>.5),reset:!!(k('KeyR')||b(9)>.5),camera:!!(k('KeyC')||b(3)>.5),slow:!!(k('Space')||b(5)>.5),
    controller:pad?pad.id:unsupported?'Unsupported mapping — use keyboard':'No controller — keyboard ready',connected:!!pad };
}
export class Edges { previous={}; take(input,key){const hit=!!input[key]&&!this.previous[key];this.previous[key]=!!input[key];return hit;} }
