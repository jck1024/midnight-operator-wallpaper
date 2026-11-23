/* MIDNIGHT OPERATOR v0.3 — Living City.
 * Lightweight deterministic 2D canvas overlay anchored to the drifting backdrop.
 * All local; no audio, network, image downloads, device access or API dependencies.
 * The city is atmospheric artwork, not a representation of real security telemetry.
 */
(function (root) {
  'use strict';
  const clamp = (n,a,b) => Math.min(b,Math.max(a,n));
  function seeded(seed) {
    let x = seed >>> 0;
    return () => { x ^= x << 13; x ^= x >>> 17; x ^= x << 5; return ((x >>> 0) / 4294967295); };
  }
  const rand = seeded(31032026);
  const windows = [];
  // Cluster over existing buildings, not across blank sky or the workstation.
  const clusters = [
    [.37,.45,.095,.10,17], [.49,.57,.065,.16,17],
    [.59,.33,.09,.095,14], [.65,.49,.115,.12,13],
    [.70,.61,.17,.13,14], [.81,.62,.10,.11,8]
  ];
  clusters.forEach(([x,y,w,h,n]) => {
    for(let i=0;i<n;i++) windows.push({
      x:x+rand()*w,y:y+rand()*h,w:1.1+rand()*2.2,h:1.5+rand()*3.4,
      tint:rand(),phase:rand()*6.28,rate:.38+rand()*.72,twinkle:rand()>.72
    });
  });
  const ripples = Array.from({length:21}, () => ({
    x:.48+rand()*.47,y:.875+rand()*.11,l:7+rand()*32,
    p:rand()*6.28,s:.42+rand()*.67,tint:rand()
  }));
  class MidnightCityEffects {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d', {alpha:true});
      this.w=1;this.h=1;this.dpr=1;
      this.enabled=true;this.activity=70;this.signs=true;
      this.traffic=true;this.reflections=true;this.reduced=false;
      this.draws=0;
    }
    configure(opts) {
      this.enabled = !!opts.enabled;
      this.activity = clamp(Number(opts.activity)||0,0,100);
      this.signs = !!opts.signs;
      this.traffic = !!opts.traffic;
      this.reflections = !!opts.reflections;
      this.reduced = !!opts.reduced;
      this.canvas.style.display=this.enabled?'':'none';
    }
    resize(w,h,dpr) {
      this.w=Math.max(1,w*1.036);this.h=Math.max(1,h*1.036);
      this.dpr=Math.min(dpr||1,1.25); // capped GPU and memory use
      this.canvas.width=Math.round(this.w*this.dpr);
      this.canvas.height=Math.round(this.h*this.dpr);
      this.ctx.setTransform(this.dpr,0,0,this.dpr,0,0);
    }
    paint(now,dt) {
      const c=this.ctx,w=this.w,h=this.h;
      c.clearRect(0,0,w,h);
      if(!this.enabled || this.activity===0 || this.reduced) return;
      this.draws++;
      const t=now/1000;
      const level=this.activity/100;
      // Window clusters: slow, asynchronous illumination rather than a uniform flashing grid.
      for(const win of windows) {
        const breathe=.55+.45*Math.sin(t*win.rate+win.phase);
        const flicker=win.twinkle && Math.sin(t*2.7+win.phase*13)>.97 ? .06 : 1;
        const a=level*clamp(.06+breathe*.17,0,.28)*flicker;
        c.fillStyle=win.tint>.67?`rgba(255,147,217,${a.toFixed(3)})`:
          win.tint>.34?`rgba(147,230,255,${(a*.78).toFixed(3)})`:`rgba(250,201,148,${(a*.65).toFixed(3)})`;
        c.fillRect(Math.round(win.x*w),Math.round(win.y*h),win.w,win.h);
      }
      // Distant rail traffic: a few tiny windows following the existing elevated rail.
      if(this.traffic) {
        for(let train=0;train<2;train++) {
          const period=train===0?21.6:27.2;
          const cycle=(t/period+train*.54)%1;
          if(cycle>.74)continue;
          const p=cycle/.74;
          const x=(.57+.38*(1-p))*w;
          const y=(.545-.174*(1-p)+.023*Math.sin(p*Math.PI))*h;
          c.save();c.globalAlpha=(.28+.55*Math.sin(p*Math.PI))*level;
          c.shadowColor=train===0?'#f9a0d9':'#73efe5';c.shadowBlur=7;
          for(let i=0;i<5;i++) {
            c.fillStyle=train===0?'#ffadcf':'#9bffed';
            c.fillRect(x+i*10,y-i*3.7,6,2.3);
          }
          c.restore();
        }
        // Tiny flying navigation lights, not large aircraft silhouettes.
        for(let i=0;i<2;i++) {
          const period=38+i*12,p=(t/period+i*.46)%1;
          const x=(.43+.4*p)*w, y=(.20+Math.sin(p*Math.PI*2+i)*.018)*h;
          const blink=Math.sin(t*3.2+i*4)>.17?1:.24;
          c.fillStyle=`rgba(${i?'116,249,225':'255,111,193'},${(.5*blink*level).toFixed(3)})`;
          c.fillRect(x,y,1.8,1.8);
        }
      }
      // Wet ledge: local horizontal glints fade in and out, no fullscreen white washes.
      if(this.reflections) {
        for(const r of ripples) {
          const phase=(Math.sin(t*r.s+r.p)+1)/2;
          const alpha=level*(.018+phase*.115);
          c.fillStyle=r.tint>.53?`rgba(221,91,237,${alpha.toFixed(3)})`:`rgba(84,227,225,${alpha.toFixed(3)})`;
          c.fillRect(r.x*w,r.y*h,r.l*(.55+phase*.65),r.tint>.65?1.6:.85);
        }
      }
    }
  }
  root.MidnightCityEffects=MidnightCityEffects;
  if(typeof module!=='undefined' && module.exports)module.exports=MidnightCityEffects;
})(typeof window!=='undefined'?window:globalThis);
