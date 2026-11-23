/* MIDNIGHT OPERATOR — offline, local Wallpaper Engine web wallpaper.
   Live data: system audio spectrum (Wallpaper Engine), current media metadata
   (Wallpaper Engine when supported), real London/Hong Kong time, calendar.
   Project chips are decorative labels, NOT telemetry or external account links. */
(function(){
'use strict';
const $=id=>document.getElementById(id);
const rainCanvas=$('rain'),rainCtx=rainCanvas.getContext('2d',{alpha:true});
const spectrumCanvas=$('spectrum'),spectrumCtx=spectrumCanvas.getContext('2d',{alpha:true});
const settings={rain:true,rainAmount:45,hud:true,calendar:true,projects:true,music:true,scanlines:true,reducedMotion:false,milestoneDate:'',milestoneName:'MILESTONE'};
let fpsLimit=24,paused=false,lastFrame=0,displayW=0,displayH=0,dpr=1;
let drops=[],audioLevels=new Float32Array(64),smoothed=new Float32Array(40),lastAudioAt=0,hasMedia=false;
const reduceUserMotion=window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function classSettings(){
  document.body.classList.toggle('cinematic',!settings.hud);
  document.body.classList.toggle('no-rain',!settings.rain);
  document.body.classList.toggle('no-calendar',!settings.calendar);
  document.body.classList.toggle('no-project',!settings.projects);
  document.body.classList.toggle('no-music',!settings.music);
  document.body.classList.toggle('no-scan',!settings.scanlines);
  document.body.classList.toggle('low-motion',settings.reducedMotion||reduceUserMotion);
  updateMilestone();
  resetRain();
}
function fmtTime(zone){
  const date=new Date();
  const t=new Intl.DateTimeFormat('en-GB',{timeZone:zone,hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'}).format(date);
  const dateString=new Intl.DateTimeFormat('en-GB',{timeZone:zone,day:'2-digit',month:'short',year:'numeric'}).format(date);
  return {t,dateString};
}
let cachedMonth='';
function updateClocks(){
  const uk=fmtTime('Europe/London'),hk=fmtTime('Asia/Hong_Kong');
  function write(timeId,dateId,values){ const parts=values.t.split(':');$(timeId).innerHTML=parts[0]+':'+parts[1]+'<small>:'+parts[2]+'</small>';$(dateId).textContent=values.dateString.toUpperCase();}
  write('time-uk','date-uk',uk);write('time-hk','date-hk',hk);
  const now=new Date();
  const ukParts=new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/London',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(now);
  const value=type=>Number(ukParts.find(part=>part.type===type).value);
  const y=value('year'),m=value('month'),d=value('day'),key=`${y}-${m}-${d}`;
  if(cachedMonth!==key){cachedMonth=key;renderCalendar(y,m,d);}
  updateMilestone();
}
function renderCalendar(year,month,day){
  $('cal-month').textContent=new Intl.DateTimeFormat('en-GB',{month:'long',timeZone:'UTC'}).format(new Date(Date.UTC(year,month-1,1))).toUpperCase();
  $('cal-year').textContent=year;
  const grid=$('calendar-grid');grid.replaceChildren();
  ['M','T','W','T','F','S','S'].forEach(n=>{const div=document.createElement('div');div.textContent=n;div.className='dayhead';grid.appendChild(div);});
  const first=(new Date(Date.UTC(year,month-1,1)).getUTCDay()+6)%7;
  const count=new Date(Date.UTC(year,month,0)).getUTCDate();
  const total=Math.ceil((first+count)/7)*7;
  for(let cell=0;cell<total;cell++){
    const n=cell-first+1;const div=document.createElement('div');div.className='date';
    if(n<1||n>count){div.classList.add('outside');div.textContent='·';}
    else {div.textContent=String(n).padStart(2,'0');if(n===day)div.classList.add('today');}
    grid.appendChild(div);
  }
  $('calendar-foot').textContent=`TODAY // ${String(day).padStart(2,'0')} ${$('cal-month').textContent} ${year}`;
}
function updateMilestone(){
  const box=$('milestone');
  if(!settings.milestoneDate || !/^\d{4}-\d{2}-\d{2}$/.test(settings.milestoneDate)){box.hidden=true;return;}
  const target=new Date(settings.milestoneDate+'T00:00:00');
  if(isNaN(target.getTime())){box.hidden=true;return;}
  box.hidden=false;$('milestone-name').textContent=settings.milestoneName||'MILESTONE';
  const diff=target.getTime()-Date.now();
  if(diff<=0){$('milestone-value').textContent='MILESTONE REACHED';return;}
  const day=Math.floor(diff/86400000),hr=Math.floor(diff/3600000)%24,min=Math.floor(diff/60000)%60;
  $('milestone-value').textContent=`${String(day).padStart(2,'0')}D ${String(hr).padStart(2,'0')}H ${String(min).padStart(2,'0')}M`;
}
function sizeCanvases(){
  displayW=Math.max(1,window.innerWidth);displayH=Math.max(1,window.innerHeight);dpr=Math.min(window.devicePixelRatio||1,1.5);
  rainCanvas.width=Math.floor(displayW*dpr);rainCanvas.height=Math.floor(displayH*dpr);rainCtx.setTransform(dpr,0,0,dpr,0,0);
  const r=spectrumCanvas.getBoundingClientRect();spectrumCanvas.width=Math.max(1,Math.floor(r.width*dpr));spectrumCanvas.height=Math.max(1,Math.floor(r.height*dpr));spectrumCtx.setTransform(dpr,0,0,dpr,0,0);
  resetRain();
}
function resetRain(){
  const amount=settings.rain && !settings.reducedMotion && !reduceUserMotion?Number(settings.rainAmount):0;
  const count=Math.min(160,Math.floor(displayW*displayH/12000 * amount/55));
  drops=Array.from({length:count},()=>({x:Math.random()*displayW,y:Math.random()*displayH,speed:120+Math.random()*290,len:7+Math.random()*17,alpha:.09+Math.random()*.16,width:Math.random()<.14?1.2:.65}));
}
function drawRain(delta){
  rainCtx.clearRect(0,0,displayW,displayH);
  if(!settings.rain||settings.reducedMotion||reduceUserMotion)return;
  for(const r of drops){
    r.y+=r.speed*delta;r.x-=r.speed*delta*.12;
    if(r.y>displayH+25){r.y=-30;r.x=Math.random()*(displayW+70);}
    if(r.x<-20)r.x=displayW+20;
    rainCtx.beginPath();rainCtx.moveTo(r.x,r.y);rainCtx.lineTo(r.x-2,r.y+r.len);rainCtx.lineWidth=r.width;
    rainCtx.strokeStyle=`rgba(165,196,255,${r.alpha})`;rainCtx.stroke();
  }
}
function drawSpectrum(){
  const bounds=spectrumCanvas.getBoundingClientRect(),w=bounds.width,h=bounds.height;if(!w||!h)return;
  spectrumCtx.clearRect(0,0,w,h);
  const recent=Date.now()-lastAudioAt<2000;
  const bands=40,gap=3,barWidth=Math.max(2,(w-(bands-1)*gap)/bands);
  for(let i=0;i<bands;i++){
    const source=Math.floor(i*64/bands),next=Math.min(63,source+1);
    const level=recent?Math.min(1,Math.max(0,(audioLevels[source]+audioLevels[next])/2)):0;
    smoothed[i]+=(level-smoothed[i])*(recent?.28:.13);
    const v=smoothed[i],height=Math.max(2,Math.pow(v,.65)*(h-4));
    const x=i*(barWidth+gap),y=h-height;
    spectrumCtx.fillStyle=v>.5?'rgba(236,159,255,.94)':'rgba(159,119,224,.76)';
    spectrumCtx.fillRect(x,y,barWidth,height);
    if(v>.08){spectrumCtx.fillStyle='rgba(97,231,219,.72)';spectrumCtx.fillRect(x,y,barWidth,Math.min(2,height));}
  }
  if(!recent&&!hasMedia){$('audio-text').textContent='AUDIO REACTIVE / IDLE';}
  else{$('audio-text').textContent='AUDIO REACTIVE / WALLPAPER ENGINE';}
}
function loop(now){
  requestAnimationFrame(loop);
  if(paused||document.hidden)return;
  const interval=1000/Math.max(1,fpsLimit);
  if(now-lastFrame<interval)return;
  const delta=Math.min(.08,Math.max(0,(now-lastFrame)/1000));lastFrame=now;
  drawRain(delta);if(settings.music)drawSpectrum();
}

// Wallpaper Engine callbacks are registered at script evaluation time, not onload.
window.wallpaperPropertyListener={
  applyGeneralProperties:function(props){if(typeof props.fps==='number')fpsLimit=Math.max(1,Math.min(30,Math.floor(props.fps)));},
  setPaused:function(value){paused=!!value;},
  applyUserProperties:function(props){
    const keys={showrain:'rain',rainamount:'rainAmount',showhud:'hud',showcalendar:'calendar',showprojects:'projects',showmusic:'music',showscanlines:'scanlines',reducedmotion:'reducedMotion',milestonedate:'milestoneDate',milestonename:'milestoneName'};
    Object.keys(keys).forEach(key=>{if(props[key] && Object.prototype.hasOwnProperty.call(props[key],'value'))settings[keys[key]]=props[key].value;});
    classSettings();
  }
};
function audioListener(audio){
  lastAudioAt=Date.now();
  for(let i=0;i<64;i++)audioLevels[i]=Math.min(1,Math.max(0,((Number(audio[i])||0)+(Number(audio[i+64])||0))/2));
}
function mediaProperties(event){
  if(!event)return;hasMedia=!!(event.title||event.artist);
  $('music-track').textContent=event.title||'UNTITLED TRACK';
  $('music-artist').textContent=event.artist||event.albumArtist||'UNKNOWN ARTIST';
  $('music-state').textContent='MEDIA SESSION CONNECTED';
}
function mediaThumbnail(event){if(!event)return;const art=$('album');if(event.thumbnail){art.src=event.thumbnail;art.hidden=false;$('album-placeholder').hidden=true;}else{art.hidden=true;$('album-placeholder').hidden=false;}}
function mediaPlayback(event){
  if(!event)return;
  const playback=window.wallpaperMediaIntegration||{};
  if(event.state===playback.PLAYBACK_PLAYING)$('music-state').textContent='NOW PLAYING';
  else if(event.state===playback.PLAYBACK_PAUSED)$('music-state').textContent='PAUSED';
  else if(event.state===playback.PLAYBACK_STOPPED)$('music-state').textContent='STOPPED';
}
function mediaStatus(event){if(event && event.enabled===false)$('music-state').textContent='ENABLE MEDIA INTEGRATION';}
if(typeof window.wallpaperRegisterAudioListener==='function')window.wallpaperRegisterAudioListener(audioListener);
if(typeof window.wallpaperRegisterMediaPropertiesListener==='function')window.wallpaperRegisterMediaPropertiesListener(mediaProperties);
if(typeof window.wallpaperRegisterMediaThumbnailListener==='function')window.wallpaperRegisterMediaThumbnailListener(mediaThumbnail);
if(typeof window.wallpaperRegisterMediaPlaybackListener==='function')window.wallpaperRegisterMediaPlaybackListener(mediaPlayback);
if(typeof window.wallpaperRegisterMediaStatusListener==='function')window.wallpaperRegisterMediaStatusListener(mediaStatus);

window.addEventListener('resize',sizeCanvases,{passive:true});
window.addEventListener('visibilitychange',()=>{lastFrame=performance.now();});
sizeCanvases();classSettings();updateClocks();setInterval(updateClocks,1000);
requestAnimationFrame(loop);
})();
