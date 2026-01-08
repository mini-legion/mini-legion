import type { Raid } from '../../types';

// Heroic Drop Images
import snakebogTrinket from '../../assets/items/heroic/snakebog-trinket.jpg';
import dimmineRing from '../../assets/items/heroic/dimmine-ring.jpg';
import moonclawWrist from '../../assets/items/heroic/moonclaw-wrist.jpg';
import moonclawHeritage from '../../assets/items/heroic/moonclaw-heritage.jpg';
import labreganShield from '../../assets/items/heroic/labregan-shield.jpg';
import boarswampRing from '../../assets/items/heroic/boarswamp-ring.jpg';
import bloodconfessWarrior from '../../assets/items/heroic/bloodconfess-sword-warrior.jpg';
import bloodconfessRogue from '../../assets/items/heroic/bloodconfess-sword-rogue.jpg';
import bloodpraySword from '../../assets/items/heroic/bloodpray-sword.jpg';
import lostruinsHeritage from '../../assets/items/heroic/lostruins-heritage.jpg';
import sunkenshireSword from '../../assets/items/heroic/sunkenshire-sword.jpg';
import sunkenshireAxe from '../../assets/items/heroic/sunkenshire-axe.jpg';
import sunkenshireChest from '../../assets/items/heroic/sunkenshire-chest.jpg';
import darkrockrealmWarrior from '../../assets/items/heroic/darkrockrealm-mace-warrior.jpg';
import darkrockrealmRogue from '../../assets/items/heroic/darkrockrealm-mace-rogue.jpg';
import darkrockrealmHead from '../../assets/items/heroic/darkrockrealm-head.jpg';
import sickcitywSword from '../../assets/items/heroic/sickcityw-sword.jpg';
import sickcitywMount from '../../assets/items/heroic/sickcityw-mount.jpg';
import sickcityeRelic from '../../assets/items/heroic/sickcitye-relic.jpg';
import sickcityeHeritage from '../../assets/items/heroic/sickcitye-heritage.jpg';
import soullab1Staff from '../../assets/items/heroic/soullab1-staff.jpg';
import soullab1Heritage from '../../assets/items/heroic/soullab1-heritage.jpg';
import soullab2Bow from '../../assets/items/heroic/soullab2-bow.jpg';
import wyrmspire1Dagger from '../../assets/items/heroic/wyrmspire1-dagger.jpg';
import wyrmspire2Shield from '../../assets/items/heroic/wyrmspire2-shield.jpg';

export const heroicRaids: Raid[] = [
  {
    id: 'hero-1',
    name: 'RageAbyss (Hero)',
    difficulty: 'Hard',
    subcategory: 'heroic',
    minLevel: 16,
    rewards: ['Gear lvl 23'],
    description: 'The Heroic version of RageAbyss.',
    image: 'https://placehold.co/400x250/1F2937/FFFFFF?text=RageAbyss+Hero',
    stats: { sta: 0, armor: 0, gearLvlDrop: 23, importantDrop: 'none' }
  },
  {
    id: 'hero-2',
    name: 'Snakebog (Hero)',
    difficulty: 'Hard',
    subcategory: 'heroic',
    minLevel: 23,
    rewards: ['Gear lvl 30'],
    description: 'The Heroic version of Snakebog.',
    image: 'https://placehold.co/400x250/1F2937/FFFFFF?text=Snakebog+Hero',
    stats: { 
      sta: 0, 
      armor: 0, 
      gearLvlDrop: 30, 
      importantDrop: 'Legendary Trinket lvl 30 (all classes)',
      importantDrops: [
        { name: 'Legendary Trinket lvl 30 (all classes)', image: snakebogTrinket }
      ]
    }
  },
  {
    id: 'hero-3',
    name: 'Dim Mine (Hero)',
    difficulty: 'Hard',
    subcategory: 'heroic',
    minLevel: 28,
    rewards: ['Gear lvl 35'],
    description: 'The Heroic version of Dim Mine.',
    image: 'https://placehold.co/400x250/1F2937/FFFFFF?text=Dim+Mine+Hero',
    stats: { 
      sta: 0, 
      armor: 0, 
      gearLvlDrop: 35, 
      importantDrop: 'Legendary Ring lvl 40 (all classes)',
      importantDrops: [
        { name: 'Legendary Ring lvl 40 (all classes)', image: dimmineRing }
      ]
    }
  },
  {
    id: 'hero-4',
    name: 'Moonclaw (Hero)',
    difficulty: 'Hard',
    subcategory: 'heroic',
    minLevel: 34,
    rewards: ['Gear lvl 42'],
    description: 'The Heroic version of Moonclaw.',
    image: 'https://placehold.co/400x250/1F2937/FFFFFF?text=Moonclaw+Hero',
    stats: { 
      sta: 0, 
      armor: 0, 
      gearLvlDrop: 42, 
      importantDrop: 'Legendary Wrist lvl 43 (all classes) - Heritage Bracers (+5% exp)',
      importantDrops: [
        { name: 'Legendary Wrist lvl 43 (all classes)', image: moonclawWrist },
        { name: 'Heritage Bracers (+5% exp)', image: moonclawHeritage }
      ]
    }
  },
  {
    id: 'hero-5',
    name: 'Labregan (Hero)',
    difficulty: 'Hard',
    subcategory: 'heroic',
    minLevel: 38,
    rewards: ['Gear lvl 44'],
    description: 'The Heroic version of Labregan.',
    image: 'https://placehold.co/400x250/1F2937/FFFFFF?text=Labregan+Hero',
    stats: { 
      sta: 0, 
      armor: 0, 
      gearLvlDrop: 44, 
      importantDrop: 'Legendary Shield lvl 46 (Warrior)',
      importantDrops: [
        { name: 'Legendary Shield lvl 46 (Warrior)', image: labreganShield }
      ]
    }
  },
  {
    id: 'hero-6',
    name: 'Boar Swamp (Hero)',
    difficulty: 'Hard',
    subcategory: 'heroic',
    minLevel: 42,
    rewards: ['Gear lvl 47'],
    description: 'The Heroic version of Boar Swamp.',
    image: 'https://placehold.co/400x250/1F2937/FFFFFF?text=Boar+Swamp+Hero',
    stats: { 
      sta: 0, 
      armor: 0, 
      gearLvlDrop: 47, 
      importantDrop: 'Legendary Ring lvl 47 (Mage, Priest)',
      importantDrops: [
        { name: 'Legendary Ring lvl 47 (Mage, Priest)', image: boarswampRing }
      ]
    }
  },
  {
    id: 'hero-7',
    name: 'Blood Confess (Hero)',
    difficulty: 'Hard',
    subcategory: 'heroic',
    minLevel: 46,
    rewards: ['Gear lvl 50'],
    description: 'The Heroic version of Blood Confess.',
    image: 'https://placehold.co/400x250/1F2937/FFFFFF?text=Blood+Confess+Hero',
    stats: { 
      sta: 0, 
      armor: 0, 
      gearLvlDrop: 50, 
      importantDrop: 'Legendary Sword lvl 51 (Warrior, Rogue)',
      importantDrops: [
        { name: 'Legendary Sword lvl 51 (Warrior)', image: bloodconfessWarrior },
        { name: 'Legendary Sword lvl 51 (Rogue)', image: bloodconfessRogue }
      ]
    }
  },
  {
    id: 'hero-8',
    name: 'Blood Pray (Hero)',
    difficulty: 'Hard',
    subcategory: 'heroic',
    minLevel: 46,
    rewards: ['Gear lvl 50'],
    description: 'The Heroic version of Blood Pray.',
    image: 'https://placehold.co/400x250/1F2937/FFFFFF?text=Blood+Pray+Hero',
    stats: { 
      sta: 0, 
      armor: 0, 
      gearLvlDrop: 50, 
      importantDrop: 'Legendary Sword lvl 51 (Rogue)',
      importantDrops: [
        { name: 'Legendary Sword lvl 51 (Rogue)', image: bloodpraySword }
      ]
    }
  },
  {
    id: 'hero-9',
    name: 'Lost Ruins (Hero)',
    difficulty: 'Hard',
    subcategory: 'heroic',
    minLevel: 49,
    rewards: ['Gear lvl 54'],
    description: 'The Heroic version of Lost Ruins.',
    image: 'https://placehold.co/400x250/1F2937/FFFFFF?text=Lost+Ruins+Hero',
    stats: { 
      sta: 0, 
      armor: 0, 
      gearLvlDrop: 54, 
      importantDrop: 'Heritage Spaulders (+5% exp)',
      importantDrops: [
        { name: 'Heritage Spaulders (+5% exp)', image: lostruinsHeritage }
      ]
    }
  },
  {
    id: 'hero-10',
    name: 'Sunken Shire (Hero)',
    difficulty: 'Hard',
    subcategory: 'heroic',
    minLevel: 53,
    rewards: ['Gear lvl 57'],
    description: 'The Heroic version of Sunken Shire.',
    image: 'https://placehold.co/400x250/1F2937/FFFFFF?text=Sunken+Shire+Hero',
    stats: { 
      sta: 0, 
      armor: 0, 
      gearLvlDrop: 57, 
      importantDrop: 'Legendary sword lvl 58 (Rogue) - Legendary Axe lvl 58 (Warrior) - Legendary Chest lvl 58 (Mage, Priest)',
      importantDrops: [
        { name: 'Legendary sword lvl 58 (Rogue)', image: sunkenshireSword },
        { name: 'Legendary Axe lvl 58 (Warrior)', image: sunkenshireAxe },
        { name: 'Legendary Chest lvl 58 (Mage, Priest)', image: sunkenshireChest }
      ]
    }
  },
  {
    id: 'hero-11',
    name: 'Darkrock Realm (Hero)',
    difficulty: 'Hard',
    subcategory: 'heroic',
    minLevel: 55,
    rewards: ['Gear lvl 60'],
    description: 'The Heroic version of Darkrock Realm.',
    image: 'https://placehold.co/400x250/1F2937/FFFFFF?text=Darkrock+Realm+Hero',
    stats: { 
      sta: 0, 
      armor: 0, 
      gearLvlDrop: 60, 
      importantDrop: 'Legendary Mace lvl 60 (Rogue, Warrior) - Legendary Head lvl 60 (Mage, Priest)',
      importantDrops: [
        { name: 'Legendary Mace lvl 60 (Warrior)', image: darkrockrealmWarrior },
        { name: 'Legendary Mace lvl 60 (Rogue)', image: darkrockrealmRogue },
        { name: 'Legendary Head lvl 60 (Mage, Priest)', image: darkrockrealmHead }
      ]
    }
  },
  {
    id: 'hero-12',
    name: 'Sick City W (Hero)',
    difficulty: 'Hard',
    subcategory: 'heroic',
    minLevel: 57,
    rewards: ['Gear lvl 63'],
    description: 'A plague-ridden city (West).',
    image: 'https://placehold.co/400x250/1F2937/FFFFFF?text=Sick+City+W+Hero',
    stats: { 
      sta: 0, 
      armor: 0, 
      gearLvlDrop: 63, 
      importantDrop: 'Legendary Sword lvl 65 (Warrior) - Raven Deathcharger Mount',
      importantDrops: [
        { name: 'Legendary Sword lvl 65 (Warrior)', image: sickcitywSword },
        { name: 'Raven Deathcharger Mount', image: sickcitywMount }
      ]
    }
  },
  {
    id: 'hero-13',
    name: 'Sick City E (Hero)',
    difficulty: 'Hard',
    subcategory: 'heroic',
    minLevel: 57,
    rewards: ['Gear lvl 63'],
    description: 'A plague-ridden city (East).',
    image: 'https://placehold.co/400x250/1F2937/FFFFFF?text=Sick+City+E+Hero',
    stats: { 
      sta: 0, 
      armor: 0, 
      gearLvlDrop: 63, 
      importantDrop: 'Legendary Relic lvl 65 (Mage, Priest) - Heritage Legplates (+5% exp)',
      importantDrops: [
        { name: 'Legendary Relic lvl 65 (Mage, Priest)', image: sickcityeRelic },
        { name: 'Heritage Legplates (+5% exp)', image: sickcityeHeritage }
      ]
    }
  },
  {
    id: 'hero-14',
    name: 'Soul Lab-1 (Hero)',
    difficulty: 'Hard',
    subcategory: 'heroic',
    minLevel: 59,
    rewards: ['Gear lvl 63'],
    description: 'Mysterious laboratory (Part 1).',
    image: 'https://placehold.co/400x250/1F2937/FFFFFF?text=Soul+Lab+1+Hero',
    stats: { 
      sta: 0, 
      armor: 0, 
      gearLvlDrop: 63, 
      importantDrop: 'Legendary Staff lvl 65 (Mage, Priest) - Heritage Cloak (+5% exp)',
      importantDrops: [
        { name: 'Legendary Staff lvl 65 (Mage, Priest)', image: soullab1Staff },
        { name: 'Heritage Cloak (+5% exp)', image: soullab1Heritage }
      ]
    }
  },
  {
    id: 'hero-15',
    name: 'Soul Lab-2 (Hero)',
    difficulty: 'Hard',
    subcategory: 'heroic',
    minLevel: 59,
    rewards: ['Gear lvl 63'],
    description: 'Mysterious laboratory (Part 2).',
    image: 'https://placehold.co/400x250/1F2937/FFFFFF?text=Soul+Lab+2+Hero',
    stats: { 
      sta: 0, 
      armor: 0, 
      gearLvlDrop: 63, 
      importantDrop: 'Legendary Bow lvl 65 (Hunter)',
      importantDrops: [
        { name: 'Legendary Bow lvl 65 (Hunter)', image: soullab2Bow }
      ]
    }
  },
  {
    id: 'hero-16',
    name: 'Wyrm Spire-1 (Hero)',
    difficulty: 'Hard',
    subcategory: 'heroic',
    minLevel: 60,
    rewards: ['Gear lvl 63'],
    description: 'Ancient dragon tower (Part 1).',
    image: 'https://placehold.co/400x250/1F2937/FFFFFF?text=Wyrm+Spire+1+Hero',
    stats: { 
      sta: 0, 
      armor: 0, 
      gearLvlDrop: 63, 
      importantDrop: 'Legendary Dagger lvl 65 (Rogue)',
      importantDrops: [
        { name: 'Legendary Dagger lvl 65 (Rogue)', image: wyrmspire1Dagger }
      ]
    }
  },
  {
    id: 'hero-17',
    name: 'Wyrm Spire-2 (Hero)',
    difficulty: 'Hard',
    subcategory: 'heroic',
    minLevel: 60,
    rewards: ['Gear lvl 63'],
    description: 'Ancient dragon tower (Part 2).',
    image: 'https://placehold.co/400x250/1F2937/FFFFFF?text=Wyrm+Spire+2+Hero',
    stats: { 
      sta: 0, 
      armor: 0, 
      gearLvlDrop: 63, 
      importantDrop: 'Legendary Shield lvl 65 (Warrior)',
      importantDrops: [
        { name: 'Legendary Shield lvl 65 (Warrior)', image: wyrmspire2Shield }
      ]
    }
  },
];

