import { noteToSemitone } from '../utils/musicTheory';
import { SoundTimbre } from '../types';

// Base frequencies for octave 4 (A4 = 440Hz)
export function getFrequency(noteName: string, octave = 4): number {
  const clean = noteName.replace(/[0-9]/g, '').trim();
  const semi = noteToSemitone(clean);
  // Formula: 440 * 2^((midi - 69) / 12)
  const midi = (octave + 1) * 12 + semi;
  return 440 * Math.pow(2, (midi - 69) / 12);
}

class AudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private volume = 0.75;
  private currentTimbre: SoundTimbre = 'piano';
  private activeSequenceTimeout: number | null = null;
  private isLoopRunning = false;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  public setTimbre(timbre: SoundTimbre) {
    this.currentTimbre = timbre;
  }

  public getTimbre(): SoundTimbre {
    return this.currentTimbre;
  }

  public playNote(noteName: string, octave = 4, duration = 1.2, delay = 0, timbre?: SoundTimbre) {
    const activeTimbre = timbre || this.currentTimbre;
    switch (activeTimbre) {
      case 'guitarra':
        this.playGuitarNote(noteName, octave, duration, delay);
        break;
      case 'baixo':
        this.playBassNote(noteName, octave === 4 ? 2 : octave, duration, delay);
        break;
      case 'pads':
        this.playPadNote(noteName, octave, duration, delay);
        break;
      case 'orgao':
        this.playOrganNote(noteName, octave, duration, delay);
        break;
      case 'piano':
      default:
        this.playPianoNote(noteName, octave, duration, delay);
        break;
    }
  }

  // 1. Piano: Dual triangle/sine detuned with acoustic lowpass filter decay
  public playPianoNote(noteName: string, octave = 4, duration = 1.4, delay = 0) {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const startTime = this.ctx.currentTime + delay;
    const freq = getFrequency(noteName, octave);

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const noteGain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(freq, startTime);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 1.002, startTime); // acoustic warmth

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(freq * 3.5, startTime);
    filter.frequency.exponentialRampToValueAtTime(Math.max(120, freq * 1.1), startTime + duration);

    const attack = 0.02;
    const decay = 0.35;
    const sustain = 0.25;
    const release = duration - attack - decay;

    noteGain.gain.setValueAtTime(0, startTime);
    noteGain.gain.linearRampToValueAtTime(0.28, startTime + attack);
    noteGain.gain.linearRampToValueAtTime(0.28 * sustain, startTime + attack + decay);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, startTime + attack + decay + Math.max(0.1, release));

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(noteGain);
    noteGain.connect(this.masterGain);

    osc1.start(startTime);
    osc2.start(startTime);
    osc1.stop(startTime + duration + 0.1);
    osc2.stop(startTime + duration + 0.1);
  }

  // 2. Guitarra / Violão: Plucked string with fast harmonic decay and bright attack
  public playGuitarNote(noteName: string, octave = 4, duration = 1.3, delay = 0) {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const startTime = this.ctx.currentTime + delay;
    const freq = getFrequency(noteName, octave);

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const noteGain = this.ctx.createGain();

    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(freq, startTime);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 2, startTime); // 1st harmonic overtone

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(freq * 5, startTime);
    filter.frequency.exponentialRampToValueAtTime(Math.max(150, freq * 1.4), startTime + 0.4);

    const attack = 0.008; // fast plucking attack
    noteGain.gain.setValueAtTime(0, startTime);
    noteGain.gain.linearRampToValueAtTime(0.24, startTime + attack);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(noteGain);
    noteGain.connect(this.masterGain);

    osc1.start(startTime);
    osc2.start(startTime);
    osc1.stop(startTime + duration + 0.05);
    osc2.stop(startTime + duration + 0.05);
  }

  // 3. Baixo: Deep fundamental sine + punchy filtered lowpass
  public playBassNote(noteName: string, octave = 2, duration = 1.4, delay = 0) {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const startTime = this.ctx.currentTime + delay;
    const freq = getFrequency(noteName, octave);

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const noteGain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, startTime);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq, startTime);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(Math.min(500, freq * 3.5), startTime);
    filter.frequency.exponentialRampToValueAtTime(Math.max(80, freq * 1.4), startTime + duration);

    const attack = 0.015;
    const decay = 0.4;
    const sustain = 0.35;
    const release = duration - attack - decay;

    noteGain.gain.setValueAtTime(0, startTime);
    noteGain.gain.linearRampToValueAtTime(0.38, startTime + attack);
    noteGain.gain.linearRampToValueAtTime(0.38 * sustain, startTime + attack + decay);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, startTime + attack + decay + Math.max(0.1, release));

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(noteGain);
    noteGain.connect(this.masterGain);

    osc1.start(startTime);
    osc2.start(startTime);
    osc1.stop(startTime + duration + 0.1);
    osc2.stop(startTime + duration + 0.1);
  }

  // 4. Pads: Lush, slow-attack ambient synth pad with chorus detune
  public playPadNote(noteName: string, octave = 4, duration = 2.4, delay = 0) {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const startTime = this.ctx.currentTime + delay;
    const freq = getFrequency(noteName, octave);

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const osc3 = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const noteGain = this.ctx.createGain();

    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(freq, startTime);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 1.004, startTime); // detune +

    osc3.type = 'sine';
    osc3.frequency.setValueAtTime(freq * 0.996, startTime); // detune -

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(freq * 1.8, startTime);

    const attack = 0.35; // gentle swell
    const release = 0.6;
    noteGain.gain.setValueAtTime(0, startTime);
    noteGain.gain.linearRampToValueAtTime(0.18, startTime + attack);
    noteGain.gain.setValueAtTime(0.18, startTime + duration - release);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc1.connect(filter);
    osc2.connect(filter);
    osc3.connect(filter);
    filter.connect(noteGain);
    noteGain.connect(this.masterGain);

    osc1.start(startTime);
    osc2.start(startTime);
    osc3.start(startTime);
    osc1.stop(startTime + duration + 0.1);
    osc2.stop(startTime + duration + 0.1);
    osc3.stop(startTime + duration + 0.1);
  }

  // 5. Órgão: Hammond drawbar additive tone with subtle vibrato
  public playOrganNote(noteName: string, octave = 4, duration = 1.5, delay = 0) {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const startTime = this.ctx.currentTime + delay;
    const freq = getFrequency(noteName, octave);

    // 3 drawbar harmonics: 16' (sub), 8' (fundamental), 4' (octave up)
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const osc3 = this.ctx.createOscillator();
    const noteGain = this.ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, startTime);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 2, startTime);

    osc3.type = 'sine';
    osc3.frequency.setValueAtTime(freq * 3, startTime); // 3rd harmonic drawbar

    // Organ envelope: immediate on, steady sustain, fast release
    noteGain.gain.setValueAtTime(0, startTime);
    noteGain.gain.linearRampToValueAtTime(0.18, startTime + 0.015);
    noteGain.gain.setValueAtTime(0.18, startTime + duration - 0.05);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc1.connect(noteGain);
    osc2.connect(noteGain);
    osc3.connect(noteGain);
    noteGain.connect(this.masterGain);

    osc1.start(startTime);
    osc2.start(startTime);
    osc3.start(startTime);
    osc1.stop(startTime + duration + 0.05);
    osc2.stop(startTime + duration + 0.05);
    osc3.stop(startTime + duration + 0.05);
  }

  public playChordNotes(notes: string[], duration = 1.6, arpeggiated = true, timbre?: SoundTimbre) {
    this.initContext();
    if (!notes || notes.length === 0) return;

    let baseOctave = 4;
    notes.forEach((note, index) => {
      // Keep bass notes lower if first note
      const octave = index === 0 ? baseOctave - 1 : baseOctave;
      const delay = arpeggiated ? index * 0.035 : 0;
      this.playNote(note, octave, duration, delay, timbre);
    });
  }

  // Play a sequence of chords once with visual callback for each step
  public playProgression(
    chordsNotes: string[][],
    bpm = 85,
    onStepChange?: (index: number) => void,
    onFinished?: () => void,
    timbre?: SoundTimbre
  ) {
    this.stopPlayback();
    if (!chordsNotes || chordsNotes.length === 0) return;

    const secondsPerBeat = 60 / bpm;
    const chordDuration = secondsPerBeat * 2; // 2 beats per chord
    let currentIndex = 0;

    const playNext = () => {
      if (currentIndex >= chordsNotes.length) {
        if (onFinished) onFinished();
        return;
      }

      if (onStepChange) onStepChange(currentIndex);
      this.playChordNotes(chordsNotes[currentIndex], chordDuration * 0.95, true, timbre);

      currentIndex++;
      this.activeSequenceTimeout = window.setTimeout(playNext, chordDuration * 1000);
    };

    playNext();
  }

  // Play an interactive practice loop of a chord progression with metronome synchronization
  public playLoopProgression(
    chordsNotes: string[][],
    bpm = 80,
    beatsPerChord = 4,
    totalMeasures = 8, // 0 = infinite loop
    onStepChange?: (chordIndex: number, measureNumber: number) => void,
    onBeatTick?: (beat: number) => void,
    onFinished?: () => void,
    timbre?: SoundTimbre
  ) {
    this.stopPlayback();
    if (!chordsNotes || chordsNotes.length === 0) return;

    this.isLoopRunning = true;
    const secondsPerBeat = 60 / bpm;
    let currentBeat = 0;
    let currentMeasure = 1;
    let chordIndex = 0;

    const tick = () => {
      if (!this.isLoopRunning) return;

      const beatInMeasure = (currentBeat % beatsPerChord) + 1;
      const isFirstBeatOfChord = beatInMeasure === 1;

      // Play metronome click
      this.playClick(isFirstBeatOfChord);

      if (onBeatTick) {
        onBeatTick(beatInMeasure);
      }

      if (isFirstBeatOfChord) {
        if (onStepChange) {
          onStepChange(chordIndex, currentMeasure);
        }
        const chordDuration = secondsPerBeat * beatsPerChord;
        this.playChordNotes(chordsNotes[chordIndex], chordDuration * 0.9, true, timbre);

        chordIndex = (chordIndex + 1) % chordsNotes.length;
        if (chordIndex === 0) {
          currentMeasure++;
        }
      }

      // Check if finished measure count
      if (totalMeasures > 0 && currentMeasure > totalMeasures) {
        this.stopPlayback();
        if (onFinished) onFinished();
        return;
      }

      currentBeat++;
      this.activeSequenceTimeout = window.setTimeout(tick, secondsPerBeat * 1000);
    };

    tick();
  }

  public stopPlayback() {
    this.isLoopRunning = false;
    if (this.activeSequenceTimeout !== null) {
      clearTimeout(this.activeSequenceTimeout);
      this.activeSequenceTimeout = null;
    }
  }

  // Metronome tick
  public playClick(isAccented = false) {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(isAccented ? 1200 : 800, this.ctx.currentTime);

    gain.gain.setValueAtTime(isAccented ? 0.35 : 0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(this.ctx.currentTime);
    osc.stop(this.ctx.currentTime + 0.06);
  }
}

export const audioSynth = new AudioEngine();
