import type { GuideDetail } from '../types';

// Guide image - place the image at: frontend/src/assets/guides/heroic-dg-solo.png
// Uncomment the import below once the image is added:
import heroicDgSoloImage from '../../../assets/guides/heroic-dg-solo.png';

export const heroicDgSoloGuide: GuideDetail = {
  id: 'heroic-dg-solo',
  slug: 'heroic-dg-solo',
  title: 'How to Heroic DG Solo',
  subtitle: '3 Quick Tips & Tricks to Rush the DG',
  description: 'Learn how to efficiently solo Heroic Dungeons with your team of companions. Master synergy, dungeon knowledge, and speed run strategies.',
  category: 'guides',
  subcategory: 'raids-dungeons',
  image: heroicDgSoloImage,
  author: 'ʀᴇᴅᴍ²',
  date: '2025-12-17',
  readTime: '3 min',
  tags: ['dungeon', 'heroic', 'solo', 'farming', 'tips'],
  sections: [
    {
      type: 'note',
      title: 'Important',
      content: 'Make sure you have all your CHARACTERS on the same server before attempting to solo Heroic Dungeons.'
    },
    {
      type: 'tips',
      title: 'Tips & Tricks',
      tips: [
        {
          icon: '✦',
          title: 'Synergy',
          description: 'Having good synergy between the team members, a healer, a protector and a DPS is recommended.'
        },
        {
          icon: '✦',
          title: 'Know your DG',
          description: 'Knowing which dungeon you want to farm repeatedly can be beneficial, multiple dungeons allows you to bypass bosses without aggro them making it easier to complete.'
        },
        {
          icon: '✦',
          title: 'Speed Run Mode',
          description: 'When the bosses level is significantly lower than your team\'s, nothing prevents you from going straight to the point and farming the final boss, who is often the only one to drop legendary items.'
        }
      ]
    },
    {
      type: 'steps',
      title: 'Step by Step Guide',
      steps: [
        {
          stepNumber: 1,
          title: 'Select the Heroic DG Tab',
          description: 'Navigate to the Dungeon section and select the "Heroic" tab to see all available Heroic Dungeons.'
        },
        {
          stepNumber: 2,
          title: 'Click on Form Team',
          description: 'Choose your desired dungeon and click on "Form Team" to create your party. Configure the team settings like Team Mode, Loot Mode, and Approval settings.'
        },
        {
          stepNumber: 3,
          title: 'Add Your Companions',
          description: 'Click on "My Role" and add your companions from the same server. Your companions will appear at the bottom of the screen - simply click "Join" to add them to your team.'
        }
      ]
    },
    {
      type: 'image',
      image: heroicDgSoloImage,
      imageCaption: 'Visual guide showing the complete process of forming a Heroic DG Solo team'
    }
  ],
  relatedGuides: []
};

