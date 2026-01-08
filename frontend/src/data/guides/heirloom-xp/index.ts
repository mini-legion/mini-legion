import type { GuideDetail } from '../types';

// Guide images
import heirloomGuide from '../../../assets/guides/heilroom/heilroom-guide.png';

export const heirloomXpGuide: GuideDetail = {
  id: 'heirloom-xp',
  slug: 'heirloom-xp',
  title: 'Heirloom Armor Sets & XP Guide',
  subtitle: 'Maximize Your Experience Gains with Special Equipment',
  description: 'Complete guide to Heirloom armor sets, including how to obtain each piece, XP bonuses, and tips for stacking bonuses on alt characters.',
  category: 'guides',
  subcategory: 'farming',
  image: heirloomGuide,
  author: 'ʀᴇᴅᴍ²',
  date: '2026-01-07',
  readTime: '6 min',
  tags: ['heirloom', 'xp', 'experience', 'armor', 'equipment', 'leveling', 'alts', 'dungeons', 'reputation'],
  sections: [
    {
      type: 'text',
      title: '1. What are Heirlooms?',
      content: 'Heirloom armor sets are special equipment pieces that grant a **percentage increase to experience** gained from killing all mobs and during AFK farming.'
    },
    {
      type: 'steps',
      title: 'How to View Heirlooms',
      steps: [
        {
          stepNumber: 1,
          title: 'Open Inventory',
          description: 'Access your character\'s Inventory menu.'
        },
        {
          stepNumber: 2,
          title: 'Click on Transmogs',
          description: 'Navigate to the Transmogs tab.'
        },
        {
          stepNumber: 3,
          title: 'Select Heirlooms',
          description: 'Click on "Heirlooms" in the bottom right corner to view all available pieces.'
        }
      ]
    },
    {
      type: 'image',
      image: heirloomGuide,
      imageCaption: 'Heirloom Menu - View all available heirloom pieces and their XP bonuses'
    },
    {
      type: 'note',
      title: 'Pro Tip',
      content: 'Clicking on any individual heirloom in this menu will display specific information on how to obtain it.'
    },
    {
      type: 'text',
      title: '2. How to Obtain Heirlooms',
      content: 'There are **three main ways** to get these valuable items:'
    },
    {
      type: 'tips',
      title: 'Acquisition Methods',
      tips: [
        {
          icon: '💳',
          title: 'Paid (Shop)',
          description: 'Once your first character reaches Level 40, the Heirloom Shop opens in the Town section. You can buy most heirlooms here for $14.99 each (the Chest is the primary purchase as it gives +40% XP).'
        },
        {
          icon: '⚔️',
          title: 'Dungeon Drops',
          description: 'Several pieces drop from Heroic Dungeons (usually from the last boss). Pro Tip: Complete dungeons in a Warband for higher drop chances.'
        },
        {
          icon: '⭐',
          title: 'Reputation',
          description: 'Some pieces are sold by faction vendors once you reach the required Reputation level.'
        }
      ]
    },
    {
      type: 'text',
      title: '3. Complete Heirloom List & Locations',
      content: 'Here is the breakdown of every piece, its XP bonus, and where to find it:'
    },
    {
      type: 'table',
      title: 'Head & Shoulders',
      tableHeaders: ['#', 'Piece', 'XP Bonus', 'Location'],
      tableRows: [
        ['1', 'Heritage Crown', '+5% XP', 'Arena Shop (Requires 3000 Arena Points)'],
        ['2', 'Heritage Spaulders', '+5% XP', 'Heroic Lost Ruins - Boss: Zul\'Gim']
      ]
    },
    {
      type: 'table',
      title: 'Torso & Hands',
      tableHeaders: ['#', 'Piece', 'XP Bonus', 'Location'],
      tableRows: [
        ['3', 'Heritage Breastplate', '+40% XP', 'Shop Exclusive: $15 pack in Village (Town) at Level 40'],
        ['5', 'Heritage Gauntlets', '+5% XP', 'Thiaro Rep Vendor (Requires specific Rep level)']
      ]
    },
    {
      type: 'table',
      title: 'Jewelry & Back',
      tableHeaders: ['#', 'Piece', 'XP Bonus', 'Location'],
      tableRows: [
        ['4', 'Heritage Pendant', '+20% XP', 'Voyage/Fest Event (new servers) - Look for tile with Necklace/Alpaca mount'],
        ['6', 'Heritage Cloak', '+5% XP', 'Heroic Soul Lab-1 - Boss: Dean Hasting']
      ]
    },
    {
      type: 'table',
      title: 'Legs, Feet & Waist',
      tableHeaders: ['#', 'Piece', 'XP Bonus', 'Location'],
      tableRows: [
        ['7', 'Heritage Bracers', '+5% XP', 'Heroic Moonclaw - Boss: Rudy'],
        ['8', 'Heritage Belt', '+5% XP', 'Saharis Rep Vendor (Requires specific Rep level)'],
        ['9', 'Heritage Legplates', '+5% XP', 'Heroic Sick City E - Boss: Dread Emperor'],
        ['10', 'Heritage Boots', '+5% XP', 'Sicklands Rep Vendor (Requires specific Rep level)']
      ]
    },
    {
      type: 'text',
      title: '4. Important Notes on XP',
      content: 'Understanding how XP bonuses work with your characters:'
    },
    {
      type: 'tips',
      title: 'XP Stacking & Alt Bonuses',
      tips: [
        {
          icon: '📊',
          title: 'Stacking Bonuses',
          description: 'You can obtain multiple heirlooms by playing the game (via drops/rep) if you do not wish to buy them. All XP bonuses stack together!'
        },
        {
          icon: '👥',
          title: 'Alt Characters',
          description: 'Your alternative characters (alts) receive the Heirloom XP bonus PLUS an additional bonus based on the level difference between your highest-level character (toon) and the alt.'
        }
      ]
    },
    {
      type: 'warning',
      title: 'Total XP Potential',
      content: 'By collecting all heirloom pieces, you can achieve a total XP bonus of **+100%** (5+5+40+5+20+5+5+5+5+5 = 100%). Combined with alt character bonuses, this significantly speeds up leveling!'
    }
  ],
  relatedGuides: ['afk-farming', '2h-quest', 'heroic-dg-solo']
};
