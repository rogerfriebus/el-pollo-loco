class AudioManager {
  isMuted = false;
  audioContext;
  backgroundInterval = null;
  backgroundShouldRun = false;
  isActivated = false;

  constructor() {
    this.isMuted = localStorage.getItem("pollo-loco-muted") === "true";
  }

  /**
   * Activates audio after a real user interaction.
   */
  async activate() {
    this.createAudioContextIfNeeded();

    if (this.audioContext.state === "suspended") {
      await this.audioContext.resume();
    }

    this.isActivated = this.audioContext.state === "running";
    this.playUnlockTone();
  }

  /**
   * Creates the browser audio context if needed.
   */
  createAudioContextIfNeeded() {
    if (this.audioContext && this.audioContext.state !== "closed") return;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    this.audioContext = new AudioContextClass();
  }

  /**
   * Plays a silent tone to unlock audio safely.
   */
  playUnlockTone() {
    if (!this.audioContext || this.audioContext.state !== "running") return;
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    gainNode.gain.setValueAtTime(0.001, this.audioContext.currentTime);
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + 0.03);
  }

  /**
   * Toggles mute and stores the setting.
   */
  toggleMute() {
    this.isMuted = !this.isMuted;
    localStorage.setItem("pollo-loco-muted", String(this.isMuted));
    this.applyMuteState();
  }

  /**
   * Applies the current mute state.
   */
  applyMuteState() {
    if (this.isMuted) this.pauseBackgroundLoop();
    else this.resumeBackgroundIfNeeded();
  }

  /**
   * Starts a soft repeating background sound.
   */
  startBackground() {
    this.backgroundShouldRun = true;
    this.resumeBackgroundIfNeeded();
  }

  /**
   * Stops the repeating background sound.
   */
  stopBackground() {
    this.backgroundShouldRun = false;
    this.pauseBackgroundLoop();
  }

  /**
   * Resumes background if sound is allowed.
   */
  resumeBackgroundIfNeeded() {
    if (!this.canRunBackground()) return;
    this.playBackgroundStep();
    this.backgroundInterval = setInterval(
      () => this.playBackgroundStep(),
      1400,
    );
  }

  /**
   * Checks whether background loop may start.
   * @returns {boolean}
   */
  canRunBackground() {
    return (
      !this.isMuted &&
      this.isActivated &&
      !this.backgroundInterval &&
      this.backgroundShouldRun
    );
  }

  /**
   * Pauses only the active background loop.
   */
  pauseBackgroundLoop() {
    clearInterval(this.backgroundInterval);
    this.backgroundInterval = null;
  }

  /**
   * Plays one background rhythm step.
   */
  playBackgroundStep() {
    this.playTone(130, 0.08, 0.18, "sine");
    setTimeout(() => this.playTone(196, 0.06, 0.15, "sine"), 320);
  }

  /**
   * Plays coin collection sound.
   */
  playCoin() {
    this.playTone(880, 0.16, 0.16, "triangle");
    setTimeout(() => this.playTone(1170, 0.12, 0.13, "triangle"), 80);
  }

  /**
   * Plays bottle collection sound.
   */
  playBottle() {
    this.playTone(360, 0.15, 0.2, "square");
    setTimeout(() => this.playTone(520, 0.1, 0.14, "square"), 90);
  }

  /**
   * Plays throw sound.
   */
  playThrow() {
    this.playTone(240, 0.13, 0.17, "sawtooth");
  }

  /**
   * Plays enemy stomp sound.
   */
  playStomp() {
    this.playTone(180, 0.14, 0.24, "square");
  }

  /**
   * Plays hurt sound.
   */
  playHurt() {
    this.playTone(120, 0.16, 0.27, "sawtooth");
  }

  /**
   * Plays boss hit sound.
   */
  playBossHit() {
    this.playTone(95, 0.18, 0.3, "sawtooth");
    setTimeout(() => this.playTone(70, 0.13, 0.24, "square"), 120);
  }

  /**
   * Plays game over sound.
   */
  playGameOver() {
    this.playTone(220, 0.16, 0.27, "sine");
    setTimeout(() => this.playTone(160, 0.14, 0.27, "sine"), 180);
    setTimeout(() => this.playTone(90, 0.18, 0.38, "sine"), 360);
  }

  /**
   * Plays win sound.
   */
  playWin() {
    this.playTone(523, 0.15, 0.19, "triangle");
    setTimeout(() => this.playTone(659, 0.15, 0.19, "triangle"), 140);
    setTimeout(() => this.playTone(784, 0.16, 0.24, "triangle"), 280);
  }

  /**
   * Plays one synthesized tone.
   * @param {number} frequency tone frequency
   * @param {number} volume tone volume
   * @param {number} duration tone duration
   * @param {OscillatorType} type oscillator type
   */
  playTone(frequency, volume, duration, type) {
    if (!this.canPlaySound()) return;
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.createGainNode(volume, duration);
    this.connectTone(oscillator, gainNode, frequency, type, duration);
  }

  /**
   * Checks if sound may be played.
   * @returns {boolean}
   */
  canPlaySound() {
    return (
      !this.isMuted &&
      this.isActivated &&
      this.audioContext?.state === "running"
    );
  }

  /**
   * Creates a fading gain node.
   * @param {number} volume target volume
   * @param {number} duration fade duration
   * @returns {GainNode}
   */
  createGainNode(volume, duration) {
    const gainNode = this.audioContext.createGain();
    const now = this.audioContext.currentTime;
    gainNode.gain.setValueAtTime(volume, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);
    return gainNode;
  }

  /**
   * Connects and starts oscillator and gain node.
   * @param {OscillatorNode} oscillator oscillator node
   * @param {GainNode} gainNode gain node
   * @param {number} frequency tone frequency
   * @param {OscillatorType} type oscillator type
   * @param {number} duration tone duration
   */
  connectTone(oscillator, gainNode, frequency, type, duration) {
    oscillator.frequency.value = frequency;
    oscillator.type = type;
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + duration);
  }
}
