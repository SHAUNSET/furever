import React from "react";
import { motion } from "framer-motion";

function Title({ text1, text2 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="text-center"
    >
      <h2
        className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-wide"
        style={{
          fontFamily: "'Baloo 2', sans-serif",
        }}
      >
        <span className="text-[#14172E]">{text1} </span>

        <span className="text-[#FF6A3D]">{text2}</span>
      </h2>

      <div className="w-28 h-1 bg-[#FF6A3D] rounded-full mx-auto mt-4"></div>
    </motion.div>
  );
}

export default Title;