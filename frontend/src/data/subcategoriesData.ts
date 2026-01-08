import type { Subcategory } from '../types';
import hunterLogo from '../assets/classes/hunter-logo.png';
import priestLogo from '../assets/classes/priest-logo.png';
import mageLogo from '../assets/classes/mage-logo.png';
import warriorLogo from '../assets/classes/warrior-logo.png';
import rogueLogo from '../assets/classes/rogue-logo.png';
import paladinLogo from '../assets/classes/paladin-logo.png';

export const buildsSubcategories: Subcategory[] = [
  { id: 'hunter', name: 'Hunter', icon: hunterLogo, description: 'Masters of the wild', itemCount: 1 },
  { id: 'priest', name: 'Priest', icon: priestLogo, description: 'Divine healers & shadow wielders', itemCount: 0 },
  { id: 'mage', name: 'Mage', icon: mageLogo, description: 'Arcane destruction', itemCount: 0 },
  { id: 'warrior', name: 'Warrior', icon: warriorLogo, description: 'Frontline fighters', itemCount: 0 },
  { id: 'rogue', name: 'Rogue', icon: rogueLogo, description: 'Shadow assassins', itemCount: 0 },
  { id: 'paladin', name: 'Paladin', icon: paladinLogo, description: 'Holy warriors', itemCount: 0 },
];

