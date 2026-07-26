import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ChevronDown, MoveRight } from "lucide-react";
import Nav from "../components/Nav";
import Footer from "../components/Footer";

/* ------------------------------------------------------------------ */
/*  FONTS                                                              */
/*  Fraunces (editorial display serif) + Inter (body/utility sans)     */
/*  Injected once so the page doesn't depend on index.html edits.      */
/* ------------------------------------------------------------------ */
const useBrandFonts = () => {
  useEffect(() => {
    const id = "furever-about-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400;1,9..144,500&family=Inter:wght@400;500;600&display=swap";
    document.head.appendChild(link);
  }, []);
};

/* ------------------------------------------------------------------ */
/*  SIGNATURE MARK — a single continuous line-drawing of a fox in      */
/*  profile. Drawn with framer-motion's pathLength so it feels hand-   */
/*  sketched rather than like stock iconography.                       */
/* ------------------------------------------------------------------ */
const FoxMark = ({ className = "", stroke = "#FF6A3D", duration = 2.2, delay = 0 }) => (
  <svg
    viewBox="0 0 420 380"
    fill="none"
    className={className}
    aria-hidden="true"
  >
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
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={{ pathLength: 0, opacity: 0 }}
      whileInView={{ pathLength: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ pathLength: { duration, delay, ease: "easeInOut" }, opacity: { duration: 0.4, delay } }}
    />
    <motion.circle
      cx="252"
      cy="98"
      r="2.5"
      fill={stroke}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: delay + duration - 0.2 }}
    />
  </svg>
);

/* ------------------------------------------------------------------ */
/*  SHARED MOTION VARIANTS                                             */
/* ------------------------------------------------------------------ */
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function About() {
  useBrandFonts();
  const navigate = useNavigate();

  const storyRef = useRef(null);
  const scrollToStory = () =>
    storyRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  const { scrollYProgress: heroProgress } = useScroll();
  const foxDrift = useTransform(heroProgress, [0, 0.15], [0, -40]);

  return (
    <div
      className="w-full overflow-x-hidden"
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      <Nav />

      <main className="w-full">
        {/* ============================================================ */}
        {/*  1. HERO — THE BRAND STATEMENT                                 */}
        {/* ============================================================ */}
        <section
          className="relative w-full min-h-[92vh] flex flex-col justify-between overflow-hidden"
          style={{ backgroundColor: "#14172E" }}
        >
          {/* ambient gradient glow */}
          <div
            className="pointer-events-none absolute -top-32 right-[-10%] w-[60vw] h-[60vw] max-w-[720px] max-h-[720px] rounded-full blur-3xl"
            style={{
              background:
                "radial-gradient(circle, rgba(255,106,61,0.20) 0%, rgba(255,106,61,0.00) 70%)",
            }}
          />
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(180deg, rgba(20,23,46,0) 60%, rgba(20,23,46,0.9) 100%)",
            }}
          />

          {/* fox mark, large, right side */}
          <motion.div
            style={{ y: foxDrift }}
            className="absolute top-[10%] right-[2%] w-[46vw] max-w-[520px] min-w-[260px] opacity-[0.55]"
          >
            <FoxMark stroke="#FF6A3D" duration={2.6} delay={0.4} />
          </motion.div>

          <div className="relative z-10 flex-1 flex flex-col justify-center px-6 sm:px-10 lg:px-20 pt-28 lg:pt-24">
            <motion.p
              initial="hidden"
              animate="show"
              variants={fadeUp}
              className="uppercase tracking-[0.35em] text-xs sm:text-sm mb-6 sm:mb-8"
              style={{ color: "#FF6A3D" }}
            >
              FurEver — Animal-Inspired Lifestyle
            </motion.p>

            <motion.h1
              initial="hidden"
              animate="show"
              custom={1}
              variants={fadeUp}
              className="leading-[0.92] text-white"
              style={{
                fontFamily: "'Fraunces', serif",
                fontWeight: 500,
                fontSize: "clamp(3rem, 9.5vw, 8.5rem)",
              }}
            >
              WEAR WHAT
              <br />
              YOU{" "}
              <span style={{ color: "#FF6A3D", fontStyle: "italic" }}>
                believe
              </span>{" "}
              IN.
            </motion.h1>

            <motion.p
              initial="hidden"
              animate="show"
              custom={2}
              variants={fadeUp}
              className="mt-8 max-w-xl text-base sm:text-lg leading-relaxed"
              style={{ color: "#A7A6B8" }}
            >
              FurEver is an animal-inspired lifestyle brand creating things
              people genuinely want to wear — while building a business with
              a purpose beyond the product.
            </motion.p>

            <motion.div
              initial="hidden"
              animate="show"
              custom={3}
              variants={fadeUp}
              className="mt-10 flex flex-wrap items-center gap-4 sm:gap-6"
            >
              <button
                onClick={scrollToStory}
                className="group inline-flex items-center gap-3 rounded-full px-7 py-3.5 text-sm sm:text-base font-medium transition-transform duration-300 hover:-translate-y-0.5"
                style={{ backgroundColor: "#FF6A3D", color: "#14172E" }}
              >
                Our Story
                <ChevronDown
                  size={18}
                  className="transition-transform duration-300 group-hover:translate-y-0.5"
                />
              </button>

              <button
                onClick={() => navigate("/collections")}
                className="group inline-flex items-center gap-2 text-sm sm:text-base font-medium border-b border-transparent hover:border-current pb-1 transition-colors"
                style={{ color: "#FAF7F1" }}
              >
                Explore Collection
                <ArrowRight
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </button>
            </motion.div>
          </div>

          <motion.button
            onClick={scrollToStory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ delay: 1.1, duration: 0.8 }}
            className="relative z-10 mx-auto mb-8 flex flex-col items-center gap-2 text-xs tracking-[0.3em] uppercase"
            style={{ color: "#A7A6B8" }}
            aria-label="Scroll to story"
          >
            Scroll
            <motion.span
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            >
              <ChevronDown size={16} />
            </motion.span>
          </motion.button>
        </section>

        {/* ============================================================ */}
        {/*  2. THE STORY + OUR MISSION                                    */}
        {/* ============================================================ */}
        <section
          ref={storyRef}
          className="relative w-full py-28 sm:py-36 lg:py-44 px-6 sm:px-10 lg:px-20"
          style={{ backgroundColor: "#FAF7F1" }}
        >
          <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-10 items-start">
            {/* copy column */}
            <div className="lg:col-span-7 lg:pr-8">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6 }}
                className="uppercase tracking-[0.3em] text-xs sm:text-sm mb-8"
                style={{ color: "#FF6A3D" }}
              >
                Our Story
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, delay: 0.05 }}
                className="text-2xl sm:text-3xl lg:text-4xl leading-snug"
                style={{ fontFamily: "'Fraunces', serif", fontWeight: 400, color: "#14172E" }}
              >
                People care about animals. People also want to buy things
                that feel like a reflection of who they are. FurEver exists
                at the intersection of those two truths.
              </motion.p>

              <motion.blockquote
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="my-12 sm:my-16 pl-6 sm:pl-8 border-l-2"
                style={{ borderColor: "#FF6A3D" }}
              >
                <p
                  className="text-xl sm:text-2xl lg:text-3xl leading-snug italic"
                  style={{ fontFamily: "'Fraunces', serif", color: "#14172E" }}
                >
                  "Impact should not be something added after the business
                  is built. It should be part of the way the business is
                  built."
                </p>
              </motion.blockquote>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, delay: 0.15 }}
                className="space-y-6 text-base sm:text-lg leading-relaxed max-w-xl"
                style={{ color: "#5B5A68" }}
              >
                <p>
                  We're starting with clothing — but the product always
                  comes first. FurEver should never feel like a mediocre
                  product you buy to feel good about a cause. It should feel
                  like something you genuinely love wearing, made even
                  better by what it's connected to.
                </p>
                <p>
                  That's why our mission isn't a marketing campaign attached
                  to a product. It's built into how the business runs.
                  FurEver intends to contribute{" "}
                  <span
                    style={{
                      fontFamily: "'Fraunces', serif",
                      fontStyle: "italic",
                      color: "#FF6A3D",
                      fontSize: "1.3em",
                    }}
                  >
                    15%
                  </span>{" "}
                  of net profits toward animal welfare — not as an
                  afterthought, but as part of the design.
                </p>
              </motion.div>
            </div>

            {/* visual column */}
            <div className="lg:col-span-5 relative min-h-[420px] sm:min-h-[520px]">
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0 rounded-[2rem] overflow-hidden"
                style={{
                  background:
                    "linear-gradient(155deg, #14172E 0%, #1E2244 55%, #14172E 100%)",
                }}
              >
                <div
                  className="absolute -bottom-16 -left-16 w-72 h-72 rounded-full blur-3xl"
                  style={{ background: "rgba(255,106,61,0.25)" }}
                />
                <div className="absolute inset-0 flex items-center justify-center p-10">
                  <FoxMark
                    stroke="#FAF7F1"
                    className="w-full max-w-[300px] opacity-90"
                    duration={2}
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.7, delay: 0.25 }}
                className="absolute -bottom-8 -left-6 sm:-left-10 right-10 sm:right-16 rounded-2xl px-6 py-5 shadow-xl"
                style={{ backgroundColor: "#FFFFFF" }}
              >
                <p
                  className="text-sm sm:text-base leading-snug"
                  style={{ color: "#14172E" }}
                >
                  Product first. Purpose built in. Nothing bolted on
                  afterward.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/*  3. THE FUTURE — CLOSING BRAND VISION                          */}
        {/* ============================================================ */}
        <section
          className="relative w-full py-28 sm:py-36 lg:py-44 px-6 sm:px-10 lg:px-20 overflow-hidden"
          style={{ backgroundColor: "#14172E" }}
        >
          <div
            className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[900px] max-h-[900px] rounded-full blur-3xl opacity-40"
            style={{
              background:
                "radial-gradient(circle, rgba(255,106,61,0.14) 0%, rgba(255,106,61,0) 70%)",
            }}
          />

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.35 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="absolute -bottom-10 -right-10 w-[40vw] max-w-[380px] min-w-[220px] scale-x-[-1]"
          >
            <FoxMark stroke="#FF6A3D" duration={2.2} />
          </motion.div>

          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6 }}
              className="uppercase tracking-[0.3em] text-xs sm:text-sm mb-8"
              style={{ color: "#FF6A3D" }}
            >
              What's Next
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: 0.05 }}
              className="leading-[1.05]"
              style={{
                fontFamily: "'Fraunces', serif",
                fontWeight: 400,
                fontSize: "clamp(1.9rem, 4.5vw, 3.4rem)",
                color: "#FAF7F1",
              }}
            >
              FurEver begins with clothing.
              <br />
              <span style={{ fontStyle: "italic", color: "#FF6A3D" }}>
                The ambition is bigger.
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="mt-8 text-base sm:text-lg leading-relaxed max-w-xl mx-auto"
              style={{ color: "#A7A6B8" }}
            >
              Over time, we want FurEver to grow beyond apparel — into
              products, experiences, and collaborations that stay connected
              to the same idea: things people genuinely want, built around
              something that matters.
            </motion.p>

            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: 0.18 }}
              className="mt-16 sm:mt-20 tracking-tight"
              style={{
                fontFamily: "'Fraunces', serif",
                fontWeight: 500,
                fontSize: "clamp(2rem, 6vw, 4.5rem)",
                color: "#FFFFFF",
              }}
            >
              WE'RE JUST GETTING STARTED.
            </motion.h3>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="mt-12 flex flex-wrap items-center justify-center gap-4 sm:gap-6"
            >
              <button
                onClick={() => navigate("/collections")}
                className="group inline-flex items-center gap-3 rounded-full px-7 py-3.5 text-sm sm:text-base font-medium transition-transform duration-300 hover:-translate-y-0.5"
                style={{ backgroundColor: "#FF6A3D", color: "#14172E" }}
              >
                Explore Collection
                <MoveRight
                  size={18}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </button>

              <button
                onClick={() => navigate("/contact")}
                className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm sm:text-base font-medium border transition-colors duration-300 hover:bg-white/5"
                style={{ borderColor: "#FAF7F1", color: "#FAF7F1" }}
              >
                Get in Touch
              </button>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}