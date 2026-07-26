import React, { useContext } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { shopDataContext } from "../context/ShopContext";
import Card from "./Card";

function BestSeller() {
  const navigate = useNavigate();

  const { products, loading } = useContext(shopDataContext);

  if (loading) {
    return (
      <div className="py-16 text-center text-gray-500 text-lg">
        Loading Best Sellers...
      </div>
    );
  }

  const bestSellerProducts = products
    .filter((product) => product.bestseller)
    .slice(0, 4);

  if (bestSellerProducts.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        No Best Sellers Available Yet.
      </div>
    );
  }

  return (
    <>
      {/* ---------------- DESKTOP ---------------- */}

      <div className="hidden md:flex justify-center gap-10">
        {bestSellerProducts.map((product) => (
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
        {bestSellerProducts.map((product) => (
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
        filter: "bestseller",
      },
    })
  }
  className="
    px-10
    py-4
    rounded-full
    bg-[#FF6A3D]
    text-white
    font-semibold
    shadow-md
    hover:bg-[#14172E]
    hover:shadow-xl
    transition-all
    duration-300
  "
>
  Shop Best Sellers →
</button>
      </motion.div>
    </>
  );
}

export default BestSeller;