import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  ArrowRight,
  PawPrint,
  Heart,
  MapPin,
  Phone,
} from "lucide-react";
import {
  FaInstagram,
  FaFacebookF,
  FaTwitter,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function Footer() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();

    if (!email.trim()) return;

    setSubscribed(true);
    setEmail("");
  };

  return (
    <footer className="w-full bg-[#14172E] text-white overflow-hidden">

      {/* =====================================================
          TOP BRAND + NEWSLETTER SECTION
      ===================================================== */}

      <section className="relative w-full border-b border-white/10">

        {/* Background Decoration */}

        <div className="absolute -top-48 -right-48 w-[600px] h-[600px] rounded-full bg-[#FF6A3D]/10 blur-3xl pointer-events-none" />

        <div className="absolute -bottom-48 -left-48 w-[600px] h-[600px] rounded-full bg-[#FF6A3D]/5 blur-3xl pointer-events-none" />

        <div className="relative z-10 w-full px-8 sm:px-12 md:px-16 lg:px-24 xl:px-32 2xl:px-44 py-24 lg:py-32">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-32 items-center">

            {/* BRAND MESSAGE */}

            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >

              <div className="flex items-center gap-5 mb-8">

                <div className="w-20 h-20 rounded-3xl bg-[#FF6A3D] flex items-center justify-center shadow-xl">

                  <PawPrint
                    size={42}
                    strokeWidth={1.7}
                  />

                </div>

                <h2
                  className="text-5xl sm:text-6xl font-bold"
                  style={{
                    fontFamily: "'Baloo 2', sans-serif",
                  }}
                >
                  Fur<span className="text-[#FF6A3D]">Ever</span>
                </h2>

              </div>

              <h3 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] max-w-3xl">

                Wear something you{" "}

                <span className="text-[#FF6A3D]">
                  believe in.
                </span>

              </h3>

              <p className="mt-8 text-[#BFC1CF] text-lg sm:text-xl leading-relaxed max-w-2xl">

                FurEver is more than just a clothing brand. We are building
                a community that believes style can carry a message, create
                conversations and make a difference.

              </p>

              <div className="flex items-center gap-3 mt-8 text-[#FF8C68]">

                <Heart
                  size={23}
                  className="fill-[#FF6A3D]"
                />

                <span className="text-base sm:text-lg">
                  Fashion with a purpose.
                </span>

              </div>

            </motion.div>


            {/* NEWSLETTER CARD */}

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="
                w-full
                bg-white/5
                border
                border-white/10
                rounded-[36px]
                p-8
                sm:p-12
                lg:p-14
                backdrop-blur-sm
              "
            >

              <div className="flex items-center gap-5 mb-7">

                <div className="w-16 h-16 rounded-2xl bg-[#FF6A3D]/15 flex items-center justify-center text-[#FF6A3D]">

                  <Mail size={30} />

                </div>

                <div>

                  <h4 className="text-2xl sm:text-3xl font-bold">
                    Stay in the loop
                  </h4>

                  <p className="text-[#AEB0BD] text-base mt-2">
                    Get the latest from FurEver.
                  </p>

                </div>

              </div>

              <p className="text-[#BFC1CF] text-base sm:text-lg leading-relaxed mb-8">

                Be the first to know about new collections, exclusive drops
                and stories from our community.

              </p>

              {!subscribed ? (

                <form
                  onSubmit={handleSubscribe}
                  className="flex flex-col sm:flex-row gap-4"
                >

                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="
                      flex-1
                      min-w-0
                      bg-white/10
                      border
                      border-white/10
                      rounded-2xl
                      px-6
                      py-5
                      text-white
                      text-base
                      placeholder:text-[#8E90A0]
                      outline-none
                      focus:border-[#FF6A3D]
                      transition-all
                    "
                  />

                  <button
                    type="submit"
                    className="
                      px-8
                      py-5
                      rounded-2xl
                      bg-[#FF6A3D]
                      text-white
                      font-semibold
                      text-base
                      flex
                      items-center
                      justify-center
                      gap-3
                      hover:bg-white
                      hover:text-[#14172E]
                      transition-all
                      duration-300
                      whitespace-nowrap
                    "
                  >

                    Join Us

                    <ArrowRight size={20} />

                  </button>

                </form>

              ) : (

                <div className="rounded-2xl bg-[#FF6A3D]/10 border border-[#FF6A3D]/30 px-6 py-5 text-[#FFB09A] font-medium text-base">

                  You're officially part of the FurEver community. 🐾

                </div>

              )}

            </motion.div>

          </div>

        </div>

      </section>


      {/* =====================================================
          FOOTER LINKS
      ===================================================== */}

      <section className="w-full">

        <div className="w-full px-8 sm:px-12 md:px-16 lg:px-24 xl:px-32 2xl:px-44 py-20 lg:py-28">

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-14 lg:gap-20">

            {/* ABOUT */}

            <div>

              <h4 className="text-2xl font-bold mb-7">
                About FurEver
              </h4>

              <p className="text-[#AEB0BD] leading-relaxed text-base sm:text-lg max-w-sm">

                A purpose-driven clothing brand creating products that
                represent individuality, community and compassion.

              </p>

              {/* SOCIAL ICONS */}

              <div className="flex items-center gap-4 mt-9">

                <a
                  href="#"
                  aria-label="Instagram"
                  className="
                    w-14
                    h-14
                    rounded-full
                    bg-white/5
                    border
                    border-white/10
                    flex
                    items-center
                    justify-center
                    text-[#BFC1CF]
                    hover:bg-[#FF6A3D]
                    hover:text-white
                    hover:border-[#FF6A3D]
                    transition-all
                    duration-300
                  "
                >

                  <FaInstagram size={22} />

                </a>

                <a
                  href="#"
                  aria-label="Facebook"
                  className="
                    w-14
                    h-14
                    rounded-full
                    bg-white/5
                    border
                    border-white/10
                    flex
                    items-center
                    justify-center
                    text-[#BFC1CF]
                    hover:bg-[#FF6A3D]
                    hover:text-white
                    hover:border-[#FF6A3D]
                    transition-all
                    duration-300
                  "
                >

                  <FaFacebookF size={20} />

                </a>

                <a
                  href="#"
                  aria-label="Twitter"
                  className="
                    w-14
                    h-14
                    rounded-full
                    bg-white/5
                    border
                    border-white/10
                    flex
                    items-center
                    justify-center
                    text-[#BFC1CF]
                    hover:bg-[#FF6A3D]
                    hover:text-white
                    hover:border-[#FF6A3D]
                    transition-all
                    duration-300
                  "
                >

                  <FaTwitter size={20} />

                </a>

                <a
                  href="mailto:shaunak206107@gmail.com"
                  aria-label="Email"
                  className="
                    w-14
                    h-14
                    rounded-full
                    bg-white/5
                    border
                    border-white/10
                    flex
                    items-center
                    justify-center
                    text-[#BFC1CF]
                    hover:bg-[#FF6A3D]
                    hover:text-white
                    hover:border-[#FF6A3D]
                    transition-all
                    duration-300
                  "
                >

                  <Mail size={22} />

                </a>

              </div>

            </div>


            {/* SHOP */}

            <div>

              <h4 className="text-2xl font-bold mb-7">
                Shop
              </h4>

              <div className="flex flex-col gap-5 text-[#AEB0BD] text-base sm:text-lg">

                <button
                  onClick={() => navigate("/collections")}
                  className="text-left hover:text-[#FF6A3D] transition-colors"
                >
                  All Collections
                </button>

                <button
                  onClick={() => navigate("/collections?filter=bestseller")}
                  className="text-left hover:text-[#FF6A3D] transition-colors"
                >
                  Best Sellers
                </button>

                <button
                  onClick={() => navigate("/collections?category=men")}
                  className="text-left hover:text-[#FF6A3D] transition-colors"
                >
                  Men's Collection
                </button>

                <button
                  onClick={() => navigate("/collections?category=women")}
                  className="text-left hover:text-[#FF6A3D] transition-colors"
                >
                  Women's Collection
                </button>

              </div>

            </div>


            {/* EXPLORE */}

            <div>

              <h4 className="text-2xl font-bold mb-7">
                Explore
              </h4>

              <div className="flex flex-col gap-5 text-[#AEB0BD] text-base sm:text-lg">

                <button
                  onClick={() => navigate("/")}
                  className="text-left hover:text-[#FF6A3D] transition-colors"
                >
                  Home
                </button>

                <button
                  onClick={() => navigate("/about")}
                  className="text-left hover:text-[#FF6A3D] transition-colors"
                >
                  Our Story
                </button>

                <button
                  onClick={() => navigate("/contact")}
                  className="text-left hover:text-[#FF6A3D] transition-colors"
                >
                  Contact Us
                </button>

                <button
                  onClick={() => navigate("/about")}
                  className="text-left hover:text-[#FF6A3D] transition-colors"
                >
                  Our Mission
                </button>

              </div>

            </div>


            {/* CONTACT */}

            <div>

              <h4 className="text-2xl font-bold mb-7">
                Get In Touch
              </h4>

              <div className="flex flex-col gap-6 text-[#AEB0BD] text-base sm:text-lg">

                <div className="flex items-start gap-4">

                  <Mail
                    size={22}
                    className="text-[#FF6A3D] shrink-0 mt-1"
                  />

                  <span>
                    shaunak206107@gmail.com
                  </span>

                </div>

                <div className="flex items-start gap-4">

                  <MapPin
                    size={22}
                    className="text-[#FF6A3D] shrink-0 mt-1"
                  />

                  <span>
                    Pune, Maharashtra
                  </span>

                </div>

                <div className="flex items-start gap-4">

                  <Phone
                    size={22}
                    className="text-[#FF6A3D] shrink-0 mt-1"
                  />

                  <span>
                    Customer support available through email.
                  </span>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          MISSION BANNER
      ===================================================== */}

      <section className="w-full border-t border-b border-white/10">

        <div className="w-full px-8 sm:px-12 md:px-16 lg:px-24 xl:px-32 2xl:px-44 py-8 lg:py-10">

          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 text-center lg:text-left">

            <div className="flex items-center gap-4">

              <Heart
                size={26}
                className="text-[#FF6A3D] fill-[#FF6A3D] shrink-0"
              />

              <p className="text-[#BFC1CF] text-base sm:text-lg">

                Every purchase helps us move closer to a better tomorrow.

              </p>

            </div>

            <button
              onClick={() => navigate("/about")}
              className="
                text-[#FF6A3D]
                font-semibold
                text-base
                flex
                items-center
                gap-3
                hover:text-white
                transition-colors
              "
            >

              Discover Our Mission

              <ArrowRight size={20} />

            </button>

          </div>

        </div>

      </section>


      {/* =====================================================
          BOTTOM BAR
      ===================================================== */}

      <section className="w-full">

        <div className="w-full px-8 sm:px-12 md:px-16 lg:px-24 xl:px-32 2xl:px-44 py-8">

          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 text-center lg:text-left">

            <p className="text-[#777A8D] text-sm sm:text-base">

              © {new Date().getFullYear()} FurEver. All rights reserved.

            </p>

            <div className="flex flex-wrap justify-center items-center gap-6 text-[#777A8D] text-sm sm:text-base">

              <button className="hover:text-white transition-colors">
                Privacy Policy
              </button>

              <button className="hover:text-white transition-colors">
                Terms & Conditions
              </button>

            </div>

            <p className="text-[#777A8D] text-sm sm:text-base flex items-center gap-2">

              Made with

              <Heart
                size={16}
                className="text-[#FF6A3D] fill-[#FF6A3D]"
              />

              for the community

            </p>

          </div>

        </div>

      </section>

    </footer>
  );
}

export default Footer;