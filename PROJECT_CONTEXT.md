# Project Context & AI Architecture Specification
**Project Name:** Happy Birthday Prachi — Cinematic Surprise Web App  
**Target Person:** Prachi Shukla (BCA CMP Degree College classmate, "Miss Popular", "Baklol")  
**Developer / Creator:** Abhishek Maurya (Tech Master / CR)  
**Stack:** Vanilla HTML5, Vanilla CSS3 (Custom Tokens), Modular ES6 JavaScript (Zero heavy external libraries, fast load time, high performance)  
**Deployment Target:** Vercel / Netlify / Static Host  

---

## 📌 Executive Overview

This repository is a personalized, interactive, mobile-first birthday surprise web app built specifically for **Prachi Shukla**. It combines humor, college nostalgia (CMP Degree College BCA batch), custom interaction design, and an elegant **Crystal Black** aesthetic with rose/gold/emerald accents (zero indigo/blue).

The design flow transitions through 10 distinct interactive screens:
1. **Password Gate & Countdown Screen (`#gate-screen`)**: 4-digit PIN protection (`2608`) with escalating roast messages on incorrect guesses, plus a live countdown to August 26.
2. **Terminal Scan / Warning Screen (`#loading-screen`)**: Matrix-style system check detecting "Baklol level 9999%", punctuality errors, and a humor warning box.
3. **Welcome / Hero Screen (`#welcome-screen`)**: High-contrast hero section featuring Prachi's portrait with rotating glow rings and floating festive elements.
4. **Official Baklol Meter (`#baklol-meter`)**: Animated progress bars (Serious 2%, Intelligence 80%, Caring 95%, Baklol Energy 9999% overflow, Smile Power Unlimited).
5. **College Memories Timeline (`#memories-timeline`)**: Vertical timeline with real photos (Ayodhya trip, Scribble Day, Lucknow selfie, HCL interview return, Farewell) and iconic quotes.
6. **Friendship Story Page (`#friendship-page`)**: Minimalist, cinematic typography reveal describing college bonding and quiet maturity.
7. **Certified Roast Zone (`#roast-section`)**: 3D flip cards with playful roasts, plus press-and-hold easter eggs.
8. **Wishes Wall (`#wishes-wall`)**: Click-to-expand glassmorphic cards with personalized birthday wishes and quotes from teachers (Gaurav Sir's trust).
9. **Interactive Cake Celebration (`#celebration`)**: 3D CSS cake with lit candles. Tapping the cake blows out candles, triggers confetti bursts, releases floating balloons, and fires fireworks.
10. **Final Farewell & Signature (`#final-message`)**: Heartfelt closing message and signature.

---

## 📁 Repository Structure

```
c:\my_data\projects\college_mem\HBD\lili\
├── index.html              # Main HTML5 document containing all 10 section markup blocks
├── css/
│   ├── tokens.css          # Centralized design system (Crystal Black palette, typography, radii, spacing)
│   └── style.css           # Complete responsive stylesheet (Mobile-first, glassmorphism, animations)
├── js/
│   ├── app.js              # Core controller: PIN gate, countdown, section transitions, interactions
│   ├── animations.js       # FX engine: Confetti fall, firework bursts, balloon release, meter animations
│   └── audio.js            # Ambient audio engine with fade-in/out support & UI toggle state
├── assets/
│   ├── photos/             # Real photo assets from CMP college journey
│   │   ├── prachi-profile.png
│   │   ├── ayodhya.png
│   │   ├── farewell.png
│   │   ├── scribble-day.png
│   │   ├── funny-selfie.png
│   │   └── hcl-interview.png
│   └── audio/              # Optional background music (birthday.mp3 / birthday.ogg)
└── PROJECT_CONTEXT.md      # This context file for AI assistants
```

---

## 🎨 Design System & Styling Rules

All styling tokens strictly follow the **Centralized Configuration Architecture**:

* **Background:** Crystal Black (`#050507`), Deep Obsidian (`#08080C`), Dark Secondary (`#111116`), Terminal (`#030304`).
* **Accent Colors:** Rose Crimson (`#E11D48`), Coral Pink (`#F43F5E`), Warm Amber (`#F59E0B`), Gold (`#FBBF24`), Terminal Emerald (`#34D399`).
* **Strict Constraint:** **NO blue or indigo colors are permitted anywhere.**
* **Buttons:** Solid, high-contrast, premium metallic glass/crimson buttons (`background: #E11D48; border: 1px solid rgba(255,255,255,0.15); box-shadow: 0 4px 20px rgba(225,29,72,0.35);`). No gaudy rainbow gradients.
* **Cards:** Glassmorphism with `background: rgba(255, 255, 255, 0.03)` and `border: 1px solid rgba(255, 255, 255, 0.08)`.
* **Typography:** `Outfit` (Headings), `Inter` (Body text), `Permanent Marker` (Roast & hand-written quotes), `Space Mono` (Terminal scan).
* **Responsiveness:** Full word-wrapping (`white-space: normal; word-break: break-word;`) on terminal lines to prevent mobile overflow clipping. Flexbox and Grid breakpoint adaptors down to 320px width.

---

## ⚙️ Core JavaScript Modules

### 1. `app.js` (Main Controller)
- **`CONFIG.password`**: Set to `'2608'` (4-digit PIN).
- **`CONFIG.birthdayDate`**: Set to August 26 (`new Date(2026, 7, 26)`).
- **`WRONG_MESSAGES`**: Escalating list of funny Indian/Hindi roasts when incorrect PIN is entered (e.g., *"Abe ruk ja bhai, nag madi le ke manega kya... 😤"*).
- **Gate Unlock Flow**: PIN validation -> Gate fade out -> Terminal scan start -> Terminal warning box -> Continue button click -> Unlock main scroll & audio play.
- **Scroll Observer**: `IntersectionObserver` triggers card slide-ins, meter progress fills, line reveals, and scroll progress bar updates.
- **Interactions**: Roast card 3D flip toggle, wish card accordion expansion, cake candle blow-out sequence.

### 2. `animations.js` (FX Engine)
- **`Animations.confetti(count, duration)`**: Generates falling colorful confetti shapes (`circle`, `strip`, `square`) with random drift and rotation.
- **`Animations.firework(x, y, particles)`**: Radial particle explosion at specified coordinates.
- **`Animations.fireworkShow(bursts, intervalMs)`**: Multi-burst firework sequence.
- **`Animations.releaseBalloons(count)`**: Rising floating balloons with string shadows.
- **`Animations.showEasterEgg(message)`**: Floating toast notification for hidden easter eggs (e.g., clicking Prachi's photo 5 times).

### 3. `audio.js` (Audio Controller)
- Auto-detects audio files in `assets/audio/` (`birthday.mp3`, `birthday.ogg`, `birthday.wav`).
- Silently degrades if no audio file is provided (no JavaScript runtime crashes).
- Handles fade-in (1000ms) and fade-out (500ms) to ensure smooth audio playback.

---

## 💡 Key Personal Details & Context for Enhancements

If enhancing or adding new features to this app, keep these personal inside-jokes and facts in mind:
- **Prachi's Persona:** Funny, goofy ("baklol"), fashionably late, overthinker, practical but caring, laughs at anything.
- **College Background:** CMP Degree College, BCA Batch 2023–2026.
- **Notable Locations & Moments:** Lab 1 (2nd row, gate side), New department gallery, Ayodhya trip, HCL interview return, Scribble Day.
- **Famous Quotes / References:** Gaurav Sir's quote *"Wo kar legi"*, *"Gathbandhan ki sarkar"* during practical exams, *"Communication me full marks, real life me seen 3 hours ago"*.

---

## 🚀 Recommended Future Enhancements for Next AI
1. **Interactive Photo Gallery / Modal Lightbox**: Click any timeline photo to view it full-screen with high-res zoom and caption.
2. **Audio Track Selector**: Add a small dropdown/toggle in the audio player for ambient music tracks.
3. **Personal Voice Note / Video Popup**: An optional hidden video or audio message trigger inside the cake celebration.
4. **Dynamic Confession / Note Generator**: Allow visitors to write a birthday note that gets saved locally in `localStorage`.
