import { useState, useContext, useRef, useEffect } from "react";
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

  const navigate = useNavigate();
  const { serverUrl } = useContext(authDataContext);
  const { userData, setUserData, getCurrentUser } = useContext(userDataContext);

  const profileRef = useRef(null);

  const closeSearch = () => {
    setSearchOpen(false);
    setSearchQuery("");
  };

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close profile dropdown on Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") setProfileOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const handleNavigate = (path) => {
    navigate(path);
    setProfileOpen(false);
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        `${serverUrl}/api/auth/logout`,
        {},
        {
          withCredentials: true,
        }
      );

      // Clear frontend user state
      setUserData(null);

      // Close dropdown
      setProfileOpen(false);

      // Redirect to homepage
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div
      className="w-full bg-[#FFFBF7] border-b border-[#F2E6DC] sticky top-0 z-50"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Full-bleed on desktop: no max-w cap, just responsive padding */}
      <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-16">
        <div className="flex items-center justify-between h-16 sm:h-20 lg:h-24 gap-2">
          {/* Logo — shrink-0 + min-w-0 handling keeps it from colliding with icons */}
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

          {/* Center links — desktop only */}
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
            {/* Search */}
            <div className="hidden sm:flex items-center">
              <AnimatePresence initial={false}>
                {searchOpen && (
                  <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 240, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="overflow-hidden mr-1"
                  >
                    <input
                      autoFocus
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search products..."
                      className="w-full px-4 py-2.5 rounded-full border border-[#F2E6DC] bg-[#FFF8F1] text-base text-[#181D27] placeholder:text-[#B7AFA3] outline-none focus:border-[#FF5C35] focus:ring-2 focus:ring-[#FF5C35]/15 transition-all"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
              <button
                onClick={() => (searchOpen ? closeSearch() : setSearchOpen(true))}
                aria-label={searchOpen ? "Close search" : "Open search"}
                className="w-10 h-10 lg:w-11 lg:h-11 flex items-center justify-center rounded-full text-[#181D27] hover:bg-[#FFF1EA] hover:text-[#FF5C35] transition-colors"
              >
                {searchOpen ? <X size={22} /> : <Search size={22} />}
              </button>
            </div>

            {/* Profile — guest or logged-in, with dropdown */}
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
                        {/* User Info */}
                        <div className="px-4 py-4 border-b border-[#F2E6DC]">
                          <p className="text-[#181D27] font-semibold text-base">
                            {userData.name}
                          </p>

                          <p className="text-[#8A8378] text-sm truncate">
                            {userData.email}
                          </p>
                        </div>

                        {/* Logged In Menu */}
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

            {/* Hamburger — mobile/tablet only (shown below lg since links hide below lg) */}
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

        {/* Mobile search bar — full width below header */}
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
                  placeholder="Search products..."
                  className="w-full px-4 py-3 rounded-full border border-[#F2E6DC] bg-[#FFF8F1] text-base text-[#181D27] placeholder:text-[#B7AFA3] outline-none focus:border-[#FF5C35] focus:ring-2 focus:ring-[#FF5C35]/15 transition-all"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile/tablet nav links dropdown — matches hamburger breakpoint (lg) */}
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