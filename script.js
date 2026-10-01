// Each scene: sky colors, ground color, caption, sound note, and actors that move from (x0,y0) to (x1,y1).
const scenes=[
 {t:"Leo is lost",sky:["#ffd9a0","#ffb38a"],gr:"#7fae5a",snd:"Soft wind, a tiny squeak, a far-off train whistle",
  a:[{e:"🌅",x0:80,y0:22,x1:80,y1:22,s:12},{e:"🦁",x0:35,y0:62,x1:52,y1:60,s:11}]},
 {t:"The elephant friend",sky:["#ffe2a8","#ffc48f"],gr:"#86b45e",snd:"Footsteps, a gentle elephant trumpet, a xylophone note",
  a:[{e:"🐘",x0:-8,y0:60,x1:58,y1:60,s:14},{e:"🦁",x0:40,y0:63,x1:76,y1:63,s:10},{e:"🌼",x0:88,y0:70,x1:88,y1:70,s:6},{e:"🌸",x0:94,y0:74,x1:94,y1:74,s:6}]},
 {t:"The monkeys help",sky:["#cfe9ff","#ffe2a8"],gr:"#8dbb62",snd:"Playful monkey chatter, a tiny sneeze, happy chirps",
  a:[{e:"🐘",x0:20,y0:60,x1:26,y1:60,s:14},{e:"🦁",x0:36,y0:64,x1:44,y1:64,s:10},{e:"🐒",x0:56,y0:-10,x1:56,y1:62,s:9},{e:"🐒",x0:64,y0:-20,x1:64,y1:64,s:9},{e:"🐒",x0:72,y0:-15,x1:72,y1:62,s:9},{e:"🌺",x0:50,y0:70,x1:48,y1:68,s:6},{e:"🏠",x0:94,y0:52,x1:94,y1:52,s:9}]},
 {t:"The train arrives",sky:["#bfe0ff","#ffd9a0"],gr:"#7fae5a",snd:"Train whistle, steam hiss, cheerful music begins",
  a:[{e:"🏠",x0:84,y0:50,x1:84,y1:50,s:14},{e:"🚂",x0:-15,y0:58,x1:52,y1:58,s:16},{e:"🦁",x0:10,y0:72,x1:62,y1:74,s:8},{e:"🐘",x0:4,y0:72,x1:56,y1:74,s:10},{e:"🐒",x0:0,y0:72,x1:50,y1:74,s:7}]},
 {t:"Everyone rides together",sky:["#ffcf99","#ff9f6b"],gr:"#b07a4a",snd:"Rhythmic train wheels, soft ukulele music",
  a:[{e:"🌄",x0:130,y0:36,x1:-30,y1:36,s:20},{e:"🦒",x0:112,y0:46,x1:-20,y1:46,s:22},{e:"🦁",x0:36,y0:68,x1:36,y1:68,s:11},{e:"🐘",x0:52,y0:66,x1:52,y1:66,s:13},{e:"🐒",x0:66,y0:68,x1:66,y1:68,s:9}]},
 {t:"Home at sunset",sky:["#ff9a6b","#7a4b8a"],gr:"#5f8a4a",snd:"A soft roar, happy music swelling, a gentle chime",
  a:[{e:"🌇",x0:50,y0:26,x1:50,y1:26,s:18},{e:"🦁",x0:84,y0:64,x1:84,y1:64,s:20},{e:"🦁",x0:18,y0:70,x1:70,y1:70,s:9},{e:"🚂",x0:30,y0:50,x1:130,y1:50,s:12},{e:"💛",x0:78,y0:46,x1:80,y1:36,s:5}]}
];
const SEC=10,TOTAL=scenes.length*SEC;
const stage=document.getElementById("stage"),ground=document.getElementById("ground"),cap=document.getElementById("cap");
const fill=document.getElementById("fill"),timeEl=document.getElementById("time"),playBtn=document.getElementById("play"),dots=document.getElementById("dots");
let t=0,playing=false,cur=-1,timer=null;

scenes.forEach((s,i)=>{const b=document.createElement("button");b.textContent=(i+1)+". "+s.t;b.onclick=()=>{t=i*SEC;render(true)};dots.appendChild(b)});

function buildScene(i){
  const s=scenes[i];
  stage.querySelectorAll(".actor").forEach(n=>n.remove());
  stage.style.background="linear-gradient("+s.sky[0]+","+s.sky[1]+")";
  ground.style.background=s.gr;
  cap.innerHTML="<b>SCENE "+(i+1)+" OF 6 &middot; "+(i*10)+"-"+(i*10+10)+" SEC</b>"+s.t+"<i>Sound: "+s.snd+"</i>";
  const els=s.a.map(a=>{
    const n=document.createElement("span");
    n.className="actor";n.textContent=a.e;
    n.style.fontSize=a.s+"cqw";n.style.left=a.x0+"%";n.style.top=a.y0+"%";
    n.style.transitionDuration=(SEC-1)+"s";
    stage.insertBefore(n,cap);return n;
  });
  requestAnimationFrame(()=>requestAnimationFrame(()=>{
    s.a.forEach((a,k)=>{els[k].style.left=a.x1+"%";els[k].style.top=a.y1+"%"});
  }));
  [...dots.children].forEach((d,k)=>d.classList.toggle("on",k===i));
}
function fmt(x){const m=Math.floor(x/60),s=Math.floor(x%60);return m+":"+String(s).padStart(2,"0")}
function render(force){
  const i=Math.min(scenes.length-1,Math.floor(t/SEC));
  if(i!==cur||force){cur=i;buildScene(i)}
  fill.style.width=(t/TOTAL*100)+"%";
  timeEl.textContent=fmt(t)+" / 1:00";
}
function tick(){
  t+=0.1;
  if(t>=TOTAL){t=TOTAL;stop();playBtn.textContent="Replay";render();return}
  render();
}
function start(){if(t>=TOTAL){t=0;render(true)}playing=true;playBtn.textContent="Pause";timer=setInterval(tick,100)}
function stop(){playing=false;clearInterval(timer);if(t<TOTAL)playBtn.textContent="Play"}
playBtn.onclick=()=>playing?stop():start();
document.getElementById("restart").onclick=()=>{stop();t=0;render(true);start()};
render(true);