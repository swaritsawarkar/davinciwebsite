import * as THREE from 'three';
import RAPIER from '@dimforge/rapier3d-compat';
import {jawBoxes,SOLID_GROUP} from './gripper.js';
import {START} from './field.js';
export const REST_ARM=-.30;
export const STATION={halfWidth:.23,halfLength:.50,height:.182,rampLength:.40};
export function ringParts(center){return Array.from({length:12},(_,i)=>{const a=i*Math.PI/6;return {position:new THREE.Vector3(center.x+Math.cos(a)*.0375,center.y,center.z+Math.sin(a)*.0375),rotation:{x:0,y:Math.sin(-a/2),z:0,w:Math.cos(-a/2)},shape:new RAPIER.Cuboid(.011,.015,.010)};});}
export function createMotion(world){
 const body=world.createRigidBody(RAPIER.RigidBodyDesc.kinematicPositionBased().setTranslation(START.x,START.y,START.z));
 const collider=world.createCollider(RAPIER.ColliderDesc.cuboid(.169,.10,.168).setMass(2).setCollisionGroups(SOLID_GROUP),body);
 const controller=world.createCharacterController(.002);controller.setMaxSlopeClimbAngle(Math.PI/4);controller.setMinSlopeSlideAngle(Math.PI/3);controller.enableSnapToGround(.045);controller.disableAutostep();controller.setApplyImpulsesToDynamicBodies(true);controller.setCharacterMass(2);
 let yaw=0,angle=REST_ARM,pitch=0,roll=0,vertical=0,blocked=false,wheelAngles=[0,0,0,0];
 const position=new THREE.Vector3(START.x,START.y,START.z),previous=position.clone();let prevYaw=0,prevAngle=angle,prevPitch=0,prevRoll=0,prevWheels=[0,0,0,0];
 const quaternion=(heading,p=0,r=0)=>new THREE.Quaternion().setFromEuler(new THREE.Euler(p,heading,r,'YXZ'));
 const solid=c=>c.parent()===null;
 function intersect(part,predicate=solid){let hit=false;world.intersectionsWithShape(part.position,part.rotation,part.shape,()=>{hit=true;return false;},undefined,undefined,undefined,body,predicate);return hit;}
 function terrainHeight(x,z){let h=0;for(const s of [-1,1])if(Math.abs(x-s*1.51)<=STATION.halfWidth){const d=Math.abs(z);if(d<=STATION.halfLength)h=STATION.height;else if(d<STATION.halfLength+STATION.rampLength)h=STATION.height*(1-(d-STATION.halfLength)/STATION.rampLength);}return h;}
 function slope(p,heading){const f=new THREE.Vector3(Math.sin(heading)*.092,0,Math.cos(heading)*.092),side=new THREE.Vector3(Math.cos(heading)*.145,0,-Math.sin(heading)*.145);const front=terrainHeight(p.x+f.x,p.z+f.z),back=terrainHeight(p.x-f.x,p.z-f.z),right=terrainHeight(p.x+side.x,p.z+side.z),left=terrainHeight(p.x-side.x,p.z-side.z);return {pitch:THREE.MathUtils.clamp(-Math.atan2(front-back,.184),-.45,.45),roll:THREE.MathUtils.clamp(Math.atan2(right-left,.29),-.3,.3)};}
 function parts(p=position,heading=yaw,lift=angle,closed=false,carrying=false,tilt={pitch,roll}){
  const base=quaternion(heading,tilt.pitch,tilt.roll),armQ=base.clone().multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0),-lift));
  const pivot=new THREE.Vector3(0,0,.065).applyQuaternion(base).add(p);
  const at=(v,q=armQ,origin=pivot)=>v.applyQuaternion(q).add(origin);
  const pieces=[-.035,.035].map(x=>({position:at(new THREE.Vector3(x,0,.105)),rotation:armQ,shape:new RAPIER.Cuboid(.007,.009,.105)}));
  for(const z of [.015,.215])pieces.push({position:at(new THREE.Vector3(0,0,z)),rotation:armQ,shape:new RAPIER.Cuboid(.0275,.0185,.02)});
  const claw=at(new THREE.Vector3(0,0,.265));
  const clawRotation=quaternion(heading);
  const jawPieces=jawBoxes(closed).map(b=>({position:at(new THREE.Vector3(b.x,b.y,b.z),clawRotation,claw),rotation:clawRotation.clone().multiply(quaternion(b.ry||0)),shape:new RAPIER.Cuboid(b.hx,b.hy,b.hz)}));
  pieces.push(...jawPieces);
  if(carrying)pieces.push(...ringParts(claw));return {pieces,claw,base,clawRotation,jawPieces};
 }
 function pathClear(from,to,predicate=solid){for(let i=0;i<to.length;i++){if(intersect(to[i],predicate))return false;if(from[i]){const delta=to[i].position.clone().sub(from[i].position);if(delta.lengthSq()>1e-10&&world.castShape(from[i].position,from[i].rotation,delta,from[i].shape,0,1,false,undefined,undefined,undefined,body,predicate))return false;}}return true;}
 function attachmentClear(p,h,a,closed,held,tilt){return pathClear(parts(position,yaw,angle,closed,held).pieces,parts(p,h,a,closed,held,tilt).pieces);}
 return {body,collider,parts,terrainHeight,ringClear(from,to){return pathClear(ringParts(from),ringParts(to));},canClose(closed,held){return pathClear(parts(position,yaw,angle,!closed,held).pieces,parts(position,yaw,angle,closed,held).pieces);},
  step(input,dt,closed,held){previous.copy(position);prevYaw=yaw;prevAngle=angle;prevPitch=pitch;prevRoll=roll;prevWheels=[...wheelAngles];blocked=false;
   for(let i=0;i<3;i++){const next=yaw-input.steer*dt*2.2*(input.slow?.4:1)/3;const shape={position,rotation:quaternion(next),shape:collider.shape};const chassisHit=intersect(shape,solid);if(!chassisHit&&attachmentClear(position,next,angle,closed,held,{pitch,roll}))yaw=next;else if(input.steer)blocked=true;const lift=THREE.MathUtils.clamp(angle+input.lift*dt*.95/3,REST_ARM,1.25);if(attachmentClear(position,yaw,lift,closed,held,{pitch,roll}))angle=lift;else if(input.lift)blocked=true;}
   body.setRotation(quaternion(yaw),true);vertical=Math.max(vertical-9.81*dt,-3);const speed=input.throttle*(input.slow?.17:.65);const desired={x:Math.sin(yaw)*speed*dt,y:vertical*dt,z:Math.cos(yaw)*speed*dt};controller.computeColliderMovement(collider,desired,undefined,SOLID_GROUP,c=>c.parent()!==body && (!held||c.parent()!==held.body));const movement=controller.computedMovement();const next=position.clone().add(new THREE.Vector3(movement.x,movement.y,movement.z));const tilt=slope(next,yaw);
   if(attachmentClear(next,yaw,angle,closed,held,tilt)){position.copy(next);pitch=tilt.pitch;roll=tilt.roll;}else{blocked=true;const settle=position.clone();settle.y=next.y;if(attachmentClear(settle,yaw,angle,closed,held,{pitch,roll}))position.copy(settle);}
   if(controller.computedGrounded())vertical=0;
   if(Math.abs(speed)>.001&&Math.hypot(position.x-previous.x,position.z-previous.z)<.0001)blocked=true;
   body.setNextKinematicTranslation(position);body.setNextKinematicRotation(quaternion(yaw));
   const travel=(position.x-previous.x)*Math.sin(yaw)+(position.z-previous.z)*Math.cos(yaw),turn=yaw-prevYaw;
   wheelAngles=wheelAngles.map((a,i)=>a+(travel-(i<2?-.145:.145)*turn)/.074);
  },
  reset(p=START,heading=0,lift=REST_ARM){position.copy(p);previous.copy(p);yaw=prevYaw=heading;angle=prevAngle=lift;pitch=prevPitch=roll=prevRoll=vertical=0;wheelAngles=[0,0,0,0];prevWheels=[...wheelAngles];body.setTranslation(p,true);body.setNextKinematicTranslation(p);body.setRotation(quaternion(yaw),true);body.setNextKinematicRotation(quaternion(yaw));},
  render(alpha){return {position:previous.clone().lerp(position,alpha),yaw:THREE.MathUtils.lerp(prevYaw,yaw,alpha),angle:THREE.MathUtils.lerp(prevAngle,angle,alpha),pitch:THREE.MathUtils.lerp(prevPitch,pitch,alpha),roll:THREE.MathUtils.lerp(prevRoll,roll,alpha),wheelAngles:wheelAngles.map((a,i)=>THREE.MathUtils.lerp(prevWheels[i],a,alpha))};},
  get state(){return {position:position.clone(),yaw,angle,pitch,roll,blocked,wheelAngles:[...wheelAngles]};}
 };
}
