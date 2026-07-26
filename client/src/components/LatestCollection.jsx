import React, { useContext } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { shopDataContext } from "../context/ShopContext";
import Card from "./Card";

function LatestCollection() {
  const navigate = useNavigate();

  const { products, loading } = useContext(shopDataContext);

  if (loading) {
    return (
      <div className="py-16 text-center text-gray-500 text-lg">
        Loading Latest Collection...
      </div>
    );
  }

  const latestProducts = [...products]
    .sort((a, b) => b.date - a.date)
    .slice(0, 4);

  return (
    <>
      {/* ---------------- DESKTOP ---------------- */}

      <div className="hidden md:flex justify-center gap-10">
        {latestProducts.map((product) => (
          <Card
            key={product._id}
            product={product}
          />
        ))}
      </div>

      {/* ---------------- MOBILE ---------------- */}

      <div
        className="
        md:hidden
        flex
        gap-6
        overflow-x-auto
        snap-x
        snap-mandatory
        scroll-smooth
        pb-4
        px-5
        no-scrollbar
      "
      >
        {latestProducts.map((product) => (
          <div
            key={product._id}
            className="
              snap-center
              shrink-0
              w-[88vw]
            "
          >
            <Card product={product} />
          </div>
        ))}
      </div>

      {/* CTA */}

      <motion.div
        initial={{
          opacity: 0,
          y: 25,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        viewport={{
          once: true,
        }}
        transition={{
          duration: 0.5,
        }}
        className="flex justify-center mt-14"
      >
     <button
  onClick={() =>
    navigate("/collections", {
      state: {
        filter: "latest",
      },
    })
  }
  className="
    px-10
    py-4
    rounded-full
    border-2
    border-[#14172E]
    text-[#14172E]
    font-semibold
    hover:bg-[#14172E]
    hover:text-white
    transition-all
    duration-300
    shadow-sm
    hover:shadow-lg
  "
>
  Explore Collections →
</button>
      </motion.div>
    </>
  );
}

export default LatestCollection;