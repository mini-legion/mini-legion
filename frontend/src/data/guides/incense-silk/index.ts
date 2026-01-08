import type { GuideDetail } from '../types';

// Guide images
import silkGuide1 from '../../../assets/guides/incense-silk/silk-guide1.png';
import silkGuide2 from '../../../assets/guides/incense-silk/silk-guide2.png';
import silkGuide3 from '../../../assets/guides/incense-silk/silk-guide3.png';
import silkGuide4 from '../../../assets/guides/incense-silk/silk-guide4.png';
import silkGuide5 from '../../../assets/guides/incense-silk/silk-guide5.png';
import silkGuide6 from '../../../assets/guides/incense-silk/silk-guide6.png';
import silkGuide7 from '../../../assets/guides/incense-silk/silk-guide7.png';

export const incenseSilkGuide: GuideDetail = {
  id: 'incense-silk',
  slug: 'incense-silk',
  title: 'Ultimate Incense Silk Guide',
  subtitle: 'Master the Most Powerful Resource for CP Growth',
  description: 'Complete guide to obtaining Incense Silk, the most important resource for increasing your Combat Power. Learn all F2P methods including Battle Pass, Arena, Events, Shop, and Elite Farming.',
  category: 'guides',
  subcategory: 'farming',
  image: silkGuide1,
  author: 'Mini Legion',
  date: '2026-01-07',
  readTime: '8 min',
  tags: ['incense silk', 'shirt upgrade', 'cp', 'f2p', 'arena', 'battle pass', 'elite farming', 'resources'],
  sections: [
    {
      type: 'note',
      title: '1. Why is it Important?',
      content: 'Incense Silk is arguably the **most powerful resource** in the game for increasing your CP, as it allows you to increase the star level of your Shirt. However, it is also one of the hardest resources for Free-to-Play (F2P) players to obtain.'
    },
    {
      type: 'steps',
      title: 'Cost Scaling (Green to Blue)',
      steps: [
        {
          stepNumber: 1,
          title: '2 Star',
          description: '50 Silk'
        },
        {
          stepNumber: 2,
          title: '3 Star',
          description: '160 Silk'
        },
        {
          stepNumber: 3,
          title: '4 Star',
          description: '360 Silk'
        },
        {
          stepNumber: 4,
          title: '5 Star',
          description: '600 Silk'
        },
        {
          stepNumber: 5,
          title: 'Upgrade to Blue',
          description: '750 Silk'
        }
      ]
    },
    {
      type: 'warning',
      title: 'Pro Tip',
      content: 'If you achieve 5 green stars and Shirt Level 60 on one character, the upgrade cost for your alternate characters (alts) is **reduced by 50%**.'
    },
    {
      type: 'image',
      image: silkGuide1,
      imageCaption: 'Incense Silk Upgrade Costs Overview'
    },
    {
      type: 'text',
      title: '2. Method 1: The Battle Pass',
      content: 'You earn Activity Points by completing daily quests (found under "Daily" in town).'
    },
    {
      type: 'tips',
      title: 'Battle Pass Details',
      tips: [
        {
          icon: '✅',
          title: 'Availability',
          description: 'Most quests are doable by Level 10.'
        },
        {
          icon: '⏰',
          title: 'The Clock',
          description: 'For the first 30 days after creating your first character, these points count toward the Battle Pass.'
        },
        {
          icon: '🎁',
          title: 'Milestones',
          description: 'Reaching 1100 and 2400 points rewards 25 Incense Silk each (Total: 50).'
        },
        {
          icon: '📅',
          title: 'Timeframe',
          description: 'Earning 100 points/day, it takes about 24 days to get all 50 Silk.'
        }
      ]
    },
    {
      type: 'image',
      image: silkGuide2,
      imageCaption: 'Battle Pass Milestones and Rewards'
    },
    {
      type: 'text',
      title: '3. Method 2: Special Events',
      content: 'Events like Thanksgiving or Fishing award currency for daily logins or activities.'
    },
    {
      type: 'warning',
      title: 'Strategy',
      content: 'You can use event currency to buy Incense Silk, but you must prioritize. These shops also sell transmogs, titles, avatars, Iron Scrap, and Gold. **You have to decide if Silk is more important than cosmetics or other upgrades.**'
    },
    {
      type: 'image',
      image: silkGuide3,
      imageCaption: 'Special Event Shop - Prioritize Your Purchases'
    },
    {
      type: 'text',
      title: '4. Method 3: The Arena (Weekly)',
      content: 'Once unlocked, the Arena offers weekly Silk rewards.'
    },
    {
      type: 'steps',
      title: '1v1 Arena',
      steps: [
        {
          stepNumber: 1,
          title: 'Goal',
          description: 'Win 40 matches in a week to unlock the final chest containing 20 Incense Silk.'
        },
        {
          stepNumber: 2,
          title: 'The Cost',
          description: 'You get 35 free matches/week. To hit 40 wins, you must buy 5 extra tickets.'
        },
        {
          stepNumber: 3,
          title: 'Tip',
          description: 'Buy 1-2 tickets per day for 10 diamonds each to keep the cost low.'
        },
        {
          stepNumber: 4,
          title: 'Rank Rewards',
          description: 'Minimum 2 Silk for participating; up to 25 Silk for Rank #1.'
        }
      ]
    },
    {
      type: 'steps',
      title: '3v3 Arena',
      steps: [
        {
          stepNumber: 1,
          title: 'Goal',
          description: '25 wins/week unlocks 10 Incense Silk.'
        },
        {
          stepNumber: 2,
          title: 'Rank Rewards',
          description: 'Minimum 2 Silk; up to 80 Silk for Rank #1.'
        }
      ]
    },
    {
      type: 'image',
      image: silkGuide4,
      imageCaption: 'Arena Weekly Rewards'
    },
    {
      type: 'text',
      title: '5. Method 4: The Shop',
      content: 'If you have the currency, the Town Shop always has Silk in stock.'
    },
    {
      type: 'tips',
      title: 'Shop Costs & Limits',
      tips: [
        {
          icon: '💎',
          title: 'Diamonds',
          description: '20 Diamonds per Silk. Weekly limit: 300 Silk max.'
        },
        {
          icon: '🏆',
          title: 'Arena Coins',
          description: '50 Honor Coins per Silk. Weekly limit: 12 Silk max.'
        },
        {
          icon: '⚔️',
          title: 'Grand Arena Points',
          description: '20 Conquer Points per Silk. Weekly limit: 50 Silk max.'
        }
      ]
    },
    {
      type: 'image',
      image: silkGuide5,
      imageCaption: 'Town Shop - Incense Silk Purchases'
    },
    {
      type: 'text',
      title: '6. Method 5: Elite Farming (AFK)',
      content: 'This method is significantly faster if you have the "Dawnbreaker" package (increases elite drops/reduces respawn), but it still works for F2P players at a slower rate.'
    },
    {
      type: 'warning',
      title: 'Crucial Strategy: Ignore the First 4 Elites',
      content: 'The first 4 Elites listed in the AFK menu **do not have Incense Silk in their loot table**.'
    },
    {
      type: 'note',
      title: 'Recommendation',
      content: 'Once you have maxed reputation and 5-starred blue monsters in the first 2 zones, **uncheck these 4 elites from your AFK settings**. Tests show that removing them drastically increases the Silk drop rate relative to time spent.'
    },
    {
      type: 'steps',
      title: 'The Math (5-Character Farm)',
      steps: [
        {
          stepNumber: 1,
          title: 'Rate',
          description: '~125 Rares killed = 1 Silk'
        },
        {
          stepNumber: 2,
          title: 'Time',
          description: 'It takes ~14 hours for one character to farm 1 Silk.'
        },
        {
          stepNumber: 3,
          title: 'Combined',
          description: 'If all 5 characters farm simultaneously, you get 1 Silk every ~3 hours.'
        },
        {
          stepNumber: 4,
          title: 'Weekly Yield',
          description: 'By AFK farming overnight/all week, you can collect approximately 56 Silk per week.'
        }
      ]
    },
    {
      type: 'image',
      image: silkGuide6,
      imageCaption: 'Elite Farming Setup - Uncheck First 4 Elites'
    },
    {
      type: 'text',
      title: 'Summary & Expectations',
      content: 'If you combine Elite Farming and Arena (buying minimal tickets):'
    },
    {
      type: 'tips',
      title: 'Weekly Progress',
      tips: [
        {
          icon: '📊',
          title: 'Weekly Gain',
          description: '~50 (Farming) + ~80 (Arena) = 130 Silk / Week.'
        },
        {
          icon: '📅',
          title: 'Timeline',
          description: 'It will take approximately 15 weeks to upgrade your shirt to Blue quality purely through gameplay (without buying Silk directly from the shop).'
        },
        {
          icon: '💡',
          title: 'Value',
          description: 'Every single Silk you buy or earn from an event saves you 3 hours of AFK farming time.'
        }
      ]
    },
    {
      type: 'image',
      image: silkGuide7,
      imageCaption: 'Summary - Weekly Silk Gains Overview'
    }
  ],
  relatedGuides: ['afk-farming', 'heirloom-xp', '2h-quest']
};
