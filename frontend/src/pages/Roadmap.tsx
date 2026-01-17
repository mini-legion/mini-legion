import { useState, useRef } from 'react';
import { PageHeader, Card } from '../components/UI';
import { storage } from '../lib/api';

interface RoadmapImage {
  id: string;
  title: string;
  date: string;
  image: string;
}

// Ordered from most recent to oldest
const roadmaps: RoadmapImage[] = [
  {
    id: '4',
    title: 'Roadmap 2026 - Divine & Dragon',
    date: 'January 2026',
    image: storage.roadmap.getImageUrl('roadmap-4.png'),
  },
  {
    id: '3',
    title: 'Roadmap 2025 - Christmas Update',
    date: 'December 2025',
    image: storage.roadmap.getImageUrl('roadmap-3.png'),
  },
  {
    id: '2',
    title: 'Roadmap 2025 - Late November',
    date: 'Late November 2025',
    image: storage.roadmap.getImageUrl('roadmap-2.png'),
  },
  {
    id: '1',
    title: 'Roadmap 2025 - Global Release',
    date: 'October - November 2025',
    image: storage.roadmap.getImageUrl('roadmap-1.png'),
  },
];

export const Roadmap = () => {
  const [selectedImage, setSelectedImage] = useState<RoadmapImage | null>(null);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement>(null);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.5, 4));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.5, 1));
  const handleResetZoom = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      setIsDragging(true);
      dragStart.current = { x: e.clientX - position.x, y: e.clientY - position.y };
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoom > 1) {
      setPosition({
        x: e.clientX - dragStart.current.x,
        y: e.clientY - dragStart.current.y,
      });
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  const openLightbox = (roadmap: RoadmapImage) => {
    setSelectedImage(roadmap);
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  return (
    <div>
      <PageHeader
        title="Roadmap"
        subtitle="Official development roadmaps for Mini Legion"
        gradient="blue"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Roadmap Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {roadmaps.map((roadmap, index) => (
            <Card
              key={roadmap.id}
              className="overflow-hidden group cursor-pointer relative flex flex-col h-full border-slate-700/30 hover:border-blue-500/30 transition-all duration-500"
              glow={index === 0 ? 'amber' : 'none'}
              onClick={() => openLightbox(roadmap)}
            >
              {/* Latest Badge */}
              {index === 0 && (
                <div className="absolute top-2 right-2 z-20">
                  <span className="px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-tighter shadow-xl flex items-center gap-1">
                    NEW
                  </span>
                </div>
              )}

              {/* Thumbnail Image Container */}
              <div className="relative aspect-[3/4] overflow-hidden bg-slate-950">
                <img
                  src={roadmap.image}
                  alt={roadmap.title}
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.parentElement!.innerHTML = `
                      <div class="flex flex-col items-center justify-center h-full text-slate-600">
                        <div class="text-3xl mb-2">🖼️</div>
                        <p class="text-[10px] font-medium">Image not found</p>
                      </div>
                    `;
                  }}
                />

                {/* Gradient Fade Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                {/* View Icon */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100">
                  <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-2xl">
                    🔍
                  </div>
                </div>
              </div>

              {/* Info Section */}
              <div className="p-3 bg-slate-900/40 backdrop-blur-sm border-t border-white/5 flex-1 flex flex-col justify-center">
                <h3 className="font-bold text-slate-100 text-[13px] leading-tight mb-1 line-clamp-2 group-hover:text-blue-400 transition-colors">
                  {roadmap.title}
                </h3>
                <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                  <span className="opacity-70">📅</span>
                  <span>{roadmap.date}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Info Card */}
        <div className="mt-12 flex justify-center">
          <div className="bg-slate-900/40 backdrop-blur-sm rounded-2xl border border-white/5 p-4 max-w-2xl w-full flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-xl shadow-inner">
              💡
            </div>
            <div>
              <h3 className="font-bold text-slate-200 text-sm">About the Roadmap</h3>
              <p className="text-slate-500 text-[12px] leading-relaxed">
                These are the official development roadmaps released by the Mini Legion team.
                Content and estimated dates are subject to change.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal with Zoom */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-black/95"
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <div className="text-white">
              <div className="font-bold">{selectedImage.title}</div>
              <div className="text-sm text-slate-400">{selectedImage.date}</div>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleZoomOut}
                disabled={zoom <= 1}
                className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-white text-lg transition-all"
              >
                −
              </button>
              <span className="text-white text-sm w-16 text-center">{Math.round(zoom * 100)}%</span>
              <button
                onClick={handleZoomIn}
                disabled={zoom >= 4}
                className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-white text-lg transition-all"
              >
                +
              </button>
              <button
                onClick={handleResetZoom}
                className="ml-2 px-3 h-10 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-sm transition-all"
              >
                Reset
              </button>
              <button
                onClick={closeLightbox}
                className="ml-4 w-10 h-10 rounded-lg bg-red-500/20 hover:bg-red-500/40 flex items-center justify-center text-red-400 text-lg transition-all"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Image Container */}
          <div
            className="flex-1 overflow-hidden flex items-center justify-center"
            style={{ cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onClick={(e) => {
              if (!isDragging && zoom === 1) {
                // Click to close only if not zoomed
                if (e.target === e.currentTarget) closeLightbox();
              }
            }}
          >
            <img
              ref={imageRef}
              src={selectedImage.image}
              alt={selectedImage.title}
              className="max-w-full max-h-full object-contain select-none"
              style={{
                transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
                transition: isDragging ? 'none' : 'transform 0.2s ease-out',
              }}
              draggable={false}
            />
          </div>

          {/* Help text */}
          <div className="p-3 text-center text-slate-500 text-xs border-t border-white/10">
            Use + / − to zoom • Drag to pan when zoomed • Click outside or ✕ to close
          </div>
        </div>
      )}
    </div>
  );
};
