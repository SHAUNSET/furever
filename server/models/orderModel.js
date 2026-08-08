import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    // User who placed the order
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Products included in the order
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },

        name: {
          type: String,
          required: true,
        },

        image: {
          type: String,
          required: true,
        },

        price: {
          type: Number,
          required: true,
        },

        size: {
          type: String,
          required: true,
        },

        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],

    // Final order amount
    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    // Delivery address
    address: {
      type: Object,
      required: true,
    },

    // Order status
    status: {
      type: String,
      default: "Placed",
      enum: [
        "Placed",
        "Processing",
        "Shipped",
        "Out for delivery",
        "Delivered",
        "Cancelled",
      ],
    },

    // Payment method
    paymentMethod: {
      type: String,
      required: true,
      enum: [
        "COD",
        "Razorpay",
      ],
    },

    // Whether payment has been completed
    payment: {
      type: Boolean,
      default: false,
    },

    // Razorpay payment ID (set once payment is verified)
    paymentId: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model(
  "Order",
  orderSchema
);

export default Order;