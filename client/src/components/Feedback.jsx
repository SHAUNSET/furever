import React, { useContext, useState } from "react";
import { motion } from "framer-motion";
import {
  MessageCircleHeart,
  HeartHandshake,
  Star,
  ArrowRight,
  PawPrint,
  CheckCircle2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { userDataContext } from "../context/UserContext.jsx";
import { authDataContext } from "../context/Authcontext.jsx";

function Feedback() {
  const navigate = useNavigate();

  const { userData } = useContext(userDataContext);
  const { serverUrl } = useContext(authDataContext);

  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0);

  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();

    // If user is not logged in
    if (!userData) {
      navigate("/login", {
        state: {
          from: "/",
          message: "Please login to share your feedback.",
        },
      });

      return;
    }

    // Validate feedback
    if (!feedback.trim() || rating === 0) {
      return;
    }

    try {
      setSending(true);

      const result = await axios.post(
        `${serverUrl}/api/feedback/send`,
        {
          name: userData.name,
          email: userData.email,
          feedback,
          rating,
        },
        {
          withCredentials: true,
        }
      );

      if (result.data.success) {
        setSubmitted(true);

        setFeedback("");
        setRating(0);
      }

    } catch (error) {
      console.log("Feedback Error:", error);

    } finally {
      setSending(false);
    }
  };

  return (
    <section className="w-full bg-[#FAF7F1] py-20 sm:py-24 lg:py-32">
      <div className="w-full px-5 sm:px-8 lg:px-12 xl:px-20">

        {/* Section Heading */}
        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.7,
          }}
          viewport={{
            once: true,
          }}
          className="text-center mb-14 lg:mb-20"
        >
          <p className="text-[#FF6A3D] uppercase tracking-[0.3em] text-xs sm:text-sm font-semibold mb-4">
            More Than Just Clothing
          </p>

          <h2
            className="
              text-4xl
              sm:text-5xl
              lg:text-6xl
              font-bold
              text-[#14172E]
            "
            style={{
              fontFamily: "'Baloo 2', sans-serif",
            }}
          >
            Be Part of{" "}
            <span className="text-[#FF6A3D]">
              FurEver
            </span>
          </h2>

          <p className="mt-5 max-w-2xl mx-auto text-[#8D8D8D] text-base sm:text-lg leading-relaxed">
            Your voice helps us grow. Your support helps us give back.
          </p>
        </motion.div>

        {/* Two Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-12">

          {/* FEEDBACK CARD */}
          <motion.div
            initial={{
              opacity: 0,
              x: -40,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.7,
            }}
            viewport={{
              once: true,
            }}
            className="
              group
              relative
              overflow-hidden
              bg-white
              rounded-[36px]
              lg:rounded-[44px]
              p-8
              sm:p-10
              lg:p-14
              xl:p-16
              shadow-md
              hover:shadow-2xl
              transition-all
              duration-500
            "
          >
            {/* Decorative Circle */}
            <div
              className="
                absolute
                -top-24
                -right-24
                w-64
                h-64
                rounded-full
                bg-[#FFF0E9]
                group-hover:scale-125
                transition-transform
                duration-700
              "
            />

            <div className="relative z-10">

              {/* Icon */}
              <div
                className="
                  w-20
                  h-20
                  lg:w-24
                  lg:h-24
                  rounded-full
                  bg-[#FFF0E9]
                  flex
                  items-center
                  justify-center
                  text-[#FF6A3D]
                  mb-8
                  group-hover:bg-[#FF6A3D]
                  group-hover:text-white
                  transition-all
                  duration-500
                "
              >
                <MessageCircleHeart
                  size={42}
                  strokeWidth={1.7}
                />
              </div>

              <p className="text-[#FF6A3D] uppercase tracking-[0.25em] text-xs font-semibold">
                We Want To Hear From You
              </p>

              <h3
                className="
                  mt-4
                  text-3xl
                  sm:text-4xl
                  lg:text-5xl
                  font-bold
                  text-[#14172E]
                "
              >
                Tell us what you{" "}
                <span className="text-[#FF6A3D]">
                  think.
                </span>
              </h3>

              <p className="mt-5 text-[#8D8D8D] text-base lg:text-lg leading-relaxed max-w-xl">
                Every piece of feedback helps us create better products,
                better experiences and a better FurEver community.
              </p>

              {!submitted ? (

                <form
                  onSubmit={handleFeedbackSubmit}
                  className="mt-8"
                >

                  {/* Rating */}
                  <div className="mb-6">

                    <p className="text-[#14172E] font-semibold mb-3">
                      Rate your experience
                    </p>

                    <div className="flex gap-2">

                      {[1, 2, 3, 4, 5].map((star) => (

                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="
                            transition-transform
                            hover:scale-125
                          "
                        >
                          <Star
                            size={27}
                            className={
                              star <= rating
                                ? "fill-[#FF6A3D] text-[#FF6A3D]"
                                : "text-[#D8D8D8]"
                            }
                          />
                        </button>

                      ))}

                    </div>

                  </div>

                  {/* Feedback Input */}
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Share your thoughts with us..."
                    rows={4}
                    required
                    className="
                      w-full
                      resize-none
                      rounded-2xl
                      border
                      border-[#E8DED5]
                      bg-[#FFFCF9]
                      px-5
                      py-4
                      text-[#14172E]
                      placeholder:text-[#A6A6A6]
                      outline-none
                      focus:border-[#FF6A3D]
                      focus:ring-2
                      focus:ring-[#FF6A3D]/10
                      transition-all
                    "
                  />

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={sending}
                    className="
                      mt-5
                      w-full
                      sm:w-auto
                      px-8
                      py-4
                      rounded-full
                      bg-[#14172E]
                      text-white
                      font-semibold
                      flex
                      items-center
                      justify-center
                      gap-3
                      hover:bg-[#FF6A3D]
                      transition-all
                      duration-300
                      disabled:opacity-50
                      disabled:cursor-not-allowed
                    "
                  >
                    {sending
                      ? "Sending..."
                      : "Submit Feedback"}

                    <ArrowRight size={18} />
                  </button>

                </form>

              ) : (

                <div
                  className="
                    mt-8
                    rounded-2xl
                    bg-[#F1FAF3]
                    border
                    border-[#CDE8D2]
                    p-5
                    flex
                    items-center
                    gap-3
                    text-[#287A38]
                  "
                >
                  <CheckCircle2 size={24} />

                  <p className="font-semibold">
                    Thank you for sharing your feedback with us!
                  </p>
                </div>

              )}

            </div>
          </motion.div>

          {/* DONATION CARD */}
          <motion.div
            initial={{
              opacity: 0,
              x: 40,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.7,
            }}
            viewport={{
              once: true,
            }}
            className="
              group
              relative
              overflow-hidden
              bg-[#14172E]
              rounded-[36px]
              lg:rounded-[44px]
              p-8
              sm:p-10
              lg:p-14
              xl:p-16
              shadow-md
              hover:shadow-2xl
              transition-all
              duration-500
            "
          >

            {/* Decorative Circle */}
            <div
              className="
                absolute
                -top-24
                -right-24
                w-72
                h-72
                rounded-full
                bg-[#232744]
                group-hover:scale-125
                transition-transform
                duration-700
              "
            />

            <div
              className="
                absolute
                -bottom-32
                -left-20
                w-72
                h-72
                rounded-full
                border
                border-[#FF6A3D]/20
              "
            />

            <div className="relative z-10">

              {/* Icon */}
              <div
                className="
                  w-20
                  h-20
                  lg:w-24
                  lg:h-24
                  rounded-full
                  bg-[#FF6A3D]
                  flex
                  items-center
                  justify-center
                  text-white
                  mb-8
                  group-hover:scale-110
                  transition-transform
                  duration-500
                "
              >
                <HeartHandshake
                  size={42}
                  strokeWidth={1.7}
                />
              </div>

              <p className="text-[#FF8C68] uppercase tracking-[0.25em] text-xs font-semibold">
                Wear Good. Do Good.
              </p>

              <h3
                className="
                  mt-4
                  text-3xl
                  sm:text-4xl
                  lg:text-5xl
                  font-bold
                  text-white
                "
              >
                Every purchase can make a{" "}
                <span className="text-[#FF6A3D]">
                  difference.
                </span>
              </h3>

              <p className="mt-5 text-[#C8C9D4] text-base lg:text-lg leading-relaxed max-w-xl">
                FurEver is built on the belief that fashion can have a
                purpose beyond the product. A portion of our profits goes
                towards supporting animal welfare initiatives.
              </p>

              {/* Donation Highlight */}
              <div
                className="
                  mt-8
                  rounded-3xl
                  bg-white/5
                  border
                  border-white/10
                  p-6
                  sm:p-7
                "
              >
                <div className="flex items-center gap-4">

                  <div
                    className="
                      w-14
                      h-14
                      rounded-2xl
                      bg-[#FF6A3D]/15
                      flex
                      items-center
                      justify-center
                      text-[#FF6A3D]
                    "
                  >
                    <PawPrint size={28} />
                  </div>

                  <div>

                    <p className="text-white font-bold text-lg">
                      Fashion with a purpose
                    </p>

                    <p className="text-[#AEB0BD] text-sm mt-1">
                      A part of our profits goes towards making a difference.
                    </p>

                  </div>

                </div>
              </div>

              {/* Mission Button */}
              <button
                onClick={() => navigate("/about")}
                className="
                  mt-8
                  px-8
                  py-4
                  rounded-full
                  bg-[#FF6A3D]
                  text-white
                  font-semibold
                  flex
                  items-center
                  justify-center
                  gap-3
                  hover:bg-white
                  hover:text-[#14172E]
                  transition-all
                  duration-300
                "
              >
                Learn About Our Mission

                <ArrowRight size={18} />
              </button>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

export default Feedback;