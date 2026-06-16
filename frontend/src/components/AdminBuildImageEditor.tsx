import type { AdminBuildImages, AdminBuildRow } from '../lib/admin';

const imageSlots = [
  { key: 'skills', label: 'Skills / Runes', icon: '⚡' },
  { key: 'tree1', label: 'Primary Tree', icon: '🌳' },
  { key: 'tree2', label: 'Secondary Tree', icon: '🌲' },
  { key: 'tree3', label: 'Tertiary Tree', icon: '🌿' },
  { key: 'dungeonGear', label: 'Dungeon Gear', icon: '🏰' },
  { key: 'adventureGear', label: 'Adventure Gear', icon: '🗺️' },
] as const;

type ImageSlotKey = typeof imageSlots[number]['key'];

function imageUrl(value?: string | null) {
  if (!value) return '';
  if (value.includes('://') || value.startsWith('/')) return value;
  return `/images/${value}`;
}

function cleanImages(images: AdminBuildImages) {
  return Object.fromEntries(
    Object.entries(images).filter(([, value]) => typeof value === 'string' && value.trim().length > 0)
  ) as AdminBuildImages;
}

interface AdminBuildImageEditorProps {
  build: AdminBuildRow;
  onChange: (images: AdminBuildImages, coverImage: string | null) => void;
}

export const AdminBuildImageEditor = ({ build, onChange }: AdminBuildImageEditorProps) => {
  const images = build.images || {};

  const getNextCover = (nextImages: AdminBuildImages) => {
    return build.image && Object.values(nextImages).includes(build.image)
      ? build.image
      : nextImages.skills || Object.values(nextImages)[0] || null;
  };

  const updateSlot = (slot: ImageSlotKey, value: string) => {
    const nextImages = cleanImages({ ...images, [slot]: value.trim() || undefined });
    onChange(nextImages, getNextCover(nextImages));
  };

  const removeSlot = (slot: ImageSlotKey) => {
    const nextImages = { ...images };
    delete nextImages[slot];
    const cleanedImages = cleanImages(nextImages);
    onChange(cleanedImages, getNextCover(cleanedImages));
  };

  const swapSlots = (fromSlot: ImageSlotKey, toSlot: ImageSlotKey) => {
    if (fromSlot === toSlot) return;

    const nextImages = { ...images };
    const fromValue = nextImages[fromSlot];
    const toValue = nextImages[toSlot];

    nextImages[toSlot] = fromValue;
    nextImages[fromSlot] = toValue;

    const cleanedImages = cleanImages(nextImages);
    onChange(cleanedImages, getNextCover(cleanedImages));
  };

  const moveSlot = (slot: ImageSlotKey, direction: -1 | 1) => {
    const currentIndex = imageSlots.findIndex((item) => item.key === slot);
    const targetSlot = imageSlots[currentIndex + direction]?.key;

    if (!targetSlot) return;
    swapSlots(slot, targetSlot);
  };

  const setCover = (value: string) => {
    onChange(cleanImages(images), value || null);
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/35 p-4">
      <div className="mb-4">
        <h4 className="text-sm font-black uppercase tracking-wide text-slate-300">Build Images</h4>
        <p className="mt-1 text-xs text-slate-500">
          Use the move buttons or the target slot selector to reorder images. Drag and drop still works on desktop, but many tablet browsers block it.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {imageSlots.map((slot, index) => {
          const value = images[slot.key];
          const preview = imageUrl(value);
          const isCover = !!value && build.image === value;

          return (
            <div
              key={slot.key}
              draggable={!!value}
              onDragStart={(event) => event.dataTransfer.setData('text/plain', slot.key)}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                event.preventDefault();
                const sourceSlot = event.dataTransfer.getData('text/plain') as ImageSlotKey;
                if (sourceSlot) swapSlots(sourceSlot, slot.key);
              }}
              className="rounded-xl border border-slate-700 bg-slate-900/60 p-3"
            >
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 text-sm">{slot.icon}</span>
                  <span className="text-sm font-black text-slate-200">{slot.label}</span>
                </div>
                {isCover && (
                  <span className="rounded-full bg-amber-500/15 px-2 py-1 text-[10px] font-black uppercase text-amber-300 border border-amber-500/30">
                    Cover
                  </span>
                )}
              </div>

              {preview ? (
                <button
                  type="button"
                  onClick={() => window.open(preview, '_blank', 'noopener,noreferrer')}
                  className="mb-3 block aspect-video w-full overflow-hidden rounded-lg border border-slate-700 bg-slate-950"
                >
                  <img src={preview} alt={slot.label} className="h-full w-full object-cover opacity-85 hover:opacity-100 transition-opacity" />
                </button>
              ) : (
                <div className="mb-3 flex aspect-video items-center justify-center rounded-lg border border-dashed border-slate-700 bg-slate-950 text-xs text-slate-600">
                  Empty Slot
                </div>
              )}

              <input
                value={value || ''}
                onChange={(event) => updateSlot(slot.key, event.target.value)}
                placeholder="Image path or URL"
                className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-xs text-slate-300 outline-none focus:border-amber-500"
              />

              <div className="mt-3 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  disabled={!value || index === 0}
                  onClick={() => moveSlot(slot.key, -1)}
                  className="rounded-lg border border-slate-600 bg-slate-800 px-3 py-1.5 text-xs font-bold text-slate-300 hover:border-amber-500/40 hover:text-amber-300 disabled:opacity-40 disabled:hover:text-slate-300 disabled:hover:border-slate-600"
                >
                  ← Move Up
                </button>
                <button
                  type="button"
                  disabled={!value || index === imageSlots.length - 1}
                  onClick={() => moveSlot(slot.key, 1)}
                  className="rounded-lg border border-slate-600 bg-slate-800 px-3 py-1.5 text-xs font-bold text-slate-300 hover:border-amber-500/40 hover:text-amber-300 disabled:opacity-40 disabled:hover:text-slate-300 disabled:hover:border-slate-600"
                >
                  Move Down →
                </button>
              </div>

              {value && (
                <label className="mt-3 block">
                  <span className="mb-1 block text-[10px] font-black uppercase tracking-wide text-slate-500">Move to slot</span>
                  <select
                    value={slot.key}
                    onChange={(event) => swapSlots(slot.key, event.target.value as ImageSlotKey)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-xs text-slate-300 outline-none focus:border-amber-500"
                  >
                    {imageSlots.map((target) => (
                      <option key={target.key} value={target.key}>
                        {target.label}
                      </option>
                    ))}
                  </select>
                </label>
              )}

              <div className="mt-3 flex flex-wrap gap-2">
                {value && (
                  <button
                    type="button"
                    onClick={() => setCover(value)}
                    className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-bold text-amber-300 hover:bg-amber-500/20"
                  >
                    Set Cover
                  </button>
                )}
                {value && (
                  <button
                    type="button"
                    onClick={() => removeSlot(slot.key)}
                    className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-bold text-red-300 hover:bg-red-500/20"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
