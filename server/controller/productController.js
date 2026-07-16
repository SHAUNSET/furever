import Product from "../models/productModel.js";
import uploadOnCloudinary from "../config/cloudinary.js";

export const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      subCategory,
      sizes,
      bestseller,
    } = req.body;

    if (!req.files?.image1?.[0]) {
      return res.status(400).json({
        success: false,
        message: "Image 1 is required",
      });
    }

    // Upload images to Cloudinary
    const image1 = await uploadOnCloudinary(req.files.image1[0].path);

    const image2 = req.files?.image2?.[0]
      ? await uploadOnCloudinary(req.files.image2[0].path)
      : "";

    const image3 = req.files?.image3?.[0]
      ? await uploadOnCloudinary(req.files.image3[0].path)
      : "";

    const image4 = req.files?.image4?.[0]
      ? await uploadOnCloudinary(req.files.image4[0].path)
      : "";

    const productData = {
      name,
      description,
      price: Number(price),
      category,
      subCategory,
      sizes: JSON.parse(sizes),
      bestseller: bestseller === "true",
      date: Date.now(),
      image1,
      image2,
      image3,
      image4,
    };

    const product = await Product.create(productData);

    return res.status(201).json({
      success: true,
      message: "Product Added Successfully",
      product,
    });
  } catch (error) {
    console.log("Add Product Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


export const listProduct = async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.log("List Product Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const removeProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product Removed Successfully",
      product,
    });
  } catch (error) {
    console.log("Remove Product Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      description,
      price,
      category,
      subCategory,
      sizes,
      bestseller,
    } = req.body;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Upload new images if provided
    const image1 = req.files?.image1?.[0]
      ? await uploadOnCloudinary(req.files.image1[0].path)
      : product.image1;

    const image2 = req.files?.image2?.[0]
      ? await uploadOnCloudinary(req.files.image2[0].path)
      : product.image2;

    const image3 = req.files?.image3?.[0]
      ? await uploadOnCloudinary(req.files.image3[0].path)
      : product.image3;

    const image4 = req.files?.image4?.[0]
      ? await uploadOnCloudinary(req.files.image4[0].path)
      : product.image4;

    product.name = name;
    product.description = description;
    product.price = Number(price);
    product.category = category;
    product.subCategory = subCategory;
    product.sizes = JSON.parse(sizes);
    product.bestseller = bestseller === "true";

    product.image1 = image1;
    product.image2 = image2;
    product.image3 = image3;
    product.image4 = image4;

    await product.save();

    return res.status(200).json({
      success: true,
      message: "Product Updated Successfully",
      product,
    });
  } catch (error) {
    console.log("Update Product Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};