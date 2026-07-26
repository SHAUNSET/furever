import React, { useContext } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaShoppingCart, FaStar } from "react-icons/fa";
import { shopDataContext } from "../context/ShopContext";

function Card({ product }) {
  const navigate = useNavigate();

  const { currency } = useContext(shopDataContext);

  const handleAddToCart = (e) => {
    e.stopPropagation();

    // TODO:
    // addToCart(product._id);

    console.log("Added to Cart:", product.name);
  };

  return (
    <motion.div
      whileHover={{
        y: -10,
        scale: 1.02,
      }}
      transition={{
        duration: 0.35,
      }}
      onClick={() => navigate(`/product/${product._id}`)}
      className="
        group
        w-full
        max-w-[420px]
        rounded-[32px]
        overflow-hidden
        bg-white
        shadow-md
        hover:shadow-2xl
        transition-all
        duration-500
        cursor-pointer
      "
    >
      {/* Image */}

      <div className="relative overflow-hidden bg-[#F8F5EF]">

        {product.bestseller && (
          <div className="absolute left-5 top-5 z-20 bg-[#FF6A3D] text-white px-4 py-2 rounded-full text-xs font-semibold tracking-wide shadow-lg">
            Bestseller
          </div>
        )}

        <img
          src={product.image1}
          alt={product.name}
          className="
            w-full
            aspect-[1/1]
            object-cover
            transition-all
            duration-700
            group-hover:scale-110
            group-hover:brightness-95
          "
        />
      </div>

      {/* Content */}

      <div className="px-7 py-6">

        {/* Product Name */}

        <h3 className="text-2xl font-bold text-[#14172E] text-center line-clamp-1">
          {product.name}
        </h3>

        {/* Rating */}

        <div className="flex justify-center items-center gap-1 mt-4">

          {[1, 2, 3, 4, 5].map((star) => (
            <FaStar
              key={star}
              className="text-yellow-400 text-sm"
            />
          ))}

          <span className="ml-2 text-sm text-gray-500">
            4.9
          </span>

        </div>

        {/* Price */}

        <div className="mt-6 text-center">

          <span className="text-4xl font-bold text-[#FF6A3D]">
            {currency}
            {product.price}
          </span>

        </div>

        {/* Add To Cart */}

        <motion.button
          whileHover={{
            scale: 1.03,
          }}
          whileTap={{
            scale: 0.95,
          }}
          onClick={handleAddToCart}
          className="
            mt-7
            w-full
            flex
            justify-center
            items-center
            gap-3
            bg-[#14172E]
            hover:bg-[#FF6A3D]
            text-white
            py-4
            rounded-2xl
            font-semibold
            text-lg
            transition-all
            duration-300
          "
        >
          <FaShoppingCart />

          Add to Cart
        </motion.button>

      </div>
    </motion.div>
  );
}

export default Card;