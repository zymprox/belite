export type Memory = { id: string; src: string; title: string; category: string; caption: string; position?: string };
// Add a photo to public/photos, then add its entry here. Both galleries update automatically.
export const initialMemories: Memory[] = [
  { id: 'ayodhya', src: '/photos/ayodhya.webp', title: 'A little adventure', category: 'AYODHYA DIARIES', caption: 'Between the bus conversations and all the noise, some words stayed forever. A trip, a thousand little memories.', position: 'center 35%' },
  { id: 'scribble', src: '/photos/scribble-day.webp', title: 'Written in our hearts', category: 'SCRIBBLE DAY', caption: 'Shirts pe likha, dil pe bhi. The day everyone’s handwriting became a permanent memory.' },
  { id: 'farewell', src: '/photos/farewell.webp', title: 'Not really a goodbye', category: 'THE FAREWELL', caption: 'The last official photo. Complete but incomplete — because jitni reels banani thi wo bachi reh gayi.', position: 'center 30%' },
  { id: 'selfie', src: '/photos/funny-selfie.webp', title: 'Our kind of chaos', category: 'LUCKNOW, UNFILTERED', caption: 'No filter, no perfect pose, just us. The kind of photo that makes you laugh every time you find it.' },
  { id: 'hcl', src: '/photos/hcl-interview.webp', title: 'On the way to everything', category: 'HCL INTERVIEW DIARIES', caption: 'Test dekar wapis laut rahe the. We didn’t know what would happen next. But we went together, and that mattered.' },
  { id: 'prachi', src: '/photos/prachi-profile.webp', title: 'The main character', category: 'SIMPLY, YOU', caption: 'A little sunshine, a little mischief, and a whole lot of heart. Never stop being wonderfully you.', position: 'center 25%' },
];
export const birthdayWishes = [
  { title: 'For your big dreams', text: 'The apartment in a new city, decorated your way, with that car. May every beautiful thing you imagine find its way to you.', note: 'You described it so clearly. It’s already yours in some universe.' },
  { title: 'For your beautiful heart', text: 'May you always have reasons to laugh — the kind of laughter that echoes through empty college hallways.', note: 'The world needs more people who laugh at absolutely anything.' },
  { title: 'For everything ahead', text: 'May success find you wherever you go. Gaurav Sir was right when he said, “Wo kar legi.”', note: 'When a teacher believes in you that much, believe in yourself a little more.' },
];
