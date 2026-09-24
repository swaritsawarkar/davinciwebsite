// Metres. Coordinates estimated from manual PDF page 8, Fig 3.1 (not CAD).
export const SIZE=3.6576;
export const COLORS={red:0xf13f59,blue:0x356bff,gold:0xffcb45};
export const POLES=['red','blue'].flatMap(team=>{
 const s=team==='red'?-1:1;
 return [...[-.6096,0,.6096].map((x,i)=>({id:`${team}-high-${i}`,team,type:'HIGH',x,z:s*.6096,height:.13})),...[-.6096,.6096].map((x,i)=>({id:`${team}-star-${i}`,team,type:'STAR',x,z:s*1.524,height:.1}))];
});
export const SPIKES=[[-.6096,.40],[0,.11],[.6096,.40]].flatMap(([x,z])=>[{x,z,team:'red'},{x,z:-z,team:'blue'}]);
export const START={x:0,y:.115,z:-1.59};
export {ringInside as canGrab} from './gripper.js';
