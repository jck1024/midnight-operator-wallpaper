/* MIDNIGHT OPERATOR v0.2.1 -- bounded, adaptive audio-to-bars conversion.
 * Independent from Wallpaper Engine: takes the 128-sample audio frequency array.
 * No microphone/audio capture, fake music, remote calls, or hidden network use.
 * Adaptation only occurs when genuine signals exceed the silence floor.
 */
(function (root) {
  'use strict';
  const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
  class MidnightAudioEngine {
    constructor(bands) {
      this.count = bands || 40;
      this.raw = new Float32Array(64);
      this.bars = new Float32Array(this.count);
      this.referencePeak = .04; // calibrated to measured 0.01--0.05 PEAK signals
      this.lastPeak = 0;
      this.lastRms = 0;
      this.lastInputAt = -Infinity;
      this.lastSampleAt = null;
      this.gain = 1;
      this.callbacks = 0;
      this.sensitivity = 125;
      this.intensity = 125;
      this.bass = 125;
    }
    configure(opts) {
      if (Number.isFinite(+opts.sensitivity)) this.sensitivity = clamp(+opts.sensitivity, 25, 200);
      if (Number.isFinite(+opts.intensity)) this.intensity = clamp(+opts.intensity, 50, 200);
      if (Number.isFinite(+opts.bass)) this.bass = clamp(+opts.bass, 75, 200);
    }
    ingest(samples, now) {
      if (!samples || samples.length < 128) return false;
      const t = Number.isFinite(now) ? now : 0;
      this.callbacks++;
      let peak = 0, squareSum = 0;
      for (let i = 0; i < 64; i++) {
        const l = Number(samples[i]);
        const r = Number(samples[i + 64]);
        const a = Number.isFinite(l) ? Math.max(0, l) : 0;
        const b = Number.isFinite(r) ? Math.max(0, r) : 0;
        const v = clamp((a + b) / 2, 0, 1);
        this.raw[i] = v;
        peak = Math.max(peak, v);
        squareSum += v * v;
      }
      this.lastPeak = peak;
      this.lastRms = Math.sqrt(squareSum / 64);
      this.lastInputAt = t;
      // Do not teach the automatic gain to amplify silence or background hiss.
      if (peak > .004) {
        const seconds = this.lastSampleAt === null ? .033 : clamp((t - this.lastSampleAt) / 1000, .008, .2);
        const tau = peak > this.referencePeak ? 1.4 : 4.0;
        const weight = 1 - Math.exp(-seconds / tau);
        this.referencePeak = clamp(this.referencePeak + (peak - this.referencePeak) * weight, .012, .50);
        this.lastSampleAt = t;
      }
      return true;
    }
    state(now) {
      if (!Number.isFinite(this.lastInputAt) || now - this.lastInputAt > 2400) return 'waiting';
      return this.lastPeak > .004 ? 'active' : 'quiet';
    }
    update(now, dt) {
      // Strong enough for low 0.01--0.05 PEAK audio; avoids runaway gain.
      const sensitivityFactor = Math.pow(2, (this.sensitivity - 100) / 100);
      const autoGain = clamp(.56 / this.referencePeak, 1, 38);
      const gain = clamp(autoGain * sensitivityFactor, .6, 58);
      this.gain = gain;
      const fresh = now - this.lastInputAt < 420 && this.lastPeak > .004;
      const seconds = clamp(dt, .008, .1);
      const rise = 1 - Math.exp(-seconds / .065);
      const decay = 1 - Math.exp(-seconds / .23);
      const boost = this.bass / 100;
      const visual = this.intensity / 100;
      for (let i = 0; i < this.count; i++) {
        let target = 0;
        if (fresh) {
          const at = Math.floor(i * 64 / this.count);
          // Slight local averaging improves readability without losing individual peaks.
          const b1 = this.raw[at];
          const b2 = this.raw[Math.min(63, at+1)];
          const b0 = this.raw[Math.max(0, at-1)];
          const energy = Math.max(b1 * .75 + b2 * .25, b0 * .24 + b1 * .53 + b2 * .23);
          const lowFrequency = Math.pow(1 - i / this.count, 2);
          const frequencyGain = 1 + (boost - 1) * lowFrequency;
          const amplified = clamp(energy * gain * frequencyGain, 0, 1);
          target = clamp(Math.pow(amplified, .76) * visual, 0, 1);
        }
        this.bars[i] = clamp(this.bars[i] + (target - this.bars[i]) * (target > this.bars[i] ? rise : decay), 0, 1);
      }
      return this.bars;
    }
  }
  root.MidnightAudioEngine = MidnightAudioEngine;
  if (typeof module !== 'undefined' && module.exports) module.exports = MidnightAudioEngine;
})(typeof window !== 'undefined' ? window : globalThis);
