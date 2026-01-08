export { raidsSubcategories } from './subcategories';
export { normalRaids } from './normal';
export { heroicRaids } from './heroic';
export { raidRaids } from './raid';
export { abyssData } from './abyss';
export { mythicRaids } from './mythic';

// Combined export for backwards compatibility
import { normalRaids } from './normal';
import { heroicRaids } from './heroic';
import { raidRaids } from './raid';
import { abyssData } from './abyss';
import { mythicRaids } from './mythic';

export const dummyRaids = [
  ...normalRaids,
  ...heroicRaids,
  ...raidRaids,
  ...abyssData,
  ...mythicRaids,
];

