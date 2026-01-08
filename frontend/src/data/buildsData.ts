export interface BuildDetail {
  id: string;
  heroClass: string;
  spec: string;
  title: string;
  description: string;
  author: string;
  tier: 'S' | 'A' | 'B' | 'C';
  contentType: ('Raid' | 'Mythic+' | 'PvP' | 'Leveling' | 'Open World')[];
  images: {
    skills: string;
    tree1: string;
    tree2: string;
    dungeonGear?: string;
    adventureGear?: string;
  };
  runes: {
    skill: string;
    runeName: string;
    description: string;
    icon: string;
  }[];
  // Extended fields for detailed guides
  role?: 'DPS' | 'Healer' | 'Tank';
  introText?: string;
  gearGuide?: {
    dungeonStats: {
      priority: string[];
      description: string;
    };
    adventureStats: {
      armor: { priority: string[]; description: string };
      accessories: { priority: string[]; description: string };
    };
  };
  refinesGuide?: {
    priority: string[];
    details: { slot: string; stats: string[] }[];
    tips?: string;
  };
  spellsGuide?: {
    skill: string;
    rune: string;
    description: string;
    icon: string;
    autocast: boolean;
    priority?: number;
  }[];
  healingTips?: string[];
  autocastOrder?: string[];
  talentTips?: string;
}

export const buildDetails: BuildDetail[] = [
  {
    id: 'hunter-survival',
    heroClass: 'Hunter',
    spec: 'Survival',
    title: 'End Game Raid/Mythic+ Build',
    description: 'This enables a strong single target focused playstyle that excels in raids and Mythic+ content. Gear refines and runes allow Cunning Strike to be used much more efficiently in the end game.',
    author: 'Widi - Server 60',
    tier: 'S',
    contentType: ['Raid', 'Mythic+'],
    role: 'DPS',
    images: {
      skills: '/builds/hunter-survival/skills.png',
      tree1: '/builds/hunter-survival/tree1.png',
      tree2: '/builds/hunter-survival/tree2.png',
    },
    runes: [
      {
        skill: "Nature's Protection",
        runeName: 'Porcupine',
        description: 'Provides a solid overall damage boost',
        icon: '🛡️',
      },
      {
        skill: "Falcon's Fury",
        runeName: 'Tranquility',
        description: 'When upgraded to blue, Falcon\'s Fury deals 50% increased damage to a single target',
        icon: '🦅',
      },
      {
        skill: "Hawk's Blessing",
        runeName: "Eagle's Cry",
        description: "When upgraded to blue, causes Hawk's Blessing to trigger Wing Clip for additional damage",
        icon: '✨',
      },
      {
        skill: 'Blast Trap',
        runeName: 'Concussion',
        description: 'Grants cooldown reduction and a chance to stun enemies for 1 second',
        icon: '💥',
      },
      {
        skill: 'Wing Clip',
        runeName: 'Wing Clip',
        description: "The Ignore Armor bonus significantly increases Wing Clip's damage",
        icon: '🦴',
      },
      {
        skill: 'Scatter Shot',
        runeName: 'Dynamite',
        description: 'Provides strong single target damage while also reducing mana cost',
        icon: '💣',
      },
      {
        skill: "Skylord's Strike",
        runeName: 'Vanish',
        description: "Increases damage, and when upgraded to legendary the crits can reduce Hawk's Blessing cooldown",
        icon: '⚡',
      },
      {
        skill: 'Cunning Strike',
        runeName: 'Ambush',
        description: "Required to offset Cunning Strike's high mana cost and provides a chance to reset Blast Trap's cooldown, further increasing damage output",
        icon: '🗡️',
      },
    ],
  },
  {
    id: 'priest-healing',
    heroClass: 'Priest',
    spec: 'Healing',
    title: 'High M+ Healing Build',
    description: 'A comprehensive healing guide focused on high Mythic+ dungeons. Master the art of healing through timing, movement, and efficient spell management. For low level content and raids, you can run this on auto while dodging mechanics.',
    author: 'Pastis - Server 22',
    tier: 'S',
    contentType: ['Raid', 'Mythic+'],
    role: 'Healer',
    introText: 'Welcome to my guide. I am Pastis of S22 and I am currently sitting at 110k CP. Priest is my main and I hope to share some insight into the class to help you all out. My guide is focused mainly around very high M+ dungeons as this is the most intense healing in the game currently.',
    images: {
      skills: '/builds/priest-healing/skills.png',
      tree1: '/builds/priest-healing/tree1.png',
      tree2: '/builds/priest-healing/tree2.png',
      dungeonGear: '/builds/priest-healing/dungeon-gear.png',
      adventureGear: '/builds/priest-healing/adventure-gear.png',
    },
    gearGuide: {
      dungeonStats: {
        priority: ['Versatility', 'Haste', 'Crit'],
        description: 'Vers is the strongest stat in the game - increases output and decreases damage taken. Haste speeds up cast time, GCDs, and gives extra healing ticks on Renew. Crit is nice when it happens but never stack it. Hit/Expertise caps do not matter for healing.',
      },
      adventureStats: {
        armor: {
          priority: ['Versatility', 'Dodge'],
          description: 'All armor should be Vers and Dodge with Vers as the highest stat value. Avoid upgrading any adventure gear until you find pieces with these stats.',
        },
        accessories: {
          priority: ['Versatility', 'Haste', 'Crit'],
          description: 'Necklace, staff, rings, and trinket should all prioritize Vers > Haste > Crit.',
        },
      },
    },
    refinesGuide: {
      priority: ['SP%', 'HP%', 'INT', 'Ability %', 'SP', 'Stam', 'Health'],
      tips: 'When searching red refines, roll until you find an attribute you want. After that, never lock it until you reach the bonus, then lock it and roll the bonus. This saves refine stones over time.',
      details: [
        { slot: 'Armor', stats: ['SP%', 'HP%'] },
        { slot: 'Necklace', stats: ['Holy Radiance %'] },
        { slot: 'Cape', stats: ['Holy Shock %'] },
        { slot: 'Rings', stats: ['Divine Punish DMG', 'Crit DMG %', 'Holy DMG %'] },
        { slot: 'Trinkets', stats: ['Mana Regen % (MUST HAVE)', 'Prayer of Mending %'] },
        { slot: 'Weapon', stats: ['Holy DMG %', 'Crit DMG %'] },
      ],
    },
    spellsGuide: [
      {
        skill: 'Power Voice: Fortitude',
        rune: 'Tenderness',
        description: 'Should be up at all times. Refresh anytime you are moving or have no healing to do. Avoid waiting for Autocast as this will trigger a GCD when you need to heal. Rune increases holy damage and healing %.',
        icon: '🛡️',
        autocast: true,
        priority: 1,
      },
      {
        skill: 'Renew',
        rune: 'Gratitude',
        description: 'Huge throughput spell that keeps tank topped off. Only cast when tank is missing health, otherwise it will priority cast on yourself. Reduces cooldown of Prayer of Mending. Rune allows multiple allies to receive Renew at lower heal %.',
        icon: '💚',
        autocast: true,
        priority: 2,
      },
      {
        skill: 'Power Voice: Shield',
        rune: 'Bloom',
        description: 'Grants shield to self (rune allows ally at reduced %). Stay closest to tank so shield goes to them if everyone is full health. Always shields whoever is lowest health or closest if everyone is full.',
        icon: '🛡️',
        autocast: true,
        priority: 3,
      },
      {
        skill: 'Holy Radiance',
        rune: 'Sunray',
        description: 'Big AoE heal that CAN be precast when incoming damage is about to occur. Reduces cooldown of Prayer of Mending. Rune has chance to reduce incoming damage and cast time. Bonus with legendary staff for 1.5% vers to team.',
        icon: '☀️',
        autocast: true,
        priority: 4,
      },
      {
        skill: 'Holy Shock',
        rune: 'Afterglow',
        description: 'WARNING: Can bait you into boss AoE on autocast. Source of damage and good AoE heal to combo between spells. Rune gives damage reduction to team.',
        icon: '⚡',
        autocast: true,
        priority: 5,
      },
      {
        skill: 'Heal',
        rune: '',
        description: 'Single target spell. Must be cast when someone is missing health or it will be cast on yourself. This spell CAN NOT be precast when expecting damage.',
        icon: '✨',
        autocast: true,
        priority: 6,
      },
      {
        skill: 'Prayer of Mending',
        rune: 'Levitate',
        description: 'Your BIGGEST heal. Instant cast, 30 sec CD with reduction from other spells. NEVER put on autocast. Save for when someone gets hit hard and needs instant full HP. Rune allows instant Divine Punish after use. Avoid "Sink" rune - it significantly reduces healing for a weak shield on crit.',
        icon: '🙏',
        autocast: false,
      },
      {
        skill: 'Sanctuary',
        rune: 'Anthem',
        description: 'Use only for the damage bonus to your team. Position next to everyone for full benefit. The channel gives very little healing - cancel instantly with movement. Ideal during boss enrage in +16 M+ or big trash pulls.',
        icon: '🎵',
        autocast: false,
      },
      {
        skill: 'Psychic Horror',
        rune: '',
        description: 'Only CC available. Must be cast on top of targets. Super valuable in emergencies to stop incoming damage/hard pulls. Especially useful in 16+ M+ when boss enrages.',
        icon: '😱',
        autocast: false,
      },
      {
        skill: 'Divine Punish',
        rune: 'Absolution',
        description: 'Secondary damage spell with no CD. Rune reduces Prayer of Mending cooldown on crit. Only cast if no damage incoming or to burn boss during CC\'d enrage. NEVER autocast - your job is to heal, damage is just extra. Avoid "Culpability" rune - heal on crit is too small.',
        icon: '⚔️',
        autocast: false,
      },
      {
        skill: 'Holy Blast',
        rune: '',
        description: 'Long CD, damage, DoT. DO NOT USE THIS SPELL. Waste of space on your bar.',
        icon: '❌',
        autocast: false,
      },
    ],
    autocastOrder: [
      'Power Voice: Fortitude - Always active for increased healing % and team benefit',
      'Renew - Constantly going out to reduce Mending CD and top tank',
      'Power Voice: Shield - Solid throughput to tank',
      'Holy Radiance - Combo well with cast time/GCD',
      'Holy Shock - Good AoE heal combo (watch for boss bait)',
      'Heal - Single target filler',
    ],
    healingTips: [
      'OVERHEAL IS YOUR ENEMY. Never stand still letting spells autocast - they will be wasted and on cooldown when needed.',
      'Constantly keep your character moving to stop autocasting. Stand still only when wanting to cast or click specific spells.',
      'Keep Renew on your tank 100% of the time. Use it off cooldown anytime he drops health.',
      'Use Holy Radiance and Heal back and forth as top-up abilities. Remember Heal cannot be precast, Holy Radiance can.',
      'Combo Holy Shock between direct heals - but don\'t let it bait you into boss AoE.',
      'Save Prayer of Mending for when someone goes extremely low - it\'s your emergency full heal.',
      'During downtime, spam Divine Punish while ensuring Renew and Shield stay up.',
      'Priest healing is all about timing and good movement. Your tank should be constantly at full health.',
    ],
    talentTips: 'Pretty cookie cutter build. Get skin for 2 extra points and upgrade training camp for extra talent points. My spec ignores Holy Blast as I see no value in it - instead I opt for increased Divine Punish. If missing extra talent points, ensure Sacred Faith is finished before building into Divine Punish. Holy Fire talent is also wasted points as I do not use this spell.',
    runes: [
      {
        skill: 'Power Voice: Fortitude',
        runeName: 'Tenderness',
        description: 'Increases holy damage and healing % - essential for overall throughput',
        icon: '🛡️',
      },
      {
        skill: 'Renew',
        runeName: 'Gratitude',
        description: 'Allows multiple allies to receive Renew at lower heal % - great for group healing',
        icon: '💚',
      },
      {
        skill: 'Power Voice: Shield',
        runeName: 'Bloom',
        description: 'Allows shield to go to an ally at reduced % instead of just self',
        icon: '🌸',
      },
      {
        skill: 'Holy Shock',
        runeName: 'Afterglow',
        description: 'Provides damage reduction to the team - essential defensive utility',
        icon: '⚡',
      },
      {
        skill: 'Holy Radiance',
        runeName: 'Sunray',
        description: 'Chance to reduce incoming damage of all allies healed and reduced cast time',
        icon: '☀️',
      },
      {
        skill: 'Prayer of Mending',
        runeName: 'Levitate',
        description: 'Allows instant cast Divine Punish after spell use - great for weaving damage',
        icon: '🙏',
      },
      {
        skill: 'Divine Punish',
        runeName: 'Absolution',
        description: 'Reduces Prayer of Mending cooldown on crit - helps cycle your big heal faster',
        icon: '⚔️',
      },
      {
        skill: 'Sanctuary',
        runeName: 'Anthem',
        description: 'Reduced cooldown - allows more frequent damage buff windows for your team',
        icon: '🎵',
      },
    ],
  },
  {
    id: 'fire-mage',
    heroClass: 'Mage',
    spec: 'Fire',
    title: 'End Game Fire Mage Build',
    description: 'A powerful Fire Mage build focused on high spell power and critical strikes. Build by ASVP reaching 102k+ CP and Floor 90.',
    author: 'ASVP',
    tier: 'S',
    contentType: ['Raid', 'Mythic+'],
    role: 'DPS',
    images: {
      skills: '/builds/fire-mage/skills.png',
      tree1: '/builds/fire-mage/tree1.png',
      tree2: '/builds/fire-mage/tree2.png',
      dungeonGear: '/builds/fire-mage/stats.png',
    },
    runes: [
      {
        skill: 'Arcane Amp',
        runeName: 'Ardent',
        description: 'Buff rune for increased damage amplification',
        icon: '💜',
      },
      {
        skill: 'Arcane Storm',
        runeName: 'Convergence',
        description: 'AoE rune for grouped enemies',
        icon: '🌀',
      },
      {
        skill: 'Fire Armor',
        runeName: 'Immolation',
        description: 'Adds passive fire damage while active',
        icon: '🔥',
      },
    ],
  },
  {
    id: 'generic-priest',
    heroClass: 'Priest',
    spec: 'General',
    title: 'AFK/Dungeon Farm & Healing Build',
    description: 'Complete Priest guide covering both AFK/Dungeon farming and Healing builds. Includes talent trees, skills setup, and stat priorities for both playstyles.',
    author: 'Shiftage - Server 4',
    tier: 'A',
    contentType: ['Raid', 'Mythic+', 'Leveling', 'Open World'],
    images: {
      skills: '/builds/generic-priest/image.png',
      tree1: '/builds/generic-priest/image.png',
      tree2: '/builds/generic-priest/image.png',
    },
    gearGuide: {
      dungeonStats: {
        priority: ['Hit% (until cap)', 'Expertise% (until cap)', 'Versatility', 'Haste', 'Crit'],
        description: 'Reforge Stats: hit%(until cap)>expertise%(until cap)>Versatility>haste>crit',
      },
      adventureStats: {
        armor: {
          priority: ['STA', 'SP%', 'HP%'],
          description: 'Refine Stats: STA>SP%>HP%',
        },
        accessories: {
          priority: ['STA', 'SP%', 'HP%'],
          description: 'Refine Stats: STA>SP%>HP%',
        },
      },
    },
    talentTips: 'Talents - points after 40 should be spent on final 2 nodes. For healing with different runes, Holy Blast can be removed or for pure healing remove both Shadow Voice and Blast. Keep in mind that manually casting Sanctuary/Prayer of Mending gives much better results.',
    runes: [
      {
        skill: 'Holy Shock',
        runeName: 'Shadow Voice',
        description: 'Pre Suffering talent (Holy Shock casts Shadow Voice) - add to bar after Holy Shock',
        icon: '⚡',
      },
    ],
  },
  {
    id: 'generic-rogue',
    heroClass: 'Rogue',
    spec: 'General',
    title: 'AFK Farm & Dungeon Farm Build',
    description: 'Complete Rogue guide covering both AFK farming and Dungeon farming builds. Currently both Outlaw and Sub are competitive so either talent can be used.',
    author: 'Shiftage - Server 4',
    tier: 'A',
    contentType: ['Raid', 'Mythic+', 'Leveling', 'Open World'],
    role: 'DPS',
    images: {
      skills: '/builds/generic-rogue/image.png',
      tree1: '/builds/generic-rogue/image.png',
      tree2: '/builds/generic-rogue/image.png',
    },
    gearGuide: {
      dungeonStats: {
        priority: ['Hit% (until cap)', 'Expertise% (until cap)', 'Versatility', 'Crit', 'Haste'],
        description: 'Reforge Stats: hit%(until cap)>expertise%(until cap)>Versatility>crit>haste',
      },
      adventureStats: {
        armor: {
          priority: ['STA', 'AP%', 'HP%'],
          description: 'Refine Stats: STA>AP%>HP%',
        },
        accessories: {
          priority: ['STA', 'AP%', 'HP%'],
          description: 'Refine Stats: STA>AP%>HP%',
        },
      },
    },
    talentTips: 'Talents - points after 40 should be spent on final 2 nodes. The AFK farm build can easily be used in dungeons if you want a simple never change setup, however as an example of a Sub dungeon setup I have posted a Sub dungeon setup. Currently both Outlaw and Sub are competitive so either talent can be used.',
    runes: [
      {
        skill: 'Poison',
        runeName: 'Various',
        description: 'Core skill for both AFK and Dungeon builds',
        icon: '🗡️',
      },
    ],
  },
  {
    id: 'generic-warrior',
    heroClass: 'Warrior',
    spec: 'General',
    title: 'AFK/Dungeon Farm & Tank Build',
    description: 'Complete Warrior guide covering both DPS (AFK/Dungeon farming) and Tank builds. Tank build requires shield on applied gear set!',
    author: 'Shiftage - Server 4',
    tier: 'A',
    contentType: ['Raid', 'Mythic+', 'Leveling', 'Open World'],
    images: {
      skills: '/builds/generic-warrior/image.png',
      tree1: '/builds/generic-warrior/image.png',
      tree2: '/builds/generic-warrior/image.png',
    },
    gearGuide: {
      dungeonStats: {
        priority: ['Hit/Exp (until cap)', 'Versatility', 'Crit'],
        description: 'DPS: hit/exp/Vers/Crit | Tank: DG/Vers',
      },
      adventureStats: {
        armor: {
          priority: ['STA', 'AP%', 'HP%'],
          description: 'Refine Stats: STA>AP%>HP%. Rage Gen on trinkets.',
        },
        accessories: {
          priority: ['STA', 'AP%', 'HP%'],
          description: 'Refine Stats: STA>AP%>HP%. Rage Gen on trinkets.',
        },
      },
    },
    talentTips: 'Talents - points after 40 should be spent on final 2 nodes. Weapon: Drop Battlestance/healing denial points if you don\'t have enough. Prot: Swap Guard stance for taunt if manually playing.',
    runes: [
      {
        skill: 'Battle Shout',
        runeName: 'Infinity',
        description: 'Key rune for Rage Gen',
        icon: '💪',
      },
      {
        skill: 'Demo Shout',
        runeName: 'Roar',
        description: 'Use when farming/dps. Other runes are mostly all situational and use as needed.',
        icon: '📣',
      },
    ],
  },
];

// Build list for the builds page grid
export const buildsListByClass: Record<string, { id: string; spec: string; title: string; tier: 'S' | 'A' | 'B' | 'C'; tags: string[] }[]> = {
  hunter: [
    { id: 'hunter-survival', spec: 'Survival', title: 'End Game Raid/Mythic+ Build', tier: 'S', tags: ['Raid', 'Mythic+'] },
  ],
  priest: [
    { id: 'priest-healing', spec: 'Healing', title: 'High M+ Healing Build', tier: 'S', tags: ['Raid', 'Mythic+', 'Healer'] },
    { id: 'generic-priest', spec: 'General', title: 'AFK/Dungeon Farm & Healing Build', tier: 'A', tags: ['Raid', 'Mythic+', 'Leveling', 'Open World'] },
  ],
  mage: [
    { id: 'fire-mage', spec: 'Fire', title: 'End Game Fire Mage Build', tier: 'S', tags: ['Raid', 'Mythic+', 'DPS'] },
  ],
  warrior: [
    { id: 'generic-warrior', spec: 'General', title: 'AFK/Dungeon Farm & Tank Build', tier: 'A', tags: ['Raid', 'Mythic+', 'Leveling', 'Tank', 'DPS'] },
  ],
  rogue: [
    { id: 'generic-rogue', spec: 'General', title: 'AFK Farm & Dungeon Farm Build', tier: 'A', tags: ['Raid', 'Mythic+', 'Leveling', 'DPS'] },
  ],
  paladin: [],
};
