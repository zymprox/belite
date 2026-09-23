'use client';
import { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, CakeSlice, Camera, Check, ChevronLeft, ChevronRight, CircleHelp, Gift, Globe2, Heart, Images, Infinity as InfinityIcon, Mail, Menu, Pause, Plus, Sparkles, Star, WandSparkles, X } from 'lucide-react';
import MusicPlayer from '@/components/MusicPlayer';
import PhotoSphere from '@/components/PhotoSphere';
import Modal from '@/components/Modal';
import { birthdayWishes, initialMemories, type Memory } from '@/lib/memories';
type Note = { name: string; text: string };
const roastCards = [
  ['Professional overthinker', 'Sochti itna hai, NASA hire kar le. A whole research department in one person.'],
  ['Fashionably unavailable', 'Communication mein full marks. Real-life replies? “Seen 3 hours ago.”'],
  ['A little too iconic', 'Friend who deserves appreciation? “Myself.” Honestly, we respect the confidence.'],
];
export default function Home() {
  const [active, setActive] = useState('home');
  const [mobileMenu, setMobileMenu] = useState(false);
  const [memories, setMemories] = useState(initialMemories);
  const [view, setView] = useState<'carousel' | 'sphere'>('carousel');
  const [selected, setSelected] = useState<Memory | null>(null);
  const [letter, setLetter] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [notes, setNotes] = useState<Note[]>([]);
  const [toast, setToast] = useState('');
  const [wishOpen, setWishOpen] = useState<number | null>(null);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [blown, setBlown] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const [motion, setMotion] = useState(true);
  const [systemReduced, setSystemReduced] = useState(false);
  const [days, setDays] = useState<number | null>(null);
  const [slide, setSlide] = useState(0);
  const carousel = useRef<HTMLDivElement>(null);
  const upload = useRef<HTMLInputElement>(null);
  const urls = useRef<string[]>([]);
  const reduced = !motion || systemReduced;
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    setSystemReduced(media.matches); const change = () => setSystemReduced(media.matches); media.addEventListener('change', change);
    try { const saved: unknown = JSON.parse(localStorage.getItem('prachi-birthday-notes') || '[]'); if (Array.isArray(saved)) setNotes(saved.filter((n): n is Note => typeof n?.name === 'string' && typeof n?.text === 'string').slice(0, 20)); } catch { /* Local storage may be unavailable in private browsers. */ }
    const updateDate = () => { const now = new Date(); const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()); const birthday = new Date(now.getFullYear(), 7, 26); if (today > birthday) birthday.setFullYear(birthday.getFullYear() + 1); setDays(Math.round((birthday.getTime() - today.getTime()) / 86400000)); };
    updateDate(); const dateTimer = window.setInterval(updateDate, 60000);
    const observer = new IntersectionObserver(entries => { entries.forEach(entry => { if (entry.isIntersecting) setActive(entry.target.id); }); }, { rootMargin: '-20% 0px -55% 0px' });
    document.querySelectorAll('main > section[id]').forEach(section => observer.observe(section));
    return () => { media.removeEventListener('change', change); clearInterval(dateTimer); observer.disconnect(); urls.current.forEach(url => URL.revokeObjectURL(url)); };
  }, []);
  useEffect(() => { if (!toast) return; const timer = setTimeout(() => setToast(''), 5000); return () => clearTimeout(timer); }, [toast]);
  useEffect(() => { if (!confetti) return; const timer = setTimeout(() => setConfetti(false), 4500); return () => clearTimeout(timer); }, [confetti]);
  useEffect(() => {
    if (!selected) return;
    const key = (e: KeyboardEvent) => { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { const index = memories.findIndex(m => m.id === selected.id); setSelected(memories[(index + (e.key === 'ArrowRight' ? 1 : -1) + memories.length) % memories.length]); } };
    document.addEventListener('keydown', key); return () => document.removeEventListener('keydown', key);
  }, [selected, memories]);
  const scrollCarousel = (direction: number) => { if (!carousel.current) return; const width = (carousel.current.querySelector('.memory-card') as HTMLElement)?.offsetWidth || 300; carousel.current.scrollBy({ left: direction * (width + 24), behavior: reduced ? 'instant' : 'smooth' }); };
  const navigate = (id: string) => { setActive(id); setMobileMenu(false); };
  const celebrate = () => { setBlown(true); if (!reduced) setConfetti(true); setToast('A wish made, a little magic sent. Happy birthday, Prachi!'); };
  return <div className={`birthday-app ${reduced ? 'still-mode' : ''}`}>
    <a className="skip-link" href="#main">Skip to the birthday story</a>
    <div className="ambient-glow glow-one"/><div className="ambient-glow glow-two"/>
    <header className="site-header wrap">
      <a className="brand" href="#home" onClick={() => navigate('home')}>for you<span>.</span><Sparkles size={16}/></a>
      <nav className={mobileMenu ? 'nav-links mobile-open glass' : 'nav-links'} aria-label="Main navigation">
        {[['home', 'The beginning'], ['memories', 'Our memories'], ['wishes', 'Little wishes']].map(([id, title]) => <a key={id} href={`#${id}`} className={active === id ? 'active' : ''} onClick={() => navigate(id)}>{title}</a>)}
        <a href="#celebrate" className={`nav-celebrate ${active === 'celebrate' ? 'active' : ''}`} onClick={() => navigate('celebrate')}>Let’s celebrate <Sparkles size={13}/></a>
      </nav>
      <div className="header-right"><span className="just-for-you"><span/> A little world, just for you</span><button className="mobile-menu-button icon-button" onClick={() => setMobileMenu(!mobileMenu)} aria-label={mobileMenu ? 'Close navigation' : 'Open navigation'} aria-expanded={mobileMenu}>{mobileMenu ? <X/> : <Menu/>}</button></div>
    </header>
    <main id="main">
      <section id="home" className="hero wrap">
        <div className="hero-copy">
          <div className="eyebrow hero-eyebrow"><span className="tiny-star">✧</span> THE WORLD GOT LUCKIER ON AUGUST 26</div>
          <h1>Happy Birthday,<br/><span>Prachi</span><span className="title-dot">.</span><svg className="title-sparkle" width="44" height="60" viewBox="0 0 44 60" aria-hidden="true"><path d="M22 1c0 23-5 27-21 29 17 1 21 9 21 29 0-22 6-28 21-29C27 28 22 23 22 1Z" fill="none" stroke="currentColor" strokeWidth="1.3"/></svg></h1>
          <p className="hero-description">Some people make the world a little brighter.<br/>You make it a whole lot more beautiful.</p>
          <p className="hero-subtext">So here’s a little corner of the universe, made just for you.</p>
          <div className="hero-actions"><a className="button button-primary" href="#memories" onClick={() => navigate('memories')}>Open your little universe <ArrowUpRight size={17}/></a><button className="button button-glass" onClick={() => setLetter(true)}><Mail size={17}/> A note for you</button></div>
          <div className="hero-footnote"><span className="mini-avatars"><img src="/photos/funny-selfie.webp" alt=""/><img src="/photos/scribble-day.webp" alt=""/><span><Heart size={12}/></span></span><span>Made of memories. Wrapped in love.</span><span className="little-line"/></div>
        </div>
        <div className="hero-art" aria-label="A scrapbook of Prachi's memories">
          <div className="orbit-ring ring-a"/><div className="orbit-ring ring-b"/>
          <div className="glass-orb orb-top"/><div className="glass-orb orb-bottom"/>
          <span className="art-star star-a">✧</span><span className="art-star star-b">✦</span><span className="art-star star-c">✧</span>
          <button className="polaroid side-photo left-photo" onClick={() => setSelected(memories[1])} aria-label="Open Scribble Day photo"><img src="/photos/scribble-day.webp" alt="Friends celebrating Scribble Day"/><span>the good old days</span></button>
          <button className="polaroid side-photo right-photo" onClick={() => setSelected(memories[2])} aria-label="Open farewell photo"><img src="/photos/farewell.webp" alt="A beautiful farewell memory"/><span>forever a favourite</span></button>
          <button className="polaroid main-photo" onClick={() => setSelected(initialMemories[5])} aria-label="Open Prachi's birthday portrait"><div className="photo-tape"/><img src="/photos/prachi-profile.webp" alt="Prachi, the birthday girl" fetchPriority="high"/><span>our favourite human <Heart size={16}/></span></button>
          <div className="birthday-tag glass"><span className="tag-heart"><Heart size={20}/></span><span>A little more magic.<br/><strong>A little more you.</strong></span><Sparkles size={17}/></div>
          <span className="handwritten art-caption">you’re kind of a big deal.</span>
          <svg className="doodle-arrow" width="80" height="66" viewBox="0 0 80 66" aria-hidden="true"><path d="M3 4c35-9 58 17 42 29-13 9-18-10-5-12 22-4 31 24 27 39m-8-10 8 12 9-9" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
        </div>
        <a className="scroll-cue" href="#memories"><span>THERE’S SO MUCH MORE BELOW</span><ArrowDown size={15}/></a>
        <span className="hero-edition">THE BIRTHDAY EDITION <span>·</span> 26.08</span>
      </section>
      <div className="memory-ribbon" aria-hidden="true"><span>A LITTLE NOSTALGIA</span><span>✧</span><span>A LOT OF LAUGHTER</span><span>✧</span><span>YOUR FAVOURITE PEOPLE</span><span>✧</span><span>ENDLESS POSSIBILITIES</span><span>✧</span><span>ALL THE LOVE</span><span>✧</span></div>
      <section id="memories" className="memories-section wrap section-space">
        <div className="section-heading"><div><div className="eyebrow"><Camera size={14}/> THE MOMENTS THAT STAY</div><h2>Little moments.<br className="mobile-break"/> <em>Forever memories.</em></h2><p>If happiness had a photo album, it would look a little like this.</p></div><div className="view-switch glass" role="group" aria-label="Gallery view"><button className={view === 'carousel' ? 'selected' : ''} onClick={() => setView('carousel')} aria-pressed={view === 'carousel'}><Images size={15}/> Photo stories</button><button className={view === 'sphere' ? 'selected' : ''} onClick={() => setView('sphere')} aria-pressed={view === 'sphere'}><Globe2 size={15}/> Photo sphere</button></div></div>
        {view === 'carousel' ? <><div className="memory-carousel" ref={carousel} onScroll={() => { if (!carousel.current) return; const width = (carousel.current.querySelector('.memory-card') as HTMLElement)?.offsetWidth || 300; setSlide(Math.round(carousel.current.scrollLeft / (width + 24))); }}>
          {memories.map((memory, i) => <button className="memory-card" key={memory.id} onClick={() => setSelected(memory)}><div className="memory-image"><img src={memory.src} alt={memory.title} loading="lazy" style={{ objectPosition: memory.position }}/><span className="image-index glass">{String(i + 1).padStart(2, '0')} / {String(memories.length).padStart(2, '0')}</span><span className="expand-photo glass"><ArrowUpRight size={18}/></span></div><div className="memory-caption"><span className="eyebrow">{memory.category}</span><h3>{memory.title}</h3><Heart size={17}/></div></button>)}
        </div><div className="gallery-bottom"><span><span className="small-dot"/> Some moments deserve to be kept forever.</span><div className="carousel-dots">{memories.map((m, i) => <button key={m.id} aria-label={`Scroll to memory ${i + 1}`} className={slide === i ? 'active' : ''} onClick={() => { const card = carousel.current?.children[i] as HTMLElement | undefined; if (card && carousel.current) carousel.current.scrollTo({ left: card.offsetLeft - (carousel.current.children[0] as HTMLElement).offsetLeft, behavior: reduced ? 'instant' : 'smooth' }); }}/>)}</div><div className="carousel-arrows"><button className="round-button" onClick={() => scrollCarousel(-1)} aria-label="Previous memories"><ArrowLeft size={17}/></button><button className="round-button" onClick={() => scrollCarousel(1)} aria-label="Next memories"><ArrowRight size={17}/></button></div></div></> : <PhotoSphere memories={memories} onSelect={setSelected} reducedMotion={reduced}/>}
        <div className="add-memories"><span>There’s always room for one more memory.</span><button onClick={() => upload.current?.click()}><Plus size={14}/> Add photos</button><small>Private preview · stays in this tab</small><input ref={upload} type="file" accept="image/jpeg,image/png,image/webp" multiple hidden onChange={e => {
          const files = Array.from(e.target.files || []); const available = 30 - memories.length;
          const valid = files.filter(file => ['image/jpeg','image/png','image/webp'].includes(file.type) && file.size <= 10 * 1024 * 1024).slice(0, Math.max(available, 0));
          const additions = valid.map((file, i) => { const url = URL.createObjectURL(file); urls.current.push(url); return { id: `upload-${Date.now()}-${i}`, src: url, title: file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '), category: 'A NEW LITTLE MEMORY', caption: 'Another beautiful little moment added to your universe.' }; });
          setMemories(prev => [...prev, ...additions]); setToast(additions.length ? `${additions.length} photo${additions.length === 1 ? '' : 's'} added to this tab. Add files to public/photos for a permanent collection.` : 'Choose JPG, PNG or WebP photos under 10 MB. Maximum 30 photos.'); e.target.value = '';
        }}/></div>
      </section>
      <section id="story" className="story-section wrap">
        <div className="story-card glass"><div className="story-kicker"><InfinityIcon size={27}/><span>THREE YEARS. COUNTLESS STORIES.</span></div><h2>We came for a degree.<br/>We left with <em>so much more.</em></h2><p>Lab 1. The second row. The last-minute assignments.<br/>The practical-exam “gathbandhan.” And all those little check-ins.</p><p>College ended. But the good stuff?<br/><strong>That gets to stay with us.</strong></p><span className="story-signoff">CMP Degree College · BCA · 2023—2026</span><span className="story-sparkle" aria-hidden="true">✧</span></div>
      </section>
      <section id="wishes" className="wishes-section wrap section-space">
        <div className="section-heading"><div><div className="eyebrow"><Sparkles size={14}/> A FEW THINGS I WISH FOR YOU</div><h2>All the good things. <em>And then some.</em></h2><p>Because someone like you deserves a world full of them.</p></div><button className="button button-glass small-button" onClick={() => setNoteOpen(true)}><Plus size={16}/> Leave a little wish</button></div>
        <div className="wish-grid">{birthdayWishes.map((wish, i) => <button key={wish.title} className={`wish-card glass ${wishOpen === i ? 'wish-open' : ''}`} aria-expanded={wishOpen === i} onClick={() => setWishOpen(wishOpen === i ? null : i)}><span className="wish-icon">{i === 0 ? <Star size={22}/> : i === 1 ? <Heart size={22}/> : <WandSparkles size={22}/>}</span><span className="wish-number">0{i + 1}</span><h3>{wish.title}</h3><p>{wish.text}</p>{wishOpen === i && <p className="wish-note">{wish.note}</p>}<span className="wish-bottom">A LITTLE WISH, WITH LOVE <Plus size={15} className={wishOpen === i ? 'rotated' : ''}/></span></button>)}</div>
        {notes.length > 0 && <div className="personal-notes">{notes.map((note, i) => <article className="personal-note glass" key={i}><Heart size={16}/><p>{note.text}</p><span>— {note.name}</span><button className="icon-button" aria-label={`Delete wish from ${note.name}`} onClick={() => { const remaining = notes.filter((_, index) => index !== i); try { localStorage.setItem('prachi-birthday-notes', JSON.stringify(remaining)); setNotes(remaining); } catch { setToast('Your browser could not save this change.'); } }}><X size={13}/></button></article>)}</div>}
      </section>
      <section id="little-chaos" className="roast-section wrap"><div className="roast-intro"><div className="eyebrow">SWEET, WITH A LITTLE SASS</div><h2>Still our favourite <em>baklol.</em></h2><p>It wouldn’t be your birthday without a little friendly fire.</p></div><div className="roast-grid">{roastCards.map(([title, roast], i) => <button key={title} className={`roast-card ${flipped.includes(i) ? 'flipped' : ''}`} aria-pressed={flipped.includes(i)} onClick={() => setFlipped(prev => prev.includes(i) ? prev.filter(n => n !== i) : [...prev, i])}><span className="roast-card-inner"><span className="roast-front"><CircleHelp size={21}/><span>{title}</span><small>TAP FOR THE TRUTH <ArrowUpRight size={12}/></small></span><span className="roast-back">{roast}<small>With affection. Always.</small></span></span></button>)}</div></section>
      <section id="celebrate" className="celebration-section wrap section-space"><div className="celebration-card glass"><div className="celebration-copy"><div className="eyebrow"><Gift size={14}/> THIS MOMENT IS ALL YOURS</div><h2>Close your eyes.<br/><em>Make a little wish.</em></h2><p>Here’s to new adventures, unreasonable amounts of happiness,<br className="desktop-break"/> and becoming even more wonderfully you.</p><button className="button button-primary" onClick={blown ? () => setBlown(false) : celebrate}>{blown ? <><Sparkles size={17}/> Make another wish</> : <><CakeSlice size={17}/> Blow out the candles</>}</button><span className="candle-message" aria-live="polite">{blown ? 'May every little wish find its way to you.' : 'Don’t tell anyone. That’s how the magic works.'}</span></div><button className={`cake-scene ${blown ? 'candles-out' : ''}`} onClick={blown ? () => setBlown(false) : celebrate} aria-label={blown ? 'Relight birthday candles' : 'Blow out birthday candles'}><div className="cake-halo"/><div className="cake-decoration decoration-one">✧</div><div className="cake-decoration decoration-two">✧</div><div className="cake-stand"/><div className="cake-base"/><div className="cake-top"/><div className="cake-frosting"/><div className="cake-candles">{[0,1,2,3,4].map(i => <div className="candle" key={i}><span className="flame"/></div>)}</div><span className="cake-caption handwritten">a wish, just for you</span></button></div></section>
      <section id="ending" className="ending wrap"><Heart size={24} strokeWidth={1}/><h2>The world is better<br/>with <em>you</em> in it.</h2><p>Stay happy. Dream a little bigger. Never stop being you.</p><span className="handwritten signature">With love, Abhishek</span><div className="birthday-countdown"><span className="small-dot"/>{days === null ? 'YOUR DAY, AUGUST 26' : days === 0 ? 'TODAY IS YOUR DAY. HAPPY BIRTHDAY!' : `${days} DAYS UNTIL YOUR NEXT CHAPTER · AUGUST 26`}</div></section>
    </main>
    <footer className="site-footer wrap"><a className="brand" href="#home">for you<span>.</span></a><span>Not just a website. A little piece of heart.</span><button onClick={() => setMotion(!motion)} aria-pressed={!motion}><Pause size={12}/>{reduced ? 'Gentle mode on' : 'Pause animations'}</button></footer>
    <MusicPlayer/>
    {toast && <div className="toast glass" role="status"><Check size={16}/>{toast}<button className="icon-button" aria-label="Dismiss notification" onClick={() => setToast('')}><X size={14}/></button></div>}
    {confetti && <div className="confetti-container" aria-hidden="true">{Array.from({ length: 70 }, (_, i) => <i key={i} style={{ left: `${(i * 37) % 100}%`, animationDelay: `${(i % 9) * .13}s`, animationDuration: `${2.3 + (i % 5) * .25}s`, background: ['#cb6b84','#e4b770','#e9b5c5','#9ca586','#fffaf4'][i % 5], transform: `rotate(${i * 27}deg)` }}/>)}</div>}
    {selected && <Modal label={selected.title} onClose={() => setSelected(null)} className="lightbox"><img className="lightbox-image" src={selected.src} alt={selected.title}/><div className="lightbox-copy"><span className="eyebrow">{selected.category}</span><h2>{selected.title}</h2><p>{selected.caption}</p><div className="lightbox-controls"><button className="round-button" aria-label="Previous photo" onClick={() => setSelected(memories[(memories.findIndex(m => m.id === selected.id) - 1 + memories.length) % memories.length])}><ChevronLeft size={18}/></button><span>{memories.findIndex(m => m.id === selected.id) + 1} / {memories.length}</span><button className="round-button" aria-label="Next photo" onClick={() => setSelected(memories[(memories.findIndex(m => m.id === selected.id) + 1) % memories.length])}><ChevronRight size={18}/></button></div></div></Modal>}
    {letter && <Modal label="A personal birthday letter for Prachi" onClose={() => setLetter(false)} className="letter-modal"><span className="letter-stamp"><Mail size={27}/></span><div className="eyebrow">SOME THINGS DESERVE TO BE WRITTEN DOWN</div><h2>Dear <em>Prachi,</em></h2><p>Some people become memories because of one extraordinary moment. Some quietly stay present throughout the journey.</p><p>You were there in the event-planning chaos, the Ayodhya conversations, the practical-exam gathbandhan, and all the small check-ins. The ordinary moments that became extraordinary.</p><p>Thank you for being a part of my college journey. I hope your next chapter is full of the happiness, success, and beautiful little things you deserve.</p><p>And yes — never stop being the baklol that makes people laugh.</p><span className="handwritten signature">Happy birthday, Prachi.<br/>— Abhishek</span><Heart size={20}/></Modal>}
    {noteOpen && <Modal label="Leave a birthday wish" onClose={() => setNoteOpen(false)} className="note-modal"><Sparkles size={26}/><h2>A little wish.<br/><em>A lot of heart.</em></h2><p>A note for the birthday girl, saved on this browser only.</p><form onSubmit={e => { e.preventDefault(); const next = [...notes, { name: name.trim(), text: message.trim() }].slice(-20); if (!name.trim() || !message.trim()) return; try { localStorage.setItem('prachi-birthday-notes', JSON.stringify(next)); setNotes(next); setNoteOpen(false); setName(''); setMessage(''); setToast('Your birthday wish is saved on this browser.'); } catch { setToast('Your browser could not save the wish. Please enable local storage.'); } }}><label htmlFor="wish-name">Your name</label><input id="wish-name" value={name} onChange={e => setName(e.target.value)} maxLength={50} placeholder="Someone who thinks you’re wonderful" required/><label htmlFor="wish-message">Your birthday wish</label><textarea id="wish-message" value={message} onChange={e => setMessage(e.target.value)} maxLength={500} rows={4} placeholder="May this next chapter bring you…" required/><span className="character-count">{message.length}/500</span><button className="button button-primary" type="submit">Send a little love <Heart size={16}/></button></form></Modal>}
  </div>;
}
