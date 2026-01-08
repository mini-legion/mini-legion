import type { Subcategory } from '../types';
import { allGuides } from './guides';

export const guidesSubcategories: Subcategory[] = [
  { 
    id: 'beginner', 
    name: 'Beginner Guides', 
    icon: '📖', 
    description: 'Start your journey here', 
    itemCount: allGuides.filter(g => g.subcategory === 'beginner').length 
  },
  { 
    id: 'raids-dungeons', 
    name: 'Raids & Dungeons', 
    icon: '⚔️', 
    description: 'Conquer every challenge', 
    itemCount: allGuides.filter(g => g.subcategory === 'raids-dungeons').length 
  },
  { 
    id: 'farming', 
    name: 'Farming & Resources', 
    icon: '💰', 
    description: 'Maximize your gains', 
    itemCount: allGuides.filter(g => g.subcategory === 'farming').length 
  },
  { 
    id: 'pvp-guilds', 
    name: 'PVP & Guilds', 
    icon: '🏆', 
    description: 'Dominate the arena and lead your guild', 
    itemCount: allGuides.filter(g => g.subcategory === 'pvp-guilds').length 
  },
];
