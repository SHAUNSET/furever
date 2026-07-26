import React from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  RotateCcw,
  Headphones,
} from "lucide-react";

function OurPolicy() {
  const policies = [
    {
      icon: ShieldCheck,
      title: "Premium Quality",
      description:
        "Thoughtfully designed products crafted with quality, comfort and care.",
    },
    {
      icon: RotateCcw,
      title: "Easy Returns",
      description:
        "Shop with confidence with a simple and hassle-free return experience.",
    },
    {
      icon: Headphones,
      title: "Dedicated Support",
      description:
        "Our team is always here to help you with your FurEver experience.",
    },
  ];

  return (
    <section className="w-full bg-[#FAF7F1] py-20 sm:py-24 lg:py-32">
      <div className="w-full px-5 sm:px-8 lg:px-12 xl:px-20">

        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center mb-14 lg:mb-20"
        >
          <p className="text-[#FF6A3D] uppercase tracking-[0.3em] text-xs sm:text-sm font-semibold mb-4">
            The FurEver Promise
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
            Why Shop With{" "}
            <span className="text-[#FF6A3D]">
              Us?
            </span>
          </h2>

          <p
            className="
              mt-5
              max-w-2xl
              mx-auto
              text-[#8D8D8D]
              text-base
              sm:text-lg
              leading-relaxed
            "
          >
            Every FurEver experience is built around quality, trust and
            the little details that make shopping feel special.
          </p>
        </motion.div>

        {/* Policy Cards */}
        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-3
            gap-6
            lg:gap-8
            xl:gap-10
            w-full
          "
        >
          {policies.map((policy, index) => {
            const Icon = policy.icon;

            return (
              <motion.div
                key={policy.title}
                initial={{
                  opacity: 0,
                  y: 40,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.15,
                }}
                viewport={{
                  once: true,
                }}
                whileHover={{
                  y: -12,
                }}
                className="
                  group
                  w-full
                  min-h-[360px]
                  lg:min-h-[430px]
                  xl:min-h-[480px]
                  bg-white
                  rounded-[32px]
                  lg:rounded-[40px]
                  px-8
                  sm:px-10
                  lg:px-12
                  xl:px-16
                  py-12
                  lg:py-16
                  xl:py-20
                  flex
                  flex-col
                  items-center
                  justify-center
                  text-center
                  shadow-md
                  hover:shadow-2xl
                  transition-all
                  duration-500
                "
              >
                {/* Icon */}
                <div
                  className="
                    w-24
                    h-24
                    lg:w-28
                    lg:h-28
                    xl:w-32
                    xl:h-32
                    rounded-full
                    bg-[#FFF0E9]
                    flex
                    items-center
                    justify-center
                    text-[#FF6A3D]
                    group-hover:bg-[#FF6A3D]
                    group-hover:text-white
                    transition-all
                    duration-500
                    shrink-0
                  "
                >
                  <Icon
                    size={48}
                    strokeWidth={1.6}
                    className="lg:w-14 lg:h-14"
                  />
                </div>

                {/* Title */}
                <h3
                  className="
                    mt-8
                    lg:mt-10
                    text-2xl
                    lg:text-3xl
                    xl:text-4xl
                    font-bold
                    text-[#14172E]
                  "
                >
                  {policy.title}
                </h3>

                {/* Description */}
                <p
                  className="
                    mt-5
                    max-w-md
                    text-[#8D8D8D]
                    text-base
                    lg:text-lg
                    xl:text-xl
                    leading-relaxed
                  "
                >
                  {policy.description}
                </p>

                {/* Decorative Line */}
                <div
                  className="
                    mt-8
                    w-16
                    h-1
                    rounded-full
                    bg-[#FF6A3D]
                    group-hover:w-28
                    transition-all
                    duration-500
                  "
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default OurPolicy;