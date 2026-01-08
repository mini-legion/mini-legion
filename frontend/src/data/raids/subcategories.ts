import type { Subcategory } from '../../types';
import normalIcon from '../../assets/raids/normal.png';
import heroicIcon from '../../assets/raids/heroic.png';
import raidIcon from '../../assets/raids/raid.png';
import abyssIcon from '../../assets/raids/abyss.png';
import mythicIcon from '../../assets/raids/mythic.png';

export const raidsSubcategories: Subcategory[] = [
  { id: 'normal', name: 'Normal', icon: normalIcon, description: 'Standard events designed to be completed solo with a single character.', itemCount: 11 },
  { id: 'heroic', name: 'Heroic', icon: heroicIcon, description: 'Challenging events you can tackle solo with your 5 characters or team up with other players to complete.', itemCount: 17 },
  { id: 'raid', name: 'Raid', icon: raidIcon, description: 'Epic 25-player cooperative encounters. The first tier of end-game content where team coordination is essential.', itemCount: 2 },
  { id: 'abyss', name: 'Abyss', icon: abyssIcon, description: 'Elite 25-player events featuring enhanced raid encounters with significantly higher difficulty and superior rewards.', itemCount: 0 },
  { id: 'mythic', name: 'Mythic+', icon: mythicIcon, description: 'The ultimate high-end challenge. A 5-player multi-floor dungeon experience designed for the most coordinated squads.', itemCount: 0 },
];

