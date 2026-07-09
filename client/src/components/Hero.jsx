import { motion } from "framer-motion";
import { PawPrint, Leaf, ShieldCheck, Sparkles, ArrowUpRight, Package, Heart } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] },
  }),
};

const VALUES = [
  { icon: Leaf, label: "Premium Cotton" },
  { icon: PawPrint, label: "Animal Inspired" },
  { icon: ShieldCheck, label: "Cruelty Free" },
];

const MARQUEE_ITEMS = [
  "Premium Cotton",
  "Cruelty Free",
  "Animal Inspired",
  "Made Responsibly",
  "Ethically Sourced",
];

export default function Hero() {
  return (
    /* Section fills vertical height cleanly and pushes ticker to the exact bottom boundary */
    <section className="relative w-full min-h-[calc(100vh-96px)] overflow-hidden bg-[#FFF8F0] flex flex-col">
      
      {/* Dynamic Brand-Wash Background */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 50% at 85% 25%, rgba(255,92,53,0.15) 0%, rgba(255,92,53,0) 70%), radial-gradient(50% 45% at 10% 85%, rgba(0,168,120,0.12) 0%, rgba(0,168,120,0) 70%)",
          }}
        />
        <div className="absolute top-[-10%] right-[-5%] w-[35rem] sm:w-[45rem] h-[35rem] sm:h-[45rem] rounded-full bg-[#FFDED6] blur-3xl opacity-60" />
        <div className="absolute bottom-[-15%] left-[-5%] w-[30rem] sm:w-[40rem] h-[30rem] sm:h-[40rem] rounded-full bg-[#DCEEE9] blur-3xl opacity-70" />
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: "radial-gradient(#181D27 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      {/* Main Content Container — flex-1 + items-stretch forces inner content to fill 100% of vertical space! */}
      <div className="relative flex-1 w-full max-w-none px-4 sm:px-8 lg:px-12 xl:px-16 pt-6 sm:pt-8 lg:pt-10 pb-4 sm:pb-6 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-8 sm:gap-12 lg:gap-16 xl:gap-20 w-full items-stretch flex-1">
          
          {/* LEFT COLUMN — Stretches from top badge down to bottom values strip */}
          <div className="flex flex-col justify-between h-full py-2 z-10">
            <div>
              {/* Animal Welfare Badge */}
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                custom={0}
                className="inline-flex items-center gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full bg-white/90 backdrop-blur-md border border-[#F2E5D5] shadow-sm mb-6 sm:mb-8 w-fit max-w-full"
              >
                <div className="w-5 sm:w-6 h-5 sm:h-6 rounded-full bg-[#FF5C35]/15 flex items-center justify-center shrink-0">
                  <Heart size={13} className="text-[#FF5C35]" fill="currentColor" />
                </div>
                <span className="text-[12px] sm:text-[14px] font-extrabold text-[#181D27] tracking-wide uppercase truncate">
                  Every Purchase Supports Animal Welfare
                </span>
              </motion.div>

              {/* MASSIVE HERO HEADING — Responsive fluid sizing without word wrapping breaks */}
              <motion.h1
                initial={{ opacity: 0, x: -32 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
                className="text-[#181D27] text-4xl sm:text-6xl md:text-7xl lg:text-7xl xl:text-[5.5rem] 2xl:text-8xl font-black leading-[1.05] sm:leading-[0.95] mb-6 sm:mb-8 tracking-tight"
                style={{ fontFamily: "'Baloo 2', sans-serif" }}
              >
                <span className="block break-words">Wear Kindness.</span>
                <span className="block break-words text-[#FF5C35] drop-shadow-sm">
                  Wear FurEver.
                </span>
              </motion.h1>

              {/* Responsive Subtitle */}
              <motion.p
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                custom={0.2}
                className="text-[#4A5568] text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed mb-8 sm:mb-10 max-w-2xl font-medium"
              >
                Premium streetwear cut from fabric that feels as good as it
                looks. Every piece is designed for people who refuse to choose
                between exceptional style and genuine compassion — because
                every order helps an animal find safety.
              </motion.p>

              {/* Responsive Dual CTAs */}
              <div className="flex flex-col sm:flex-row gap-3.5 sm:gap-4 mb-8 sm:mb-10 w-full sm:w-auto">
                <motion.button
                  initial="hidden"
                  animate="visible"
                  variants={fadeUp}
                  custom={0.35}
                  whileHover={{ scale: 1.03, boxShadow: "0 20px 40px -10px rgba(255,92,53,0.4)" }}
                  whileTap={{ scale: 0.98 }}
                  className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 sm:px-10 py-4 sm:py-5 rounded-full bg-[#FF5C35] text-white text-[16px] sm:text-[18px] font-bold hover:bg-[#E04822] transition-all shadow-lg shadow-[#FF5C35]/20 cursor-pointer"
                >
                  Explore Collection
                  <ArrowUpRight size={20} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
                </motion.button>

                <motion.button
                  initial="hidden"
                  animate="visible"
                  variants={fadeUp}
                  custom={0.5}
                  whileHover={{ scale: 1.03, backgroundColor: "rgba(24, 29, 39, 0.05)" }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 rounded-full bg-white/80 border-2 border-[#181D27]/15 text-[#181D27] text-[16px] sm:text-[18px] font-bold hover:border-[#181D27] transition-all cursor-pointer text-center"
                >
                  Our Story
                </motion.button>
              </div>
            </div>

            {/* Values Strip — Anchored to the very bottom of the column, right above the marquee! */}
            <div className="pt-4 sm:pt-6 border-t border-[#F2E5D5] mt-auto">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                custom={0.65}
                className="flex flex-wrap gap-2.5 sm:gap-3.5 mb-2.5 sm:mb-3"
              >
                {VALUES.map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="inline-flex items-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full bg-white/90 border border-[#F2E5D5] backdrop-blur-md shadow-sm"
                  >
                    <Icon size={15} className="text-[#00A878] shrink-0" />
                    <span className="text-[13px] sm:text-[14px] font-bold text-[#181D27]">{label}</span>
                  </div>
                ))}
              </motion.div>

              <motion.p
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                custom={0.8}
                className="text-[#718096] text-xs sm:text-sm font-bold tracking-wider uppercase"
              >
                Designed in-house. Delivered with purpose.
              </motion.p>
            </div>
          </div>

          {/* RIGHT COLUMN — h-full dynamically stretches the white card to touch the bottom boundary! */}
          <div className="relative h-full min-h-[400px] sm:min-h-[480px] md:min-h-[520px] w-full mt-6 lg:mt-0 flex flex-col justify-center">
            
            {/* Main Gradient Card Base — inset-0 forces it to fill 100% of the column height! */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 rounded-[2rem] sm:rounded-[3rem] bg-gradient-to-br from-white via-[#FFFDF9] to-[#F5ECE1] border-2 border-white shadow-[0_25px_60px_-15px_rgba(24,29,39,0.15)] overflow-hidden"
            />

            {/* Animated Glowing Blobs */}
            <motion.div
              animate={{ y: [0, -20, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-[10%] right-[10%] w-36 sm:w-52 h-36 sm:h-52 rounded-full bg-[#FF5C35]/15 blur-2xl"
            />
            <motion.div
              animate={{ y: [0, 18, 0], scale: [1, 1.08, 1] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
              className="absolute bottom-[10%] left-[8%] w-32 sm:w-48 h-32 sm:h-48 rounded-full bg-[#00A878]/15 blur-2xl"
            />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[75%] max-w-[360px] aspect-square rounded-full border border-[#181D27]/[0.06]" />

            {/* Animated SVG Wireframe T-Shirt */}
            <motion.svg
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
              viewBox="0 0 220 240"
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] max-w-[280px] sm:max-w-[320px] h-auto text-[#181D27]/15 drop-shadow-sm"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinejoin="round"
            >
              <path d="M75 18 Q110 2 145 18 L165 38 L195 55 L182 95 L160 88 L160 225 L60 225 L60 88 L38 95 L25 55 L55 38 Z" />
              <path d="M85 18 Q110 34 135 18" />
            </motion.svg>

            {/* Floating Paws Overlay */}
            <div className="absolute top-[6%] left-[6%] flex gap-1.5 sm:gap-2.5 opacity-35">
              {[0, 1, 2].map((i) => (
                <PawPrint key={i} size={14 + i * 3} className="text-[#FF5C35]" fill="currentColor" strokeWidth={0} />
              ))}
            </div>

            {/* FLOATING CARD 1: Made Responsibly */}
            <motion.div
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="absolute top-[6%] left-[5%] sm:top-[8%] sm:left-[6%] bg-white/95 backdrop-blur-md rounded-xl sm:rounded-2xl border border-white shadow-[0_15px_35px_-10px_rgba(24,29,39,0.18)] px-3.5 py-2.5 sm:px-5 sm:py-4 max-w-[150px] sm:max-w-[210px] z-10 cursor-default"
            >
              <p className="text-[#181D27] text-[12px] sm:text-[14px] font-extrabold leading-snug">Made Responsibly</p>
              <p className="text-[#718096] text-[10px] sm:text-[12px] font-medium mt-0.5">Ethical production</p>
            </motion.div>

            {/* FLOATING CARD 2: Small-Batch Drops */}
            <motion.div
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="absolute top-[38%] right-[4%] bg-white/95 backdrop-blur-md rounded-xl sm:rounded-2xl border border-white shadow-[0_15px_35px_-10px_rgba(24,29,39,0.18)] px-3.5 py-2.5 sm:px-5 sm:py-4 flex items-center gap-2.5 sm:gap-3.5 max-w-[165px] sm:max-w-[230px] z-10 cursor-default"
            >
              <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-[#FF5C35]/15 flex items-center justify-center shrink-0">
                <Package size={15} className="text-[#FF5C35] sm:w-[18px] sm:h-[18px]" />
              </div>
              <div>
                <p className="text-[#181D27] text-[12px] sm:text-[14px] font-extrabold leading-snug">Small-Batch</p>
                <p className="text-[#718096] text-[10px] sm:text-[11px] font-medium">Zero waste</p>
              </div>
            </motion.div>

            {/* FLOATING CARD 3: Inspired by Wildlife */}
            <motion.div
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="absolute bottom-[18%] right-[5%] sm:bottom-[16%] sm:right-[8%] bg-white/95 backdrop-blur-md rounded-xl sm:rounded-2xl border border-white shadow-[0_15px_35px_-10px_rgba(24,29,39,0.18)] px-3.5 py-2.5 sm:px-5 sm:py-4 flex items-center gap-2.5 sm:gap-3.5 max-w-[170px] sm:max-w-[230px] z-10 cursor-default"
            >
              <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-[#00A878]/15 flex items-center justify-center shrink-0">
                <Sparkles size={15} className="text-[#00A878] sm:w-[18px] sm:h-[18px]" />
              </div>
              <div>
                <p className="text-[#181D27] text-[12px] sm:text-[14px] font-extrabold leading-snug">Wildlife Inspired</p>
                <p className="text-[#718096] text-[10px] sm:text-[11px] font-medium">10% to rescues</p>
              </div>
            </motion.div>

            {/* FLOATING BADGE 4: Cruelty Free Certified */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -3, scale: 1.03 }}
              className="absolute bottom-[6%] left-[5%] sm:bottom-[7%] sm:left-[6%] bg-[#181D27] rounded-xl sm:rounded-2xl shadow-[0_15px_35px_-10px_rgba(24,29,39,0.45)] px-3.5 py-2.5 sm:px-5 sm:py-3.5 z-10 flex items-center gap-2 sm:gap-2.5 cursor-default"
            >
              <ShieldCheck size={16} className="text-[#00A878] shrink-0 sm:w-[18px] sm:h-[18px]" />
              <span className="text-white text-[11px] sm:text-[13px] font-bold tracking-wider uppercase">Cruelty Free Certified</span>
            </motion.div>
          </div>

        </div>
      </div>

      {/* Infinite Marquee Ticker — Snug, flush, and directly underneath the content! */}
      <div className="relative shrink-0 w-full border-t border-[#F2E5D5] bg-white/80 backdrop-blur-md overflow-hidden py-3.5 sm:py-4 z-20">
        <motion.div
          className="flex gap-10 sm:gap-14 whitespace-nowrap w-max"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
        >
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span
              key={i}
              className="text-[#181D27] text-[12px] sm:text-[14px] tracking-[0.18em] sm:tracking-[0.2em] uppercase font-extrabold flex items-center gap-10 sm:gap-14"
            >
              {item}
              <PawPrint size={12} className="text-[#FF5C35] sm:w-[14px] sm:h-[14px]" fill="currentColor" strokeWidth={0} />
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}