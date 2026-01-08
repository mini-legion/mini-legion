// Guide-specific types for dynamic guide content
// Each guide can have different sections and content types

export interface GuideTip {
  icon: string;
  title: string;
  description: string;
}

export interface GuideStep {
  stepNumber: number;
  title: string;
  description: string;
  image?: string;
}

export interface GuideSection {
  type: 'tips' | 'steps' | 'text' | 'image' | 'table' | 'warning' | 'note';
  title?: string;
  content?: string;
  tips?: GuideTip[];
  steps?: GuideStep[];
  image?: string;
  imageCaption?: string;
  tableHeaders?: string[];
  tableRows?: string[][];
}

export interface GuideDetail {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  description: string;
  category: string;
  subcategory: string;
  image: string;
  author: string;
  date: string;
  readTime: string;
  tags?: string[];
  sections: GuideSection[];
  relatedGuides?: string[];
}

