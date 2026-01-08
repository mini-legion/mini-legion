import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { ImportantDrop } from '../../types';

interface DropItemProps {
  drop: ImportantDrop;
}

export const DropItem: React.FC<DropItemProps> = ({ drop }) => {
  const [showModal, setShowModal] = useState(false);

  // Prevent scroll when modal is open
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showModal]);

  const modalContent = drop.image && showModal && (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-8 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-300"
      onClick={() => setShowModal(false)}
    >
      <div 
        className="relative max-w-4xl w-full max-h-[95vh] flex flex-col items-center animate-in zoom-in duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          className="absolute -top-10 right-2 md:-right-12 md:-top-12 text-slate-400 hover:text-white p-2 transition-colors cursor-pointer z-[10000]"
          onClick={() => setShowModal(false)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Image Container */}
        <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow-2xl shadow-black/100 w-full flex flex-col">
          <div className="overflow-y-auto custom-scrollbar flex-1 bg-black/40 min-h-[200px]">
            <div className="p-2 sm:p-4 flex flex-col items-center justify-start min-h-full w-full">
              {/* This inner div helps with centering while preserving the top of the image if it overflows */}
              <div className="flex-1 flex items-center justify-center w-full py-4">
                <img 
                  src={drop.image} 
                  alt={drop.name}
                  className="max-w-full h-auto object-contain block shadow-lg rounded-sm"
                  style={{ maxHeight: 'calc(95vh - 120px)' }}
                />
              </div>
            </div>
          </div>
          <div className="p-3 sm:p-4 bg-slate-800 border-t border-slate-700 text-center shrink-0">
            <h4 className="text-lg sm:text-xl font-bold text-amber-400 leading-tight">{drop.name}</h4>
            <p className="text-[10px] sm:text-xs text-slate-400 mt-1 uppercase tracking-widest font-medium">Heroic Raid Reward</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="relative group/drop">
        <div 
          className="flex items-start gap-2 cursor-pointer"
          onClick={() => drop.image && setShowModal(true)}
        >
          <span className="mt-1.5 w-1 h-1 rounded-full bg-amber-500/40 shrink-0" />
          <p className="text-amber-400 font-semibold text-sm leading-relaxed hover:text-amber-300 transition-colors">
            {drop.name}
            {drop.image && <span className="ml-2 text-[10px] text-slate-500 font-normal opacity-0 group-hover/drop:opacity-100 transition-opacity">(Click to view)</span>}
          </p>
        </div>
      </div>

      {showModal && createPortal(modalContent, document.body)}
    </>
  );
};

