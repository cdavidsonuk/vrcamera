const modes=["M","Av","Tv","P","B","SCN","AUTO"];
const apertures=[1.4,1.8,2,2.8,4,5.6,8,11,16,22];
const initial={power:false,screen:"off",mode:"M",ap:4,frames:999,captured:0,x:50,y:50};
let state={...initial};
const $=id=>document.getElementById(id);
const screens={boot:$("boot"),shooting:$("shooting"),menu:$("menuScreen"),playback:$("playback")};

function set(patch){state={...state,...patch};render()}
function render(){
  $("lcd").classList.toggle("off",state.screen==="off");
  Object.entries(screens).forEach(([name,node])=>node.classList.toggle("hidden",state.screen!==name));
  $("modeRead").textContent=state.mode;
  $("apRead").textContent=`F${state.ap}`;
  $("frames").textContent=state.frames;
  $("focus").style.left=`${state.x}%`;
  $("focus").style.top=`${state.y}%`;
  $("status").innerHTML=`
    <div><dt>Power</dt><dd>${state.power?"On":"Off"}</dd></div>
    <div><dt>Mode</dt><dd>${state.mode}</dd></div>
    <div><dt>Aperture</dt><dd>f/${state.ap}</dd></div>
    <div><dt>Shutter</dt><dd>1/250</dd></div>
    <div><dt>ISO</dt><dd>100</dd></div>
    <div><dt>Captured</dt><dd>${state.captured}</dd></div>`;
}
function power(){
  if(state.power){set({power:false,screen:"off"});return}
  set({power:true,screen:"boot"});
  setTimeout(()=>state.power&&set({screen:"shooting"}),900);
}
function mode(dir=1){
  if(!state.power)return;
  const i=modes.indexOf(state.mode);
  set({mode:modes[(i+dir+modes.length)%modes.length]});
}
function dial(dir=1){
  if(!state.power)return;
  const i=apertures.indexOf(state.ap);
  set({ap:apertures[Math.max(0,Math.min(apertures.length-1,i+dir))]});
}
function close(){if(state.power)set({screen:"shooting"})}
function capture(){
  if(!state.power||state.screen!=="shooting")return;
  $("focus").classList.add("ok");
  setTimeout(()=>{
    $("camera").classList.add("fire");
    set({frames:Math.max(0,state.frames-1),captured:state.captured+1});
    setTimeout(()=>$("camera").classList.remove("fire"),220);
  },160);
}
$("SW_POWER").onclick=power;
$("DIAL_MODE").onclick=e=>mode(e.shiftKey?-1:1);
$("DIAL_REAR").onclick=e=>dial(e.shiftKey?-1:1);
$("BTN_SHUTTER").onclick=capture;
$("BTN_MENU").onclick=()=>state.power&&set({screen:"menu"});
$("BTN_Q").onclick=()=>state.power&&set({screen:"menu"});
$("BTN_PLAY").onclick=()=>state.power&&set({screen:"playback"});
$("BTN_DELETE").onclick=close;
$("BTN_LIVE").onclick=close;
$("BTN_SET").onclick=close;
$("BTN_INFO").onclick=()=>$("lcd").classList.toggle("minimal");
$("BTN_AFON").onclick=()=>$("focus").classList.add("ok");
$("JOY_FOCUS").onclick=e=>{
  if(!state.power)return;
  const r=e.currentTarget.getBoundingClientRect();
  set({
    x:Math.max(12,Math.min(88,state.x+Math.sign(e.clientX-r.left-r.width/2)*8)),
    y:Math.max(15,Math.min(85,state.y+Math.sign(e.clientY-r.top-r.height/2)*8))
  });
};
$("reset").onclick=()=>{state={...initial};render()};
window.onkeydown=e=>{
  if(e.code==="KeyP")power();
  if(e.code==="KeyM")mode();
  if(e.code==="ArrowLeft")dial(-1);
  if(e.code==="ArrowRight")dial(1);
  if(e.code==="Space"){e.preventDefault();capture()}
  if(e.code==="Escape")close();
};
render();
