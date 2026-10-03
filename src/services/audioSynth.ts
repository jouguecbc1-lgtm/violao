import { noteToSemitone } from '../utils/musicTheory';

// Base frequencies for octave 4 (A4 = 440Hz)
export function getFrequency(noteName: string, octave = 4): number {
  const clean = noteName.replace(/[0-9]/g, '').trim();
  const semi = noteToSemitone(clean);
  // C4 is 9 semitones below A4 (440Hz)
  // Formula: 440 * 2^((midi - 69) / 12)
  // In octave 4, C4 has semitone 0, A4 has semitone 9 -> midi = (octave + 1) * 12 + semi
  const midi = (octave + 1) * 12 + semi;
  return 440 * Math.pow(2, (midi - 69) / 12);
}

class AudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private volume = 0.7;
  private activeSequenceTimeout: number | null = null;
  private metronomeTimer: number | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
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

  public playNote(noteName: string, octave = 4, duration = 1.2, delay = 0) {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const startTime = this.ctx.currentTime + delay;
    const freq = getFrequency(noteName, octave);

    // Warm polyphonic piano-like tone: combination of sine and triangle with subtle detune
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const noteGain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(freq, startTime);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 1.002, startTime); // subtle chorus warmth

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(freq * 3, startTime);
    filter.frequency.exponentialRampToValueAtTime(Math.max(120, freq * 1.2), startTime + duration);

    // ADSR Envelope
    const attack = 0.02;
    const decay = 0.3;
    const sustain = 0.3;
    const release = duration - attack - decay;

    noteGain.gain.setValueAtTime(0, startTime);
    noteGain.gain.linearRampToValueAtTime(0.25, startTime + attack);
    noteGain.gain.linearRampToValueAtTime(0.25 * sustain, startTime + attack + decay);
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

  public playChordNotes(notes: string[], duration = 1.6, arpeggiated = true) {
    this.initContext();
    if (!notes || notes.length === 0) return;

    let baseOctave = 4;
    notes.forEach((note, index) => {
      // Keep bass notes lower if first note
      const octave = index === 0 ? baseOctave - 1 : baseOctave;
      const delay = arpeggiated ? index * 0.04 : 0;
      this.playNote(note, octave, duration, delay);
    });
  }

  // Play a sequence of chords with visual callback for each step
  public playProgression(
    chordsNotes: string[][],
    bpm = 85,
    onStepChange?: (index: number) => void,
    onFinished?: () => void
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
      this.playChordNotes(chordsNotes[currentIndex], chordDuration * 0.95, true);

      currentIndex++;
      this.activeSequenceTimeout = window.setTimeout(playNext, chordDuration * 1000);
    };

    playNext();
  }

  public stopPlayback() {
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
