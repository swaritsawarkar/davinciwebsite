import React,{useEffect,useRef,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {createSimulator} from './simulator.js';
import {CAMERA_DEFAULTS} from './camera.js';
import './style.css';
const controls=[['Drive / steer','WASD / arrows','Left stick'],['Arm down / up','Q / E','L2 / R2'],['Open / close claw','F','X'],['Drop CORE','G','Circle'],['Precision drive','Space','R1'],['Recover robot','T','L1'],['Camera','C','Triangle'],['Reset field','R','Options'],['Pause','P','']];
function App(){
 const host=useRef(),sim=useRef(),game=useRef();
 const [state,setState]=useState({ready:false,arm:0,grabber:'OPEN',held:'EMPTY',mode:'first',message:'Loading field and physics…'}),[error,setError]=useState(''),[settings,setSettings]=useState(false),[help,setHelp]=useState(true),[fullscreen,setFullscreen]=useState(false);
 useEffect(()=>{let cancelled=false;createSimulator(host.current,setState).then(s=>{if(cancelled)s.dispose();else sim.current=s;}).catch(e=>setError(e.message));return()=>{cancelled=true;sim.current?.dispose();};},[]);
 useEffect(()=>{const changed=()=>setFullscreen(!!document.fullscreenElement);document.addEventListener('fullscreenchange',changed);return()=>document.removeEventListener('fullscreenchange',changed);},[]);
 const act=name=>{sim.current?.command(name);document.activeElement?.blur();};
 const ranges=state.mode==='top'?[['zoom','Zoom',.65,2,.05]]:state.mode==='first'?[['eyeHeight','Eye height',.10,.32,.01],['lookPitch','Look angle',-.7,.35,.01],['fov','Field of view',35,85,1]]:[['height','Height',.35,2.5,.05],['distance','Distance',.55,3,.05],['fov','Field of view',35,85,1]];
 const full=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await game.current.requestFullscreen();}catch{setError('Fullscreen is unavailable here. Allow fullscreen on the website embed.');}};
 return <main className="game" ref={game} aria-label="HYPERDRIVE game">
  <section className="viewport" ref={host}/>
  <div className="hud-left">
   <div className="brand">HYPER<span>DRIVE</span><small>DRIVER LAB · FREE PRACTICE</small></div>
   <button className="help-toggle" aria-expanded={help} onClick={()=>{setHelp(!help);document.activeElement?.blur();}}>Controls {help?'−':'+'}</button>
   {help&&<div className="help panel"><div className="controls">{controls.map(([label,key,pad])=><div key={label}><span>{label}</span><b>{key}</b><small>{pad}</small></div>)}</div><p>Right-drag / right stick: look around<br/>Scroll: zoom / camera distance</p><p>Lower open jaws → surround a red ring → close → lift.</p></div>}
  </div>
  <nav className="toolbar" aria-label="Game menu">
   <button disabled={!state.ready} onClick={()=>act('camera')}>Camera</button>
   <button aria-expanded={settings} onClick={()=>{setSettings(!settings);document.activeElement?.blur();}}>Settings</button>
   <button disabled={!state.ready} onClick={()=>act('pause')}>{state.paused?'Resume':'Pause'}</button>
   <button onClick={full}>{fullscreen?'Exit fullscreen':'Fullscreen'}</button>
  </nav>
  {settings&&<section className="settings panel" aria-label="Game settings"><h2>GAME SETTINGS</h2><p>{state.mode==='first'?'First-person':state.mode==='chase'?'Chase':'Top-down'} camera · C / Triangle to switch</p>{ranges.map(([key,label,min,max,step])=><label key={key}>{label}<output>{Number(state.cameraSettings?.[key]??CAMERA_DEFAULTS[key]).toFixed(key==='fov'?0:2)}</output><input aria-label={label} type="range" min={min} max={max} step={step} value={state.cameraSettings?.[key]??CAMERA_DEFAULTS[key]} onChange={e=>sim.current?.setCamera({[key]:Number(e.target.value)})}/></label>)}<button onClick={()=>act('cameraReset')}>Reset camera</button><div className="buttons"><button onClick={()=>act('recover')}>Recover robot</button><button onClick={()=>act('reset')}>Reset field</button></div><p>Connect DualSense, focus the game and press a button. Keyboard works without a controller.</p><p>Approximate field · assisted handling · no scoring.</p><button onClick={()=>{setSettings(false);document.activeElement?.blur();}}>Close settings</button></section>}
  <div className="bottom-hud"><div className="statusbar"><span>{state.mode==='first'?'FIRST PERSON':state.mode==='chase'?'CHASE':'TOP DOWN'}</span><span>{state.connected?'● CONTROLLER':'KEYBOARD'}</span><span>ARM <b>{state.arm}°</b></span><span>CLAW <b>{state.grabber}</b></span><span>CORE <b>{state.held}</b></span></div><div className="instruction" role="status">{state.blocked?'Movement blocked. Raise the arm or steer clear.':state.near?'Ring inside jaws — F / X to grab.':state.message}</div></div>
  {(!state.ready||error)&&<div className="overlay"><h2>{error?'Game notice':'Preparing the field'}</h2><p>{error||'Loading local 3D assets and physics.'}</p>{error&&state.ready&&<button onClick={()=>setError('')}>Dismiss</button>}</div>}
  {state.paused&&<div className="overlay paused"><h2>PAUSED</h2><p>Click Resume to return to the game.</p><button onClick={()=>act('pause')}>Resume practice</button></div>}
 </main>;
}
createRoot(document.getElementById('root')).render(<App/>);
