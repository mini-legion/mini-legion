import { useState, useMemo, useEffect, useCallback } from "react";
import { PageHeader, Card, Badge } from "../components/UI";
import { useGearCollections } from "../lib/hooks";
import type { GearCollection } from "../lib/database.types";

const STORAGE_KEY = "mini_legion_collected_items";

// Hook para manejar el estado de colección con localStorage
const useCollectedItems = () => {
  const [collectedItems, setCollectedItems] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  // Guardar en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...collectedItems]));
  }, [collectedItems]);

  const toggleItem = useCallback((itemKey: string) => {
    setCollectedItems((prev) => {
      const next = new Set(prev);
      if (next.has(itemKey)) {
        next.delete(itemKey);
      } else {
        next.add(itemKey);
      }
      return next;
    });
  }, []);

  const isCollected = useCallback(
    (itemKey: string) => {
      return collectedItems.has(itemKey);
    },
    [collectedItems],
  );

  const clearAll = useCallback(() => {
    setCollectedItems(new Set());
  }, []);

  return {
    collectedItems,
    toggleItem,
    isCollected,
    clearAll,
    count: collectedItems.size,
  };
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
  isCollected,
  toggleItem,
}: {
  collection: string;
  items: GearCollection[];
  onClose: () => void;
  isCollected: (key: string) => boolean;
  toggleItem: (key: string) => void;
}) => {
  const collected = items.filter((item, idx) =>
    isCollected(getItemKey(item, idx)),
  ).length;
  const total = items.length;
  const progress = Math.round((collected / total) * 100);

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
                  {collected}/{total} collected
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
            Click on items to mark them as collected
          </p>
        </div>

        {/* Items list */}
        <div className="overflow-y-auto max-h-[calc(85vh-120px)] p-4 space-y-2">
          {items.map((item, idx) => {
            const itemKey = getItemKey(item, idx);
            const itemIsCollected = isCollected(itemKey);
            return (
              <button
                key={itemKey}
                onClick={() => toggleItem(itemKey)}
                className={`w-full p-3 rounded-xl border transition-all text-left ${
                  itemIsCollected
                    ? "bg-green-500/10 border-green-500/30 hover:bg-green-500/20"
                    : "bg-slate-800/50 border-slate-700/50 hover:border-purple-500/30 hover:bg-slate-700/30"
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Status indicator */}
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                      itemIsCollected ? "bg-green-500/20" : "bg-slate-700/50"
                    }`}
                  >
                    {itemIsCollected ? (
                      <svg
                        className="w-4 h-4 text-green-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <div className="w-3 h-3 rounded-full border-2 border-slate-500" />
                    )}
                  </div>

                  {/* Item info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`font-medium truncate ${itemIsCollected ? "text-green-300" : "text-slate-200"}`}
                      >
                        {item["Drop Item Name"] || "Unknown Item"}
                      </span>
                      {item["Location"] && (
                        <Badge variant="default" size="sm">
                          {item["Location"]}
                        </Badge>
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
              </button>
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
  isCollected,
}: {
  name: string;
  items: GearCollection[];
  onClick: () => void;
  isCollected: (key: string) => boolean;
}) => {
  const collected = items.filter((item, idx) =>
    isCollected(getItemKey(item, idx)),
  ).length;
  const total = items.length;
  const progress = Math.round((collected / total) * 100);
  const isComplete = progress === 100;

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
            {collected}/{total}
          </span>
          <span
            className={`font-medium ${isComplete ? "text-green-400" : "text-purple-400"}`}
          >
            {progress}%
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
  const [filter, setFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCollection, setSelectedCollection] = useState<string | null>(
    null,
  );
  const [viewMode, setViewMode] = useState<"all" | "incomplete" | "complete">(
    "all",
  );
  const {
    isCollected,
    toggleItem,
    clearAll,
    count: collectedCount,
  } = useCollectedItems();

  const allCollections = collections || [];

  // Get unique locations for filter
  const locations = useMemo(
    () => [
      ...new Set(allCollections.map((c) => c["Location"]).filter(Boolean)),
    ],
    [allCollections],
  );

  // Group and filter collections
  const groupedCollections = useMemo(() => {
    const filtered = allCollections.filter((collection) => {
      const matchesFilter =
        filter === "all" || collection["Location"] === filter;
      const matchesSearch =
        searchTerm === "" ||
        collection["Gear Collection Name"]
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        collection["Drop Item Name"]
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        collection["Affix"]?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesFilter && matchesSearch;
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
  }, [allCollections, filter, searchTerm]);

  // Apply view mode filter
  const displayedCollections = useMemo(() => {
    return Object.entries(groupedCollections).filter(([, items]) => {
      const collected = items.filter((item, idx) =>
        isCollected(getItemKey(item, idx)),
      ).length;
      const isComplete = collected === items.length;

      if (viewMode === "complete") return isComplete;
      if (viewMode === "incomplete") return !isComplete;
      return true;
    });
  }, [groupedCollections, viewMode, isCollected]);

  // Stats
  const stats = useMemo(() => {
    const totalItems = allCollections.length;
    const collectedItems = allCollections.filter((c, idx) =>
      isCollected(getItemKey(c, idx)),
    ).length;
    const totalCollections = Object.keys(groupedCollections).length;
    const completeCollections = Object.values(groupedCollections).filter(
      (items) => {
        const collected = items.filter((item, idx) =>
          isCollected(getItemKey(item, idx)),
        ).length;
        return collected === items.length;
      },
    ).length;

    return {
      totalItems,
      collectedItems,
      totalCollections,
      completeCollections,
    };
  }, [allCollections, groupedCollections, isCollected]);

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
            <div className="text-xl font-bold text-slate-300">
              {stats.collectedItems}
            </div>
            <div className="text-slate-500 text-xs">Items Collected</div>
          </Card>
          <Card className="p-3 text-center" hover={false}>
            <div className="text-xl font-bold text-amber-400">
              {stats.totalItems > 0
                ? Math.round((stats.collectedItems / stats.totalItems) * 100)
                : 0}
              %
            </div>
            <div className="text-slate-500 text-xs">Total Progress</div>
          </Card>
        </div>

        {/* Search and filters */}
        <Card className="p-4 mb-6" hover={false}>
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
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

            {/* Location filter */}
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700 text-sm text-slate-300 focus:outline-none focus:border-purple-500/50 cursor-pointer"
            >
              <option value="all">All Locations</option>
              {locations.map((loc) => (
                <option key={loc} value={loc!}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* View mode tabs and clear button */}
          <div className="flex items-center justify-between mt-3">
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
            {collectedCount > 0 && (
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
                isCollected={isCollected}
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
          isCollected={isCollected}
          toggleItem={toggleItem}
        />
      )}
    </div>
  );
};
