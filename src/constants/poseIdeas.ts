export interface PoseIdea {
  id: string
  title: string
  koreanTitle?: string
  category: 'Cute' | 'Classic' | 'Playful' | 'Aesthetic' | 'Duo & Fun' | 'Chic'
  imageUrl: string
  tip: string
  vibe: string
}

export const POSE_IDEAS: PoseIdea[] = [
  {
    id: 'cheek-heart',
    title: 'Cheek Heart',
    koreanTitle: '볼하트',
    category: 'Cute',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=80',
    tip: 'Curve your hand against your cheek to make a cute half-heart!',
    vibe: '✨ K-Photobooth Trend',
  },
  {
    id: 'peace-sign',
    title: 'Peace Sign & Wink',
    koreanTitle: '브이윙크',
    category: 'Classic',
    imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=700&q=80',
    tip: 'Hold a peace sign close to your eye and give a cheeky wink!',
    vibe: '✌️ Timeless Photobooth',
  },
  {
    id: 'chin-rest',
    title: 'Flower Chin Bloom',
    koreanTitle: '꽃받침',
    category: 'Cute',
    imageUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=700&q=80',
    tip: 'Cup both hands under your chin like petals of a blooming flower!',
    vibe: '🌸 Sweet & Whimsical',
  },
  {
    id: 'radiant-smile',
    title: 'Big Radiant Smile',
    koreanTitle: '활짝 웃기',
    category: 'Playful',
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=700&q=80',
    tip: 'Drop your guard and beam your brightest candid smile right at the camera!',
    vibe: '☀️ Pure Joy',
  },
  {
    id: 'cool-shades',
    title: 'Retro Cool Sunglasses',
    koreanTitle: '선글라스',
    category: 'Chic',
    imageUrl: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=700&q=80',
    tip: 'Tilt your glasses down slightly or look over the rim with confident attitude!',
    vibe: '🕶️ Vintage Editorial',
  },
  {
    id: 'silly-fun',
    title: 'Playful Goof / Scrunch',
    koreanTitle: '장난꾸러기',
    category: 'Playful',
    imageUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=700&q=80',
    tip: 'Scrunch up your nose, tilt your head sideways, and have fun with it!',
    vibe: '🤪 Candid & Silly',
  },
  {
    id: 'cat-paws',
    title: 'Cute Kitten Paws',
    koreanTitle: '고양이 손',
    category: 'Cute',
    imageUrl: 'https://images.unsplash.com/photo-1516726817505-f5ed825624d8?auto=format&fit=crop&w=700&q=80',
    tip: 'Curl your fingers into little paws near your cheeks like a playful kitten!',
    vibe: '🐾 Adorable & Fun',
  },
  {
    id: 'golden-tilt',
    title: 'Soft Head Tilt',
    koreanTitle: '감성 틸트',
    category: 'Aesthetic',
    imageUrl: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=700&q=80',
    tip: 'Tilt your chin up gently and let the studio light catch your cheekbones.',
    vibe: '📸 High-Fashion Aesthetic',
  },
  {
    id: 'double-v',
    title: 'Double Peace Energy',
    koreanTitle: '더블 브이',
    category: 'Playful',
    imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=700&q=80',
    tip: 'Raise both hands with peace signs framing your hair or cheeks!',
    vibe: '✌️✌️ Maximum Cheer',
  },
  {
    id: 'side-profile',
    title: 'Candid 45° Glance',
    koreanTitle: '옆태 시선',
    category: 'Chic',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=700&q=80',
    tip: 'Turn slightly to your best side and glance back warmly at the lens.',
    vibe: '💫 Natural Charm',
  },
  {
    id: 'frame-face',
    title: 'Picture Frame Hands',
    koreanTitle: '얼굴 프레임',
    category: 'Playful',
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=700&q=80',
    tip: 'Form an L-frame with your thumb and index finger to frame your smile!',
    vibe: '🖼️ Creative Frame',
  },
  {
    id: 'laugh-burst',
    title: 'Unfiltered Laughter',
    koreanTitle: '함박웃음',
    category: 'Playful',
    imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=700&q=80',
    tip: 'Laugh out loud as if your best friend just whispered something hilarious!',
    vibe: '💛 Pure Authenticity',
  },
  {
    id: 'duo-lean',
    title: 'Besties Lean-In',
    koreanTitle: '밀착 포즈',
    category: 'Duo & Fun',
    imageUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=700&q=80',
    tip: 'Lean right in toward the center of the frame and fill the photobooth shot!',
    vibe: '👯 Booth Buddies',
  },
  {
    id: 'soft-natural',
    title: 'Effortless Natural Look',
    koreanTitle: '내추럴 무드',
    category: 'Aesthetic',
    imageUrl: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=700&q=80',
    tip: 'Relax your shoulders and look straight into the camera lens with a calm gaze.',
    vibe: '🌿 Clean & Minimalist',
  },
  {
    id: 'confident-gaze',
    title: 'Studio Portrait Gaze',
    koreanTitle: '당당한 시선',
    category: 'Chic',
    imageUrl: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=700&q=80',
    tip: 'Slight head nod, relaxed expression, looking straight down the lens barrel.',
    vibe: '🕶️ Cool Vibe',
  },
  {
    id: 'film-nostalgia',
    title: '90s Film Nostalgia',
    koreanTitle: '레트로 무드',
    category: 'Aesthetic',
    imageUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=700&q=80',
    tip: 'Subtle half-smile and dreamy eyes like an old 35mm film photograph.',
    vibe: '🎞️ 35mm Analog Feel',
  },
]

/**
 * Helper to get a random pose that is not in the excluded list
 */
export function getRandomPose(excludedIds: string[] = []): PoseIdea {
  const available = POSE_IDEAS.filter((p) => !excludedIds.includes(p.id))
  if (available.length === 0) {
    const randomIndex = Math.floor(Math.random() * POSE_IDEAS.length)
    return POSE_IDEAS[randomIndex]
  }
  const randomIndex = Math.floor(Math.random() * available.length)
  return available[randomIndex]
}
