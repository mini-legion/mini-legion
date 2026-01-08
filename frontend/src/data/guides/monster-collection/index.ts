import type { GuideDetail } from '../types';

// Guide images
import monsterGuide1 from '../../../assets/guides/monster-collection/monster-guide1.png';
import monsterGuide2 from '../../../assets/guides/monster-collection/monster-guide2.png';
import monsterGuide3 from '../../../assets/guides/monster-collection/monster-guide3.png';
import monsterGuide4 from '../../../assets/guides/monster-collection/monster-guide4.png';

export const monsterCollectionGuide: GuideDetail = {
  id: 'monster-collection',
  slug: 'monster-collection',
  title: 'Ultimate Monster & Gear Collection Guide',
  subtitle: 'Maximize your CP with Collections',
  description: 'The Collection system is crucial because it provides massive CP (Combat Power) and Stat boosts shared across all your roles. Learn how to efficiently farm monsters and gear.',
  category: 'guides',
  subcategory: 'farming',
  image: monsterGuide1,
  author: 'Majosam',
  date: '2026-01-06',
  readTime: '8 min',
  tags: ['collection', 'farming', 'monsters', 'gear', 'cp', 'stats', 'beginner'],
  sections: [
    // Section 1: Why Focus on Collections?
    {
      type: 'text',
      title: '1. Why Focus on Collections?',
      content: 'The Collection system is crucial because it provides massive CP (Combat Power) and Stat boosts shared across all your roles.'
    },
    {
      type: 'note',
      title: 'When to Start',
      content: 'You should focus on this with every role as soon as they hit Level 60.'
    },
    {
      type: 'tips',
      title: 'Visualizing Your Gains',
      tips: [
        {
          icon: '👁️',
          title: 'Preview',
          description: 'To see exactly what you are gaining, go to the main Collection screen and check the "Preview" at the bottom. This lists all your active bonus stats.'
        }
      ]
    },

    // Section 2: How to Find and Farm Monsters
    {
      type: 'text',
      title: '2. How to Find and Farm Monsters',
      content: 'To begin, click on Monster Collection, select a zone, and pick a monster you haven\'t maxed out yet.'
    },
    {
      type: 'image',
      image: monsterGuide1,
      imageCaption: 'Monster Collection menu - Select a zone to view available monsters'
    },
    {
      type: 'image',
      image: monsterGuide2,
      imageCaption: 'Selecting a specific monster from the collection menu'
    },
    {
      type: 'warning',
      title: 'The Golden Rule: Match the Picture, Not the Name',
      content: 'Monster names often do not match the names on the map (some monsters have up to 3 different names). Orient yourself solely by the picture. Find the mob on the map that looks exactly like the one in the collection menu.'
    },
    {
      type: 'steps',
      title: 'Farming Strategy',
      steps: [
        {
          stepNumber: 1,
          title: 'Locate the Monster',
          description: 'Find the monster on the map using the picture method - match the appearance, not the name.'
        },
        {
          stepNumber: 2,
          title: 'Move to Location',
          description: 'Move your character to the monster\'s location on the map.'
        },
        {
          stepNumber: 3,
          title: 'AFK Farm',
          description: 'Set your character to AFK mode to farm Monster Tokens automatically.'
        }
      ]
    },
    {
      type: 'image',
      image: monsterGuide4,
      imageCaption: 'AFK farming setup for efficient token collection'
    },
    {
      type: 'tips',
      title: 'Pro Tip',
      tips: [
        {
          icon: '⭐',
          title: 'Rare Mobs',
          description: 'Position your character near Rare Mobs. These also give tokens, and some can drop up to 6 different types at once. It takes time to max them out, but it is worth it.'
        }
      ]
    },
    {
      type: 'image',
      image: monsterGuide3,
      imageCaption: 'Rare mob locations can provide multiple token types'
    },

    // Section 3: Collection Sources
    {
      type: 'text',
      title: '3. Collection Sources: Where to Look',
      content: 'You can collect items from various sources. If you open the Collection menu and tap "All" at the top, it will show you exactly where to find each item.'
    },
    {
      type: 'table',
      title: 'Collection Sources',
      tableHeaders: ['Source', 'What You Get'],
      tableRows: [
        ['Open World', 'Killing normal mobs'],
        ['Elites', 'Killing Elite monsters'],
        ['Dungeons', 'Item collections and gear'],
        ['Events', 'Special event collections']
      ]
    },

    // Section 4: Sets and Star Bonuses
    {
      type: 'text',
      title: '4. Sets and Star Bonuses',
      content: 'In the "Set" tab, you will find Monster Sets and Gear Sets. You unlock significant stat bonuses when a set reaches 2, 3, or 5 stars.'
    },
    {
      type: 'table',
      title: 'Set Types',
      tableHeaders: ['Set Type', 'How to Obtain'],
      tableRows: [
        ['Gear Sets', 'Obtained exclusively from Dungeons'],
        ['Monster Sets', 'Obtained exclusively by killing Elites']
      ]
    },
    {
      type: 'tips',
      title: 'Elite Farming Strategy',
      tips: [
        {
          icon: '💡',
          title: 'Alt Characters',
          description: 'Since Elites spawn periodically, a good tip is to park your alt characters at Elite spawn locations to farm them efficiently.'
        }
      ]
    },

    // Section 5: Upgrading and Upstarring
    {
      type: 'text',
      title: '5. Upgrading and Upstarring',
      content: 'To increase the star level ("Upstar") or upgrade your collections, you need specific resources.'
    },
    {
      type: 'table',
      title: 'Resources Needed',
      tableHeaders: ['Resource', 'Source'],
      tableRows: [
        ['Coins', 'Dropped by Elites'],
        ['Gear Squares', 'Dropped in Dungeons'],
        ['Rare Starstones', 'Used to upgrade specific items']
      ]
    },
    {
      type: 'table',
      title: 'Green Monsters',
      tableHeaders: ['Action', 'Requirement'],
      tableRows: [
        ['Upstarring', 'Free! Just kill a large number of them to reach 5 stars easily'],
        ['Upgrading (to Lv60)', 'Requires Bound Gold']
      ]
    },
    {
      type: 'table',
      title: 'Blue Monsters/Gear',
      tableHeaders: ['Action', 'Requirement'],
      tableRows: [
        ['Upgrading', 'Requires Gold'],
        ['Upstarring', 'Requires Rare Starstones']
      ]
    },
    {
      type: 'note',
      title: 'Final Tip',
      content: 'Prioritize Green monsters first as they are free to upstar. Once you have most Greens at 5 stars, start working on Blue monsters and gear.'
    }
  ],
  relatedGuides: ['heroic-dg-solo']
};

