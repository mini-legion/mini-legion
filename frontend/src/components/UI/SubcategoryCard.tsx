import { Link } from 'react-router-dom';
import type { Subcategory } from '../../types';

interface SubcategoryCardProps {
  subcategory: Subcategory;
  basePath: string;
}

export const SubcategoryCard = ({ subcategory, basePath }: SubcategoryCardProps) => {
  return (
    <Link
      to={`${basePath}/${subcategory.id}`}
      className="group block h-full"
    >
      <div className="relative h-full flex flex-col bg-gradient-to-br from-slate-800/90 to-slate-900/90 rounded-2xl border border-slate-700/50 p-6 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/10 hover:border-amber-500/30 hover:-translate-y-1">
        {/* Icon */}
        <div className="w-20 h-20 flex items-center justify-center text-4xl mb-4 group-hover:scale-110 transition-transform duration-300 shrink-0">
          {subcategory.icon.startsWith('http') || subcategory.icon.startsWith('/') || subcategory.icon.includes('static') || subcategory.icon.includes('base64') || subcategory.icon.includes('.png') || subcategory.icon.includes('.jpg') || subcategory.icon.includes('.svg') ? (
            <img src={subcategory.icon} alt={subcategory.name} className="w-full h-full object-contain" />
          ) : (
            subcategory.icon
          )}
        </div>

        {/* Content */}
        <h3 className="text-lg font-bold text-slate-100 mb-2 group-hover:text-amber-400 transition-colors shrink-0">
          {subcategory.name}
        </h3>
        <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-1">
          {subcategory.description}
        </p>

        {/* Item Count */}
        {subcategory.itemCount !== undefined && (
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-auto pt-2 shrink-0">
            <span className="px-2 py-1 rounded-full bg-slate-700/50 text-amber-400 font-medium">
              {subcategory.itemCount} items
            </span>
          </div>
        )}

        {/* Arrow */}
        <div className="absolute top-6 right-6 w-8 h-8 rounded-full bg-slate-700/50 flex items-center justify-center text-slate-500 group-hover:bg-amber-500/20 group-hover:text-amber-400 transition-all duration-300">
          <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
};

