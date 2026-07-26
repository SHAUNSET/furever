import React, { useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
  ArrowUpRight,
  Phone,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
} from "lucide-react";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import { authDataContext } from "../context/Authcontext.jsx";

/* ------------------------------------------------------------------ */
/*  NOTE ON BACKEND WIRING                                            */
/*  serverUrl comes from authDataContext (the project's existing auth   */
/*  context), same as the rest of the app. This posts to                */
/*  POST /api/contact on that server, forwarding to                     */
/*  shaunak206107@gmail.com with `replyTo` set to the sender's email.    */
/*  If your existing backend route is named differently, update the    */
/*  URL in handleSubmit below to match.                                 */
/* ------------------------------------------------------------------ */

const REASONS = [
  "General Question",
  "Product Question",
  "Collaboration",
  "NGO / Animal Welfare",
  "Feedback",
  "Other",
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] },
  }),
};

/* ------------------------------------------------------------------ */
/*  Signature fox mark, shared with About.jsx / Hero.jsx                */
/* ------------------------------------------------------------------ */
const FoxMark = ({ className = "", stroke = "#FF6A3D", duration = 2.4, delay = 0.3 }) => (
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
      whileInView={{ pathLength: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ pathLength: { duration, delay, ease: "easeInOut" }, opacity: { duration: 0.5, delay } }}
    />
  </svg>
);

function Contact() {
  const { serverUrl } = useContext(authDataContext);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === "loading") return;

    const { name, email, subject, message } = formData;

    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      setStatus("error");
      setErrorMsg("Please fill in every field before sending.");
      return;
    }
    if (!isValidEmail(email)) {
      setStatus("error");
      setErrorMsg("That email address doesn't look quite right.");
      return;
    }

    setStatus("loading");
    setErrorMsg("");

    try {
      const response = await axios.post(
        `${serverUrl}/api/contact`,
        {
          name: name.trim(),
          email: email.trim(),
          subject,
          message: message.trim(),
        },
        { withCredentials: true }
      );

      if (response?.data?.success === false) {
        throw new Error(response?.data?.message || "Something went wrong.");
      }

      setStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setStatus("error");
      setErrorMsg(
        err?.response?.data?.message ||
          "We couldn't send your message right now. Please try again in a moment."
      );
    }
  };

  return (
    <div className="w-full overflow-x-hidden" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <Nav />

      <main className="w-full">
        {/* ============================================================ */}
        {/*  1. CONTACT HERO (FULL VIEWPORT ON LOAD)                     */}
        {/* ============================================================ */}
        <section
          className="relative w-full min-h-[88vh] sm:min-h-[92vh] lg:min-h-[94vh] flex flex-col justify-between overflow-hidden"
          style={{ backgroundColor: "#14172E" }}
        >
          {/* Ambient lighting glow */}
          <div
            className="pointer-events-none absolute -top-24 left-[-6%] w-[50vw] h-[50vw] max-w-[560px] max-h-[560px] rounded-full blur-3xl"
            style={{ background: "radial-gradient(circle, rgba(255,106,61,0.16) 0%, rgba(255,106,61,0) 70%)" }}
          />
          
          {/* Background Fox Graphic */}
          <div className="pointer-events-none absolute top-1/2 right-[-8%] -translate-y-1/2 w-[70vw] sm:w-[36vw] max-w-[460px] min-w-[260px] opacity-[0.35]">
            <FoxMark stroke="#FF6A3D" />
          </div>

          {/* Spacer to balance flex vertical alignment */}
          <div className="h-6 sm:h-12" />

          {/* Main Hero Content - Fluid & Wide */}
          <div className="relative z-10 px-6 sm:px-12 lg:px-20 xl:px-28 2xl:px-36 py-12 my-auto">
            <motion.p
              initial="hidden"
              animate="show"
              custom={0}
              variants={fadeUp}
              className="uppercase tracking-[0.35em] text-xs sm:text-sm mb-6 font-medium"
              style={{ color: "#FF6A3D" }}
            >
              FurEver — Say Hello
            </motion.p>

            <motion.h1
              initial="hidden"
              animate="show"
              custom={1}
              variants={fadeUp}
              className="leading-[0.94] text-white max-w-5xl"
              style={{
                fontFamily: "'Fraunces', serif",
                fontWeight: 500,
                fontSize: "clamp(3rem, 8.5vw, 6.5rem)",
              }}
            >
              WE'RE{" "}
              <span style={{ color: "#FF6A3D", fontStyle: "italic" }}>all ears.</span>
            </motion.h1>

            <motion.p
              initial="hidden"
              animate="show"
              custom={2}
              variants={fadeUp}
              className="mt-7 max-w-xl text-base sm:text-lg lg:text-xl leading-relaxed"
              style={{ color: "#A7A6B8" }}
            >
              Questions, ideas, feedback, or just a hello — every message
              reaches an actual person on the FurEver team.
            </motion.p>
          </div>

          {/* Animated Scroll Indicator */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="relative z-10 pb-8 px-6 sm:px-12 lg:px-20 xl:px-28 2xl:px-36 flex items-center gap-3 text-xs uppercase tracking-[0.25em]"
            style={{ color: "#8A8996" }}
          >
            <span>Scroll to explore</span>
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            >
              <ChevronDown size={14} style={{ color: "#FF6A3D" }} />
            </motion.div>
          </motion.div>
        </section>

        {/* ============================================================ */}
        {/*  2. MAIN CONTACT EXPERIENCE (FULL DEVICE WIDTH)              */}
        {/* ============================================================ */}
        <section
          className="relative w-full py-24 sm:py-32 lg:py-40 xl:py-48 px-6 sm:px-12 lg:px-20 xl:px-28 2xl:px-36"
          style={{ backgroundColor: "#FAF7F1" }}
        >
          {/* Unboxed Full-Width Grid */}
          <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 xl:gap-28 items-start">
            
            {/* left — editorial intro (Unboxed & Scaled) */}
            <div className="lg:col-span-5 xl:col-span-5 lg:sticky lg:top-32">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6 }}
                className="uppercase tracking-[0.3em] text-xs sm:text-sm mb-6 sm:mb-8 font-semibold"
                style={{ color: "#FF6A3D" }}
              >
                Get In Touch
              </motion.p>

              <motion.h2
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, delay: 0.05 }}
                className="leading-[1.05]"
                style={{
                  fontFamily: "'Fraunces', serif",
                  fontWeight: 400,
                  fontSize: "clamp(2.2rem, 4vw, 3.75rem)",
                  color: "#14172E",
                }}
              >
                The conversations behind FurEver.
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="mt-6 sm:mt-8 text-lg sm:text-xl leading-relaxed max-w-lg"
                style={{ color: "#5B5A68" }}
              >
                Whether you're curious about a product, have an idea for a
                collaboration, or just want to say hello — we're listening and ready to build together.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, delay: 0.18 }}
                className="mt-12 sm:mt-16 pl-6 sm:pl-8 border-l-2"
                style={{ borderColor: "#FF6A3D" }}
              >
                <p
                  className="text-2xl sm:text-3xl xl:text-4xl leading-snug italic"
                  style={{ fontFamily: "'Fraunces', serif", color: "#14172E" }}
                >
                  Wear something.
                  <br />
                  Mean something.
                </p>
              </motion.div>
            </div>

            {/* right — the form (Expansive Widescreen Card) */}
            <div className="lg:col-span-7 xl:col-span-7 w-full">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.7 }}
                className="relative rounded-[2rem] sm:rounded-[2.75rem] p-8 sm:p-12 lg:p-16 xl:p-20 shadow-[0_30px_80px_-20px_rgba(20,23,46,0.15)] border border-stone-200/60 w-full"
                style={{ backgroundColor: "#FFFFFF" }}
              >
                <AnimatePresence mode="wait">
                  {status === "success" ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.97 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      className="flex flex-col items-center text-center py-16 sm:py-24"
                    >
                      <div
                        className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
                        style={{ backgroundColor: "rgba(255,106,61,0.12)" }}
                      >
                        <CheckCircle2 size={32} style={{ color: "#FF6A3D" }} />
                      </div>
                      <h3
                        className="text-3xl sm:text-4xl mb-4"
                        style={{ fontFamily: "'Fraunces', serif", color: "#14172E" }}
                      >
                        Message sent.
                      </h3>
                      <p className="text-base sm:text-lg max-w-md leading-relaxed" style={{ color: "#5B5A68" }}>
                        Thank you for reaching out — we read every message,
                        and someone from FurEver will get back to you soon.
                      </p>
                      <button
                        onClick={() => setStatus("idle")}
                        className="mt-10 text-base font-semibold underline underline-offset-8 transition-opacity hover:opacity-80"
                        style={{ color: "#FF6A3D" }}
                      >
                        Send another message
                      </button>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4 }}
                      onSubmit={handleSubmit}
                      noValidate
                      className="space-y-8 w-full"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <div>
                          <label
                            htmlFor="name"
                            className="block text-xs uppercase tracking-[0.2em] mb-3 font-semibold"
                            style={{ color: "#8A8996" }}
                          >
                            Name
                          </label>
                          <input
                            id="name"
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Your name"
                            className="w-full rounded-2xl px-5 py-4 sm:py-5 text-base sm:text-lg outline-none border transition-all duration-300 focus:border-[#FF6A3D] focus:ring-4 focus:ring-[#FF6A3D]/10"
                            style={{ borderColor: "#E7E3D9", color: "#14172E", backgroundColor: "#FAF7F1" }}
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="email"
                            className="block text-xs uppercase tracking-[0.2em] mb-3 font-semibold"
                            style={{ color: "#8A8996" }}
                          >
                            Email
                          </label>
                          <input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            className="w-full rounded-2xl px-5 py-4 sm:py-5 text-base sm:text-lg outline-none border transition-all duration-300 focus:border-[#FF6A3D] focus:ring-4 focus:ring-[#FF6A3D]/10"
                            style={{ borderColor: "#E7E3D9", color: "#14172E", backgroundColor: "#FAF7F1" }}
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="subject"
                          className="block text-xs uppercase tracking-[0.2em] mb-3 font-semibold"
                          style={{ color: "#8A8996" }}
                        >
                          Subject
                        </label>
                        <div className="relative">
                          <select
                            id="subject"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            className="w-full appearance-none rounded-2xl px-5 py-4 sm:py-5 text-base sm:text-lg outline-none border transition-all duration-300 focus:border-[#FF6A3D] focus:ring-4 focus:ring-[#FF6A3D]/10 cursor-pointer"
                            style={{ borderColor: "#E7E3D9", color: "#14172E", backgroundColor: "#FAF7F1" }}
                          >
                            <option value="" disabled>
                              Choose a reason for contact
                            </option>
                            {REASONS.map((reason) => (
                              <option key={reason} value={reason}>
                                {reason}
                              </option>
                            ))}
                          </select>
                          <ChevronDown
                            size={20}
                            className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2"
                            style={{ color: "#8A8996" }}
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="message"
                          className="block text-xs uppercase tracking-[0.2em] mb-3 font-semibold"
                          style={{ color: "#8A8996" }}
                        >
                          Message
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          rows={6}
                          value={formData.message}
                          onChange={handleChange}
                          placeholder="Tell us what's on your mind..."
                          className="w-full rounded-2xl px-5 py-4 sm:py-5 text-base sm:text-lg outline-none border transition-all duration-300 focus:border-[#FF6A3D] focus:ring-4 focus:ring-[#FF6A3D]/10 resize-none"
                          style={{ borderColor: "#E7E3D9", color: "#14172E", backgroundColor: "#FAF7F1" }}
                        />
                      </div>

                      <AnimatePresence>
                        {status === "error" && (
                          <motion.div
                            initial={{ opacity: 0, y: -6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            className="flex items-center gap-3 rounded-2xl px-5 py-4"
                            style={{ backgroundColor: "rgba(255,106,61,0.08)" }}
                          >
                            <AlertCircle size={20} className="shrink-0" style={{ color: "#FF6A3D" }} />
                            <p className="text-base font-medium" style={{ color: "#14172E" }}>
                              {errorMsg}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div className="pt-2">
                        <button
                          type="submit"
                          disabled={status === "loading"}
                          className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-full px-10 py-5 text-base sm:text-lg font-semibold transition-all duration-300 hover:-translate-y-1 hover:shadow-xl disabled:opacity-70 disabled:hover:translate-y-0"
                          style={{ backgroundColor: "#FF6A3D", color: "#14172E" }}
                        >
                          {status === "loading" ? (
                            <>
                              <Loader2 size={20} className="animate-spin" />
                              Sending...
                            </>
                          ) : (
                            <>
                              Send Message
                              <ArrowUpRight
                                size={20}
                                className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                              />
                            </>
                          )}
                        </button>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>

          </div>
        </section>

        {/* ============================================================ */}
        {/*  3. DIRECT FOUNDER CONTACT (MASSIVE EXPANSIVE PANELS)        */}
        {/* ============================================================ */}
        <section
          className="relative w-full py-24 sm:py-32 lg:py-40 xl:py-44 px-6 sm:px-12 lg:px-20 xl:px-28 2xl:px-36"
          style={{ backgroundColor: "#14172E" }}
        >
          {/* Edge-to-Edge Wide Layout */}
          <div className="w-full">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6 }}
              className="uppercase tracking-[0.3em] text-xs sm:text-sm mb-6 font-semibold"
              style={{ color: "#FF6A3D" }}
            >
              The People Behind FurEver
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: 0.05 }}
              className="max-w-3xl leading-[1.05] mb-16 sm:mb-20"
              style={{
                fontFamily: "'Fraunces', serif",
                fontWeight: 400,
                fontSize: "clamp(2rem, 4vw, 3.5rem)",
                color: "#FAF7F1",
              }}
            >
              Prefer to talk directly? Reach out to either of us.
            </motion.h2>

            {/* Massive Full-Width Interactive Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 w-full">
              {[
                { name: "Shaunak Naik", phone: "9833953312" },
                { name: "Nikhil Take", phone: "9309449724" },
              ].map((founder, i) => (
                <motion.a
                  key={founder.name}
                  href={`tel:${founder.phone}`}
                  initial={{ opacity: 0, y: 26 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.6, delay: i * 0.12 }}
                  whileHover={{ y: -6, scale: 1.01 }}
                  className="group relative flex items-center justify-between rounded-[2.25rem] px-8 sm:px-12 lg:px-16 py-10 sm:py-14 lg:py-16 border transition-all duration-300 hover:border-[#FF6A3D]/60 hover:shadow-[0_20px_50px_rgba(0,0,0,0.4)] w-full"
                  style={{ borderColor: "rgba(250,247,241,0.15)", backgroundColor: "rgba(255,255,255,0.02)" }}
                >
                  <div>
                    <p
                      className="text-2xl sm:text-3xl lg:text-4xl mb-2 sm:mb-3 font-normal transition-colors duration-300 group-hover:text-[#FF6A3D]"
                      style={{ fontFamily: "'Fraunces', serif", color: "#FAF7F1" }}
                    >
                      {founder.name}
                    </p>
                    <p
                      className="text-base sm:text-lg lg:text-xl tracking-wider font-mono"
                      style={{ color: "#A7A6B8" }}
                    >
                      {founder.phone}
                    </p>
                  </div>

                  <div
                    className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 shrink-0 shadow-lg"
                    style={{ backgroundColor: "#FF6A3D" }}
                  >
                    <Phone className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" style={{ color: "#14172E" }} />
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/*  CLOSING STATEMENT                                           */}
        {/* ============================================================ */}
        <section
          className="w-full py-24 sm:py-32 lg:py-36 px-6 sm:px-12 lg:px-20 text-center"
          style={{ backgroundColor: "#FAF7F1" }}
        >
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="max-w-4xl mx-auto leading-[1.05]"
            style={{
              fontFamily: "'Fraunces', serif",
              fontWeight: 400,
              fontSize: "clamp(2rem, 4.5vw, 3.5rem)",
              color: "#14172E",
            }}
          >
            It all starts with{" "}
            <span style={{ color: "#FF6A3D", fontStyle: "italic" }}>a message.</span>
          </motion.h3>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Contact;