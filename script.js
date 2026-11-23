/* MIDNIGHT OPERATOR 1.0.0 — standalone Wallpaper Engine web wallpaper.
 * No remote scripts, analytics, network calls or artificial music animation.
 * Audio samples and media metadata come ONLY from Wallpaper Engine callbacks.
 * Diagnostic UI distinguishes callback registration from receiving real samples.
 */
(function () {
  'use strict';

  const $ = id => document.getElementById(id);
  const rainCanvas = $('rain');
  const spectrumCanvas = $('spectrum');
  const cityCanvas = $('city-effects');
  const rainCtx = rainCanvas.getContext('2d', {alpha: true});
  const spectrumCtx = spectrumCanvas.getContext('2d', {alpha: true});
  const motionPreference = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const settings = {
    rain: true, rainAmount: 68, hud: true, calendar: true,
    projects: true, music: true, scanlines: true, reducedMotion: false,
    panelScale: 108, audioSensitivity: 125, visualIntensity: 125, bassBoost: 125, diagnostics: false, showMilestone: true,
    cityEffects: true, cityActivity: 70, citySigns: true, cityTraffic: true, cityReflections: true, quietBoost: true,
    milestoneDate: '', milestoneName: 'MILESTONE',
    preset: 'custom', theme: 'purple', layout: 'right', dashWidth: 100,
    sceneBrightness: 100, neonStrength: 100, power: 'balanced',
    clock: true, title: true, footer: true
  };

  let active = {...settings};
  let currentTheme = {primary: "#c281ff", high: "#e792ff", mint: "#67ebdc"};
  let width = 1, height = 1, dpr = 1, rainDrops = [], paused = false;
  let generalFpsCap = 30, renderFpsCap = 30, previousFrame = 0, drawnFrames = 0, renderFps = 0;
  let fpsMeasuredAt = performance.now();
  const audioEngine = new window.MidnightAudioEngine(40);
  const cityEngine = new window.MidnightCityEffects(cityCanvas);
  let registeredAudio = false;
  let audioCallbacks = 0, lastAudioAt = -Infinity, audioPeak = 0;
  let hasMedia = false, lastAudioUiAt = 0, lastDiagAt = 0;
  let previousCalendarDay = '';
  const reducedMotion = () => active.reducedMotion || motionPreference;
  // Initialise these once: constructing Intl formatters each second is avoidable.
  const clockFormatters = {
    'Europe/London': {
      time: new Intl.DateTimeFormat('en-GB', {timeZone:'Europe/London', hour:'2-digit', minute:'2-digit', second:'2-digit', hourCycle:'h23'}),
      date: new Intl.DateTimeFormat('en-GB', {timeZone:'Europe/London', day:'2-digit', month:'short', year:'numeric'})
    },
    'Asia/Hong_Kong': {
      time: new Intl.DateTimeFormat('en-GB', {timeZone:'Asia/Hong_Kong', hour:'2-digit', minute:'2-digit', second:'2-digit', hourCycle:'h23'}),
      date: new Intl.DateTimeFormat('en-GB', {timeZone:'Asia/Hong_Kong', day:'2-digit', month:'short', year:'numeric'})
    }
  };
  const ukCalendarFormatter = new Intl.DateTimeFormat('en-GB', {
    timeZone:'Europe/London', year:'numeric', month:'2-digit', day:'2-digit'
  });
  const monthFormatter = new Intl.DateTimeFormat('en-GB', {month:'long', timeZone:'UTC'});
  let spectrumWidth = 0, spectrumHeight = 0;
  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));

  const themePalettes = {
    purple: {primary:'#c281ff',high:'#e792ff',mint:'#67ebdc'},
    green:  {primary:'#69f3b1',high:'#a6ffc5',mint:'#63ebce'},
    blue:   {primary:'#7caeff',high:'#afd8ff',mint:'#74e2f4'}
  };
  const presetOverrides = {
    night: {hud:true,clock:true,calendar:true,music:true,projects:true,title:true,footer:true,
      sceneBrightness:100,neonStrength:120,cityActivity:80,rainAmount:68},
    focus: {hud:true,clock:true,calendar:true,music:false,projects:false,title:false,footer:false,
      cityActivity:25,rainAmount:25,neonStrength:35},
    cinematic: {hud:false,sceneBrightness:108,cityActivity:85,rainAmount:68,neonStrength:110},
    original: {hud:true,clock:true,calendar:true,music:true,projects:true,title:true,footer:true,
      theme:'purple',layout:'right',dashWidth:100,panelScale:108,sceneBrightness:100,
      neonStrength:100,cityActivity:70,rainAmount:68,scanlines:true,showMilestone:false,
      rain:true,cityEffects:true,citySigns:true,cityTraffic:true,cityReflections:true,
      reducedMotion:false, power:'balanced'}
  };
  function deriveSettings() {
    const preset = presetOverrides[settings.preset] || {};
    return Object.assign({}, settings, preset);
  }
  function updateWidth() {
    const v = window.innerWidth;
    const base = v <= 930 ? 270 : v <= 1490 ? clamp(v * .265, 312, 365) : clamp(v * .256, 344, 418);
    const factor = active.layout === 'compact' ? .87 : 1;
    const desired = Math.round(base * clamp(active.dashWidth, 85, 115) / 100 * factor);
    document.documentElement.style.setProperty('--dash-width', Math.min(desired,Math.round(v*.42))+'px');
  }
  function applySettings() {
    const previous = active;
    active = deriveSettings();
    const body = document.body;
    body.dataset.theme = ['purple','green','blue'].includes(active.theme) ? active.theme : 'purple';
    body.classList.toggle('cinematic', !active.hud);
    body.classList.toggle('no-rain', !active.rain);
    body.classList.toggle('no-calendar', !active.calendar);
    body.classList.toggle('no-project', !active.projects);
    body.classList.toggle('no-music', !active.music);
    body.classList.toggle('no-clock', !active.clock);
    body.classList.toggle('no-title', !active.title);
    body.classList.toggle('no-footer', !active.footer);
    body.classList.toggle('no-scan', !active.scanlines);
    body.classList.toggle('low-motion', reducedMotion());
    body.classList.toggle('no-city', !active.cityEffects);
    body.classList.toggle('no-signs', !active.citySigns);
    body.classList.toggle('layout-left', active.layout === 'left');
    body.classList.toggle('layout-compact', active.layout === 'compact');
    body.classList.toggle('eco', active.power === 'eco');
    cityEngine.configure({enabled:active.cityEffects, activity:active.cityActivity * (active.power === 'eco' ? .68 : 1), signs:active.citySigns, traffic:active.cityTraffic, reflections:active.cityReflections, reduced:reducedMotion()});
    document.documentElement.style.setProperty('--panel-scale', String(clamp(active.panelScale, 90, 120) / 100));
    document.documentElement.style.setProperty('--scene-brightness', String(clamp(active.sceneBrightness,65,125)/100));
    document.documentElement.style.setProperty('--neon-mult', String(clamp(active.neonStrength,0,160)/100));
    updateWidth();
    $('diagnostics').hidden = !active.diagnostics;
    $('rain').style.display = (active.rain && !reducedMotion()) ? '' : 'none';
    currentTheme = themePalettes[body.dataset.theme];
    audioEngine.configure({sensitivity:active.audioSensitivity, intensity:active.visualIntensity, bass:active.bassBoost, quietBoost:active.quietBoost});
    renderFpsCap = Math.min(generalFpsCap, active.power === 'eco' ? 15 : 30);
    $('diag-preset').textContent = `PRESET: ${active.preset.toUpperCase()} | THEME: ${active.theme.toUpperCase()} | POWER: ${active.power.toUpperCase()}`;
    updateMilestone();
    // Only resize large canvases when DPR/performance profile changes. Frequent
    // colour/volume/lighting slider moves must not reallocate them or restart rain.
    if (previous.power !== active.power) resizeRain();
    else if (previous.rain !== active.rain || previous.rainAmount !== active.rainAmount ||
             previous.reducedMotion !== active.reducedMotion) makeRain();
    if (previous.power !== active.power || previous.layout !== active.layout ||
        previous.dashWidth !== active.dashWidth || previous.panelScale !== active.panelScale ||
        previous.hud !== active.hud || previous.music !== active.music ||
        previous.calendar !== active.calendar || previous.clock !== active.clock ||
        previous.projects !== active.projects) resizeSpectrum();
    reportDiagnostics(performance.now());
  }

  // Real live clocks, with DST handled by IANA zones rather than fixed offsets.
  function clockText(zone, date) {
    const formatter = clockFormatters[zone];
    return {time: formatter.time.format(date), date: formatter.date.format(date)};
  }
  function updateClocks() {
    if (document.hidden) return; // refresh immediately when the tab becomes visible
    const date = new Date();
    function update(zone, clockId, dateId) {
      const v = clockText(zone, date);
      const timeParts = v.time.split(':');
      // Only a fixed-format clock string is interpolated; no external markup.
      $(clockId).innerHTML = timeParts[0] + ':' + timeParts[1] + '<small>:' + timeParts[2] + '</small>';
      $(dateId).textContent = v.date.toUpperCase();
    }
    update('Europe/London', 'time-uk', 'date-uk');
    update('Asia/Hong_Kong', 'time-hk', 'date-hk');
    const parts = ukCalendarFormatter.formatToParts(date);
    const part = type => Number(parts.find(p => p.type === type).value);
    const year = part('year'), month = part('month'), day = part('day');
    const key = [year, month, day].join('-');
    if (previousCalendarDay !== key) {
      previousCalendarDay = key;
      renderCalendar(year, month, day);
    }
    updateMilestone();
  }
  function renderCalendar(year, month, day) {
    const name = monthFormatter.format(new Date(Date.UTC(year, month - 1, 1))).toUpperCase();
    $('cal-month').textContent = name;
    $('cal-year').textContent = String(year);
    const grid = $('calendar-grid');
    grid.replaceChildren();
    ['M', 'T', 'W', 'T', 'F', 'S', 'S'].forEach(letter => {
      const element = document.createElement('div');
      element.className = 'dayhead';
      element.textContent = letter;
      grid.appendChild(element);
    });
    const offset = (new Date(Date.UTC(year, month - 1, 1)).getUTCDay() + 6) % 7;
    const days = new Date(Date.UTC(year, month, 0)).getUTCDate();
    const cells = Math.ceil((offset + days) / 7) * 7;
    for (let i = 0; i < cells; i++) {
      const n = i - offset + 1;
      const element = document.createElement('div');
      element.className = 'date';
      if (n < 1 || n > days) {
        element.classList.add('outside');
        element.textContent = '·';
      } else {
        element.textContent = String(n).padStart(2, '0');
        if (n === day) element.classList.add('today');
      }
      grid.appendChild(element);
    }
    $('calendar-foot').textContent = `TODAY // ${String(day).padStart(2, '0')} ${name} ${year}`;
  }
  function updateMilestone() {
    const box = $('milestone');
    const date = String(active.milestoneDate || '');
    if (!active.showMilestone || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      box.hidden = true;
      return;
    }
    const target = new Date(date + 'T00:00:00');
    if (!Number.isFinite(target.getTime()) || target.getFullYear() !== Number(date.slice(0, 4)) ||
        target.getMonth() + 1 !== Number(date.slice(5, 7)) || target.getDate() !== Number(date.slice(8, 10))) {
      box.hidden = true;
      return;
    }
    box.hidden = false;
    $('milestone-name').textContent = String(active.milestoneName || 'MILESTONE').slice(0, 40);
    const difference = target.getTime() - Date.now();
    if (difference <= 0) {
      $('milestone-value').textContent = 'MILESTONE REACHED';
    } else {
      const days = Math.floor(difference / 86400000);
      const hours = Math.floor(difference / 3600000) % 24;
      const minutes = Math.floor(difference / 60000) % 60;
      $('milestone-value').textContent = `${String(days).padStart(2, '0')}D ${String(hours).padStart(2, '0')}H ${String(minutes).padStart(2, '0')}M`;
    }
  }

  // Single full-screen transparent canvas, capped particles, cap DPR to 1.5.
  function resizeRain() {
    width = Math.max(1, window.innerWidth);
    height = Math.max(1, window.innerHeight);
    dpr = Math.min(window.devicePixelRatio || 1, active.power === 'eco' ? 1 : 1.5);
    rainCanvas.width = Math.round(width * dpr);
    rainCanvas.height = Math.round(height * dpr);
    rainCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    makeRain();
    cityEngine.resize(width,height,dpr);
  }
  function resizeSpectrum() {
    const bounds = spectrumCanvas.getBoundingClientRect();
    spectrumWidth = bounds.width;
    spectrumHeight = bounds.height;
    spectrumCanvas.width = Math.max(1, Math.round(spectrumWidth * dpr));
    spectrumCanvas.height = Math.max(1, Math.round(spectrumHeight * dpr));
    spectrumCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function makeRain() {
    const density = active.rain && !reducedMotion() ? clamp(Number(active.rainAmount), 0, 100) / 100 : 0;
    const count = Math.min(240, Math.round((width * height / 8200) * density * (active.power === 'eco' ? .62 : 1)));
    rainDrops = Array.from({length: count}, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      speed: 260 + Math.random() * 340,
      length: 12 + Math.random() * 19,
      alpha: .16 + Math.random() * .24,
      thickness: Math.random() < .19 ? 1.25 : .75,
      shade: Math.random() < .15 ? '241,187,255' : '177,211,255'
    }));
  }
  function paintRain(dt) {
    if (!active.rain || reducedMotion() || rainDrops.length === 0) return;
    rainCtx.clearRect(0, 0, width, height);
    for (const drop of rainDrops) {
      drop.x -= drop.speed * dt * .17;
      drop.y += drop.speed * dt;
      if (drop.y > height + 35) {
        drop.y = -35;
        drop.x = Math.random() * (width + 70);
      }
      if (drop.x < -35) drop.x = width + 35;
      rainCtx.beginPath();
      rainCtx.moveTo(drop.x, drop.y);
      rainCtx.lineTo(drop.x - 3.6, drop.y + drop.length);
      rainCtx.lineWidth = drop.thickness;
      rainCtx.strokeStyle = `rgba(${drop.shade},${drop.alpha})`;
      rainCtx.stroke();
    }
  }

  // Real audio samples only. Media metadata never substitutes for audio input.
  // v0.2.1: adaptive, bounded gain designed for observed PEAK 0.01--0.05.
  function audioListener(samples) {
    if (!audioEngine.ingest(samples, performance.now())) return;
    audioCallbacks = audioEngine.callbacks;
    lastAudioAt = audioEngine.lastInputAt;
    audioPeak = audioEngine.lastPeak; // raw diagnostic PEAK, not post-gain height
  }
  function audioMode(now) {
    if (!registeredAudio) return 'unavailable';
    return audioEngine.state(now);
  }
  function paintSpectrum(now, dt) {
    const w = spectrumWidth, h = spectrumHeight;
    if (!w || !h) return;
    spectrumCtx.clearRect(0, 0, w, h);
    const bars = audioEngine.update(now, dt);
    const mode = audioMode(now);
    const gap = w < 310 ? 2 : 3;
    const barWidth = (w - gap * (bars.length - 1)) / bars.length;
    for (let i = 0; i < bars.length; i++) {
      const value = bars[i];
      const actualHeight = Math.max(2, value * (h - 3));
      const x = i * (barWidth + gap), y = h - actualHeight;
      spectrumCtx.fillStyle = value > .46 ? currentTheme.high : currentTheme.primary;
      spectrumCtx.fillRect(x, y, Math.max(1, barWidth), actualHeight);
      if (value > .10) {
        spectrumCtx.fillStyle = currentTheme.mint;
        spectrumCtx.fillRect(x, y, Math.max(1, barWidth), 2);
      }
    }
    if (now - lastAudioUiAt > 500) {
      const indicator = $('audio-text');
      if (mode === 'active') indicator.textContent = 'AUDIO INPUT // LIVE';
      else if (mode === 'quiet') indicator.textContent = 'AUDIO INPUT // QUIET';
      else if (mode === 'waiting') indicator.textContent = 'AUDIO INPUT // WAITING';
      else indicator.textContent = 'AUDIO INPUT // WALLPAPER ENGINE ONLY';
      $('audio-pip').style.background = mode === 'active' ? currentTheme.mint : currentTheme.primary;
      lastAudioUiAt = now;
    }
  }

  function reportDiagnostics(now) {
    if (!active.diagnostics) return;
    const motion = reducedMotion() ? 'REDUCED' : paused ? 'PAUSED' : 'RUNNING';
    $('diag-render').textContent = `MOTION: ${motion}  |  RAIN: ${rainDrops.length}  |  CITY: ${active.cityEffects ? "ON" : "OFF"}  |  FPS: ${renderFps.toFixed(0)}`;
    const mode = audioMode(now).toUpperCase();
    const age = Number.isFinite(lastAudioAt) ? (now - lastAudioAt) / 1000 : null;
    $('diag-audio').textContent = `AUDIO: ${mode}  |  CALLBACKS: ${audioCallbacks}  |  RAW PEAK: ${audioPeak.toFixed(3)}  |  GAIN: ${audioEngine.gain.toFixed(1)}x  |  LAST: ${age === null ? 'NEVER' : age.toFixed(1) + 's'}`;
  }
  function frame(now) {
    requestAnimationFrame(frame);
    if (paused || document.hidden) {
      previousFrame = now;
      return;
    }
    const delay = 1000 / renderFpsCap;
    if (now - previousFrame < delay) return;
    const dt = clamp((now - previousFrame) / 1000, 0, .075);
    previousFrame = now;
    if (active.rain && !reducedMotion() && rainDrops.length) paintRain(dt);
    if (active.cityEffects && active.cityActivity > 0 && !reducedMotion()) cityEngine.paint(now,dt);
    if (active.hud && active.music) paintSpectrum(now, dt);
    drawnFrames++;
    if (now - fpsMeasuredAt > 1050) {
      renderFps = drawnFrames * 1000 / (now - fpsMeasuredAt);
      drawnFrames = 0;
      fpsMeasuredAt = now;
    }
    if (active.diagnostics && now - lastDiagAt > 480) {
      reportDiagnostics(now);
      lastDiagAt = now;
    }
  }

  function mediaProperties(event) {
    if (!event) return;
    hasMedia = !!(event.title || event.artist);
    $('music-track').textContent = event.title || 'UNTITLED TRACK';
    $('music-artist').textContent = event.artist || event.albumArtist || 'UNKNOWN ARTIST';
    $('music-state').textContent = hasMedia ? 'MEDIA SESSION CONNECTED' : 'AWAITING MEDIA SESSION';
  }
  function mediaThumbnail(event) {
    if (!event) return;
    const image = $('album');
    if (event.thumbnail) {
      image.src = event.thumbnail; // supplied by Wallpaper Engine's Windows media integration
      image.hidden = false;
      $('album-placeholder').hidden = true;
    } else {
      image.removeAttribute('src');
      image.hidden = true;
      $('album-placeholder').hidden = false;
    }
  }
  function mediaPlayback(event) {
    if (!event) return;
    const integration = window.wallpaperMediaIntegration || {};
    if (event.state === integration.PLAYBACK_PLAYING) $('music-state').textContent = 'NOW PLAYING';
    else if (event.state === integration.PLAYBACK_PAUSED) $('music-state').textContent = 'PAUSED';
    else if (event.state === integration.PLAYBACK_STOPPED) $('music-state').textContent = 'STOPPED';
  }
  function mediaStatus(event) {
    if (event && event.enabled === false) $('music-state').textContent = 'MEDIA INTEGRATION DISABLED';
  }

  window.wallpaperPropertyListener = {
    applyGeneralProperties: function (props) {
      if (Number(props.fps) > 0) generalFpsCap = clamp(Math.floor(Number(props.fps)), 1, 30);
      renderFpsCap = Math.min(generalFpsCap, active.power === 'eco' ? 15 : 30);
    },
    setPaused: function (value) {
      paused = !!value;
      document.body.classList.toggle('paused', paused);
      previousFrame = performance.now();
      reportDiagnostics(previousFrame);
    },
    applyUserProperties: function (props) {
      const map = {
        showrain: 'rain', rainamount: 'rainAmount', showhud: 'hud',
        showcalendar: 'calendar', showprojects: 'projects', showmusic: 'music',
        showscanlines: 'scanlines', reducedmotion: 'reducedMotion',
        uiscale: 'panelScale', audiosensitivity: 'audioSensitivity',
        visualintensity: 'visualIntensity', bassboost: 'bassBoost',
        showmilestone: 'showMilestone',
        showdiagnostics: 'diagnostics',
        milestonedate: 'milestoneDate', milestonename: 'milestoneName',
        cityeffects: 'cityEffects', cityactivity: 'cityActivity', citysigns: 'citySigns',
        citytraffic: 'cityTraffic', cityreflections: 'cityReflections', quietboost: 'quietBoost',
        displaypreset: 'preset', colortheme: 'theme', dashboardlayout: 'layout', dashboardwidth: 'dashWidth',
        scenebrightness: 'sceneBrightness', neonstrength: 'neonStrength', powerprofile: 'power',
        showclock: 'clock', showtitle: 'title', showfooter: 'footer'
      };
      Object.keys(map).forEach(key => {
        if (props[key] && Object.prototype.hasOwnProperty.call(props[key], 'value')) {
          settings[map[key]] = props[key].value;
        }
      });
      applySettings();
    }
  };

  // DO NOT move these registrations into onload / setTimeout.
  // Wallpaper Engine detects audio usage when the wallpaper starts.
  if (typeof window.wallpaperRegisterAudioListener === 'function') {
    window.wallpaperRegisterAudioListener(audioListener);
    registeredAudio = true;
  }
  if (typeof window.wallpaperRegisterMediaPropertiesListener === 'function') window.wallpaperRegisterMediaPropertiesListener(mediaProperties);
  if (typeof window.wallpaperRegisterMediaThumbnailListener === 'function') window.wallpaperRegisterMediaThumbnailListener(mediaThumbnail);
  if (typeof window.wallpaperRegisterMediaPlaybackListener === 'function') window.wallpaperRegisterMediaPlaybackListener(mediaPlayback);
  if (typeof window.wallpaperRegisterMediaStatusListener === 'function') window.wallpaperRegisterMediaStatusListener(mediaStatus);

  let resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {updateWidth(); resizeRain(); resizeSpectrum();}, 120);
  }, {passive: true});
  window.addEventListener('visibilitychange', () => {previousFrame = performance.now(); if (!document.hidden) updateClocks();});
  resizeRain();
  resizeSpectrum();
  applySettings();
  updateClocks();
  setInterval(updateClocks, 1000);
  requestAnimationFrame(frame);
})();
