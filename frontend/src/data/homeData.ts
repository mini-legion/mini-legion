import { allGuides, afkFarmingGuide } from './guides';
import { dummyRaids } from './raidsData';
import { dummyCodes } from './codesData';
import { buildDetails } from './buildsData';

// Featured builds order: Hunter Survival, Priest Healing, Fire Mage
export const featuredBuilds = [
  buildDetails.find(b => b.id === 'hunter-survival')!,
  buildDetails.find(b => b.id === 'priest-healing')!,
  buildDetails.find(b => b.id === 'fire-mage')!,
];

export const homeStats = {
  totalGuides: allGuides.length,
  totalBuilds: buildDetails.length,
  activeCodes: dummyCodes.filter(c => c.isActive).length,
  creators: 2,
};

// Featured content - AFK Farming guide as the main featured guide
export const featuredContent = {
  guide: {
    id: afkFarmingGuide.id,
    title: afkFarmingGuide.title,
    description: afkFarmingGuide.description,
    image: afkFarmingGuide.image,
  },
  build: featuredBuilds[0],
  raid: dummyRaids[0],
};

