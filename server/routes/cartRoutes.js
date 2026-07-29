import express from "express";

import {
  addToCart,
  updateCart,
  removeFromCart,
  clearCart,
  getCartData,
} from "../controller/cartController.js";

import userAuth from "../middleware/userAuth.js";

const cartRoutes = express.Router();


// ---------------- ROUTER TEST ----------------

cartRoutes.get(
  "/test",
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "Cart router is working",
    });
  }
);


// ---------------- GET CART DATA ----------------

cartRoutes.get(
  "/get",
  userAuth,
  getCartData
);


// ---------------- ADD PRODUCT TO CART ----------------

cartRoutes.post(
  "/add",
  userAuth,
  addToCart
);


// ---------------- UPDATE CART QUANTITY ----------------

cartRoutes.post(
  "/update",
  userAuth,
  updateCart
);


// ---------------- REMOVE PRODUCT FROM CART ----------------

cartRoutes.post(
  "/remove",
  userAuth,
  removeFromCart
);


// ---------------- CLEAR ENTIRE CART ----------------

cartRoutes.post(
  "/clear",
  userAuth,
  clearCart
);


export default cartRoutes;