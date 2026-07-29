import express from "express";
import upload from "../middleware/multer.js";
import adminAuth from "../middleware/adminAuth.js";
import userAuth from "../middleware/userAuth.js";

import {
  addProduct,
  listProduct,
  removeProduct,
  updateProduct,
  addReview,
  getReviews,
} from "../controller/productController.js";

const productRoutes = express.Router();


// ===============================
// ADMIN: ADD PRODUCT
// ===============================

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


// ===============================
// PUBLIC: LIST ALL PRODUCTS
// ===============================

productRoutes.get(
  "/listproduct",
  listProduct
);


// ===============================
// USER: ADD REVIEW AND RATING
// ===============================

productRoutes.post(
  "/:id/review",
  userAuth,
  addReview
);

productRoutes.get(
  "/:id/reviews",
  getReviews
);


// ===============================
// ADMIN: REMOVE PRODUCT
// ===============================

productRoutes.delete(
  "/removeproduct/:id",
  adminAuth,
  removeProduct
);


// ===============================
// ADMIN: UPDATE PRODUCT
// ===============================

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