import { useState, useContext, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
  Search,
  X,
  ShoppingCart,
  Menu,
  User,
  Package,
  Info,
  LogOut,
  LogIn,
  UserPlus,
} from "lucide-react";
import { authDataContext } from "../context/Authcontext";
import { userDataContext } from "../context/UserContext";
import { shopDataContext } from "../context/ShopContext";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Collections", href: "/collections" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Nav({ cartCount = 2 }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);

  const navigate = useNavigate();
  const { serverUrl } = useContext(authDataContext);
  const { userData, setUserData } = useContext(userDataContext);
  const { products = [], setSearch } = useContext(shopDataContext) || {};

  const profileRef = useRef(null);
  const searchInputRef = useRef(null);

  // ─── Compute suggestions (no images) ───────────────────────────────
  const suggestions = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query || !products.length) return [];

    return products
      .filter((p) => {
        const name = (p.name || "").toLowerCase();
        const category = (p.category || "").toLowerCase();
        const subCategory = (p.subCategory || "").toLowerCase();
        return (
          name.includes(query) ||
          category.includes(query) ||
          subCategory.includes(query)
        );
      })
      .slice(0, 8);
  }, [searchQuery, products]);

  // ─── Close search ─────────────────────────────────────────────────────
  const closeSearch = () => {
    setSearchOpen(false);
    setSearchQuery("");
    setSelectedSuggestionIndex(-1);
  };

  // ─── Submit search ──────────────────────────────────────────────────
  const submitSearch = (term) => {
    const trimmed = (term || searchQuery).trim();
    if (!trimmed) return;
    if (typeof setSearch === "function") {
      setSearch(trimmed);
    }
    navigate("/collections");
    setSearchOpen(false);
    setMobileMenuOpen(false);
    setSelectedSuggestionIndex(-1);
  };

  // ─── Keyboard handlers ──────────────────────────────────────────────
  const handleSearchKeyDown = (e) => {
    if (e.key === "Escape") {
      closeSearch();
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();
      if (selectedSuggestionIndex >= 0 && suggestions[selectedSuggestionIndex]) {
        const product = suggestions[selectedSuggestionIndex];
        setSearchQuery(product.name);
        submitSearch(product.name);
      } else {
        submitSearch();
      }
      return;
    }

    if (suggestions.length) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedSuggestionIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedSuggestionIndex((prev) => (prev > 0 ? prev - 1 : -1));
      }
    }
  };

  // ─── Desktop search icon click ──────────────────────────────────────
  const handleSearchIconClick = () => {
    if (!searchOpen) {
      setSearchOpen(true);
      setTimeout(() => searchInputRef.current?.focus(), 50);
      return;
    }
    if (searchQuery.trim()) {
      submitSearch();
    } else {
      closeSearch();
    }
  };

  // ─── Click outside profile ───────────────────────────────────────────
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ─── Escape closes profile ──────────────────────────────────────────
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") setProfileOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  // ─── Navigation helpers ─────────────────────────────────────────────
  const handleNavigate = (path) => {
    navigate(path);
    setProfileOpen(false);
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        `${serverUrl}/api/auth/logout`,
        {},
        { withCredentials: true }
      );
      setUserData(null);
      setProfileOpen(false);
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  // ─── Render ──────────────────────────────────────────────────────────
  return (
    <div
      className="w-full bg-[#FFFBF7] border-b border-[#F2E6DC] sticky top-0 z-50"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-16">
        <div className="flex items-center justify-between h-16 sm:h-20 lg:h-24 gap-2">
          {/* Logo */}
          <a
            href="/"
            className="inline-flex items-center gap-1.5 sm:gap-2.5 group shrink-0 min-w-0"
          >
            <img
              src="/paws.png"
              alt="FurEver"
              className="w-8 h-8 sm:w-11 sm:h-11 lg:w-14 lg:h-14 xl:w-16 xl:h-16 object-contain group-hover:scale-105 transition-transform shrink-0"
            />
            <span
              className="text-[#181D27] text-xl sm:text-2xl lg:text-3xl xl:text-4xl whitespace-nowrap tracking-tight"
              style={{ fontFamily: "'Baloo 2', sans-serif", fontWeight: 700 }}
            >
              Fur<span className="text-[#FF5C35]">Ever</span>
            </span>
          </a>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-10 xl:gap-14">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="relative text-[#181D27] text-lg xl:text-xl font-semibold hover:text-[#FF5C35] transition-colors after:absolute after:left-0 after:-bottom-1.5 after:h-[2px] after:w-0 after:bg-[#FF5C35] after:transition-all after:duration-300 hover:after:w-full"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right icons */}
          <div className="flex items-center gap-1 sm:gap-3 lg:gap-4 shrink-0">
            {/* ===== Desktop Search ===== */}
            <div className="hidden sm:flex items-center relative">
              {/* Container with row-reverse so the button stays at the right edge */}
              <div className="flex flex-row-reverse items-center relative">
                {/* The animated input – expands leftward */}
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{
                    width: searchOpen ? 280 : 0,
                    opacity: searchOpen ? 1 : 0,
                  }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="overflow-hidden"
                >
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setSelectedSuggestionIndex(-1);
                    }}
                    onKeyDown={handleSearchKeyDown}
                    onFocus={() => setSearchOpen(true)}
                    placeholder="Search products..."
                    className="w-full px-4 py-2.5 rounded-full border border-[#F2E6DC] bg-[#FFF8F1] text-base text-[#181D27] placeholder:text-[#B7AFA3] outline-none focus:border-[#FF5C35] focus:ring-2 focus:ring-[#FF5C35]/15 transition-all"
                  />
                </motion.div>

                {/* Search toggle button – always visible, rightmost */}
                <button
                  onClick={handleSearchIconClick}
                  aria-label={searchOpen ? "Submit or close search" : "Open search"}
                  className="w-10 h-10 lg:w-11 lg:h-11 flex items-center justify-center rounded-full text-[#181D27] hover:bg-[#FFF1EA] hover:text-[#FF5C35] transition-colors shrink-0"
                >
                  {searchOpen ? (
                    searchQuery.trim() ? <Search size={22} /> : <X size={22} />
                  ) : (
                    <Search size={22} />
                  )}
                </button>

                {/* Suggestions dropdown – positioned below the input, no clipping */}
                <AnimatePresence>
                  {searchOpen && suggestions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-[#E3D9CB] shadow-xl z-50 max-h-[300px] overflow-y-auto"
                    >
                      {suggestions.map((product, index) => (
                        <div
                          key={product._id}
                          onClick={() => {
                            setSearchQuery(product.name);
                            submitSearch(product.name);
                          }}
                          onMouseEnter={() => setSelectedSuggestionIndex(index)}
                          className={`px-4 py-3 hover:bg-[#FFF8F1] cursor-pointer flex items-center gap-3 border-b border-[#F2E6DC] last:border-none ${
                            selectedSuggestionIndex === index ? "bg-[#FFF8F1]" : ""
                          }`}
                        >
                          {/* No image – just text */}
                          <div className="flex-1">
                            <p className="text-sm font-medium">{product.name}</p>
                            <p className="text-xs text-[#8A8578]">₹{product.price}</p>
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Profile dropdown – unchanged */}
            <div className="relative shrink-0" ref={profileRef}>
              {userData ? (
                <button
                  onClick={() => setProfileOpen((o) => !o)}
                  aria-label="Account menu"
                  aria-haspopup="true"
                  aria-expanded={profileOpen}
                  className="w-9 h-9 sm:w-10 sm:h-10 lg:w-11 lg:h-11 rounded-full bg-[#FF5C35] text-white text-base sm:text-lg font-semibold flex items-center justify-center hover:opacity-90 transition-opacity shrink-0"
                  style={{ fontFamily: "'Baloo 2', sans-serif" }}
                >
                  {userData?.name?.[0]?.toUpperCase()}
                </button>
              ) : (
                <button
                  onClick={() => setProfileOpen((o) => !o)}
                  aria-label="Account menu"
                  aria-haspopup="true"
                  aria-expanded={profileOpen}
                  className="w-9 h-9 sm:w-10 sm:h-10 lg:w-11 lg:h-11 rounded-full bg-[#FFF1EA] text-[#C79A82] flex items-center justify-center hover:bg-[#FFE4D6] transition-colors shrink-0"
                >
                  <User size={20} />
                </button>
              )}

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.97 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    className="absolute right-0 mt-3 w-56 bg-white rounded-2xl border border-[#F2E6DC] shadow-[0_10px_40px_-12px_rgba(24,29,39,0.18)] overflow-hidden z-50"
                  >
                    {userData ? (
                      <>
                        <div className="px-4 py-4 border-b border-[#F2E6DC]">
                          <p className="text-[#181D27] font-semibold text-base">
                            {userData.name}
                          </p>
                          <p className="text-[#8A8378] text-sm truncate">
                            {userData.email}
                          </p>
                        </div>
                        <div className="py-2">
                          <button
                            onClick={() => handleNavigate("/orders")}
                            className="w-full flex items-center gap-3 px-4 py-3 text-[#181D27] text-base font-medium hover:bg-[#FFF1EA] hover:text-[#FF5C35] transition-colors"
                          >
                            <Package size={18} />
                            Orders
                          </button>
                          <button
                            onClick={() => handleNavigate("/about")}
                            className="w-full flex items-center gap-3 px-4 py-3 text-[#181D27] text-base font-medium hover:bg-[#FFF1EA] hover:text-[#FF5C35] transition-colors"
                          >
                            <Info size={18} />
                            About
                          </button>
                          <div className="h-px bg-[#F2E6DC] my-1" />
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 text-[#FF7A5C] text-base font-medium hover:bg-[#FFF3F0] transition-colors"
                          >
                            <LogOut size={18} />
                            Logout
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="py-2">
                        <button
                          onClick={() => handleNavigate("/login")}
                          className="w-full flex items-center gap-3 px-4 py-3 text-[#181D27] text-base font-medium hover:bg-[#FFF1EA] hover:text-[#FF5C35] transition-colors"
                        >
                          <LogIn size={18} />
                          Login
                        </button>
                        <button
                          onClick={() => handleNavigate("/signup")}
                          className="w-full flex items-center gap-3 px-4 py-3 text-[#181D27] text-base font-medium hover:bg-[#FFF1EA] hover:text-[#FF5C35] transition-colors"
                        >
                          <UserPlus size={18} />
                          Sign Up
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Cart */}
            <button
              aria-label="Cart"
              className="relative w-9 h-9 sm:w-10 sm:h-10 lg:w-11 lg:h-11 flex items-center justify-center rounded-full text-[#181D27] hover:bg-[#FFF1EA] hover:text-[#FF5C35] transition-colors shrink-0"
            >
              <ShoppingCart size={20} className="sm:w-[22px] sm:h-[22px]" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 min-w-[18px] h-[18px] px-1 rounded-full bg-[#FF5C35] text-white text-[11px] font-semibold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile search toggle */}
            <button
              onClick={() => setSearchOpen((s) => !s)}
              aria-label="Open search"
              className="sm:hidden w-9 h-9 flex items-center justify-center rounded-full text-[#181D27] hover:bg-[#FFF1EA] hover:text-[#FF5C35] transition-colors shrink-0"
            >
              <Search size={20} />
            </button>

            {/* Hamburger */}
            <button
              onClick={() => setMobileMenuOpen((o) => !o)}
              aria-label="Menu"
              className="lg:hidden w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full text-[#181D27] hover:bg-[#FFF1EA] hover:text-[#FF5C35] transition-colors shrink-0"
            >
              <AnimatePresence mode="wait" initial={false}>
                {mobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X size={22} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu size={22} />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>

        {/* Mobile search bar – full width */}
        <AnimatePresence initial={false}>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="sm:hidden overflow-hidden"
            >
              <div className="pb-4">
                <input
                  autoFocus
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  placeholder="Search products..."
                  className="w-full px-4 py-3 rounded-full border border-[#F2E6DC] bg-[#FFF8F1] text-base text-[#181D27] placeholder:text-[#B7AFA3] outline-none focus:border-[#FF5C35] focus:ring-2 focus:ring-[#FF5C35]/15 transition-all"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile menu */}
        <AnimatePresence initial={false}>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="lg:hidden overflow-hidden border-t border-[#F2E6DC]"
            >
              <div className="py-4 flex flex-col gap-1">
                {NAV_LINKS.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-[#181D27] text-lg font-semibold px-2 py-3 rounded-lg hover:bg-[#FFF1EA] hover:text-[#FF5C35] transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}