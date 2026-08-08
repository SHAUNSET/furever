import express from "express";


import {

  placeOrder,

  placeOrderRazorpay,

  verifyPayment,

  getUserOrders,

  allOrders,

  updateStatus,

} from "../controller/orderController.js";


import userAuth
from "../middleware/userAuth.js";


import adminAuth
from "../middleware/adminAuth.js";


const orderRoutes =

  express.Router();


// ==========================================================
// PLACE COD ORDER
// ==========================================================

orderRoutes.post(

  "/placeorder",

  userAuth,

  placeOrder

);


// ==========================================================
// CREATE RAZORPAY PAYMENT ORDER
// ==========================================================

orderRoutes.post(

  "/placeorderrazorpay",

  userAuth,

  placeOrderRazorpay

);


// ==========================================================
// VERIFY RAZORPAY PAYMENT
// ==========================================================

orderRoutes.post(

  "/verifypayment",

  userAuth,

  verifyPayment

);


// ==========================================================
// GET LOGGED-IN USER ORDERS
// ==========================================================

orderRoutes.get(

  "/myorders",

  userAuth,

  getUserOrders

);


// ==========================================================
// GET ALL ORDERS — ADMIN
// ==========================================================

orderRoutes.get(

  "/allorders",

  adminAuth,

  allOrders

);


// ==========================================================
// UPDATE ORDER STATUS — ADMIN
// ==========================================================

orderRoutes.put(

  "/updatestatus/:orderId",

  adminAuth,

  updateStatus

);


export default orderRoutes;