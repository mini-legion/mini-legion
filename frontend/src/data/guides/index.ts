import type { Guide } from '../../types';

// Re-export guide types
export type { GuideDetail, GuideSection, GuideTip, GuideStep } from './types';

// Import all guide details
import { heroicDgSoloGuide } from './heroic-dg-solo';
import { monsterCollectionGuide } from './monster-collection';
import { twoHandQuestGuide } from './2h-quest';
import { afkFarmingGuide } from './afk-farming';
import { heirloomXpGuide } from './heirloom-xp';
import { incenseSilkGuide } from './incense-silk';
import { settingsMenusGuide } from './settings-menus';

// Export individual guides
export { heroicDgSoloGuide, monsterCollectionGuide, twoHandQuestGuide, afkFarmingGuide, heirloomXpGuide, incenseSilkGuide, settingsMenusGuide };

// Combined export of all guide details (full content)
export const guideDetails: Record<string, typeof heroicDgSoloGuide> = {
  'heroic-dg-solo': heroicDgSoloGuide,
  'monster-collection': monsterCollectionGuide,
  '2h-quest': twoHandQuestGuide,
  'afk-farming': afkFarmingGuide,
  'heirloom-xp': heirloomXpGuide,
  'incense-silk': incenseSilkGuide,
  'settings-menus': settingsMenusGuide,
};

// Convert GuideDetail to simple Guide format for listings
const guideDetailToGuide = (detail: typeof heroicDgSoloGuide): Guide => ({
  id: detail.id,
  title: detail.title,
  description: detail.description,
  category: detail.category,
  subcategory: detail.subcategory,
  image: detail.image,
  author: detail.author,
  date: detail.date,
  readTime: detail.readTime,
});

// All guides in simple format (for listings/grids)
export const allGuides: Guide[] = Object.values(guideDetails).map(guideDetailToGuide);

// Get guide by slug
export const getGuideBySlug = (slug: string) => {
  return guideDetails[slug] || null;
};

// Get all guide slugs
export const getAllGuideSlugs = () => {
  return Object.keys(guideDetails);
};

