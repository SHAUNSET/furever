import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, SlidersHorizontal, PackageX } from "lucide-react";
import Nav from "../components/Nav";
import Card from "../components/Card";
import { shopDataContext } from "../context/ShopContext";

// =============================================================================
// CONSTANTS
// =============================================================================
const CATEGORIES = ["All", "Men", "Women", "Kids"];
const SUB_CATEGORIES = ["All", "Topwear", "Bottomwear", "Winterwear"];
const SIZES = ["S", "M", "L", "XL", "XXL"];
const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "priceLowHigh", label: "Price: Low to High" },
  { value: "priceHighLow", label: "Price: High to Low" },
  { value: "alphabetical", label: "Alphabetical" },
];
const PAGE_SIZE = 12;

// =============================================================================
// SUB COMPONENT — SKELETON CARD (loading state)
// =============================================================================
function SkeletonCard() {
  return (
    <div className="rounded-[32px] bg-white shadow-sm overflow-hidden animate-pulse border border-[#EFE7DD]">
      <div className="w-full aspect-[1/1] bg-[#F2ECE1]" />
      <div className="p-7 space-y-4">
        <div className="h-6 bg-[#F2ECE1] rounded w-3/4 mx-auto" />
        <div className="h-4 bg-[#F2ECE1] rounded w-1/2 mx-auto" />
        <div className="h-8 bg-[#F2ECE1] rounded w-full mt-4" />
      </div>
    </div>
  );
}

// =============================================================================
// SUB COMPONENT — FLOATING BACKGROUND DECORATION
// =============================================================================
function FloatingCircle({ className, duration, delay }) {
  return (
    <motion.div
      animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className={`absolute rounded-full blur-3xl pointer-events-none ${className}`}
    />
  );
}

// =============================================================================
// SUB COMPONENT — FILTER PILL BUTTON
// =============================================================================
function PillButton({ active, onClick, children }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
        active
          ? "bg-[#FF6A3D] text-white shadow-sm"
          : "bg-[#F3EFE7] text-[#50546B] hover:bg-[#FFE7DB] hover:text-[#FF6A3D]"
      }`}
    >
      {children}
    </motion.button>
  );
}

// =============================================================================
// SUB COMPONENT — ACTIVE FILTER CHIP
// =============================================================================
function FilterChip({ label, onRemove }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="flex items-center gap-1.5 bg-white border border-[#E3D9CB] pl-3 pr-1.5 py-1.5 rounded-full shadow-sm"
    >
      <span className="text-[11px] font-bold text-[#14172E]">{label}</span>
      <button
        onClick={onRemove}
        className="p-1 rounded-full hover:bg-[#F3EFE7] text-[#8A8578] hover:text-[#FF6A3D] transition-colors"
      >
        <X size={10} />
      </button>
    </motion.div>
  );
}

// =============================================================================
// SUB COMPONENT — FILTERS PANEL
// =============================================================================
function FiltersPanel({
  category,
  setCategory,
  subCategory,
  setSubCategory,
  selectedSizes,
  toggleSize,
  priceRange,
  setPriceRange,
  priceBounds,
  sortOption,
  setSortOption,
  bestsellerOnly,
  setBestsellerOnly,
  isMobile = false,
}) {
  const range = priceBounds.max - priceBounds.min;

  const minPercent = useMemo(() => {
    if (range <= 0) return 0;
    return ((priceRange[0] - priceBounds.min) / range) * 100;
  }, [priceRange, priceBounds, range]);

  const maxPercent = useMemo(() => {
    if (range <= 0) return 100;
    return ((priceRange[1] - priceBounds.min) / range) * 100;
  }, [priceRange, priceBounds, range]);

  return (
    <div className="flex flex-col gap-7 text-[#14172E]">
      {/* Category */}
      <div>
        <p className="text-[11px] font-bold uppercase tracking-wider text-[#8A8578] mb-3">
          Category
        </p>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <PillButton key={c} active={category === c} onClick={() => setCategory(c)}>
              {c}
            </PillButton>
          ))}
        </div>
      </div>

      {/* Sub Category */}
      <div>
        <p className="text-[11px] font-bold uppercase tracking-wider text-[#8A8578] mb-3">
          Sub Category
        </p>
        <div className="flex flex-wrap gap-2">
          {SUB_CATEGORIES.map((sc) => (
            <PillButton
              key={sc}
              active={subCategory === sc}
              onClick={() => setSubCategory(sc)}
            >
              {sc}
            </PillButton>
          ))}
        </div>
      </div>

      {/* Sizes */}
      <div>
        <p className="text-[11px] font-bold uppercase tracking-wider text-[#8A8578] mb-3">
          Sizes
        </p>
        <div className="flex flex-wrap gap-2">
          {SIZES.map((size) => (
            <PillButton
              key={size}
              active={selectedSizes.includes(size)}
              onClick={() => toggleSize(size)}
            >
              {size}
            </PillButton>
          ))}
        </div>
      </div>

      {/* Price Range Slider */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#8A8578]">
            Price Range
          </p>
          <span className="text-xs font-bold text-[#FF6A3D]">
            ₹{priceRange[0]} - ₹{priceRange[1]}
          </span>
        </div>
        <div className="relative w-full h-6 mt-2 flex items-center">
          <div className="absolute left-0 right-0 h-1 bg-[#E3D9CB] rounded-full w-full" />
          <div
            className="absolute h-1 bg-[#FF6A3D] rounded-full"
            style={{
              left: `${minPercent}%`,
              width: `${maxPercent - minPercent}%`,
            }}
          />
          <input
            type="range"
            min={priceBounds.min}
            max={priceBounds.max}
            value={priceRange[0]}
            onChange={(e) => {
              const val = Math.min(Number(e.target.value), priceRange[1] - 1);
              setPriceRange([val, priceRange[1]]);
            }}
            className="dual-range-slider absolute w-full h-1 appearance-none pointer-events-none bg-transparent left-0 top-1/2 -translate-y-1/2 m-0 p-0 outline-none"
            style={{ zIndex: priceRange[0] > priceBounds.max - 100 ? "5" : "3" }}
          />
          <input
            type="range"
            min={priceBounds.min}
            max={priceBounds.max}
            value={priceRange[1]}
            onChange={(e) => {
              const val = Math.max(Number(e.target.value), priceRange[0] + 1);
              setPriceRange([priceRange[0], val]);
            }}
            className="dual-range-slider absolute w-full h-1 appearance-none pointer-events-none bg-transparent left-0 top-1/2 -translate-y-1/2 m-0 p-0 outline-none"
            style={{ zIndex: "4" }}
          />
        </div>
        <div className="flex justify-between items-center text-[10px] text-[#8A8578] font-bold mt-1">
          <span>₹{priceBounds.min}</span>
          <span>₹{priceBounds.max}</span>
        </div>
      </div>

      {/* Mobile Sort Controls */}
      {isMobile && (
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#8A8578] mb-3">
            Sort By
          </p>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="w-full px-4 py-2.5 rounded-2xl text-xs font-bold bg-[#F3EFE7] text-[#50546B] outline-none cursor-pointer focus:ring-2 focus:ring-[#FF6A3D]/30 transition-all"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Bestseller Toggle */}
      <div className="pt-2 border-t border-[#F2ECE1]">
        <label className="flex items-center gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={bestsellerOnly}
            onChange={(e) => setBestsellerOnly(e.target.checked)}
            className="w-4 h-4 rounded border-[#E3D9CB] accent-[#FF6A3D] cursor-pointer"
          />
          <span className="text-xs font-bold text-[#50546B]">
            Show Bestsellers Only
          </span>
        </label>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
          .dual-range-slider {
            pointer-events: none;
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
          }
          .dual-range-slider::-webkit-slider-thumb {
            pointer-events: auto;
            -webkit-appearance: none;
            appearance: none;
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background: #FF6A3D;
            cursor: pointer;
            border: 2px solid white;
            box-shadow: 0 1px 3px rgba(0,0,0,0.25);
            transition: transform 0.1s ease;
          }
          .dual-range-slider::-webkit-slider-thumb:hover {
            transform: scale(1.15);
          }
          .dual-range-slider::-moz-range-thumb {
            pointer-events: auto;
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background: #FF6A3D;
            cursor: pointer;
            border: 2px solid white;
            box-shadow: 0 1px 3px rgba(0,0,0,0.25);
            transition: transform 0.1s ease;
          }
          .dual-range-slider::-moz-range-thumb:hover {
            transform: scale(1.15);
          }
        `,
        }}
      />
    </div>
  );
}

// =============================================================================
// MAIN COMPONENT — COLLECTIONS
// =============================================================================
function Collections() {
  const { products = [], loading = false, search = "" } = useContext(shopDataContext) || {};
  const location = useLocation();
  const productsRef = useRef(null);
  const boundsInitialized = useRef(false);

  // ---------------------------------------------------------------------
  // FILTER STATE
  // ---------------------------------------------------------------------
  const [category, setCategory] = useState("All");
  const [subCategory, setSubCategory] = useState("All");
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [sortOption, setSortOption] = useState("newest");
  const [bestsellerOnly, setBestsellerOnly] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [highlightLatest, setHighlightLatest] = useState(false);

  // Safe parsing of min and max prices across database items
  const priceBounds = useMemo(() => {
    if (!products || !products.length) return { min: 0, max: 10000 };
    const prices = products
      .map((p) => Number(p.price))
      .filter((price) => !isNaN(price));
    if (prices.length === 0) return { min: 0, max: 10000 };
    return { min: Math.min(...prices), max: Math.max(...prices) };
  }, [products]);

  useEffect(() => {
    if (!boundsInitialized.current && products.length > 0) {
      setPriceRange([priceBounds.min, priceBounds.max]);
      boundsInitialized.current = true;
    }
  }, [products, priceBounds]);

  const toggleSize = (size) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const scrollToProducts = () => {
    setTimeout(() => {
      productsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 300);
  };

  useEffect(() => {
    if (location.state?.filter === "latest") {
      setSortOption("newest");
      setHighlightLatest(true);
      scrollToProducts();
    } else if (location.state?.filter === "bestseller") {
      setBestsellerOnly(true);
      scrollToProducts();
    }
  }, [location.state]);

  // Whenever a fresh search term arrives from the Nav search bar, scroll the
  // filtered results into view so the user immediately sees their matches.
  useEffect(() => {
    if (search && search.trim()) {
      scrollToProducts();
    }
  }, [search]);

  const clearFilters = () => {
    setCategory("All");
    setSubCategory("All");
    setSelectedSizes([]);
    setPriceRange([priceBounds.min, priceBounds.max]);
    setSortOption("newest");
    setBestsellerOnly(false);
    setHighlightLatest(false);
    setVisibleCount(PAGE_SIZE);
  };

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [category, subCategory, selectedSizes, priceRange, bestsellerOnly, sortOption, search]);

  // ---------------------------------------------------------------------
  // FILTER ENGINE – with exact match forced to front
  // ---------------------------------------------------------------------
  const filteredProducts = useMemo(() => {
    const query = (search || "").trim().toLowerCase();

    // 1. Filter
    let result = products.filter((p) => {
      const matchesSearch =
        !query ||
        p.name?.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query) ||
        String(p.category ?? "").toLowerCase().includes(query) ||
        String(p.subCategory ?? "").toLowerCase().includes(query) ||
        String(p.price ?? "").toLowerCase().includes(query) ||
        (Array.isArray(p.sizes) &&
          p.sizes.some((sz) => String(sz ?? "").toLowerCase().includes(query)));

      const matchesCategory =
        category === "All" ||
        (p.category && String(p.category).trim().toLowerCase() === category.trim().toLowerCase());

      const matchesSubCategory =
        subCategory === "All" ||
        (p.subCategory &&
          String(p.subCategory).trim().toLowerCase() === subCategory.trim().toLowerCase());

      const matchesSizes =
        selectedSizes.length === 0 ||
        (Array.isArray(p.sizes) &&
          selectedSizes.some((selectedSize) =>
            p.sizes.some(
              (productSize) =>
                productSize &&
                String(productSize).trim().toLowerCase() === selectedSize.trim().toLowerCase()
            )
          ));

      const price = Number(p.price);
      const matchesPrice = !isNaN(price) && price >= priceRange[0] && price <= priceRange[1];

      const matchesBestseller = !bestsellerOnly || p.bestseller === true;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesSubCategory &&
        matchesSizes &&
        matchesPrice &&
        matchesBestseller
      );
    });

    // 2. If there is a search query, find the exact match (by name) and move it to the front
    if (query) {
      const exactMatchIndex = result.findIndex(
        (p) => p.name?.trim().toLowerCase() === query
      );
      if (exactMatchIndex !== -1) {
        const exactMatch = result.splice(exactMatchIndex, 1)[0];
        result.unshift(exactMatch);
      }
    }

    // 3. Apply secondary sorting to the remaining products (excluding the first if it was the exact match)
    // We'll sort the entire array with a custom sort that gives the first item (if it's the exact match) priority,
    // but simpler: separate the first item (if it's the exact match) and sort the rest.
    let firstItem = null;
    let rest = result;
    if (query) {
      // Check if the first item is the exact match we just moved
      if (result.length > 0 && result[0].name?.trim().toLowerCase() === query) {
        firstItem = result[0];
        rest = result.slice(1);
      }
    }

    // Sort the rest according to the chosen sort option
    rest.sort((a, b) => {
      switch (sortOption) {
        case "newest":
          return new Date(b.date || 0) - new Date(a.date || 0);
        case "oldest":
          return new Date(a.date || 0) - new Date(b.date || 0);
        case "priceLowHigh":
          return (Number(a.price) || 0) - (Number(b.price) || 0);
        case "priceHighLow":
          return (Number(b.price) || 0) - (Number(a.price) || 0);
        case "alphabetical":
          return (a.name || "").localeCompare(b.name || "");
        default:
          return 0;
      }
    });

    // Combine: if we have a firstItem (exact match), put it at the front
    if (firstItem) {
      return [firstItem, ...rest];
    }
    return rest;
  }, [
    products,
    search,
    category,
    subCategory,
    selectedSizes,
    priceRange,
    bestsellerOnly,
    sortOption,
  ]);

  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  const activeFilters = useMemo(() => {
    const chips = [];

    if (category !== "All") {
      chips.push({ key: "category", label: category, onRemove: () => setCategory("All") });
    }
    if (subCategory !== "All") {
      chips.push({
        key: "subCategory",
        label: subCategory,
        onRemove: () => setSubCategory("All"),
      });
    }
    selectedSizes.forEach((size) =>
      chips.push({
        key: `size-${size}`,
        label: size,
        onRemove: () => toggleSize(size),
      })
    );
    if (priceRange[0] !== priceBounds.min || priceRange[1] !== priceBounds.max) {
      chips.push({
        key: "price",
        label: `₹${priceRange[0]} - ₹${priceRange[1]}`,
        onRemove: () => setPriceRange([priceBounds.min, priceBounds.max]),
      });
    }
    if (bestsellerOnly) {
      chips.push({
        key: "bestseller",
        label: "Bestsellers Only",
        onRemove: () => setBestsellerOnly(false),
      });
    }

    return chips;
  }, [category, subCategory, selectedSizes, priceRange, bestsellerOnly, priceBounds]);

  const filterPanelProps = {
    category,
    setCategory,
    subCategory,
    setSubCategory,
    selectedSizes,
    toggleSize,
    priceRange,
    setPriceRange,
    priceBounds,
    sortOption,
    setSortOption,
    bestsellerOnly,
    setBestsellerOnly,
  };

  const gridVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.05 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  };

  return (
    <div
      className="min-h-screen w-full bg-[#FAF7F1] flex flex-col text-[#14172E]"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <Nav />

      {/* Decorative Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <FloatingCircle className="w-80 h-80 bg-[#FF6A3D]/5 -top-10 -left-10" duration={8} delay={0} />
        <FloatingCircle className="w-96 h-96 bg-[#3B4CE0]/5 top-40 right-0" duration={10} delay={1} />
      </div>

      {/* Split Layout Container */}
      <div ref={productsRef} className="relative z-10 w-full flex-1 flex flex-col lg:flex-row">
        {/* Continuous Left Sidebar */}
        <aside className="hidden lg:block w-72 xl:w-80 shrink-0 bg-white border-r border-[#EFE7DD] px-8 py-10 sticky top-[72px] h-[calc(100vh-72px)] overflow-y-auto">
          <div className="flex items-center justify-between pb-4 border-b border-[#F2ECE1] mb-6">
            <h3
              className="text-lg font-extrabold text-[#14172E]"
              style={{ fontFamily: "'Baloo 2', sans-serif" }}
            >
              Filters
            </h3>
            <button onClick={clearFilters} className="text-xs font-bold text-[#FF6A3D] hover:underline">
              Clear All
            </button>
          </div>
          <FiltersPanel {...filterPanelProps} />
        </aside>

        {/* Dynamic Content Grid */}
        <main className="flex-1 flex flex-col px-4 sm:px-8 lg:px-12 py-10">
          <header className="mb-10">
            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#14172E]"
              style={{ fontFamily: "'Baloo 2', sans-serif" }}
            >
              Explore Our <span className="text-[#FF6A3D]">Collections</span>
            </motion.h1>
            <p className="text-base sm:text-lg text-[#50546B] mt-2 max-w-xl font-medium leading-relaxed">
              Timeless, hand-crafted styles built for modern pets and the owners who adore them.
            </p>
            {highlightLatest && (
              <span className="inline-block mt-4 px-4 py-1.5 rounded-full bg-[#FF6A3D]/10 text-[#FF6A3D] text-[10px] font-extrabold tracking-wider">
                ✨ CURRENTLY HIGHLIGHTING NEW ARRIVALS FIRST
              </span>
            )}
            {search && search.trim() && (
              <span className="inline-block mt-4 ml-2 px-4 py-1.5 rounded-full bg-[#3B4CE0]/10 text-[#3B4CE0] text-[10px] font-extrabold tracking-wider">
                SHOWING RESULTS FOR "{search.trim().toUpperCase()}"
              </span>
            )}
          </header>

          <div className="flex items-center justify-between border-b border-[#EFE7DD] pb-4 mb-6">
            <p className="text-sm text-[#50546B] font-semibold">
              Showing <span className="text-[#14172E] font-bold">{filteredProducts.length}</span> products
            </p>
            <div className="flex items-center gap-4">
              <div className="hidden lg:flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#8A8578]">Sort:</span>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-white border border-[#E3D9CB] text-[#50546B] outline-none cursor-pointer hover:border-[#FF6A3D] focus:ring-2 focus:ring-[#FF6A3D]/20 transition-all"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="lg:hidden flex items-center gap-2 bg-white border border-[#E3D9CB] hover:border-[#FF6A3D] rounded-full px-5 py-2.5 font-bold text-xs text-[#14172E] shadow-sm"
              >
                <SlidersHorizontal size={14} />
                Filter & Sort
              </button>
            </div>
          </div>

          {activeFilters.length > 0 && (
            <div className="flex items-center flex-wrap gap-2 mb-6">
              <AnimatePresence>
                {activeFilters.map((chip) => (
                  <FilterChip key={chip.key} label={chip.label} onRemove={chip.onRemove} />
                ))}
              </AnimatePresence>
              <button onClick={clearFilters} className="text-xs font-extrabold text-[#FF6A3D] ml-2 hover:underline">
                Reset All
              </button>
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
              {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[2rem] border border-[#EFE7DD] shadow-sm py-20 px-6 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-[#F3EFE7] flex items-center justify-center mx-auto mb-4">
                <PackageX size={28} className="text-[#B4AFA1]" />
              </div>
              <h3
                className="text-xl font-bold text-[#14172E] mb-2"
                style={{ fontFamily: "'Baloo 2', sans-serif" }}
              >
                No Matching Products Found
              </h3>
              <p className="text-sm text-[#8A8578] mb-6 max-w-sm mx-auto font-medium">
                Try widening your price range, choosing alternate sizes, or switching categories.
              </p>
              <button
                onClick={clearFilters}
                className="px-6 py-3 rounded-full font-bold text-sm text-white bg-[#FF6A3D] hover:bg-[#E85A2E] transition-all duration-200"
              >
                Reset Filters
              </button>
            </motion.div>
          ) : (
            <>
              <motion.div
                variants={gridVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8 xl:gap-10 w-full"
              >
                {visibleProducts.map((product) => (
                  <motion.div
                    key={product._id}
                    variants={cardVariants}
                    className="flex justify-center w-full"
                  >
                    <Card product={product} />
                  </motion.div>
                ))}
              </motion.div>

              {hasMore && (
                <div className="flex justify-center mt-14">
                  <motion.button
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
                    className="px-8 py-3.5 rounded-full font-bold text-xs text-[#14172E] bg-white border border-[#E3D9CB] shadow-sm hover:shadow-md hover:border-[#FF6A3D] transition-all duration-200"
                  >
                    Load More Products
                  </motion.button>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFiltersOpen(false)}
              className="fixed inset-0 z-[90] bg-black/40 lg:hidden"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 320 }}
              className="fixed bottom-0 left-0 right-0 z-[95] bg-white rounded-t-[2.5rem] shadow-2xl max-h-[85vh] flex flex-col overflow-hidden lg:hidden"
            >
              <div className="bg-white flex items-center justify-between px-6 py-5 border-b border-[#F2ECE1]">
                <div>
                  <h3
                    className="text-lg text-[#14172E] font-extrabold"
                    style={{ fontFamily: "'Baloo 2', sans-serif" }}
                  >
                    Filter & Sort
                  </h3>
                  <p className="text-[10px] text-[#8A8578] font-bold">
                    Refining {filteredProducts.length} Results
                  </p>
                </div>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="p-2 rounded-full bg-[#F3EFE7] hover:bg-[#FFE7DB] transition-colors"
                >
                  <X size={16} className="text-[#50546B] hover:text-[#FF6A3D]" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-6 scrollbar-none">
                <FiltersPanel {...filterPanelProps} isMobile={true} />
              </div>

              <div className="px-6 py-5 border-t border-[#F2ECE1] bg-white flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    clearFilters();
                    setMobileFiltersOpen(false);
                  }}
                  className="flex-1 py-3.5 rounded-full font-bold text-xs text-[#50546B] bg-[#F3EFE7] hover:bg-red-50 hover:text-red-500 transition-colors"
                >
                  Clear All
                </button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setMobileFiltersOpen(false)}
                  className="flex-[2] py-3.5 rounded-full font-bold text-xs text-white bg-[#FF6A3D] hover:bg-[#E85A2E] shadow-md transition-colors"
                >
                  Show {filteredProducts.length} Results
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Collections;