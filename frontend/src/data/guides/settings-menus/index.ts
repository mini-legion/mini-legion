import type { GuideDetail } from '../types';

// Guide images
import settingsGuide1 from '../../../assets/guides/settings/settings-guide1.webp';
import settingsGuide2 from '../../../assets/guides/settings/settings-guide2.webp';
import settingsGuide3 from '../../../assets/guides/settings/settings-guide3.webp';
import settingsGuide4 from '../../../assets/guides/settings/settings-guide4.webp';
import settingsGuide5 from '../../../assets/guides/settings/settings-guide5.webp';
import settingsGuide6 from '../../../assets/guides/settings/settings-guide6.webp';
import settingsGuide7 from '../../../assets/guides/settings/settings-guide7.webp';
import settingsGuide8 from '../../../assets/guides/settings/settings-guide8.webp';
import settingsGuide9 from '../../../assets/guides/settings/settings-guide9.webp';
import settingsGuide10 from '../../../assets/guides/settings/settings-guide10.webp';
import settingsGuide11 from '../../../assets/guides/settings/settings-guide11.webp';
import settingsGuide12 from '../../../assets/guides/settings/settings-guide12.webp';
import settingsGuide13 from '../../../assets/guides/settings/settings-guide13.webp';
import settingsGuide14 from '../../../assets/guides/settings/settings-guide14.webp';
import settingsGuide15 from '../../../assets/guides/settings/settings-guide15.webp';
import settingsGuide16 from '../../../assets/guides/settings/settings-guide16.webp';
import settingsGuide17 from '../../../assets/guides/settings/settings-guide17.webp';
import settingsGuide18 from '../../../assets/guides/settings/settings-guide18.webp';

export const settingsMenusGuide: GuideDetail = {
  id: 'settings-menus',
  slug: 'settings-menus',
  title: 'Handy Guide to Settings and Menus',
  subtitle: 'Everything You Missed or Were Looking For',
  description: 'Complete guide to game settings and menus, covering auto-dismantle, AFK farming, server time, promo codes, chat settings, dungeon teams, item transfers, food, heirlooms, skills, and more.',
  category: 'guides',
  subcategory: 'beginner',
  image: settingsGuide1,
  author: 'Step Bro',
  date: '2026-01-07',
  readTime: '8 min',
  tags: ['settings', 'menus', 'tips', 'basics', 'afk', 'dismantle', 'bank', 'food', 'heirloom', 'skills', 'dungeon'],
  sections: [
    {
      type: 'note',
      title: 'Introduction',
      content: 'Here are some of the things you may be looking for or things you simply missed. This guide covers the most common questions about settings and menus in the game.'
    },

    // Question 1: Auto Dismantle
    {
      type: 'text',
      title: '1) How to automatically dissolve items from AFK farming?',
      content: 'You need to choose the right settings in the **Dismantle → Auto** tab. Now you need to tick the **Enable dismantle** check in the AFK Backpack when collecting your AFK loot.\n\nFirst time all the loot will be shown in the AFK Backpack but after clicking **Claim All** you will only receive gear crystals. After that you will be dismantling items as they drop.'
    },
    {
      type: 'image',
      image: settingsGuide1,
      imageCaption: 'Auto Dismantle Settings - Part 1'
    },
    {
      type: 'image',
      image: settingsGuide2,
      imageCaption: 'Auto Dismantle Settings - Part 2'
    },

    // Question 2: AFK Farming Position
    {
      type: 'text',
      title: '2) My character doesn\'t stay where I left him for AFK farming',
      content: 'You need to make sure that you actually left him for AFK farming instead of letting him do whatever he wants. To do that make sure the marked icon shows **Auto AFK**.\n\nWhen AFK farming you can also choose to farm Elite mobs - your character will move to the Elite location and come back to AFK spot after killing. If you have a free teleport option (**Dawnbreaker pack** - highly recommended) your character will farm much more efficient.\n\nIf your character dies during AFK farming he\'ll move to the recommended AFK farm spot (recommended by the game, not the players).'
    },
    {
      type: 'image',
      image: settingsGuide3,
      imageCaption: 'Auto AFK Mode Icon'
    },

    // Question 3: Server Time
    {
      type: 'text',
      title: '3) What is the server time?',
      content: 'You can find it in the **Settings** menu (accessible via the cogwheel icon on the right side of the screen).'
    },
    {
      type: 'image',
      image: settingsGuide4,
      imageCaption: 'Server Time Location in Settings'
    },

    // Question 4: Promo Codes
    {
      type: 'text',
      title: '4) Where can I redeem promo codes?',
      content: 'In the **Settings** menu.'
    },
    {
      type: 'image',
      image: settingsGuide5,
      imageCaption: 'Promo Code Redemption in Settings'
    },

    // Question 5: Meetstone Notifications
    {
      type: 'text',
      title: '5) How can I turn off the Meetstone notification spam?',
      content: 'Go to the main chat window and untick the **Meetstone** check.'
    },
    {
      type: 'image',
      image: settingsGuide6,
      imageCaption: 'Meetstone Chat Filter'
    },

    // Question 6: Solo Farm Dungeons
    {
      type: 'text',
      title: '6) How can I solo farm dungeons with my alts?',
      content: 'You can add alts in the team view when making a dungeon team.\n\nAlthough it\'s recommended to have at least one more player in the team - optimal is 4 your characters and 1 other player. This way you will be presented with a choice of rewards after each boss. Going solo gives you no choice and has a chance to give 0 items.'
    },
    {
      type: 'image',
      image: settingsGuide7,
      imageCaption: 'Adding Alts to Dungeon Team'
    },

    // Question 7: Alt Builds
    {
      type: 'text',
      title: '7) My alts are using weird builds in the dungeon',
      content: 'You need to select the right build when adding your alt.'
    },
    {
      type: 'image',
      image: settingsGuide8,
      imageCaption: 'Selecting Alt Build for Dungeon'
    },

    // Question 8: Remove Alt from Team
    {
      type: 'text',
      title: '8) How can I remove alt from dungeon team?',
      content: 'Use this tiny button:'
    },
    {
      type: 'image',
      image: settingsGuide9,
      imageCaption: 'Remove Alt Button'
    },

    // Question 9: Item Transfer
    {
      type: 'text',
      title: '9) How can I transfer items between my characters?',
      content: 'You can drop the item in the **Bank** - city view.\n\nThe Bank icon visible in your inventory shows only a personal stash of the current character. This one is a good option to keep alternative gear.'
    },
    {
      type: 'image',
      image: settingsGuide10,
      imageCaption: 'Bank Location in City View'
    },
    {
      type: 'image',
      image: settingsGuide11,
      imageCaption: 'Personal Stash vs Shared Bank'
    },

    // Question 10: Buy Food
    {
      type: 'text',
      title: '10) Where can I buy food?',
      content: 'After clicking the food icon on the main screen and going here:'
    },
    {
      type: 'image',
      image: settingsGuide12,
      imageCaption: 'Food Purchase Location'
    },

    // Question 11: Not Enough Gold for Food
    {
      type: 'text',
      title: '11) I don\'t have enough gold to buy more food - what to do?',
      content: 'The best idea is to farm mobs you can handle. There are recommended spots according to character\'s STA level.\n\nYou can also get food from **Nomi\'s Baskets** (awarded for daily activity)\nor\nYou can use **Packs of Bound Gold** (awarded from events, rankings, etc).\n\nIt\'s recommended to keep both for later game as food gets more expensive and Gold from Pack of Bound Gold scale up with your Bonfire level.'
    },
    {
      type: 'image',
      image: settingsGuide13,
      imageCaption: 'Nomi\'s Baskets - Food Source'
    },
    {
      type: 'image',
      image: settingsGuide14,
      imageCaption: 'Packs of Bound Gold'
    },

    // Question 12: Heirlooms
    {
      type: 'text',
      title: '12) How can I use heirlooms?',
      content: 'The heirloom menu is a little hidden. Follow the screenshots.'
    },
    {
      type: 'image',
      image: settingsGuide15,
      imageCaption: 'Accessing Heirloom Menu - Step 1'
    },
    {
      type: 'image',
      image: settingsGuide16,
      imageCaption: 'Accessing Heirloom Menu - Step 2'
    },

    // Question 13: Skill Setup Not Saved
    {
      type: 'text',
      title: '13) My skill setup is not saved, why?',
      content: 'You probably tried to change the premade builds. You can do so but changing to any other build will reset the premade.\n\nTo set up your own go here:'
    },
    {
      type: 'image',
      image: settingsGuide17,
      imageCaption: 'Custom Skill Build Setup'
    },

    // Question 14: Character Stopped AFK Farming
    {
      type: 'text',
      title: '14) My character stopped AFK farming, why?',
      content: 'You probably ran out of available AFK farm timer. You can check the remaining time on the screenshot.\n\nOther possibility is that your AFK farm was disrupted by a server maintenance.'
    },
    {
      type: 'image',
      image: settingsGuide18,
      imageCaption: 'AFK Farm Timer Location'
    }
  ],
  relatedGuides: ['afk-farming', 'heirloom-xp']
};
