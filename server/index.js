import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import feedbackRoutes from "./routes/feedbackRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

dotenv.config();


// ---------------- CONNECT DATABASE ----------------

await connectDB();


// ---------------- CREATE APP ----------------

const app = express();

const port =
  process.env.PORT || 8000;


// ---------------- MIDDLEWARES ----------------

app.use(
  express.json()
);

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(
  cookieParser()
);

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
    ],

    credentials: true,
  })
);


// ---------------- API ROUTES ----------------

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/user",
  userRoutes
);

app.use(
  "/api/product",
  productRoutes
);

app.use(
  "/api/feedback",
  feedbackRoutes
);


// ---------------- CART ROUTES ----------------

console.log(
  "✅ Mounting cart routes at /api/cart"
);

app.use(
  "/api/cart",
  cartRoutes
);


// ---------------- ORDER ROUTES ----------------

console.log(
  "✅ Mounting order routes at /api/order"
);

app.use(
  "/api/order",
  orderRoutes
);


// ---------------- CART TEST ROUTE ----------------

app.get(
  "/api/cart-test",

  (req, res) => {

    return res.status(200).json({

      success: true,

      message:
        "Backend is running and cart testing route works",

    });

  }
);


// ---------------- HOME TEST ROUTE ----------------

app.get(
  "/",

  (req, res) => {

    return res.send(
      "FurEver Backend Running 🚀"
    );

  }
);


// ---------------- START SERVER ----------------

app.listen(
  port,

  () => {

    console.log(
      `🚀 Server is running on port ${port}`
    );

  }
);