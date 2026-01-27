import { useState, useMemo, useEffect, useCallback } from "react";
import { PageHeader, Card, Badge } from "../components/UI";
import { useGearCollections } from "../lib/hooks";
import type { GearCollection } from "../lib/database.types";

const STORAGE_KEY = "mini_legion_item_stars";

// Hook para manejar el estado de estrellas con localStorage
const useItemStars = () => {
  const [itemStars, setItemStars] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Guardar en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(itemStars));
  }, [itemStars]);

  const setStars = useCallback((itemKey: string, stars: number) => {
    setItemStars((prev) => {
      const next = { ...prev };
      if (stars === 0) {
        delete next[itemKey];
      } else {
        next[itemKey] = Math.min(5, Math.max(0, stars));
      }
      return next;
    });
  }, []);

  const getStars = useCallback(
    (itemKey: string) => {
      return itemStars[itemKey] || 0;
    },
    [itemStars],
  );

  const isCompleted = useCallback(
    (itemKey: string) => {
      return (itemStars[itemKey] || 0) >= 5;
    },
    [itemStars],
  );

  const clearAll = useCallback(() => {
    setItemStars({});
  }, []);

  const totalStars = Object.values(itemStars).reduce((sum, s) => sum + s, 0);
  const completedCount = Object.values(itemStars).filter((s) => s >= 5).length;

  return {
    itemStars,
    setStars,
    getStars,
    isCompleted,
    clearAll,
    totalStars,
    completedCount,
  };
};

// Componente de estrellas clickeables
const StarRating = ({
  stars,
  onSetStars,
  size = "md",
}: {
  stars: number;
  onSetStars: (stars: number) => void;
  size?: "sm" | "md";
}) => {
  const starSize = size === "sm" ? "w-4 h-4" : "w-5 h-5";

  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          onClick={(e) => {
            e.stopPropagation();
            // Si clickea la misma estrella que ya tiene, la quita
            onSetStars(stars === i ? i - 1 : i);
          }}
          className={`${starSize} transition-all hover:scale-110 ${
            i <= stars ? "text-yellow-400" : "text-slate-600 hover:text-slate-500"
          }`}
        >
          <svg fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
      ))}
    </div>
  );
};

// Generar key única para cada item
const getItemKey = (item: GearCollection, idx: number) => {
  return `${item["Gear Collection Name"]}::${item["Drop Item Name"] || idx}::${item["Location"] || ""}`;
};

// Modal para detalles de colección
const CollectionModal = ({
  collection,
  items,
  onClose,
  getStars,
  setStars,
  isCompleted,
}: {
  collection: string;
  items: GearCollection[];
  onClose: () => void;
  getStars: (key: string) => number;
  setStars: (key: string, stars: number) => void;
  isCompleted: (key: string) => boolean;
}) => {
  const completed = items.filter((item, idx) =>
    isCompleted(getItemKey(item, idx)),
  ).length;
  const total = items.length;
  const totalStars = items.reduce((sum, item, idx) => sum + getStars(getItemKey(item, idx)), 0);
  const maxStars = total * 5;
  const progress = Math.round((totalStars / maxStars) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[85vh] overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700 shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-slate-800/95 backdrop-blur-sm border-b border-slate-700 p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-white truncate">
                {collection}
              </h3>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-sm text-slate-400">
                  {completed}/{total} complete ({totalStars}/{maxStars} stars)
                </span>
                <div className="flex-1 max-w-32 h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      progress === 100 ? "bg-green-500" : "bg-purple-500"
                    }`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span
                  className={`text-sm font-medium ${progress === 100 ? "text-green-400" : "text-purple-400"}`}
                >
                  {progress}%
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Hint */}
        <div className="px-4 py-2 bg-slate-800/50 border-b border-slate-700/50">
          <p className="text-xs text-slate-500 text-center">
            Click stars to rate items. 5 stars = completed!
          </p>
        </div>

        {/* Items list */}
        <div className="overflow-y-auto max-h-[calc(85vh-120px)] p-4 space-y-2">
          {items.map((item, idx) => {
            const itemKey = getItemKey(item, idx);
            const stars = getStars(itemKey);
            const itemIsCompleted = stars >= 5;
            return (
              <div
                key={itemKey}
                className={`w-full p-3 rounded-xl border transition-all ${
                  itemIsCompleted
                    ? "bg-green-500/10 border-green-500/30"
                    : "bg-slate-800/50 border-slate-700/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Star rating */}
                  <div className="flex-shrink-0">
                    <StarRating
                      stars={stars}
                      onSetStars={(s) => setStars(itemKey, s)}
                    />
                  </div>

                  {/* Item info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`font-medium truncate ${itemIsCompleted ? "text-green-300" : "text-slate-200"}`}
                      >
                        {item["Drop Item Name"] || "Unknown Item"}
                      </span>
                      {item["Location"] && (
                        <Badge variant="default" size="sm">
                          {item["Location"]}
                        </Badge>
                      )}
                      {itemIsCompleted && (
                        <span className="text-xs px-1.5 py-0.5 rounded bg-green-500/20 text-green-400">
                          Complete
                        </span>
                      )}
                    </div>

                    {/* Attributes row */}
                    <div className="flex flex-wrap gap-2 mt-1.5">
                      {item["Affix"] && (
                        <span className="text-xs px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-400">
                          {item["Affix"]}
                          {item["Affix Value"] && (
                            <span className="text-amber-300/70 ml-1">
                              +{item["Affix Value"]}
                            </span>
                          )}
                        </span>
                      )}
                      {item["Attribute 1"] && (
                        <span className="text-xs text-slate-400">
                          {item["Attribute 1"]}
                          {item["Attribute Value"] && (
                            <span className="text-slate-500">
                              {" "}
                              +{item["Attribute Value"]}
                            </span>
                          )}
                        </span>
                      )}
                      {item["Attribute 2"] && (
                        <span className="text-xs text-slate-400">
                          {item["Attribute 2"]}
                          {item["Attribute 2 Value"] && (
                            <span className="text-slate-500">
                              {" "}
                              +{item["Attribute 2 Value"]}
                            </span>
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Card compacta de colección
const CollectionCard = ({
  name,
  items,
  onClick,
  getStars,
  isCompleted,
}: {
  name: string;
  items: GearCollection[];
  onClick: () => void;
  getStars: (key: string) => number;
  isCompleted: (key: string) => boolean;
}) => {
  const completedItems = items.filter((item, idx) =>
    isCompleted(getItemKey(item, idx)),
  ).length;
  const total = items.length;
  const totalStars = items.reduce((sum, item, idx) => sum + getStars(getItemKey(item, idx)), 0);
  const maxStars = total * 5;
  const progress = Math.round((totalStars / maxStars) * 100);
  const isComplete = completedItems === total;

  // Get unique locations
  const locations = [
    ...new Set(items.map((i) => i["Location"]).filter(Boolean)),
  ];
  // Get unique affixes
  const affixes = [
    ...new Set(items.map((i) => i["Affix"]).filter(Boolean)),
  ].slice(0, 2);

  return (
    <Card
      className="p-4 cursor-pointer group"
      glow={isComplete ? "green" : "purple"}
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <h3 className="font-semibold text-slate-200 text-sm leading-tight line-clamp-2 group-hover:text-white transition-colors">
          {name}
        </h3>
        {isComplete && (
          <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
            <svg
              className="w-3 h-3 text-green-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-slate-400">
            {completedItems}/{total} items
          </span>
          <span
            className={`font-medium ${isComplete ? "text-green-400" : "text-purple-400"}`}
          >
            {totalStars}/{maxStars} ★
          </span>
        </div>
        <div className="h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${isComplete ? "bg-green-500" : "bg-purple-500"}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5">
        {locations.slice(0, 1).map((loc) => (
          <span
            key={loc}
            className="text-[10px] px-1.5 py-0.5 rounded bg-slate-700/50 text-slate-400"
          >
            {loc}
          </span>
        ))}
        {affixes.map((affix) => (
          <span
            key={affix}
            className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400/80"
          >
            {affix}
          </span>
        ))}
        {locations.length > 1 && (
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-700/30 text-slate-500">
            +{locations.length - 1}
          </span>
        )}
      </div>
    </Card>
  );
};

export const Collections = () => {
  const { data: collections, loading, error } = useGearCollections();
  const [locationFilter, setLocationFilter] = useState<string>("all");
  const [attributeFilter, setAttributeFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCollection, setSelectedCollection] = useState<string | null>(
    null,
  );
  const [viewMode, setViewMode] = useState<"all" | "incomplete" | "complete">(
    "all",
  );
  const {
    getStars,
    setStars,
    isCompleted,
    clearAll,
    completedCount,
  } = useItemStars();

  const allCollections = collections || [];

  // Get unique values for filters
  const locations = useMemo(
    () => [
      ...new Set(allCollections.map((c) => c["Location"]).filter(Boolean)),
    ].sort(),
    [allCollections],
  );

  // Extraer nombre base del atributo (sin números)
  const getAttributeBase = (attr: string | null | undefined): string | null => {
    if (!attr) return null;
    // Eliminar todos los números y espacios extra
    return attr.replace(/\d+/g, "").trim();
  };

  const attributes = useMemo(() => {
    const allAttrs = allCollections.flatMap((c) => [
      getAttributeBase(c["Attribute 1"]),
      getAttributeBase(c["Attribute 2"]),
    ]);
    return [...new Set(allAttrs.filter(Boolean))].sort() as string[];
  }, [allCollections]);

  // Group and filter collections
  const groupedCollections = useMemo(() => {
    const filtered = allCollections.filter((collection) => {
      const matchesLocation =
        locationFilter === "all" || collection["Location"] === locationFilter;
      const matchesAttribute =
        attributeFilter === "all" ||
        getAttributeBase(collection["Attribute 1"]) === attributeFilter ||
        getAttributeBase(collection["Attribute 2"]) === attributeFilter;
      const matchesSearch =
        searchTerm === "" ||
        collection["Gear Collection Name"]
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        collection["Drop Item Name"]
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        collection["Affix"]?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesLocation && matchesAttribute && matchesSearch;
    });

    return filtered.reduce(
      (acc, collection) => {
        const name = collection["Gear Collection Name"];
        if (!acc[name]) {
          acc[name] = [];
        }
        acc[name].push(collection);
        return acc;
      },
      {} as Record<string, GearCollection[]>,
    );
  }, [allCollections, locationFilter, attributeFilter, searchTerm]);

  // Apply view mode filter
  const displayedCollections = useMemo(() => {
    return Object.entries(groupedCollections).filter(([, items]) => {
      const completedItems = items.filter((item, idx) =>
        isCompleted(getItemKey(item, idx)),
      ).length;
      const isComplete = completedItems === items.length;

      if (viewMode === "complete") return isComplete;
      if (viewMode === "incomplete") return !isComplete;
      return true;
    });
  }, [groupedCollections, viewMode, isCompleted]);

  // Stats
  const stats = useMemo(() => {
    const totalItems = allCollections.length;
    const completedItems = allCollections.filter((c, idx) =>
      isCompleted(getItemKey(c, idx)),
    ).length;
    const totalCollections = Object.keys(groupedCollections).length;
    const completeCollections = Object.values(groupedCollections).filter(
      (items) => {
        const completed = items.filter((item, idx) =>
          isCompleted(getItemKey(item, idx)),
        ).length;
        return completed === items.length;
      },
    ).length;
    const currentTotalStars = allCollections.reduce(
      (sum, c, idx) => sum + getStars(getItemKey(c, idx)),
      0,
    );
    const maxPossibleStars = totalItems * 5;

    return {
      totalItems,
      completedItems,
      totalCollections,
      completeCollections,
      currentTotalStars,
      maxPossibleStars,
    };
  }, [allCollections, groupedCollections, isCompleted, getStars]);

  if (loading) {
    return (
      <div>
        <PageHeader
          title="Gear Collections"
          subtitle="Track and manage your gear collections"
          gradient="purple"
        />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-purple-500 border-t-transparent"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <PageHeader
          title="Gear Collections"
          subtitle="Track and manage your gear collections"
          gradient="purple"
        />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <Card className="p-8 text-center">
            <div className="text-4xl mb-3">😕</div>
            <h3 className="text-lg font-bold text-slate-300 mb-2">
              Error loading collections
            </h3>
            <p className="text-slate-500 text-sm">Please try again later</p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Gear Collections"
        subtitle="Track and manage your gear collections"
        gradient="purple"
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <Card className="p-3 text-center" hover={false}>
            <div className="text-xl font-bold text-purple-400">
              {stats.totalCollections}
            </div>
            <div className="text-slate-500 text-xs">Collections</div>
          </Card>
          <Card className="p-3 text-center" hover={false}>
            <div className="text-xl font-bold text-green-400">
              {stats.completeCollections}
            </div>
            <div className="text-slate-500 text-xs">Complete</div>
          </Card>
          <Card className="p-3 text-center" hover={false}>
            <div className="text-xl font-bold text-yellow-400">
              {stats.currentTotalStars}/{stats.maxPossibleStars}
            </div>
            <div className="text-slate-500 text-xs">Total Stars</div>
          </Card>
          <Card className="p-3 text-center" hover={false}>
            <div className="text-xl font-bold text-amber-400">
              {stats.maxPossibleStars > 0
                ? Math.round((stats.currentTotalStars / stats.maxPossibleStars) * 100)
                : 0}
              %
            </div>
            <div className="text-slate-500 text-xs">Total Progress</div>
          </Card>
        </div>

        {/* Search and filters */}
        <Card className="p-4 mb-6" hover={false}>
          {/* Search */}
          <div className="relative mb-3">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search collections, items, affixes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500/50"
            />
          </div>

          {/* Filter dropdowns */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            {/* Location filter */}
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700 text-sm text-slate-300 focus:outline-none focus:border-purple-500/50 cursor-pointer"
            >
              <option value="all">All Locations</option>
              {locations.map((loc) => (
                <option key={loc} value={loc!}>
                  {loc}
                </option>
              ))}
            </select>

            {/* Attribute filter */}
            <select
              value={attributeFilter}
              onChange={(e) => setAttributeFilter(e.target.value)}
              className="px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700 text-sm text-slate-300 focus:outline-none focus:border-purple-500/50 cursor-pointer"
            >
              <option value="all">All Attributes</option>
              {attributes.map((attr) => (
                <option key={attr} value={attr}>
                  {attr}
                </option>
              ))}
            </select>
          </div>

          {/* View mode tabs and clear button */}
          <div className="flex items-center justify-between">
            <div className="flex gap-1 p-1 bg-slate-800/30 rounded-lg">
              {[
                { value: "all", label: "All" },
                { value: "incomplete", label: "In Progress" },
                { value: "complete", label: "Complete" },
              ].map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setViewMode(tab.value as typeof viewMode)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                    viewMode === tab.value
                      ? "bg-purple-500/20 text-purple-400"
                      : "text-slate-400 hover:text-slate-300"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Clear progress button */}
            {completedCount > 0 && (
              <button
                onClick={() => {
                  if (
                    confirm(
                      "Are you sure you want to clear all your collection progress?",
                    )
                  ) {
                    clearAll();
                  }
                }}
                className="px-3 py-1.5 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-md transition-all"
              >
                Clear Progress
              </button>
            )}
          </div>
        </Card>

        {/* Collections Grid */}
        {displayedCollections.length === 0 ? (
          <Card className="p-8 text-center">
            <div className="text-4xl mb-3">🔍</div>
            <h3 className="text-lg font-bold text-slate-300 mb-2">
              No collections found
            </h3>
            <p className="text-slate-500 text-sm">
              Try adjusting your search or filters
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {displayedCollections.map(([collectionName, items]) => (
              <CollectionCard
                key={collectionName}
                name={collectionName}
                items={items}
                onClick={() => setSelectedCollection(collectionName)}
                getStars={getStars}
                isCompleted={isCompleted}
              />
            ))}
          </div>
        )}

        {/* Results count */}
        {displayedCollections.length > 0 && (
          <div className="text-center mt-6 text-sm text-slate-500">
            Showing {displayedCollections.length} collection
            {displayedCollections.length !== 1 ? "s" : ""}
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedCollection && groupedCollections[selectedCollection] && (
        <CollectionModal
          collection={selectedCollection}
          items={groupedCollections[selectedCollection]}
          onClose={() => setSelectedCollection(null)}
          getStars={getStars}
          setStars={setStars}
          isCompleted={isCompleted}
        />
      )}
    </div>
  );
};
