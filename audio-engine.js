/* MIDNIGHT OPERATOR v0.4 — audio engine retained from v0.3 spectrum with optional quiet-input normalisation.
 * Audio-only input from Wallpaper Engine callbacks. Never synthesize musical bars.
 */
(function (root) {
  'use strict';
  const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
  class MidnightAudioEngine {
    constructor(bands=40) {
      this.count=bands;
      this.raw=new Float32Array(64);
      this.bars=new Float32Array(bands);
      this.referencePeak=.025;this.lastPeak=0;this.lastRms=0;
      this.lastInputAt=-Infinity;this.lastSampleAt=null;
      this.gain=1;this.callbacks=0;
      this.sensitivity=125;this.intensity=125;this.bass=125;this.quietBoost=true;
    }
    configure(opts={}) {
      if(Number.isFinite(+opts.sensitivity))this.sensitivity=clamp(+opts.sensitivity,25,200);
      if(Number.isFinite(+opts.intensity))this.intensity=clamp(+opts.intensity,50,200);
      if(Number.isFinite(+opts.bass))this.bass=clamp(+opts.bass,75,200);
      if(typeof opts.quietBoost==='boolean')this.quietBoost=opts.quietBoost;
    }
    ingest(samples,now) {
      if(!samples||samples.length<128)return false;
      const t=Number.isFinite(now)?now:0;
      this.callbacks++;
      let peak=0, sum=0;
      for(let i=0;i<64;i++) {
        const l=Number(samples[i]),r=Number(samples[i+64]);
        const a=Number.isFinite(l)?Math.max(0,l):0;
        const b=Number.isFinite(r)?Math.max(0,r):0;
        const v=clamp((a+b)*.5,0,1);
        this.raw[i]=v;
        peak=Math.max(peak,v);sum+=v*v;
      }
      this.lastPeak=peak;this.lastRms=Math.sqrt(sum/64);
      this.lastInputAt=t;
      // A small adaptive gate: catches the low Spotify levels that v0.2.1 lost,
      // without training gain against total silence or nearly-zero audio device hiss.
      const floor=this.quietBoost?.0015:.004;
      if(peak>floor&&this.lastRms>floor*.32) {
        const seconds=this.lastSampleAt===null?.033:clamp((t-this.lastSampleAt)/1000,.008,.2);
        const tau=peak>this.referencePeak?1.1:2.25;
        const weight=1-Math.exp(-seconds/tau);
        this.referencePeak=clamp(this.referencePeak+(peak-this.referencePeak)*weight,
          this.quietBoost?.006:.012,.5);
        this.lastSampleAt=t;
      }
      return true;
    }
    state(now) {
      if(!Number.isFinite(this.lastInputAt)||now-this.lastInputAt>2400)return 'waiting';
      const floor=this.quietBoost?.0015:.004;
      return this.lastPeak>floor&&this.lastRms>floor*.32?'active':'quiet';
    }
    update(now,dt) {
      const sensitivityFactor=Math.pow(2,(this.sensitivity-100)/100);
      const base=this.quietBoost?.65:.56;
      const gainMax=this.quietBoost?105:58;
      const autoGain=clamp(base/this.referencePeak,1,gainMax);
      this.gain=clamp(autoGain*sensitivityFactor,.6,gainMax);
      const fresh=(now-this.lastInputAt)<420&&this.state(now)==='active';
      const seconds=clamp(dt,.008,.1);
      const rise=1-Math.exp(-seconds/.070),decay=1-Math.exp(-seconds/.23);
      const bass=this.bass/100, visual=this.intensity/100;
      const floor=this.quietBoost?.0015:.004;
      for(let i=0;i<this.count;i++) {
        let target=0;
        if(fresh) {
          const at=Math.floor(i*64/this.count);
          const b0=this.raw[Math.max(0,at-1)],b1=this.raw[at],b2=this.raw[Math.min(63,at+1)];
          const energy=Math.max(b1*.75+b2*.25,b0*.24+b1*.53+b2*.23);
          const low=Math.pow(1-i/this.count,2), boost=1+(bass-1)*low;
          // Subtract gated floor before boost to prevent noise becoming visible music.
          const amplified=clamp(Math.max(0,energy-floor*.25)*this.gain*boost,0,1);
          target=clamp(Math.pow(amplified,this.quietBoost?.67:.76)*visual,0,1);
        }
        const speed=target>this.bars[i]?rise:decay;
        this.bars[i]=clamp(this.bars[i]+(target-this.bars[i])*speed,0,1);
      }
      return this.bars;
    }
  }
  root.MidnightAudioEngine=MidnightAudioEngine;
  if(typeof module!=='undefined'&&module.exports)module.exports=MidnightAudioEngine;
})(typeof window!=='undefined'?window:globalThis);
