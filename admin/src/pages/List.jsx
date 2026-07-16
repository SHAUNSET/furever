import { useContext, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
  Pencil,
  Trash2,
  Search,
  PackageX,
  X,
  CheckCircle2,
  AlertCircle,
  UploadCloud,
} from "lucide-react";
import Nav from "../component/Nav";
import Sidebar from "../component/Sidebar";
import { authDataContext } from "../context/AuthContext";

// =============================================================================
// CONSTANTS
// =============================================================================
const AVAILABLE_SIZES = ["S", "M", "L", "XL", "XXL"];

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

// Format a raw number into a rupee price string, e.g. 999 -> "₹999"
const formatPrice = (price) => `₹${Number(price).toLocaleString("en-IN")}`;

// Format a date value into a readable string, e.g. "12 Jul 2026"
const formatDate = (dateValue) => {
  if (!dateValue) return "—";
  const parsed = new Date(dateValue);
  if (isNaN(parsed.getTime())) return "—";
  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// =============================================================================
// SUB COMPONENT — TOAST NOTIFICATION
// =============================================================================
function Toast({ toast }) {
  if (!toast) return null;

  const isSuccess = toast.type === "success";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.9 }}
        transition={{ duration: 0.25 }}
        className={`fixed top-6 right-6 z-[100] flex items-center gap-3 px-5 py-4 rounded-2xl shadow-xl font-medium text-sm max-w-xs ${
          isSuccess
            ? "bg-green-50 border border-green-200 text-green-700"
            : "bg-red-50 border border-red-200 text-red-600"
        }`}
      >
        {isSuccess ? (
          <CheckCircle2 size={20} className="shrink-0" />
        ) : (
          <AlertCircle size={20} className="shrink-0" />
        )}
        <span>{toast.message}</span>
      </motion.div>
    </AnimatePresence>
  );
}

// =============================================================================
// SUB COMPONENT — SIZE CHIPS (read only, used in product rows)
// =============================================================================
function SizeChips({ sizes = [] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {sizes.map((size) => (
        <span
          key={size}
          className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#F3EFE7] text-[#50546B]"
        >
          {size}
        </span>
      ))}
    </div>
  );
}

// =============================================================================
// SUB COMPONENT — BESTSELLER BADGE
// =============================================================================
function BestsellerBadge({ isBestseller }) {
  return (
    <span
      className={`px-3 py-1 rounded-full text-[11px] font-bold tracking-wide ${
        isBestseller
          ? "bg-[#FF6A3D]/10 text-[#FF6A3D]"
          : "bg-gray-100 text-gray-500"
      }`}
    >
      {isBestseller ? "BESTSELLER" : "STANDARD"}
    </span>
  );
}

// =============================================================================
// SUB COMPONENT — ANALYTICS CARD
// =============================================================================
function AnalyticsCard({ label, value, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-2xl shadow-md p-5 border border-[#F2ECE1]"
    >
      <p className="text-xs sm:text-sm font-medium text-[#8A8578] mb-1">
        {label}
      </p>
      <h3
        className="text-2xl sm:text-3xl text-[#14172E]"
        style={{ fontFamily: "'Baloo 2', sans-serif", fontWeight: 700 }}
      >
        {value}
      </h3>
    </motion.div>
  );
}

// =============================================================================
// SUB COMPONENT — SKELETON LOADER
// =============================================================================
function SkeletonRow() {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-5 flex items-center gap-4 animate-pulse">
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-[#F2ECE1] shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-[#F2ECE1] rounded w-2/5" />
        <div className="h-3 bg-[#F2ECE1] rounded w-1/5" />
        <div className="h-3 bg-[#F2ECE1] rounded w-1/3" />
      </div>
      <div className="hidden sm:block h-8 w-24 bg-[#F2ECE1] rounded-xl" />
    </div>
  );
}

// =============================================================================
// SUB COMPONENT — IMAGE UPLOAD SLOT (used inside Edit modal)
// =============================================================================
function EditImageSlot({ label, existingUrl, newFile, onChange }) {
  const inputId = `edit-${label}`;

  // Prefer a freshly selected file preview over the existing product image
  const previewSrc = newFile ? URL.createObjectURL(newFile) : existingUrl;

  return (
    <label
      htmlFor={inputId}
      className="relative flex flex-col items-center justify-center w-full aspect-square rounded-xl border-2 border-dashed border-[#E3D9CB] bg-[#FFFDFB] cursor-pointer overflow-hidden transition-colors duration-300 hover:border-[#FF6A3D] group"
    >
      {previewSrc ? (
        <img
          src={previewSrc}
          alt={label}
          className="w-full h-full object-cover rounded-xl"
        />
      ) : (
        <div className="flex flex-col items-center justify-center gap-1.5 p-2">
          <UploadCloud size={22} className="text-[#B4AFA1]" />
          <span className="text-[11px] font-medium text-[#8A8578]">
            Upload
          </span>
        </div>
      )}

      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
        <span className="opacity-0 group-hover:opacity-100 text-white text-[11px] font-semibold transition-opacity duration-300">
          Change
        </span>
      </div>

      <input
        id={inputId}
        type="file"
        accept="image/*"
        onChange={(e) => onChange(e.target.files[0])}
        className="hidden"
      />
    </label>
  );
}

// =============================================================================
// SUB COMPONENT — EDIT PRODUCT MODAL
// =============================================================================
function EditProductModal({ product, onClose, onSave, serverUrl }) {
  // Pre-fill text/number/select fields from the product being edited
  const [name, setName] = useState(product.name || "");
  const [description, setDescription] = useState(product.description || "");
  const [category, setCategory] = useState(product.category || "Men");
  const [subCategory, setSubCategory] = useState(
    product.subCategory || "Topwear"
  );
  const [price, setPrice] = useState(product.price || "");
  const [sizes, setSizes] = useState(product.sizes || []);
  const [bestseller, setBestseller] = useState(product.bestseller || false);

  // Only holds NEWLY selected files — null means "keep existing image"
  const [newImage1, setNewImage1] = useState(null);
  const [newImage2, setNewImage2] = useState(null);
  const [newImage3, setNewImage3] = useState(null);
  const [newImage4, setNewImage4] = useState(null);

  const [saving, setSaving] = useState(false);
  const [modalError, setModalError] = useState("");

  const toggleSize = (size) => {
    setSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setModalError("");

    // -------------------- VALIDATION --------------------
    if (!name.trim()) return setModalError("Product name is required.");
    if (!description.trim())
      return setModalError("Product description is required.");
    if (!price || Number(price) <= 0)
      return setModalError("Please enter a valid price.");
    if (sizes.length === 0)
      return setModalError("Please select at least one size.");

    try {
      setSaving(true);

      const formData = new FormData();

      // Only append images that were actually changed by the admin.
      // Untouched slots are left out so the backend keeps the original file.
      if (newImage1) formData.append("image1", newImage1);
      if (newImage2) formData.append("image2", newImage2);
      if (newImage3) formData.append("image3", newImage3);
      if (newImage4) formData.append("image4", newImage4);

      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("sizes", JSON.stringify(sizes));
      formData.append("bestseller", bestseller);

      const result = await axios.put(
        `${serverUrl}/api/product/updateproduct/${product._id}`,
        formData,
        { withCredentials: true }
      );

      console.log(result.data);

      // Build the updated product object to sync into parent state instantly.
      const updatedProduct = {
        ...product,
        name,
        description,
        price,
        category,
        subCategory,
        sizes,
        bestseller,
        image1: newImage1 ? URL.createObjectURL(newImage1) : product.image1,
        image2: newImage2 ? URL.createObjectURL(newImage2) : product.image2,
        image3: newImage3 ? URL.createObjectURL(newImage3) : product.image3,
        image4: newImage4 ? URL.createObjectURL(newImage4) : product.image4,
        ...(result?.data?.product || {}),
      };

      onSave(updatedProduct);
    } catch (err) {
      console.log(err);
      setModalError(
        err?.response?.data?.message ||
          "Failed to update product. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[90] bg-black/50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.25 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl my-8 max-h-[90vh] overflow-y-auto"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 sm:px-8 py-5 border-b border-[#F2ECE1] sticky top-0 bg-white rounded-t-3xl z-10">
          <h2
            className="text-xl sm:text-2xl text-[#14172E]"
            style={{ fontFamily: "'Baloo 2', sans-serif", fontWeight: 700 }}
          >
            Edit Product
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#F3EFE7] transition-colors duration-200"
          >
            <X size={20} className="text-[#50546B]" />
          </button>
        </div>

        <form onSubmit={handleSave} className="px-6 sm:px-8 py-6 space-y-6">
          {modalError && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-medium"
            >
              {modalError}
            </motion.div>
          )}

          {/* Images */}
          <div>
            <label className="block text-sm font-semibold text-[#14172E] mb-3">
              Product Images
            </label>
            <div className="grid grid-cols-4 gap-3">
              <EditImageSlot
                label="image1"
                existingUrl={product.image1}
                newFile={newImage1}
                onChange={setNewImage1}
              />
              <EditImageSlot
                label="image2"
                existingUrl={product.image2}
                newFile={newImage2}
                onChange={setNewImage2}
              />
              <EditImageSlot
                label="image3"
                existingUrl={product.image3}
                newFile={newImage3}
                onChange={setNewImage3}
              />
              <EditImageSlot
                label="image4"
                existingUrl={product.image4}
                newFile={newImage4}
                onChange={setNewImage4}
              />
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-[#14172E] mb-2">
              Product Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-[#E3D9CB] bg-[#FFFDFB] text-[#14172E] outline-none focus:border-[#FF6A3D] focus:ring-2 focus:ring-[#FF6A3D]/20 transition-all duration-200"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-[#14172E] mb-2">
              Product Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-[#E3D9CB] bg-[#FFFDFB] text-[#14172E] outline-none focus:border-[#FF6A3D] focus:ring-2 focus:ring-[#FF6A3D]/20 transition-all duration-200 resize-none"
            />
          </div>

          {/* Category / Sub Category / Price */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#14172E] mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#E3D9CB] bg-[#FFFDFB] text-[#14172E] outline-none focus:border-[#FF6A3D] focus:ring-2 focus:ring-[#FF6A3D]/20 transition-all duration-200 cursor-pointer"
              >
                <option value="Men">Men</option>
                <option value="Women">Women</option>
                <option value="Kids">Kids</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#14172E] mb-2">
                Sub Category
              </label>
              <select
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#E3D9CB] bg-[#FFFDFB] text-[#14172E] outline-none focus:border-[#FF6A3D] focus:ring-2 focus:ring-[#FF6A3D]/20 transition-all duration-200 cursor-pointer"
              >
                <option value="Topwear">Topwear</option>
                <option value="Bottomwear">Bottomwear</option>
                <option value="Winterwear">Winterwear</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#14172E] mb-2">
                Price (₹)
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                min="0"
                required
                className="w-full px-4 py-3 rounded-xl border border-[#E3D9CB] bg-[#FFFDFB] text-[#14172E] outline-none focus:border-[#FF6A3D] focus:ring-2 focus:ring-[#FF6A3D]/20 transition-all duration-200"
              />
            </div>
          </div>

          {/* Sizes */}
          <div>
            <label className="block text-sm font-semibold text-[#14172E] mb-3">
              Sizes
            </label>
            <div className="flex flex-wrap gap-3">
              {AVAILABLE_SIZES.map((size) => {
                const isSelected = sizes.includes(size);
                return (
                  <motion.button
                    key={size}
                    type="button"
                    onClick={() => toggleSize(size)}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.94 }}
                    className={`px-4 py-2 rounded-full font-semibold text-sm transition-colors duration-200 ${
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

          {/* Bestseller */}
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

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <motion.button
              type="button"
              onClick={onClose}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 px-6 py-3 rounded-xl font-semibold text-[#50546B] bg-[#F3EFE7] hover:bg-[#EAE3D6] transition-all duration-200"
            >
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              disabled={saving}
              whileHover={{ scale: saving ? 1 : 1.02 }}
              whileTap={{ scale: saving ? 1 : 0.98 }}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all duration-200 ${
                saving
                  ? "bg-[#3B4CE0]/70 cursor-not-allowed"
                  : "bg-[#3B4CE0] hover:bg-[#2E3BC4]"
              }`}
            >
              {saving && (
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              )}
              {saving ? "Saving..." : "Save Changes"}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

// =============================================================================
// SUB COMPONENT — DELETE CONFIRMATION MODAL
// =============================================================================
function DeleteConfirmModal({ product, onCancel, onConfirm, deleting }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[90] bg-black/50 flex items-center justify-center p-4"
      onClick={onCancel}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.85 }}
        transition={{ duration: 0.25 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-7 text-center"
      >
        <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
          <Trash2 size={24} className="text-red-500" />
        </div>

        <h3
          className="text-xl text-[#14172E] mb-2"
          style={{ fontFamily: "'Baloo 2', sans-serif", fontWeight: 700 }}
        >
          Delete this product?
        </h3>
        <p className="text-sm text-[#8A8578] mb-6">
          "{product.name}" will be permanently removed. This action cannot be
          undone.
        </p>

        <div className="flex gap-3">
          <motion.button
            onClick={onCancel}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 px-5 py-3 rounded-xl font-semibold text-[#50546B] bg-[#F3EFE7] hover:bg-[#EAE3D6] transition-all duration-200"
          >
            Cancel
          </motion.button>
          <motion.button
            onClick={onConfirm}
            disabled={deleting}
            whileHover={{ scale: deleting ? 1 : 1.02 }}
            whileTap={{ scale: deleting ? 1 : 0.98 }}
            className={`flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-white transition-all duration-200 ${
              deleting
                ? "bg-red-400 cursor-not-allowed"
                : "bg-red-500 hover:bg-red-600"
            }`}
          >
            {deleting && (
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            )}
            {deleting ? "Deleting..." : "Delete"}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// =============================================================================
// MAIN COMPONENT — LIST
// =============================================================================
function List() {
  const { serverUrl } = useContext(authDataContext);

  // ---------------------------------------------------------------------
  // STATE
  // ---------------------------------------------------------------------
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [deleteTarget, setDeleteTarget] = useState(null); // product pending deletion
  const [deletingId, setDeletingId] = useState(null); // id currently being deleted

  const [editTarget, setEditTarget] = useState(null); // product currently being edited

  const [toast, setToast] = useState(null); // { type: "success" | "error", message }

  // ---------------------------------------------------------------------
  // FETCH PRODUCTS ON MOUNT
  // ---------------------------------------------------------------------
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const result = await axios.get(
          serverUrl + "/api/product/listproduct",
          { withCredentials: true }
        );
        console.log(result.data);

        // Support both { products: [...] } and a raw array response shape
        const productList = Array.isArray(result.data)
          ? result.data
          : result.data.products || [];

        setProducts(productList);
      } catch (err) {
        console.log(err);
        showToast("error", "Failed to load products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [serverUrl]);

  // ---------------------------------------------------------------------
  // TOAST HELPER — auto dismiss after 3 seconds
  // ---------------------------------------------------------------------
  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  // ---------------------------------------------------------------------
  // DELETE HANDLERS
  // ---------------------------------------------------------------------
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      setDeletingId(deleteTarget._id);

      await axios.delete(
        `${serverUrl}/api/product/removeproduct/${deleteTarget._id}`,
        { withCredentials: true }
      );

      // Remove from UI instantly, no refetch needed
      setProducts((prev) => prev.filter((p) => p._id !== deleteTarget._id));
      showToast("success", "Product deleted successfully.");
    } catch (err) {
      console.log(err);
      showToast("error", "Failed to delete product.");
    } finally {
      setDeletingId(null);
      setDeleteTarget(null);
    }
  };

  // ---------------------------------------------------------------------
  // EDIT HANDLERS
  // ---------------------------------------------------------------------
  const handleSaveEdit = (updatedProduct) => {
    setProducts((prev) =>
      prev.map((p) => (p._id === updatedProduct._id ? updatedProduct : p))
    );
    setEditTarget(null);
    showToast("success", "Product updated successfully.");
  };

  // ---------------------------------------------------------------------
  // FRONTEND SEARCH FILTER (name / category / subCategory)
  // ---------------------------------------------------------------------
  const filteredProducts = products.filter((p) => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return true;

    return (
      p.name?.toLowerCase().includes(query) ||
      p.category?.toLowerCase().includes(query) ||
      p.subCategory?.toLowerCase().includes(query)
    );
  });

  // ---------------------------------------------------------------------
  // ANALYTICS CALCULATIONS
  // ---------------------------------------------------------------------
  const totalProducts = products.length;
  const totalBestsellers = products.filter((p) => p.bestseller).length;
  const totalCategories = new Set(products.map((p) => p.category)).size;
  const averagePrice =
    products.length > 0
      ? Math.round(
          products.reduce((sum, p) => sum + Number(p.price || 0), 0) /
            products.length
        )
      : 0;

  // ---------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------
  return (
    <div
      className="min-h-screen w-full bg-[#FAF7F1]"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <Nav />

      {/* Toast Notification */}
      <Toast toast={toast} />

      {/* Mobile Sidebar */}
      <div className="md:hidden">
        <Sidebar />
      </div>

      <div className="flex min-h-[calc(100vh-80px)]">
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <Sidebar />
        </div>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 md:p-10 min-w-0">
          <div className="max-w-6xl mx-auto">
            {/* Header Row: Heading + Search */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
            >
              <div>
                <h1
                  className="text-3xl sm:text-4xl text-[#14172E]"
                  style={{ fontFamily: "'Baloo 2', sans-serif", fontWeight: 700 }}
                >
                  All <span className="text-[#FF6A3D]">Products</span>
                </h1>
                <p className="text-[#8A8578] mt-2 text-sm sm:text-base">
                  Manage your entire product catalog in one place.
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative w-full sm:w-72">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B4AFA1]"
                />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search Products..."
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#E3D9CB] bg-white text-[#14172E] placeholder:text-[#B4AFA1] outline-none focus:border-[#FF6A3D] focus:ring-2 focus:ring-[#FF6A3D]/20 transition-all duration-200"
                />
              </div>
            </motion.div>

            {/* Analytics Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <AnalyticsCard
                label="Total Products"
                value={totalProducts}
                delay={0}
              />
              <AnalyticsCard
                label="Bestsellers"
                value={totalBestsellers}
                delay={0.05}
              />
              <AnalyticsCard
                label="Categories"
                value={totalCategories}
                delay={0.1}
              />
              <AnalyticsCard
                label="Average Price"
                value={formatPrice(averagePrice)}
                delay={0.15}
              />
            </div>

            {/* Product List */}
            {loading ? (
              // -------------------- SKELETON LOADERS --------------------
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <SkeletonRow key={i} />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              // -------------------- EMPTY STATE --------------------
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl shadow-md py-16 px-6 text-center"
              >
                <div className="w-20 h-20 rounded-full bg-[#F3EFE7] flex items-center justify-center mx-auto mb-5">
                  <PackageX size={34} className="text-[#B4AFA1]" />
                </div>
                <h3
                  className="text-xl text-[#14172E] mb-2"
                  style={{
                    fontFamily: "'Baloo 2', sans-serif",
                    fontWeight: 700,
                  }}
                >
                  No Products Found
                </h3>
                <p className="text-sm text-[#8A8578]">
                  {products.length === 0
                    ? "Start by adding your first product."
                    : "Try adjusting your search term."}
                </p>
              </motion.div>
            ) : (
              <>
                {/* -------------------- DESKTOP TABLE VIEW -------------------- */}
                <div className="hidden lg:block bg-white rounded-3xl shadow-md overflow-hidden">
                  {/* Table Header */}
                  <div className="grid grid-cols-[80px_1.6fr_1fr_1fr_0.8fr_1.4fr_0.9fr_1fr_140px] gap-4 px-6 py-4 border-b border-[#F2ECE1] text-xs font-bold text-[#8A8578] uppercase tracking-wide">
                    <span>Image</span>
                    <span>Name</span>
                    <span>Category</span>
                    <span>Sub Category</span>
                    <span>Price</span>
                    <span>Sizes</span>
                    <span>Status</span>
                    <span>Created</span>
                    <span className="text-right">Actions</span>
                  </div>

                  {/* Table Rows */}
                  <AnimatePresence>
                    {filteredProducts.map((product) => (
                      <motion.div
                        key={product._id}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, x: -40 }}
                        transition={{ duration: 0.3 }}
                        className="grid grid-cols-[80px_1.6fr_1fr_1fr_0.8fr_1.4fr_0.9fr_1fr_140px] gap-4 px-6 py-4 items-center border-b border-[#F2ECE1] last:border-b-0 hover:bg-[#FFFBF6] transition-colors duration-200"
                      >
                        <img
                          src={product.image1}
                          alt={product.name}
                          className="w-20 h-20 rounded-xl object-cover shadow-sm"
                        />
                        <span className="font-semibold text-[#14172E] truncate">
                          {product.name}
                        </span>
                        <span className="text-sm text-[#50546B]">
                          {product.category}
                        </span>
                        <span className="text-sm text-[#50546B]">
                          {product.subCategory}
                        </span>
                        <span className="font-semibold text-[#14172E]">
                          {formatPrice(product.price)}
                        </span>
                        <SizeChips sizes={product.sizes} />
                        <BestsellerBadge isBestseller={product.bestseller} />
                        <span className="text-sm text-[#8A8578]">
                          {formatDate(product.date || product.createdAt)}
                        </span>

                        {/* Actions */}
                        <div className="flex items-center justify-end gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setEditTarget(product)}
                            className="p-2.5 rounded-xl bg-[#3B4CE0]/10 text-[#3B4CE0] hover:bg-[#3B4CE0] hover:text-white transition-all duration-200"
                          >
                            <Pencil size={16} />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setDeleteTarget(product)}
                            className="p-2.5 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-200"
                          >
                            <Trash2 size={16} />
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* -------------------- TABLET / MOBILE STACKED CARDS -------------------- */}
                <div className="lg:hidden space-y-4">
                  <AnimatePresence>
                    {filteredProducts.map((product) => (
                      <motion.div
                        key={product._id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -40 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white rounded-2xl shadow-md p-4 sm:p-5"
                      >
                        <div className="flex gap-4">
                          <img
                            src={product.image1}
                            alt={product.name}
                            className="w-[60px] h-[60px] sm:w-20 sm:h-20 rounded-xl object-cover shadow-sm shrink-0"
                          />

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <h4 className="font-semibold text-[#14172E] truncate">
                                  {product.name}
                                </h4>
                                <p className="text-xs text-[#8A8578] mt-0.5">
                                  {product.category} • {product.subCategory}
                                </p>
                              </div>
                              <span className="font-bold text-[#14172E] shrink-0">
                                {formatPrice(product.price)}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 mt-3 flex-wrap">
                              <BestsellerBadge
                                isBestseller={product.bestseller}
                              />
                              <span className="text-[11px] text-[#B4AFA1]">
                                {formatDate(product.date || product.createdAt)}
                              </span>
                            </div>

                            <div className="mt-3">
                              <SizeChips sizes={product.sizes} />
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-[#F2ECE1]">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setEditTarget(product)}
                            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#3B4CE0]/10 text-[#3B4CE0] font-semibold text-sm hover:bg-[#3B4CE0] hover:text-white transition-all duration-200"
                          >
                            <Pencil size={15} /> Edit
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setDeleteTarget(product)}
                            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-50 text-red-500 font-semibold text-sm hover:bg-red-500 hover:text-white transition-all duration-200"
                          >
                            <Trash2 size={15} /> Delete
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </>
            )}
          </div>
        </main>
      </div>

      {/* -------------------- DELETE CONFIRMATION MODAL -------------------- */}
      <AnimatePresence>
        {deleteTarget && (
          <DeleteConfirmModal
            product={deleteTarget}
            deleting={deletingId === deleteTarget._id}
            onCancel={() => setDeleteTarget(null)}
            onConfirm={handleConfirmDelete}
          />
        )}
      </AnimatePresence>

      {/* -------------------- EDIT PRODUCT MODAL -------------------- */}
      <AnimatePresence>
        {editTarget && (
          <EditProductModal
            product={editTarget}
            serverUrl={serverUrl}
            onClose={() => setEditTarget(null)}
            onSave={handleSaveEdit}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default List;