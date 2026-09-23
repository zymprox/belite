'use client';
import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Music2, Pause, Play, SkipForward, Upload, Volume2, X } from 'lucide-react';
const tracks = [
  { name: 'A little birthday magic', mood: 'Dreamy music box', notes: [72, 76, 79, 83, 79, 76, 74, 77, 81, 84, 81, 77], tempo: 540, wave: 'sine' as OscillatorType },
  { name: 'Somewhere, with you', mood: 'Soft evening keys', notes: [60, 67, 72, 76, 64, 71, 76, 79, 65, 72, 77, 81, 67, 74, 79, 83], tempo: 720, wave: 'triangle' as OscillatorType },
  { name: 'Our golden days', mood: 'Warm ambient bells', notes: [67, 74, 79, 81, 74, 72, 64, 71, 76, 79, 71, 69], tempo: 380, wave: 'sine' as OscillatorType },
];
export default function MusicPlayer() {
  const [playing, setPlaying] = useState(false);
  const [track, setTrack] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [volume, setVolume] = useState(35);
  const [custom, setCustom] = useState<{ name: string; url: string } | null>(null);
  const [error, setError] = useState('');
  const context = useRef<AudioContext | null>(null);
  const gain = useRef<GainNode | null>(null);
  const audio = useRef<HTMLAudioElement | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const customRef = useRef<string | null>(null);
  const session = useRef(0);
  useEffect(() => () => { void context.current?.close(); audio.current?.pause(); if (customRef.current) URL.revokeObjectURL(customRef.current); }, []);
  useEffect(() => {
    if (gain.current && context.current) gain.current.gain.setTargetAtTime(volume / 350, context.current.currentTime, .15);
    if (audio.current) audio.current.volume = volume / 100;
  }, [volume]);
  useEffect(() => {
    const currentSession = ++session.current;
    if (!playing) {
      void context.current?.suspend(); audio.current?.pause(); return;
    }
    if (track === 3 && custom) {
      void context.current?.suspend();
      if (!audio.current) audio.current = new Audio();
      audio.current.src = custom.url; audio.current.loop = true; audio.current.volume = volume / 100;
      audio.current.play().catch(() => { if (session.current === currentSession) { setError('This audio could not be played. Please try an MP3 or WAV file.'); setPlaying(false); } });
      return () => audio.current?.pause();
    }
    audio.current?.pause();
    if (!context.current) return;
    const ctx = context.current;
    void ctx.resume();
    const master = ctx.createGain(); gain.current = master; master.gain.value = volume / 350; master.connect(ctx.destination);
    let step = 0;
    const sound = () => {
      const config = tracks[track];
      const time = ctx.currentTime;
      const note = config.notes[step % config.notes.length];
      [0, 12].forEach((octave, i) => {
        const osc = ctx.createOscillator(); const envelope = ctx.createGain();
        osc.type = config.wave; osc.frequency.value = 440 * 2 ** ((note + octave - 69) / 12);
        envelope.gain.setValueAtTime(0, time); envelope.gain.linearRampToValueAtTime(i ? .15 : .55, time + .025);
        envelope.gain.exponentialRampToValueAtTime(.001, time + 2.5);
        osc.connect(envelope); envelope.connect(master); osc.start(time); osc.stop(time + 2.6);
        osc.onended = () => { osc.disconnect(); envelope.disconnect(); };
      }); step++;
    };
    sound(); const interval = window.setInterval(sound, tracks[track].tempo);
    return () => { clearInterval(interval); master.disconnect(); };
    // Volume is applied separately without restarting the melody.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, track, custom]);
  const toggle = async () => {
    setError('');
    if (!playing && track !== 3) {
      try {
        if (!context.current) context.current = new AudioContext();
        await context.current.resume();
      } catch { setError('Audio is unavailable in this browser. Try uploading a music file.'); return; }
    }
    setPlaying(!playing);
  };
  return <aside className={`music-player glass ${expanded ? 'is-expanded' : ''}`} aria-label="Music player">
    {expanded && <div className="music-menu">
      <div className="menu-heading"><span>A soundtrack for the moment</span><button className="icon-button" onClick={() => setExpanded(false)} aria-label="Close music menu"><X size={16}/></button></div>
      <p>Original, browser-played soundscapes</p>
      {tracks.map((item, i) => <button key={item.name} className={`track-option ${track === i ? 'selected' : ''}`} onClick={() => { setTrack(i); setError(''); }}><Music2 size={16}/><span>{item.name}<small>{item.mood}</small></span><span className="track-dot"/></button>)}
      {custom && <button className={`track-option ${track === 3 ? 'selected' : ''}`} onClick={() => setTrack(3)}><Music2 size={16}/><span>{custom.name}<small>Your own soundtrack</small></span></button>}
      <div className="volume-control"><Volume2 size={16}/><input aria-label="Music volume" type="range" min="0" max="100" value={volume} onChange={e => setVolume(+e.target.value)}/><span>{volume}%</span></div>
      <button className="upload-audio" onClick={() => fileInput.current?.click()}><Upload size={14}/> Add your own music</button>
    </div>}
    <input ref={fileInput} type="file" accept="audio/*" hidden onChange={e => {
      const file = e.target.files?.[0]; if (!file) return;
      if (file.size > 30 * 1024 * 1024 || !file.type.startsWith('audio/')) { setError('Choose an audio file smaller than 30 MB.'); return; }
      if (customRef.current) URL.revokeObjectURL(customRef.current);
      const url = URL.createObjectURL(file); customRef.current = url;
      setCustom({ name: file.name.replace(/\.[^.]+$/, ''), url }); setTrack(3); setError(''); e.target.value = '';
    }}/>
    <div className="player-main">
      <div className={`sound-icon ${playing ? 'playing' : ''}`} aria-hidden="true"><i/><i/><i/><i/></div>
      <button className="song-info" onClick={() => setExpanded(!expanded)} aria-expanded={expanded}><small>{playing ? 'A LITTLE MUSIC, A LITTLE MAGIC' : 'EVERY MEMORY HAS A MELODY'}</small><span>{track === 3 ? custom?.name : tracks[track].name} <ChevronDown size={13}/></span></button>
      <button className="play-button" aria-label={playing ? 'Pause music' : 'Play music'} onClick={toggle}>{playing ? <Pause size={16} fill="currentColor"/> : <Play size={16} fill="currentColor"/>}</button>
      <button className="icon-button next-track" aria-label="Next music track" onClick={() => setTrack((track + 1) % (custom ? 4 : 3))}><SkipForward size={16}/></button>
    </div>
    {error && <p className="audio-error" role="alert">{error}</p>}
  </aside>;
}
