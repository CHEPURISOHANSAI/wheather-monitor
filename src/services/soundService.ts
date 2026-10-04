class WeatherSoundSynthesizer {
  private ctx: AudioContext | null = null;
  private currentType: "rain" | "wind" | "calm" | null = null;
  private isPlaying = false;
  private gainNode: GainNode | null = null;
  private noiseNode: AudioBufferSourceNode | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === "suspended") {
      void this.ctx.resume();
    }
  }

  public play(type: "rain" | "wind" | "calm", volume = 0.4) {
    this.stop();
    this.initContext();
    if (!this.ctx) return;

    this.isPlaying = true;
    this.currentType = type;

    // Create 5 seconds loop of pink/white noise buffer
    const bufferSize = this.ctx.sampleRate * 5;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      if (type === "rain") {
        // Pink noise with subtle droplets
        lastOut = (lastOut + 0.02 * white) / 1.02;
        data[i] = lastOut * 3.5;
      } else if (type === "wind") {
        // Deep brown noise
        lastOut = (lastOut + 0.015 * white) / 1.015;
        data[i] = lastOut * 4.0;
      } else {
        // Calm gentle breeze
        lastOut = (lastOut + 0.008 * white) / 1.008;
        data[i] = lastOut * 2.5;
      }
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    // Filter
    const filter = this.ctx.createBiquadFilter();
    if (type === "rain") {
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(1200, this.ctx.currentTime);
    } else if (type === "wind") {
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(320, this.ctx.currentTime);
      filter.Q.setValueAtTime(1.5, this.ctx.currentTime);
    } else {
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(600, this.ctx.currentTime);
    }

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(volume, this.ctx.currentTime);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start();
    this.noiseNode = noise;
    this.gainNode = gain;
  }

  public setVolume(vol: number) {
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.setValueAtTime(vol, this.ctx.currentTime);
    }
  }

  public stop() {
    if (this.noiseNode) {
      try {
        this.noiseNode.stop();
        this.noiseNode.disconnect();
      } catch {}
      this.noiseNode = null;
    }
    this.isPlaying = false;
    this.currentType = null;
  }

  public getStatus() {
    return {
      isPlaying: this.isPlaying,
      currentType: this.currentType,
    };
  }
}

export const soundSynthesizer = new WeatherSoundSynthesizer();
