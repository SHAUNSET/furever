import express from "express";

import {

  placeOrder,

  getUserOrders,

} from "../controller/orderController.js";

import userAuth from "../middleware/userAuth.js";


const orderRoutes =
  express.Router();


// ===============================
// PLACE ORDER
// ===============================

orderRoutes.post(

  "/placeorder",

  userAuth,

  placeOrder

);


// ===============================
// GET MY ORDERS
// ===============================

orderRoutes.get(

  "/myorders",

  userAuth,

  getUserOrders

);


export default orderRoutes;