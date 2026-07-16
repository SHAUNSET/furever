import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    subCategory: {
      type: String,
      required: true,
    },

    image1: {
      type: String,
      required: true,
    },

    image2: {
      type: String,
      default: "",
    },

    image3: {
      type: String,
      default: "",
    },

    image4: {
      type: String,
      default: "",
    },

    sizes: [
      {
        type: String,
      },
    ],

    bestseller: {
      type: Boolean,
      default: false,
    },

    date: {
      type: Number,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;