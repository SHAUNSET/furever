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
      className="w-full bg-white border-b border-[#EFEFF6] sticky top-0 z-50"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex items-center justify-between h-20 sm:h-24">
          {/* Logo */}
          <a href="/" className="inline-flex items-center gap-2.5 group shrink-0">
            <img
              src="/paws.png"
              alt="FurEver"
              className="w-10 h-10 sm:w-12 sm:h-12 object-contain group-hover:scale-105 transition-transform"
            />
            <span
              className="text-[#14172E] text-2xl sm:text-3xl"
              style={{ fontFamily: "'Baloo 2', sans-serif", fontWeight: 700 }}
            >
              FurEver
            </span>
          </a>

          {/* Center links — desktop only */}
          <div className="hidden md:flex items-center gap-10">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="relative text-[#14172E] text-lg font-medium hover:text-[#3B4CE0] transition-colors after:absolute after:left-0 after:-bottom-1.5 after:h-[2px] after:w-0 after:bg-[#3B4CE0] after:transition-all after:duration-300 hover:after:w-full"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right icons */}
          <div className="flex items-center gap-3 sm:gap-5">
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
                      className="w-full px-4 py-2.5 rounded-full border border-[#E7E7F3] bg-[#FAF7F1] text-base text-[#14172E] placeholder:text-[#B0B3CC] outline-none focus:border-[#3B4CE0] focus:ring-2 focus:ring-[#3B4CE0]/15 transition-all"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
              <button
                onClick={() => (searchOpen ? closeSearch() : setSearchOpen(true))}
                aria-label={searchOpen ? "Close search" : "Open search"}
                className="w-11 h-11 flex items-center justify-center rounded-full text-[#14172E] hover:bg-[#F2F1FB] hover:text-[#3B4CE0] transition-colors"
              >
                {searchOpen ? <X size={22} /> : <Search size={22} />}
              </button>
            </div>

            {/* Profile — guest or logged-in, with dropdown */}
            <div className="relative" ref={profileRef}>
              {userData ? (
                <button
                  onClick={() => setProfileOpen((o) => !o)}
                  aria-label="Account menu"
                  aria-haspopup="true"
                  aria-expanded={profileOpen}
                  className="w-11 h-11 rounded-full bg-[#3B4CE0] text-white text-lg font-semibold flex items-center justify-center hover:opacity-90 transition-opacity shrink-0"
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
                  className="w-11 h-11 rounded-full bg-[#F2F1F5] text-[#9DA1C4] flex items-center justify-center hover:bg-[#E7E7F3] transition-colors shrink-0"
                >
                  <User size={22} />
                </button>
              )}

 <AnimatePresence>
  {profileOpen && (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.97 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className="absolute right-0 mt-3 w-52 bg-white rounded-2xl border border-[#EFEFF6] shadow-[0_10px_40px_-12px_rgba(20,23,46,0.18)] overflow-hidden z-50"
    >
      {userData ? (
        <>
          {/* User Info */}
          <div className="px-4 py-4 border-b border-[#EFEFF6]">
            <p className="text-[#14172E] font-semibold text-base">
              {userData.name}
            </p>

            <p className="text-[#8A8FB0] text-sm truncate">
              {userData.email}
            </p>
          </div>

          {/* Logged In Menu */}
          <div className="py-2">
            <button
              onClick={() => handleNavigate("/orders")}
              className="w-full flex items-center gap-3 px-4 py-3 text-[#14172E] text-base font-medium hover:bg-[#F2F1FB] hover:text-[#3B4CE0] transition-colors"
            >
              <Package size={18} />
              Orders
            </button>

            <button
              onClick={() => handleNavigate("/about")}
              className="w-full flex items-center gap-3 px-4 py-3 text-[#14172E] text-base font-medium hover:bg-[#F2F1FB] hover:text-[#3B4CE0] transition-colors"
            >
              <Info size={18} />
              About
            </button>

            <div className="h-px bg-[#EFEFF6] my-1" />

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
            className="w-full flex items-center gap-3 px-4 py-3 text-[#14172E] text-base font-medium hover:bg-[#F2F1FB] hover:text-[#3B4CE0] transition-colors"
          >
            <LogIn size={18} />
            Login
          </button>

          <button
            onClick={() => handleNavigate("/signup")}
            className="w-full flex items-center gap-3 px-4 py-3 text-[#14172E] text-base font-medium hover:bg-[#F2F1FB] hover:text-[#3B4CE0] transition-colors"
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
              className="relative w-11 h-11 flex items-center justify-center rounded-full text-[#14172E] hover:bg-[#F2F1FB] hover:text-[#3B4CE0] transition-colors"
            >
              <ShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#FF7A5C] text-white text-[11px] font-semibold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile search toggle */}
            <button
              onClick={() => setSearchOpen((s) => !s)}
              aria-label="Open search"
              className="sm:hidden w-11 h-11 flex items-center justify-center rounded-full text-[#14172E] hover:bg-[#F2F1FB] hover:text-[#3B4CE0] transition-colors"
            >
              <Search size={22} />
            </button>

            {/* Hamburger — mobile only */}
            <button
              onClick={() => setMobileMenuOpen((o) => !o)}
              aria-label="Menu"
              className="md:hidden w-11 h-11 flex items-center justify-center rounded-full text-[#14172E] hover:bg-[#F2F1FB] hover:text-[#3B4CE0] transition-colors"
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
                    <X size={24} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu size={24} />
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
                  className="w-full px-4 py-3 rounded-full border border-[#E7E7F3] bg-[#FAF7F1] text-base text-[#14172E] placeholder:text-[#B0B3CC] outline-none focus:border-[#3B4CE0] focus:ring-2 focus:ring-[#3B4CE0]/15 transition-all"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile nav links dropdown */}
        <AnimatePresence initial={false}>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="md:hidden overflow-hidden border-t border-[#EFEFF6]"
            >
              <div className="py-4 flex flex-col gap-1">
                {NAV_LINKS.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-[#14172E] text-lg font-medium px-2 py-3 rounded-lg hover:bg-[#F2F1FB] hover:text-[#3B4CE0] transition-colors"
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