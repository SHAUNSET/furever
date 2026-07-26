import React from "react";
import { motion } from "framer-motion";

import Title from "../components/Title";
import LatestCollection from "../components/LatestCollection";
import BestSeller from "../components/BestSeller";

function Product() {
  return (
    <section className="w-full bg-[#FAF7F1] py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Latest Collection */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Title text1="LATEST" text2="COLLECTIONS" />

          <p className="text-center text-[#8D8D8D] max-w-2xl mx-auto mt-4 mb-12 text-base sm:text-lg leading-relaxed">
            Explore our newest arrivals, thoughtfully crafted for every pet
            lover. Fresh styles, premium comfort and timeless designs—all in
            one place.
          </p>

          <LatestCollection />
        </motion.div>

        <div className="py-20" />

        {/* Best Sellers */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Title text1="BEST" text2="SELLERS" />

          <p className="text-center text-[#8D8D8D] max-w-2xl mx-auto mt-4 mb-12 text-base sm:text-lg leading-relaxed">
            Customer favourites loved by thousands. Discover the most popular
            FurEver essentials that combine style, comfort and quality.
          </p>

          <BestSeller />
        </motion.div>

      </div>
    </section>
  );
}

export default Product;