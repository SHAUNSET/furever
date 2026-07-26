import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  SIGNATURE MARK — the same single-stroke fox line drawing used      */
/*  across the FurEver brand (see About.jsx). Here it's scaled up      */
/*  and bled off the edge of the screen as the hero's dominant         */
/*  visual — an animal-inspired form that reads as art, not a logo.    */
/* ------------------------------------------------------------------ */
const FoxMark = ({ className = "", stroke = "#FF6A3D", duration = 2.8, delay = 0.3, opacity = 1 }) => (
  <svg viewBox="0 0 420 380" fill="none" className={className} aria-hidden="true">
    <motion.path
      d="M 300 40
         C 270 30, 250 55, 248 90
         C 246 120, 260 140, 250 150
         C 220 130, 190 122, 150 128
         C 100 136, 55 165, 30 205
         C 48 200, 66 198, 84 204
         C 70 220, 64 240, 70 262
         C 90 250, 108 246, 126 250
         C 118 270, 120 292, 134 310
         C 148 296, 160 288, 176 286
         C 182 306, 198 320, 220 324
         C 218 306, 222 290, 234 278
         C 258 282, 282 274, 300 256
         C 320 236, 328 208, 322 180
         C 340 176, 356 164, 364 146
         C 346 148, 330 144, 318 132
         C 332 118, 336 100, 328 82
         C 316 90, 306 100, 300 114
         C 292 90, 296 62, 300 40 Z"
      stroke={stroke}
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity }}
      transition={{ pathLength: { duration, delay, ease: "easeInOut" }, opacity: { duration: 0.6, delay } }}
    />
    <motion.circle
      cx="252"
      cy="98"
      r="2.5"
      fill={stroke}
      initial={{ opacity: 0 }}
      animate={{ opacity }}
      transition={{ duration: 0.5, delay: delay + duration - 0.3 }}
    />
  </svg>
);

/* ------------------------------------------------------------------ */
/*  GRAIN — a faint SVG turbulence texture over the dark field so the  */
/*  navy doesn't sit flat. Extremely subtle by design.                 */
/* ------------------------------------------------------------------ */
const Grain = () => (
  <svg className="pointer-events-none absolute inset-0 w-full h-full opacity-[0.05] mix-blend-overlay" aria-hidden="true">
    <filter id="furever-grain">
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
      <feColorMatrix type="saturate" values="0" />
    </filter>
    <rect width="100%" height="100%" filter="url(#furever-grain)" />
  </svg>
);

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: 0.15 + i * 0.12, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative w-full min-h-[calc(100vh-96px)] overflow-hidden bg-[#14172E] flex flex-col">
      <Grain />

      {/* ambient coral glow, upper right — the only colour wash in the field */}
      <div
        className="pointer-events-none absolute -top-24 right-[-8%] w-[55vw] h-[55vw] max-w-[640px] max-h-[640px] rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(255,106,61,0.16) 0%, rgba(255,106,61,0) 70%)" }}
      />

      {/* the fox — large, bled off the right edge, sitting behind the type */}
      <div className="pointer-events-none absolute top-1/2 right-[-6%] sm:right-[-4%] -translate-y-1/2 w-[92vw] sm:w-[58vw] max-w-[820px] min-w-[420px] opacity-90">
        <FoxMark stroke="#FF6A3D" opacity={0.85} />
      </div>

      {/* vertical brand statement — the subtle detail, not a badge */}
      <div className="hidden lg:flex absolute top-1/2 right-8 -translate-y-1/2 z-10">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.4 }}
          className="uppercase tracking-[0.35em] text-[11px] whitespace-nowrap"
          style={{
            color: "#A7A6B8",
            writingMode: "vertical-rl",
            transform: "rotate(180deg)",
          }}
        >
          15% of net profits &nbsp;·&nbsp; toward animal welfare
        </motion.p>
      </div>

      {/* main content */}
      <div className="relative z-10 flex-1 w-full px-5 sm:px-10 lg:px-16 xl:px-20 pt-28 sm:pt-32 lg:pt-24 pb-16 flex flex-col justify-center">
        <div className="max-w-[720px]">
          <motion.p
            initial="hidden"
            animate="show"
            custom={0}
            variants={fadeUp}
            className="uppercase tracking-[0.35em] text-xs sm:text-sm mb-6 sm:mb-8"
            style={{ color: "#FF6A3D" }}
          >
            FurEver — First Chapter
          </motion.p>

          <h1
            className="leading-[0.94] text-white"
            style={{
              fontFamily: "'Fraunces', serif",
              fontWeight: 500,
              fontSize: "clamp(2.75rem, 8vw, 6.5rem)",
            }}
          >
            <motion.span initial="hidden" animate="show" custom={1} variants={fadeUp} className="block overflow-hidden">
              WEAR YOUR
            </motion.span>
            <motion.span
              initial="hidden"
              animate="show"
              custom={2}
              variants={fadeUp}
              className="block overflow-hidden"
              style={{ color: "#FF6A3D", fontStyle: "italic" }}
            >
              INSTINCT.
            </motion.span>
          </h1>

          <motion.p
            initial="hidden"
            animate="show"
            custom={3}
            variants={fadeUp}
            className="mt-7 sm:mt-8 max-w-md text-base sm:text-lg leading-relaxed"
            style={{ color: "#A7A6B8" }}
          >
            Animal-inspired essentials for people who trust their instincts —
            and want the things they wear to mean a little more.
          </motion.p>

          <motion.div
            initial="hidden"
            animate="show"
            custom={4}
            variants={fadeUp}
            className="mt-10 sm:mt-12 flex flex-wrap items-center gap-6 sm:gap-8"
          >
            <button
              onClick={() => navigate("/collections")}
              className="group inline-flex items-center gap-3 rounded-full px-7 sm:px-8 py-3.5 sm:py-4 text-sm sm:text-base font-medium transition-transform duration-300 hover:-translate-y-0.5"
              style={{ backgroundColor: "#FF6A3D", color: "#14172E" }}
            >
              Explore Collection
              <ArrowUpRight size={18} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>

            <button
              onClick={() => navigate("/about")}
              className="group relative inline-flex items-center text-sm sm:text-base font-medium pb-1"
              style={{ color: "#FAF7F1" }}
            >
              Our Story
              <span
                className="absolute left-0 -bottom-0.5 h-px w-full origin-left scale-x-100 transition-transform duration-300 group-hover:scale-x-0"
                style={{ backgroundColor: "#FAF7F1" }}
              />
              <span
                className="absolute left-0 -bottom-0.5 h-px w-full origin-right scale-x-0 transition-transform duration-300 group-hover:scale-x-100"
                style={{ backgroundColor: "#FF6A3D" }}
              />
            </button>
          </motion.div>
        </div>

        {/* mobile / tablet version of the brand statement, sits inline instead of vertical */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="lg:hidden mt-14 uppercase tracking-[0.25em] text-[11px]"
          style={{ color: "#6E6D80" }}
        >
          15% of net profits toward animal welfare
        </motion.p>
      </div>

      {/* organic transition into the section below */}
      <div className="relative z-10 shrink-0 h-20 sm:h-28 -mt-4 sm:-mt-6">
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(180deg, rgba(20,23,46,0) 0%, #14172E 55%)" }}
        />
        <svg
          className="absolute bottom-0 left-0 w-full h-full"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M0,80 C360,120 1080,20 1440,70 L1440,120 L0,120 Z" fill="#FAF7F1" />
        </svg>
      </div>
    </section>
  );
}