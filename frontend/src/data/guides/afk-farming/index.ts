import type { GuideDetail } from '../types';

// Guide images
import afkGuideAlliance from '../../../assets/guides/afk/afk-guide1.png';
import afkGuideHorde from '../../../assets/guides/afk/afk-guide2.png';
import afkGuideStats from '../../../assets/guides/afk/afk-guide3.png';

export const afkFarmingGuide: GuideDetail = {
  id: 'afk-farming',
  slug: 'afk-farming',
  title: 'Recommended AFK Farming Spots',
  subtitle: 'Optimize Your Experience Gains While You Sleep',
  description: 'Complete guide to AFK farming, including best spots based on your STA, faction-specific maps, and tips for maximizing your EXP gains.',
  category: 'guides',
  subcategory: 'beginner',
  image: afkGuideAlliance,
  author: 'ʀᴇᴅᴍ²',
  date: '2026-01-07',
  readTime: '4 min',
  tags: ['afk', 'farming', 'exp', 'leveling', 'stamina', 'alliance', 'horde'],
  sections: [
    {
      type: 'note',
      title: 'The Basics',
      content: 'You can start using AFK mode as soon as you reach **Level 7**. Even though you unlock it early, this will become your main source of EXP in the later stages of the game.'
    },
    {
      type: 'steps',
      title: 'How to Choose Your Spot',
      steps: [
        {
          stepNumber: 1,
          title: 'STA is Key',
          description: 'The "best" spot isn\'t just about level; it is based on your STA attribute.'
        },
        {
          stepNumber: 2,
          title: 'Where to Check',
          description: 'Go to your Character Section > "View" Tab to see your current STA.'
        }
      ]
    },
    {
      type: 'image',
      image: afkGuideStats,
      imageCaption: 'Character View Tab - Check your STA attribute here'
    },
    {
      type: 'warning',
      title: 'Rule of Thumb',
      content: 'If you don\'t have enough Stamina to survive the mobs efficiently, you will die or farm slowly.'
    },
    {
      type: 'note',
      title: 'Online vs. Offline AFK (Important!)',
      content: 'Believe it or not, **closing the game is better than leaving it open**.'
    },
    {
      type: 'steps',
      title: 'Why Offline is Better',
      steps: [
        {
          stepNumber: 1,
          title: 'Game Open',
          description: 'Your character might "Roam" (walk around), moving away from the optimal hotspot and lowering your kill rate.'
        },
        {
          stepNumber: 2,
          title: 'Game Closed',
          description: 'Your character stays locked in the exact coordinates you left them in. This ensures you gain optimal EXP without wandering into bad areas.'
        }
      ]
    },
    {
      type: 'tips',
      title: 'Class Specifics & Tips',
      tips: [
        {
          icon: '🏹',
          title: 'Hunters',
          description: 'Can move to harder spots earlier because their companion tanks damage, increasing survivability.'
        },
        {
          icon: '✨',
          title: 'Priests',
          description: 'Can also survive with lower STA due to self-healing abilities.'
        },
        {
          icon: '🔥',
          title: 'Flameplaine Example',
          description: 'While other classes might need more, Priests and Hunters can often farm Flameplaine with just 3800 STA.'
        }
      ]
    },
    {
      type: 'text',
      title: 'Maps & Locations',
      content: 'Here are the recommended spots based on your faction. Refer to the charts below for STA requirements per zone.'
    },
    {
      type: 'image',
      image: afkGuideAlliance,
      imageCaption: 'Alliance Side: Use this map if you belong to the Alliance faction'
    },
    {
      type: 'image',
      image: afkGuideHorde,
      imageCaption: 'Horde Side: Use this map if you belong to the Horde faction'
    }
  ],
  relatedGuides: ['2h-quest', 'heroic-dg-solo']
};
