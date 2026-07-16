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