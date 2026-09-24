// Metres. Wider, level jaws around a 95 mm CORE; one geometry for visuals and physics.
export const RING_GROUP=0x00040007;
export const SOLID_GROUP=0x00010005;
export const JAW_GROUP=0x00020004;
export const JAW_RADIUS=.057, JAW_WIDTH=.012, JAW_ARC=65*Math.PI/180;
export const jawOffset=closed=>closed?0:.036;
export function jawBoxes(closed=false){
 const offset=jawOffset(closed),count=10,step=2*JAW_ARC/count;
 return [
  {x:0,y:0,z:-.076,hx:.065,hy:.009,hz:.006,ry:0},
  ...[-1,1].flatMap(s=>Array.from({length:count},(_,i)=>{
   const a=-JAW_ARC+(i+.5)*step;
   return {x:s*(offset+JAW_RADIUS*Math.cos(a)),y:0,z:JAW_RADIUS*Math.sin(a),hx:JAW_WIDTH/2,hy:.009,hz:JAW_RADIUS*Math.sin(step/2)+.001,ry:-s*a};
  })),
 ];
}
export function ringInside(claw,core,yaw=0){
 const dx=core.x-claw.x,dz=core.z-claw.z;
 const lateral=Math.cos(yaw)*dx-Math.sin(yaw)*dz;
 const forward=Math.sin(yaw)*dx+Math.cos(yaw)*dz;
 return Math.abs(lateral)<=.025&&Math.abs(forward)<=.018&&Math.abs(core.y-claw.y)<=.025;
}
