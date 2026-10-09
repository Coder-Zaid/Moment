export interface PoseIdea {
  id: string
  title: string
  koreanTitle?: string
  emoji: string
  category: 'Cute' | 'Classic' | 'Playful' | 'Aesthetic' | 'Duo & Fun' | 'Chic'
  tip: string
  vibe: string
}

export const POSE_IDEAS: PoseIdea[] = [
  {
    id: 'cheek-heart',
    title: 'Cheek Heart',
    koreanTitle: '볼하트',
    emoji: '🫶',
    category: 'Cute',
    tip: 'Curve your hand against your cheek to form a sweet half-heart!',
    vibe: '✨ K-Photobooth Trend',
  },
  {
    id: 'peace-sign',
    title: 'Peace Sign & Wink',
    koreanTitle: '브이윙크',
    emoji: '✌️',
    category: 'Classic',
    tip: 'Hold a peace sign close to your eye and give a cheeky wink!',
    vibe: '✌️ Timeless Photobooth',
  },
  {
    id: 'chin-rest',
    title: 'Flower Chin Bloom',
    koreanTitle: '꽃받침',
    emoji: '🌸',
    category: 'Cute',
    tip: 'Cup both hands under your chin like petals of a blooming flower!',
    vibe: '🌸 Sweet & Whimsical',
  },
  {
    id: 'radiant-smile',
    title: 'Big Radiant Smile',
    koreanTitle: '활짝 웃기',
    emoji: '😄',
    category: 'Playful',
    tip: 'Drop your guard and beam your brightest candid smile right at the camera!',
    vibe: '☀️ Pure Joy',
  },
  {
    id: 'cool-shades',
    title: 'Retro Cool Vibe',
    koreanTitle: '선글라스',
    emoji: '🕶️',
    category: 'Chic',
    tip: 'Tilt your chin up slightly with confident attitude like an editorial shoot!',
    vibe: '🕶️ Vintage Editorial',
  },
  {
    id: 'silly-fun',
    title: 'Playful Goof / Scrunch',
    koreanTitle: '장난꾸러기',
    emoji: '🤪',
    category: 'Playful',
    tip: 'Scrunch up your nose, tilt your head sideways, and make a funny candid face!',
    vibe: '🤪 Candid & Silly',
  },
  {
    id: 'cat-paws',
    title: 'Cute Kitten Paws',
    koreanTitle: '고양이 손',
    emoji: '🐾',
    category: 'Cute',
    tip: 'Curl your fingers into little paws near your cheeks like a playful kitten!',
    vibe: '🐾 Adorable & Fun',
  },
  {
    id: 'golden-tilt',
    title: 'Soft Head Tilt',
    koreanTitle: '감성 틸트',
    emoji: '✨',
    category: 'Aesthetic',
    tip: 'Tilt your chin up gently and let the studio light catch your cheekbones.',
    vibe: '📸 High-Fashion Aesthetic',
  },
  {
    id: 'double-v',
    title: 'Double Peace Energy',
    koreanTitle: '더블 브이',
    emoji: '✌️✌️',
    category: 'Playful',
    tip: 'Raise both hands with peace signs framing your hair or cheeks!',
    vibe: '✌️ Maximum Cheer',
  },
  {
    id: 'side-profile',
    title: 'Candid 45° Glance',
    koreanTitle: '옆태 시선',
    emoji: '💫',
    category: 'Chic',
    tip: 'Turn slightly to your best side and glance back warmly at the lens.',
    vibe: '💫 Natural Charm',
  },
  {
    id: 'frame-face',
    title: 'Picture Frame Hands',
    koreanTitle: '얼굴 프레임',
    emoji: '🖼️',
    category: 'Playful',
    tip: 'Form an L-frame with your thumb and index fingers to frame your smile!',
    vibe: '🖼️ Creative Frame',
  },
  {
    id: 'laugh-burst',
    title: 'Unfiltered Laughter',
    koreanTitle: '함박웃음',
    emoji: '💛',
    category: 'Playful',
    tip: 'Laugh out loud as if your best friend just whispered something hilarious!',
    vibe: '💛 Pure Authenticity',
  },
  {
    id: 'duo-lean',
    title: 'Lean-In Center',
    koreanTitle: '밀착 포즈',
    emoji: '👯',
    category: 'Duo & Fun',
    tip: 'Lean right in toward the center of the frame and fill the photobooth shot!',
    vibe: '👯 Booth Buddies',
  },
  {
    id: 'soft-natural',
    title: 'Effortless Natural Look',
    koreanTitle: '내추럴 무드',
    emoji: '🌿',
    category: 'Aesthetic',
    tip: 'Relax your shoulders and look straight into the camera lens with a calm gaze.',
    vibe: '🌿 Clean & Minimalist',
  },
  {
    id: 'confident-gaze',
    title: 'Studio Portrait Gaze',
    koreanTitle: '당당한 시선',
    emoji: '🎯',
    category: 'Chic',
    tip: 'Slight head nod, relaxed expression, looking straight down the lens barrel.',
    vibe: '🕶️ Cool Vibe',
  },
  {
    id: 'film-nostalgia',
    title: '90s Film Nostalgia',
    koreanTitle: '레트로 무드',
    emoji: '🎞️',
    category: 'Aesthetic',
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
