import express from "express";
import upload from "../middleware/multer.js";
import adminAuth from "../middleware/adminAuth.js";

import {
  addProduct,
  listProduct,
  removeProduct,
  updateProduct,
} from "../controller/productController.js";

const productRoutes = express.Router();

productRoutes.post(
  "/addproduct",
  adminAuth,
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
  ]),
  addProduct
);

productRoutes.get("/listproduct", listProduct);

productRoutes.delete("/removeproduct/:id", adminAuth, removeProduct);

productRoutes.put(
  "/updateproduct/:id",
  adminAuth,
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
  ]),
  updateProduct
);

export default productRoutes;