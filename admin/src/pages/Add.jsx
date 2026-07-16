import React, { useContext, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import Nav from "../component/Nav";
import Sidebar from "../component/Sidebar";
import { authDataContext } from "../context/AuthContext";
import uploadImage from "../assets/upload.png";

function Add() {
  // ---------------------------------------------------------------------
  // CONTEXT
  // ---------------------------------------------------------------------
  const { serverUrl } = useContext(authDataContext);

  // ---------------------------------------------------------------------
  // STATE — IMAGES
  // ---------------------------------------------------------------------
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [image3, setImage3] = useState(null);
  const [image4, setImage4] = useState(null);

  // ---------------------------------------------------------------------
  // STATE — FORM FIELDS
  // ---------------------------------------------------------------------
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Men");
  const [subCategory, setSubCategory] = useState("Topwear");
  const [price, setPrice] = useState("");
  const [sizes, setSizes] = useState([]);
  const [bestseller, setBestseller] = useState(false);

  // ---------------------------------------------------------------------
  // STATE — UI / UX
  // ---------------------------------------------------------------------
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ---------------------------------------------------------------------
  // CONSTANTS
  // ---------------------------------------------------------------------
  const availableSizes = ["S", "M", "L", "XL", "XXL"];

  // ---------------------------------------------------------------------
  // HANDLERS — SIZE CHIP TOGGLE
  // ---------------------------------------------------------------------
  const toggleSize = (size) => {
    setSizes((prev) =>
      prev.includes(size)
        ? prev.filter((s) => s !== size) // remove if already selected
        : [...prev, size] // add if not selected
    );
  };

  // ---------------------------------------------------------------------
  // HANDLER — RESET FORM TO DEFAULT STATE
  // ---------------------------------------------------------------------
  const resetForm = () => {
    setImage1(null);
    setImage2(null);
    setImage3(null);
    setImage4(null);
    setName("");
    setDescription("");
    setCategory("Men");
    setSubCategory("Topwear");
    setPrice("");
    setSizes([]);
    setBestseller(false);
  };

  // ---------------------------------------------------------------------
  // HANDLER — FORM SUBMISSION
  // ---------------------------------------------------------------------
  const handleAddProduct = async (e) => {
    e.preventDefault();

    // Clear any previous notifications
    setError("");
    setSuccess("");

    // -------------------- VALIDATION --------------------
    if (!image1) {
      setError("Please upload at least the first product image.");
      return;
    }
    if (!name.trim()) {
      setError("Product name is required.");
      return;
    }
    if (!description.trim()) {
      setError("Product description is required.");
      return;
    }
    if (!category) {
      setError("Please select a category.");
      return;
    }
    if (!subCategory) {
      setError("Please select a sub category.");
      return;
    }
    if (!price || Number(price) <= 0) {
      setError("Please enter a valid price.");
      return;
    }
    if (sizes.length === 0) {
      setError("Please select at least one size.");
      return;
    }

    // -------------------- SUBMIT TO SERVER --------------------
    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("image1", image1);
      formData.append("image2", image2);
      formData.append("image3", image3);
      formData.append("image4", image4);

      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("sizes", JSON.stringify(sizes));
      formData.append("bestseller", bestseller);

      const result = await axios.post(
        serverUrl + "/api/product/addproduct",
        formData,
        {
          withCredentials: true,
        }
      );

      console.log(result.data);

      setSuccess("Product added successfully!");
      resetForm();
    } catch (err) {
      console.log(err);
      setError(
        err?.response?.data?.message ||
          "Something went wrong while adding the product. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------------------
  // REUSABLE — IMAGE UPLOAD CARD
  // ---------------------------------------------------------------------
  const ImageUploadCard = ({ label, image, setImage }) => {
    const inputId = `upload-${label}`;

    return (
      <motion.label
        htmlFor={inputId}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="relative flex flex-col items-center justify-center w-full aspect-square rounded-2xl border-2 border-dashed border-[#E3D9CB] bg-[#FFFDFB] cursor-pointer overflow-hidden transition-colors duration-300 hover:border-[#FF6A3D] group"
      >
        {image ? (
          <img
            src={URL.createObjectURL(image)}
            alt={label}
            className="w-full h-full object-cover rounded-2xl"
          />
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 p-3">
            <img
              src={uploadImage}
              alt="upload"
              className="w-10 h-10 sm:w-12 sm:h-12 object-contain opacity-70 transition-transform duration-300 group-hover:scale-110"
            />
            <span className="text-xs sm:text-sm font-medium text-[#8A8578]">
              Upload
            </span>
          </div>
        )}

        {/* Overlay on hover when an image is already selected */}
        {image && (
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
            <span className="opacity-0 group-hover:opacity-100 text-white text-xs sm:text-sm font-semibold transition-opacity duration-300">
              Change Image
            </span>
          </div>
        )}

        <input
          id={inputId}
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className="hidden"
        />
      </motion.label>
    );
  };

  // ---------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------
  return (
    <div
      className="min-h-screen w-full bg-[#FAF7F1]"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <Nav />

      {/* Mobile Sidebar (horizontal, below nav) */}
      <div className="md:hidden">
        <Sidebar />
      </div>

      <div className="flex min-h-[calc(100vh-80px)]">
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <Sidebar />
        </div>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 md:p-10">
          <div className="max-w-5xl mx-auto">
            {/* Page Heading */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-8"
            >
              <h1
                className="text-3xl sm:text-4xl text-[#14172E]"
                style={{ fontFamily: "'Baloo 2', sans-serif", fontWeight: 700 }}
              >
                Add <span className="text-[#FF6A3D]">Product</span>
              </h1>
              <p className="text-[#8A8578] mt-2 text-sm sm:text-base">
                Fill in the details below to add a new product to your store.
              </p>
            </motion.div>

            {/* Notifications */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mb-6 bg-red-50 border border-red-200 text-red-600 px-5 py-4 rounded-2xl font-medium shadow-sm overflow-hidden"
                >
                  {error}
                </motion.div>
              )}

              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mb-6 bg-green-50 border border-green-200 text-green-600 px-5 py-4 rounded-2xl font-medium shadow-sm overflow-hidden"
                >
                  {success}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form Card */}
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              onSubmit={handleAddProduct}
              className="bg-white rounded-3xl shadow-xl p-5 sm:p-8 md:p-10 space-y-8"
            >
              {/* -------------------- IMAGE UPLOAD SECTION -------------------- */}
              <div>
                <h2
                  className="text-xl sm:text-2xl text-[#14172E] mb-4"
                  style={{ fontFamily: "'Baloo 2', sans-serif", fontWeight: 700 }}
                >
                  Upload Images
                </h2>

                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
                  <ImageUploadCard
                    label="image1"
                    image={image1}
                    setImage={setImage1}
                  />
                  <ImageUploadCard
                    label="image2"
                    image={image2}
                    setImage={setImage2}
                  />
                  <ImageUploadCard
                    label="image3"
                    image={image3}
                    setImage={setImage3}
                  />
                  <ImageUploadCard
                    label="image4"
                    image={image4}
                    setImage={setImage4}
                  />
                </div>
              </div>

              {/* -------------------- PRODUCT NAME -------------------- */}
              <div>
                <label className="block text-sm font-semibold text-[#14172E] mb-2">
                  Product Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Classic Cotton Hoodie"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-[#E3D9CB] bg-[#FFFDFB] text-[#14172E] placeholder:text-[#B4AFA1] outline-none focus:border-[#FF6A3D] focus:ring-2 focus:ring-[#FF6A3D]/20 transition-all duration-200"
                />
              </div>

              {/* -------------------- PRODUCT DESCRIPTION -------------------- */}
              <div>
                <label className="block text-sm font-semibold text-[#14172E] mb-2">
                  Product Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Write a short description about the product..."
                  required
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-[#E3D9CB] bg-[#FFFDFB] text-[#14172E] placeholder:text-[#B4AFA1] outline-none focus:border-[#FF6A3D] focus:ring-2 focus:ring-[#FF6A3D]/20 transition-all duration-200 resize-none"
                />
              </div>

              {/* -------------------- CATEGORY / SUB CATEGORY / PRICE -------------------- */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {/* Category */}
                <div>
                  <label className="block text-sm font-semibold text-[#14172E] mb-2">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-[#E3D9CB] bg-[#FFFDFB] text-[#14172E] outline-none focus:border-[#FF6A3D] focus:ring-2 focus:ring-[#FF6A3D]/20 transition-all duration-200 cursor-pointer"
                  >
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                    <option value="Kids">Kids</option>
                  </select>
                </div>

                {/* Sub Category */}
                <div>
                  <label className="block text-sm font-semibold text-[#14172E] mb-2">
                    Sub Category
                  </label>
                  <select
                    value={subCategory}
                    onChange={(e) => setSubCategory(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-[#E3D9CB] bg-[#FFFDFB] text-[#14172E] outline-none focus:border-[#FF6A3D] focus:ring-2 focus:ring-[#FF6A3D]/20 transition-all duration-200 cursor-pointer"
                  >
                    <option value="Topwear">Topwear</option>
                    <option value="Bottomwear">Bottomwear</option>
                    <option value="Winterwear">Winterwear</option>
                  </select>
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-semibold text-[#14172E] mb-2">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g. 999"
                    min="0"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-[#E3D9CB] bg-[#FFFDFB] text-[#14172E] placeholder:text-[#B4AFA1] outline-none focus:border-[#FF6A3D] focus:ring-2 focus:ring-[#FF6A3D]/20 transition-all duration-200"
                  />
                </div>
              </div>

              {/* -------------------- SIZES -------------------- */}
              <div>
                <label className="block text-sm font-semibold text-[#14172E] mb-3">
                  Sizes
                </label>
                <div className="flex flex-wrap gap-3">
                  {availableSizes.map((size) => {
                    const isSelected = sizes.includes(size);

                    return (
                      <motion.button
                        key={size}
                        type="button"
                        onClick={() => toggleSize(size)}
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.94 }}
                        className={`px-5 py-2.5 rounded-full font-semibold text-sm transition-colors duration-200 ${
                          isSelected
                            ? "bg-[#FF6A3D] text-white shadow-md"
                            : "bg-[#F3EFE7] text-[#8A8578] hover:bg-[#FFE7DB] hover:text-[#FF6A3D]"
                        }`}
                      >
                        {size}
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* -------------------- BESTSELLER -------------------- */}
              <div>
                <h3
                  className="text-lg text-[#14172E] mb-3"
                  style={{ fontFamily: "'Baloo 2', sans-serif", fontWeight: 700 }}
                >
                  Add to Bestseller
                </h3>
                <label className="flex items-center gap-3 cursor-pointer w-fit select-none">
                  <input
                    type="checkbox"
                    checked={bestseller}
                    onChange={(e) => setBestseller(e.target.checked)}
                    className="w-5 h-5 rounded-md accent-[#FF6A3D] cursor-pointer"
                  />
                  <span className="text-sm font-medium text-[#50546B]">
                    Mark this product as a bestseller
                  </span>
                </label>
              </div>

              {/* -------------------- SUBMIT BUTTON -------------------- */}
              <div className="flex justify-center pt-2">
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: loading ? 1 : 1.04 }}
                  whileTap={{ scale: loading ? 1 : 0.97 }}
                  className={`flex items-center justify-center gap-3 px-10 py-4 rounded-2xl font-semibold text-white shadow-lg transition-all duration-200 min-w-[220px] ${
                    loading
                      ? "bg-[#3B4CE0]/70 cursor-not-allowed"
                      : "bg-[#3B4CE0] hover:bg-[#2E3BC4]"
                  }`}
                >
                  {loading && (
                    <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  )}
                  {loading ? "Adding Product..." : "Add Product"}
                </motion.button>
              </div>
            </motion.form>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Add;