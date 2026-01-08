import type { Raid } from '../../types';

// Raid Boss Images
import br1Boss1 from '../../assets/bosses/raid/bloodritual1-1.jpg';
import br1Boss2 from '../../assets/bosses/raid/bloodritual1-2.jpg';
import br1Boss3 from '../../assets/bosses/raid/bloodritual1-3.jpg';
import br2Boss1 from '../../assets/bosses/raid/bloodritual2-1.jpg';
import br2Boss2 from '../../assets/bosses/raid/bloodritual2-2.jpg';
import br2Boss3 from '../../assets/bosses/raid/bloodritual2-3.jpg';
import br2Boss4 from '../../assets/bosses/raid/bloodritual2-4.jpg';
import fh1Boss1 from '../../assets/bosses/raid/flameheart1-1.jpg';
import fh1Boss2 from '../../assets/bosses/raid/flameheart1-2.jpg';
import fh1Boss3 from '../../assets/bosses/raid/flameheart1-3.jpg';
import fh1Boss4 from '../../assets/bosses/raid/flameheart1-4.jpg';
import fh2Boss1 from '../../assets/bosses/raid/flameheart2-1.jpg';
import fh2Boss2 from '../../assets/bosses/raid/flameheart2-2.jpg';
import fh2Boss3 from '../../assets/bosses/raid/flameheart2-3.jpg';
import fh3Boss1 from '../../assets/bosses/raid/flameheart3-1.jpg';
import fh3Boss2 from '../../assets/bosses/raid/flameheart3-2.jpg';
import fh3Boss3 from '../../assets/bosses/raid/flameheart3-3.jpg';

// Raid Drop Images
import br1Mount from '../../assets/items/raids/bloodritual1-mount.jpg';
import br2Mount from '../../assets/items/raids/bloodritual2-mount.jpg';
import fh1Item1 from '../../assets/items/raids/flameheart1-item1.jpg';
import fh1Item2 from '../../assets/items/raids/flameheart1-item2.jpg';
import fh2Item1 from '../../assets/items/raids/flameheart2-item1.jpg';
import fh2Item2 from '../../assets/items/raids/flameheart2-item2.jpg';
import fh2Item3 from '../../assets/items/raids/flameheart2-item3.jpg';
import fh3Item1 from '../../assets/items/raids/flameheart3-item1.jpg';
import fh3Item2 from '../../assets/items/raids/flameheart3-item2.jpg';
import fh3Item3 from '../../assets/items/raids/flameheart3-item3.jpg';
import fh3Item4 from '../../assets/items/raids/flameheart3-item4.jpg';
import fh3Item5 from '../../assets/items/raids/flameheart3-item5.jpg';
import fh3Item6 from '../../assets/items/raids/flameheart3-item6.jpg';
import fh3Item7 from '../../assets/items/raids/flameheart3-item7.jpg';
import fh3Item8 from '../../assets/items/raids/flameheart3-item8.jpg';
import fh3Item9 from '../../assets/items/raids/flameheart3-item9.jpg';

export const raidRaids: Raid[] = [
  {
    id: 'blood-ritual',
    name: 'Blood Ritual',
    difficulty: 'Extreme',
    subcategory: 'raid',
    minLevel: 40,
    rewards: ['Gear lvl 50-58', 'Clawstrike Raptor', 'Neltharion Chariot'],
    description: 'A dark ritual being performed by the high priests of the blood god.',
    image: 'https://placehold.co/400x250/DC2626/FFFFFF?text=Blood+Ritual',
    stats: {
      sta: 0,
      armor: 0,
      gearLvlDrop: 50,
      importantDrop: 'Clawstrike Raptor, Neltharion Chariot',
      importantDrops: [
        { name: 'Clawstrike Raptor', image: br1Mount },
        { name: 'Neltharion Chariot', image: br2Mount }
      ]
    },
    subraids: [
      {
        id: 'blood-ritual-1',
        name: 'Blood Ritual 1',
        level: 40,
        recommendedGearLvl: 38,
        gearDrop: '50-52',
        importantDrop: 'Clawstrike Raptor',
        bosses: [
          {
            name: 'High Priest Vynmore',
            level: 45,
            image: br1Boss1,
            stats: {
              hp: 2060400,
              attack: '4066-4452',
              armor: 4500,
              fireRes: 50,
              frostRes: 50,
              arcaneRes: 50,
              natureRes: 50,
              shadowRes: 50,
              holyRes: 50,
              armorPen: '25%',
              spellPen: 0,
              ignoreArmor: 1000,
              hit: '20%',
              dodge: '20%',
              critical: '15%',
              criticalRes: '15%',
              expertise: '15%',
              parry: '15%',
              block: '0',
              dmgAmp: '15%',
              dmgRed: '25%'
            },
            skills: [
              { name: 'Sunder Armor', description: 'Deals 125% Physical DMG to the current target, reducing their armor by 25%' },
              { name: 'Shadow Breath', description: 'after a wind-up, deals 250% physical DMG to all targets within the forward cone-shaped area' },
              { name: 'Shadow Bolt Volley', description: 'Fires shadow bolts at 10 targets dealing 75% shadow DMG' }
            ]
          },
          {
            name: 'High Priest Tiris',
            level: 45,
            image: br1Boss2,
            stats: {
              hp: 2288420,
              attack: '4284-4589',
              armor: 4500,
              fireRes: 50,
              frostRes: 50,
              arcaneRes: 50,
              natureRes: 50,
              shadowRes: 50,
              holyRes: 50,
              armorPen: '25%',
              spellPen: 0,
              ignoreArmor: 1000,
              hit: '20%',
              dodge: '20%',
              critical: '15%',
              criticalRes: '15%',
              expertise: '15%',
              parry: '15%',
              block: '0',
              dmgAmp: '15%',
              dmgRed: '25%'
            },
            skills: [
              { name: 'Sunder Armor', description: 'Deals 125% Physical DMG to the current target, reducing their armor by 25%' },
              { name: 'Shadow Breath', description: 'after a wind-up, deals 250% physical DMG to all targets within the forward cone-shaped area' },
              { name: 'Shadow Bolt Volley', description: 'Fires shadow bolts at 10 targets dealing 75% shadow DMG' }
            ]
          },
          {
            name: 'Bloodknight Manchester',
            level: 45,
            image: br1Boss3,
            stats: {
              hp: 2767262,
              attack: '4442-4687',
              armor: 4500,
              fireRes: 50,
              frostRes: 50,
              arcaneRes: 50,
              natureRes: 50,
              shadowRes: 50,
              holyRes: 50,
              armorPen: '25%',
              spellPen: 0,
              ignoreArmor: 1000,
              hit: '20%',
              dodge: '20%',
              critical: '15%',
              criticalRes: '15%',
              expertise: '15%',
              parry: '15%',
              block: '0',
              dmgAmp: '15%',
              dmgRed: '25%'
            },
            skills: [
              { name: 'Sunder Armor', description: 'Deals 125% Physical DMG to the current target, reducing their armor by 25%' },
              { name: 'Shadow Breath', description: 'after a wind-up, deals 250% physical DMG to all targets within the forward cone-shaped area' },
              { name: 'Shadow Bolt Volley', description: 'Fires shadow bolts at 10 targets dealing 75% shadow DMG' }
            ]
          }
        ]
      },
      {
        id: 'blood-ritual-2',
        name: 'Blood Ritual 2',
        level: 52,
        recommendedGearLvl: 45,
        gearDrop: '55-58',
        importantDrop: 'Neltharion Chariot',
        bosses: [
          {
            name: 'High Priest Tagor',
            level: 55,
            image: br2Boss1,
            stats: {
              hp: 3206584,
              attack: '4878-5095',
              armor: 5000,
              fireRes: 50,
              frostRes: 50,
              arcaneRes: 50,
              natureRes: 50,
              shadowRes: 50,
              holyRes: 50,
              armorPen: '25%',
              spellPen: 0,
              ignoreArmor: 1000,
              hit: '20%',
              dodge: '20%',
              critical: '15%',
              criticalRes: '15%',
              expertise: '15%',
              parry: '15%',
              block: '0',
              dmgAmp: '15%',
              dmgRed: '25%'
            },
            skills: [
              { name: 'Sunder Armor', description: 'Deals 125% Physical DMG to the current target, reducing their armor by 25%' },
              { name: 'Shadow Breath', description: 'after a wind-up, deals 250% physical DMG to all targets within the forward cone-shaped area' },
              { name: 'Shadow Bolt Volley', description: 'Fires shadow bolts at 10 targets dealing 75% shadow DMG' }
            ]
          },
          {
            name: 'High Priestess Panthra',
            level: 55,
            image: br2Boss2,
            stats: {
              hp: 3491913,
              attack: '5121-5349',
              armor: 5000,
              fireRes: 50,
              frostRes: 50,
              arcaneRes: 50,
              natureRes: 50,
              shadowRes: 50,
              holyRes: 50,
              armorPen: '25%',
              spellPen: 0,
              ignoreArmor: 1000,
              hit: '20%',
              dodge: '20%',
              critical: '15%',
              criticalRes: '15%',
              expertise: '15%',
              parry: '15%',
              block: '0',
              dmgAmp: '15%',
              dmgRed: '25%'
            },
            skills: [
              { name: 'Sunder Armor', description: 'Deals 125% Physical DMG to the current target, reducing their armor by 25%' },
              { name: 'Shadow Breath', description: 'after a wind-up, deals 250% physical DMG to all targets within the forward cone-shaped area' },
              { name: 'Mortal Strike', description: 'deals 150% Physical DMG to a single, while reducing the healing they receive by 25% for 5 seconds' }
            ]
          },
          {
            name: 'High Warlock Dudu',
            level: 55,
            image: br2Boss3,
            stats: {
              hp: 3677242,
              attack: '5365-5604',
              armor: 5000,
              fireRes: 50,
              frostRes: 50,
              arcaneRes: 50,
              natureRes: 50,
              shadowRes: 50,
              holyRes: 50,
              armorPen: '25%',
              spellPen: 0,
              ignoreArmor: 1000,
              hit: '20%',
              dodge: '20%',
              critical: '15%',
              criticalRes: '15%',
              expertise: '15%',
              parry: '15%',
              block: '0',
              dmgAmp: '15%',
              dmgRed: '25%'
            },
            skills: [
              { name: 'Sunder Armor', description: 'Deals 125% Physical DMG to the current target, reducing their armor by 25%' },
              { name: 'Shadow Bolt Volley', description: 'Fires shadow bolts at 10 targets dealing 75% shadow DMG' },
              { name: 'Lambnize', description: 'Immediately transforms two targets into creatures, rendering them unable to move or use abilities during the transformation' }
            ]
          },
          {
            name: 'Laisin the Blood God',
            level: 55,
            image: br2Boss4,
            stats: {
              hp: 3862571,
              attack: '5609-5869',
              armor: 5000,
              fireRes: 50,
              frostRes: 50,
              arcaneRes: 50,
              natureRes: 50,
              shadowRes: 50,
              holyRes: 50,
              armorPen: '25%',
              spellPen: 0,
              ignoreArmor: 1000,
              hit: '20%',
              dodge: '20%',
              critical: '15%',
              criticalRes: '15%',
              expertise: '15%',
              parry: '15%',
              block: '0',
              dmgAmp: '15%',
              dmgRed: '25%'
            },
            skills: [
              { name: 'Sunder Armor', description: 'Deals 125% Physical DMG to the current target, reducing their armor by 25%' },
              { name: 'Shadow Breath', description: 'after a wind-up, deals 250% physical DMG to all targets within the forward cone-shaped area' },
              { name: 'Shadow Bolt Volley', description: 'Fires shadow bolts at 10 targets dealing 75% shadow DMG' },
              { name: 'Fear', description: 'fears 3 targets for 3.5 seconds and increase the DMG they take by 10%' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'flame-heart',
    name: 'Flame Heart',
    difficulty: 'Extreme',
    subcategory: 'raid',
    minLevel: 60,
    rewards: ['Gear lvl 66-75', 'Lar´s Shackled Skull L', 'Vanguard´s Horn', 'Lar´s Shackled Skull R', 'Burning Core', 'Shadowstrike', 'Origin Ingot', 'Song of the Sky', 'Shackled Fairy', 'Pure Flame', 'Lava Hound', 'Ragros Tear', 'Ragros Soul', 'Depravity Flame', 'Perdition´s Edge'],
    description: 'A fiery dungeon where ancient flame lords await.',
    image: 'https://placehold.co/400x250/DC2626/FFFFFF?text=Flame+Heart',
    stats: {
      sta: 0,
      armor: 0,
      gearLvlDrop: 66,
      importantDrop: 'Lar´s Shackled Skull L, Vanguard´s Horn, Lar´s Shackled Skull R, Burning Core, Shadowstrike, Origin Ingot, Song of the Sky, Shackled Fairy, Pure Flame, Lava Hound, Ragros Tear, Ragros Soul, Depravity Flame, Perdition´s Edge',
      importantDrops: [
        { name: 'Lar´s Shackled Skull L', image: fh1Item1 },
        { name: 'Vanguard´s Horn', image: fh1Item2 },
        { name: 'Lar´s Shackled Skull R', image: fh2Item1 },
        { name: 'Burning Core', image: fh2Item2 },
        { name: 'Shadowstrike', image: fh2Item3 },
        { name: 'Origin Ingot', image: fh3Item1 },
        { name: 'Song of the Sky', image: fh3Item2 },
        { name: 'Shackled Fairy', image: fh3Item3 },
        { name: 'Pure Flame', image: fh3Item4 },
        { name: 'Lava Hound', image: fh3Item5 },
        { name: 'Ragros Tear', image: fh3Item6 },
        { name: 'Ragros Soul', image: fh3Item7 },
        { name: 'Depravity Flame', image: fh3Item8 },
        { name: 'Perdition´s Edge', image: fh3Item9 }
      ]
    },
    subraids: [
      {
        id: 'flame-heart-1',
        name: 'Flame Heart 1',
        level: 60,
        recommendedGearLvl: 62,
        gearDrop: '66-70',
        importantDrop: 'Lar´s Shackled Skull L, Vanguard´s Horn',
        bosses: [
          {
            name: 'Lord Lucius',
            level: 65,
            image: fh1Boss1,
            stats: {
              hp: 6373290,
              attack: '8692-9561',
              armor: 6066,
              fireRes: 140,
              frostRes: 140,
              arcaneRes: 140,
              natureRes: 140,
              shadowRes: 140,
              holyRes: 140,
              armorPen: '25%',
              spellPen: 0,
              ignoreArmor: 5000,
              hit: '20%',
              dodge: '20%',
              critical: '20%',
              criticalRes: '20%',
              expertise: '15%',
              parry: '20%',
              block: '0',
              dmgAmp: '20%',
              dmgRed: '25%'
            },
            skills: [
              { name: 'Curse of Doom', description: 'Inflicts a curse upon 3 nearby targets reducing their resource regeneration rate by 50% for 15 seconds' },
              { name: 'Doom Approaching', description: 'deals 200% Fire DMG to all targets within a large area around self' }
            ]
          },
          {
            name: 'Magmasha',
            level: 65,
            image: fh1Boss2,
            stats: {
              hp: 6691930,
              attack: '8892-9781',
              armor: 6066,
              fireRes: 140,
              frostRes: 140,
              arcaneRes: 140,
              natureRes: 140,
              shadowRes: 140,
              holyRes: 140,
              armorPen: '25%',
              spellPen: 0,
              ignoreArmor: 5000,
              hit: '20%',
              dodge: '20%',
              critical: '20%',
              criticalRes: '20%',
              expertise: '15%',
              parry: '20%',
              block: '0',
              dmgAmp: '20%',
              dmgRed: '25%'
            },
            skills: [
              { name: 'Mass Fear', description: 'Inflicts Mass Fear on all nearby targets, rendering them unable to move or use abilities for 5 seconds.' },
              { name: 'Enrage', description: 'for every 30% reduction in the boss\'s health, enters a 10-second enrage state, increasing DMG dealt by 100% during this period' },
              { name: 'Flame Breath', description: 'deals 200% fire DMG to all targets within a cone-shaped area.' }
            ]
          },
          {
            name: 'Kihynos',
            level: 66,
            image: fh1Boss3,
            stats: {
              hp: 6691930,
              attack: '9144-10058',
              armor: 6066,
              fireRes: 140,
              frostRes: 140,
              arcaneRes: 140,
              natureRes: 140,
              shadowRes: 140,
              holyRes: 140,
              armorPen: '25%',
              spellPen: 0,
              ignoreArmor: 5000,
              hit: '20%',
              dodge: '20%',
              critical: '20%',
              criticalRes: '20%',
              expertise: '15%',
              parry: '20%',
              block: '0',
              dmgAmp: '20%',
              dmgRed: '25%'
            },
            skills: [
              { name: 'Keheh\'s Curse', description: 'curses the current target, reducing healing received by 75% for 10 seconds' },
              { name: 'Shadow Bolt Volley', description: 'frequently unleashes volleys of shadow bolts at 3 random targets, dealing 100% shadow DMG' },
              { name: 'Fire Rain', description: 'Summon fire rain upon a random target location, dealing 50% fire DMG per second for 10 seconds' }
            ]
          },
          {
            name: 'Galgorn',
            level: 66,
            image: fh1Boss4,
            stats: {
              hp: 7010570,
              attack: '9344-10278',
              armor: 6066,
              fireRes: 140,
              frostRes: 140,
              arcaneRes: 140,
              natureRes: 140,
              shadowRes: 140,
              holyRes: 140,
              armorPen: '40%',
              spellPen: 0,
              ignoreArmor: 5000,
              hit: '25%',
              dodge: '20%',
              critical: '20%',
              criticalRes: '25%',
              expertise: '20%',
              parry: '25%',
              block: '0',
              dmgAmp: '20%',
              dmgRed: '30%'
            },
            skills: [
              { name: 'Stone Elementals', description: 'Upon entering combat, summons 3 stone elementals.' },
              { name: 'Explode', description: 'when the boss\'s health or any stone elementals\'s health drops below 20%, detonates the stone elementals, dealing 200% Physical DMG to all targets within range' },
              { name: 'Enrage', description: 'once all stone elementals are defeated, the boss enters enrage, increasing DMG dealt by 100% until the end of the combat' }
            ]
          }
        ]
      },
      {
        id: 'flame-heart-2',
        name: 'Flame Heart 2',
        level: 60,
        recommendedGearLvl: 63,
        gearDrop: '66-72',
        importantDrop: 'Lar´s Shackled Skull R, Burning Core, Shadowstrike',
        bosses: [
          {
            name: 'Baron Flame',
            level: 67,
            image: fh2Boss1,
            stats: {
              hp: 7010570,
              attack: '9560-10516',
              armor: 6066,
              fireRes: 140,
              frostRes: 140,
              arcaneRes: 140,
              natureRes: 140,
              shadowRes: 140,
              holyRes: 140,
              armorPen: '30%',
              spellPen: 0,
              ignoreArmor: 5000,
              hit: '20%',
              dodge: '20%',
              critical: '20%',
              criticalRes: '20%',
              expertise: '15%',
              parry: '20%',
              block: '0',
              dmgAmp: '25%',
              dmgRed: '25%'
            },
            skills: [
              { name: 'Inferno', description: 'deals 20% fire DMG per second to all targets within a small area around self, with the DMG doubling every second, lasting for 5 seconds' },
              { name: 'Mana Burn', description: 'Randomly selects 4 targets, reducing the maximum mana by 15% per second, lasting for 6 seconds' },
              { name: 'Living Bomb', description: 'randomly implants a living bomb on 2 non-primary hate targets. When the bomb detonates, it deals 150% fire DMG to itself and nearby units' }
            ]
          },
          {
            name: 'Shalsar the Blazing',
            level: 68,
            image: fh2Boss2,
            stats: {
              hp: 7329280,
              attack: '9785-10763',
              armor: 6066,
              fireRes: 140,
              frostRes: 140,
              arcaneRes: 140,
              natureRes: 140,
              shadowRes: 140,
              holyRes: 140,
              armorPen: '30%',
              spellPen: 0,
              ignoreArmor: 5000,
              hit: '20%',
              dodge: '20%',
              critical: '20%',
              criticalRes: '20%',
              expertise: '15%',
              parry: '20%',
              block: '0',
              dmgAmp: '25%',
              dmgRed: '25%'
            },
            skills: [
              { name: 'Arcane Explosion', description: 'deals 50% arcane DMG to all targets within 20 yards' },
              { name: 'Shazrah´s Curse', description: 'randomly curses 3 targets, increasing magic DMG taken by 100% for 15 seconds' },
              { name: 'Spell Barrier', description: 'the boss activates a spell barrier, reducing magic DMG taken by 50% for 10 seconds' },
              { name: 'Blink', description: 'for every 10% health lost, teleports randomly target´s side and clears all agro' }
            ]
          },
          {
            name: 'Sulfuron Harbinger',
            level: 68,
            image: fh2Boss3,
            stats: {
              hp: 7329280,
              attack: '10185-11203',
              armor: 6066,
              fireRes: 140,
              frostRes: 140,
              arcaneRes: 140,
              natureRes: 140,
              shadowRes: 140,
              holyRes: 140,
              armorPen: '40%',
              spellPen: 0,
              ignoreArmor: 5000,
              hit: '25%',
              dodge: '20%',
              critical: '20%',
              criticalRes: '25%',
              expertise: '20%',
              parry: '25%',
              block: '0',
              dmgAmp: '30%',
              dmgRed: '30%'
            },
            skills: [
              { name: 'Flame Burn', description: 'randomly targets 3 enemies, dealing 50% fire DMG every 2 seconds for 10 seconds' },
              { name: 'Shadow Frenzy', description: 'when the boss\'s health drops below 20%, increases DMG dealt by 50%' }
            ]
          }
        ]
      },
      {
        id: 'flame-heart-3',
        name: 'Flame Heart 3',
        level: 60,
        recommendedGearLvl: 65,
        gearDrop: '66-75',
        importantDrop: 'Origin Ingot, Song of the Sky, Shackled Fairy, Pure Flame, Lava Hound, Ragros Tear, Ragros Soul, Depravity Flame, Perdition´s Edge',
        bosses: [
          {
            name: 'Goremal',
            level: 69,
            image: fh3Boss1,
            stats: {
              hp: 7647920,
              attack: '10618-11679',
              armor: 6066,
              fireRes: 140,
              frostRes: 140,
              arcaneRes: 140,
              natureRes: 140,
              shadowRes: 140,
              holyRes: 140,
              armorPen: '30%',
              spellPen: 0,
              ignoreArmor: 5000,
              hit: '20%',
              dodge: '20%',
              critical: '20%',
              criticalRes: '20%',
              expertise: '15%',
              parry: '20%',
              block: '0',
              dmgAmp: '25%',
              dmgRed: '25%'
            },
            skills: [
              { name: 'Felhound', description: 'Goremal´s pet that attacks targets randomly' },
              { name: 'Sunder Armor', description: 'the boss\'s auto-attacks apply armor penetration, reducing the target\'s armor by 25% for 12 seconds' },
              { name: 'Earthquake', description: 'deals 200% physical DMG to all targets within 30 yards around self and stuns them for 3 seconds' }
            ]
          },
          {
            name: 'Eksocutus',
            level: 69,
            image: fh3Boss2,
            stats: {
              hp: 7647920,
              attack: '11018-12119',
              armor: 6066,
              fireRes: 140,
              frostRes: 140,
              arcaneRes: 140,
              natureRes: 140,
              shadowRes: 140,
              holyRes: 140,
              armorPen: '30%',
              spellPen: 0,
              ignoreArmor: 5000,
              hit: '20%',
              dodge: '20%',
              critical: '20%',
              criticalRes: '20%',
              expertise: '15%',
              parry: '20%',
              block: '0',
              dmgAmp: '25%',
              dmgRed: '25%'
            },
            skills: [
              { name: 'Reflective Shield', description: 'releases a reflective shield that periodically reflects magic and physical DMG, dealing 20% arcane DMG to the attacker' },
              { name: 'Flame Trap', description: 'randomly throws a trap at a single target. When triggered, it deals 50% fire DMG per second to the target for 6 seconds' }
            ]
          },
          {
            name: 'Flamevil',
            level: 69,
            image: fh3Boss3,
            stats: {
              hp: 7966560,
              attack: '14459-15604',
              armor: 6066,
              fireRes: 140,
              frostRes: 140,
              arcaneRes: 140,
              natureRes: 140,
              shadowRes: 140,
              holyRes: 140,
              armorPen: '40%',
              spellPen: 0,
              ignoreArmor: 5000,
              hit: '30%',
              dodge: '20%',
              critical: '20%',
              criticalRes: '25%',
              expertise: '20%',
              parry: '25%',
              block: '0',
              dmgAmp: '30%',
              dmgRed: '30%'
            },
            skills: [
              { name: 'Burning Strike', description: 'normal attacks inflict a burning effect, dealing 20% of attack power as fire DMG to the target over 5 seconds' },
              { name: 'Flame Purge', description: 'hurls a fireball at a random target, dealing 200% fire DMG to all units within 20 yards of the target and stunning them for 2 seconds' },
              { name: 'Blazing Slash', description: 'unleashes a wide fan-shaped heavy slash at the current target´s position, dealing 300% fire DMG and knocking back affected targets' },
              { name: 'Lava Eruption', description: 'releases lava eruption on 2 random targets, dealing 100% fire DMG to all units within range. If there are no attackable targets in range, the boss disengages combat and rapidly regenerates health' }
            ]
          }
        ]
      }
    ]
  },
];

