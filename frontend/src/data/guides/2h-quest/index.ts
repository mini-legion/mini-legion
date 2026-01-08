import type { GuideDetail } from '../types';

// Guide image
import twoHandQuestImage from '../../../assets/guides/2hquest-guide.png';

export const twoHandQuestGuide: GuideDetail = {
  id: '2h-quest',
  slug: '2h-quest',
  title: '2 Hand Quest & Advice',
  subtitle: 'Legendary Desert Scourge Weapon Guide',
  description: 'Complete step-by-step guide to obtain the Legendary Desert Scourge 2H Weapon. From prerequisites to the final reward.',
  category: 'guides',
  subcategory: 'beginner',
  image: twoHandQuestImage,
  author: 'ʀᴇᴅᴍ²',
  date: '2025-11-30',
  readTime: '5 min',
  tags: ['legendary', 'weapon', '2h', 'quest', 'desert scourge', 'dungeon'],
  sections: [
    {
      type: 'note',
      title: 'Before You Begin',
      content: 'This guide covers the entire questline to obtain the Legendary Desert Scourge 2H Weapon. Make sure to follow each phase in order.'
    },
    {
      type: 'steps',
      title: 'Phase 1: Prerequisites',
      steps: [
        {
          stepNumber: 1,
          title: 'Quest Completion',
          description: 'Complete all available Main and Side quest lines before you can begin the hunt for the legendary weapon.'
        },
        {
          stepNumber: 2,
          title: 'Trigger the Legendary Quest',
          description: 'Progress until Kik Night offers you the "Legendary Quest." This unlocks the ability to start the weapon questline.'
        }
      ]
    },
    {
      type: 'steps',
      title: 'Phase 2: The Epic Weapon (Arcane Slab-1)',
      steps: [
        {
          stepNumber: 1,
          title: 'Speak to Kik Night',
          description: 'Start by talking to Kik Night to begin your journey towards the Epic base weapon.'
        },
        {
          stepNumber: 2,
          title: 'Purchase Arcane Slab-1',
          description: 'Buy the Arcane Slab-1 from Kik Night. This will unlock two specific objectives.'
        },
        {
          stepNumber: 3,
          title: 'The Quest Objectives',
          description: 'You need to obtain two items: "The Protector" and "The Deflector".'
        },
        {
          stepNumber: 4,
          title: 'Farm the Regular "Lost Ruins" Dungeon',
          description: 'Both "The Protector" and "The Deflector" drop from the Regular "Lost Ruins" Dungeon.'
        },
        {
          stepNumber: 5,
          title: 'Claim Your Epic Weapon',
          description: 'Once you have both items, turn them in to Kik Night to receive an Epic 2-Handed Weapon.'
        }
      ]
    },
    {
      type: 'warning',
      title: 'Reputation Grind Required',
      content: 'Before you can upgrade to the Legendary version, you must reach Exalted Reputation with the faction.'
    },
    {
      type: 'steps',
      title: 'Phase 3: The Reputation Grind',
      steps: [
        {
          stepNumber: 1,
          title: 'Reach Exalted Reputation',
          description: 'Your goal is to reach Exalted Reputation with the faction. This is required before you can purchase the next upgrade.'
        },
        {
          stepNumber: 2,
          title: 'Farm the Harpoon Area',
          description: 'The fastest method to gain reputation is farming the Harpoon area. The quests there are repeatable and offer high reputation gains.'
        }
      ]
    },
    {
      type: 'steps',
      title: 'Phase 4: The Legendary Weapon (Arcane Slab-2)',
      steps: [
        {
          stepNumber: 1,
          title: 'Return to Kik Night',
          description: 'Once you are Exalted, return to Kik Night to finish the journey.'
        },
        {
          stepNumber: 2,
          title: 'Purchase Arcane Slab-2',
          description: 'Buy the Arcane Slab-2 from Kik Night. This unlocks upgraded versions of the previous objectives.'
        },
        {
          stepNumber: 3,
          title: 'Heroic Quest Objectives',
          description: 'You need to obtain the Epic versions: "The Protector" (Heroic) and "The Deflector" (Heroic).'
        },
        {
          stepNumber: 4,
          title: 'Farm the Heroic "Lost Ruins" Dungeon',
          description: 'Both Heroic items drop from the Heroic "Lost Ruins" Dungeon.'
        },
        {
          stepNumber: 5,
          title: 'Claim Your Legendary Weapon',
          description: 'Turn both Heroic items in to Kik Night to receive the Legendary Desert Scourge 2H Weapon!'
        }
      ]
    },
    {
      type: 'image',
      image: twoHandQuestImage,
      imageCaption: 'Complete visual overview of the 2H Quest progression and weapon rewards'
    },
    {
      type: 'tips',
      title: 'Pro Tips',
      tips: [
        {
          icon: '💡',
          title: 'Maximize Efficiency',
          description: 'While grinding reputation at Harpoon, you can also farm materials for crafting and other upgrades.'
        },
        {
          icon: '⚔️',
          title: 'Party Up for Heroic',
          description: 'The Heroic "Lost Ruins" Dungeon can be challenging. Consider forming a party for faster and safer runs.'
        },
        {
          icon: '🎯',
          title: 'Track Your Progress',
          description: 'Keep track of which items you\'ve obtained. The Protector and Deflector can drop from any boss in the dungeon.'
        }
      ]
    }
  ],
  relatedGuides: ['heroic-dg-solo']
};

