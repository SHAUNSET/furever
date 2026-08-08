import crypto from "crypto";

import Razorpay from "razorpay";

import Order from "../models/orderModel.js";
import User from "../models/userModel.js";


// ==========================================================
// RAZORPAY INSTANCE
// ==========================================================

const razorpayInstance = new Razorpay({

  key_id:
    process.env.RAZORPAY_KEY_ID,

  key_secret:
    process.env.RAZORPAY_KEY_SECRET,

});


// ==========================================================
// PLACE COD ORDER
// ==========================================================

export const placeOrder = async (
  req,
  res
) => {

  try {

    const {

      items,

      amount,

      address,

    } = req.body;


    const userId =
      req.user._id;


    // ------------------------------------------------------
    // VALIDATION
    // ------------------------------------------------------

    if (

      !items ||

      Object.keys(
        items
      ).length === 0

    ) {

      return res.status(400).json({

        success:
          false,

        message:
          "Cart is empty.",

      });

    }


    if (

      !amount ||

      Number(amount) <= 0

    ) {

      return res.status(400).json({

        success:
          false,

        message:
          "A valid order amount is required.",

      });

    }


    if (
      !address
    ) {

      return res.status(400).json({

        success:
          false,

        message:
          "Delivery address is required.",

      });

    }


    // ------------------------------------------------------
    // CREATE COD ORDER
    // ------------------------------------------------------

    const newOrder =

      await Order.create({

        userId,

        items,

        amount:
          Number(amount),

        address,

        status:
          "Placed",

        paymentMethod:
          "COD",

        payment:
          false,

      });


    // ------------------------------------------------------
    // CLEAR CART
    // ------------------------------------------------------

    await User.findByIdAndUpdate(

      userId,

      {

        cartData:
          {},

      }

    );


    // ------------------------------------------------------
    // RESPONSE
    // ------------------------------------------------------

    return res.status(201).json({

      success:
        true,

      message:
        "COD order placed successfully.",

      order:
        newOrder,

    });

  }

  catch (
    error
  ) {

    console.log(

      "Place COD Order Error:",

      error

    );


    return res.status(500).json({

      success:
        false,

      message:
        "Unable to place the order.",

    });

  }

};


// ==========================================================
// CREATE RAZORPAY ORDER
// ==========================================================

export const placeOrderRazorpay = async (
  req,
  res
) => {

  try {

    const {

      items,

      amount,

      address,

    } = req.body;


    const userId =
      req.user._id;


    // ------------------------------------------------------
    // VALIDATE ENVIRONMENT VARIABLES
    // ------------------------------------------------------

    if (

      !process.env.RAZORPAY_KEY_ID ||

      !process.env.RAZORPAY_KEY_SECRET

    ) {

      console.log(

        "Razorpay environment variables are missing."

      );


      return res.status(500).json({

        success:
          false,

        message:
          "Payment gateway is not configured.",

      });

    }


    // ------------------------------------------------------
    // VALIDATE CART
    // ------------------------------------------------------

    if (

      !items ||

      Object.keys(
        items
      ).length === 0

    ) {

      return res.status(400).json({

        success:
          false,

        message:
          "Cart is empty.",

      });

    }


    // ------------------------------------------------------
    // VALIDATE AMOUNT
    // ------------------------------------------------------

    if (

      !amount ||

      Number(amount) <= 0

    ) {

      return res.status(400).json({

        success:
          false,

        message:
          "A valid order amount is required.",

      });

    }


    // ------------------------------------------------------
    // VALIDATE ADDRESS
    // ------------------------------------------------------

    if (
      !address
    ) {

      return res.status(400).json({

        success:
          false,

        message:
          "Delivery address is required.",

      });

    }


    // ------------------------------------------------------
    // CREATE ORDER IN MONGODB
    // ------------------------------------------------------

    const newOrder =

      await Order.create({

        userId,

        items,

        amount:
          Number(amount),

        address,

        status:
          "Placed",

        paymentMethod:
          "Razorpay",

        payment:
          false,

      });


    // ------------------------------------------------------
    // CREATE RAZORPAY PAYMENT ORDER
    // ------------------------------------------------------

    const razorpayOrder =

      await razorpayInstance.orders.create({

        // Razorpay accepts amount in paise.
        // ₹499 becomes 49900 paise.

        amount:

          Math.round(

            Number(amount) *
            100

          ),

        currency:
          "INR",

        receipt:

          `order_${newOrder._id}`,

        notes: {

          mongoOrderId:

            String(
              newOrder._id
            ),

          userId:

            String(
              userId
            ),

        },

      });


    // ------------------------------------------------------
    // RESPONSE
    // ------------------------------------------------------

    return res.status(201).json({

      success:
        true,

      message:
        "Razorpay order created successfully.",

      order:
        newOrder,

      razorpayOrder,

      key:

        process.env.RAZORPAY_KEY_ID,

    });

  }

  catch (
    error
  ) {

    console.log(

      "Create Razorpay Order Error:",

      error

    );


    return res.status(500).json({

      success:
        false,

      message:
        "Unable to initialize Razorpay payment.",

    });

  }

};


// ==========================================================
// VERIFY RAZORPAY PAYMENT
// ==========================================================

export const verifyPayment = async (
  req,
  res
) => {

  try {

    const {

      razorpay_order_id,

      razorpay_payment_id,

      razorpay_signature,

    } = req.body;


    const userId =
      req.user._id;


    // ------------------------------------------------------
    // VALIDATION
    // ------------------------------------------------------

    if (

      !razorpay_order_id ||

      !razorpay_payment_id ||

      !razorpay_signature

    ) {

      return res.status(400).json({

        success:
          false,

        message:
          "Incomplete payment verification details.",

      });

    }


    // ------------------------------------------------------
    // VERIFY SIGNATURE
    // ------------------------------------------------------

    const generatedSignature =

      crypto

        .createHmac(

          "sha256",

          process.env.RAZORPAY_KEY_SECRET

        )

        .update(

          `${razorpay_order_id}|${razorpay_payment_id}`

        )

        .digest(
          "hex"
        );


    if (

      generatedSignature !==
      razorpay_signature

    ) {

      return res.status(400).json({

        success:
          false,

        message:
          "Payment verification failed. Signature mismatch.",

      });

    }


    // ------------------------------------------------------
    // FETCH RAZORPAY ORDER TO GET MONGO ORDER ID (FROM NOTES)
    // ------------------------------------------------------

    const razorpayOrder =

      await razorpayInstance.orders.fetch(

        razorpay_order_id

      );


    const mongoOrderId =

      razorpayOrder
        ?.notes
        ?.mongoOrderId;


    if (
      !mongoOrderId
    ) {

      return res.status(404).json({

        success:
          false,

        message:
          "Order reference not found for this payment.",

      });

    }


    // ------------------------------------------------------
    // UPDATE ORDER (SCOPED TO THIS USER, FOR SAFETY)
    // ------------------------------------------------------

    const updatedOrder =

      await Order.findOneAndUpdate(

        {

          _id:
            mongoOrderId,

          userId,

        },

        {

          payment:
            true,

          paymentId:
            razorpay_payment_id,

          status:
            "Placed",

        },

        {

          new:
            true,

        }

      );


    if (
      !updatedOrder
    ) {

      return res.status(404).json({

        success:
          false,

        message:
          "Order not found.",

      });

    }


    // ------------------------------------------------------
    // CLEAR CART
    // ------------------------------------------------------

    await User.findByIdAndUpdate(

      userId,

      {

        cartData:
          {},

      }

    );


    // ------------------------------------------------------
    // RESPONSE
    // ------------------------------------------------------

    return res.status(200).json({

      success:
        true,

      message:
        "Payment successful! Your order has been placed.",

      order:
        updatedOrder,

    });

  }

  catch (
    error
  ) {

    console.log(

      "Verify Payment Error:",

      error

    );


    return res.status(500).json({

      success:
        false,

      message:
        "Unable to verify payment.",

    });

  }

};


// ==========================================================
// GET LOGGED-IN USER ORDERS
// ==========================================================

export const getUserOrders = async (
  req,
  res
) => {

  try {

    const userId =
      req.user._id;


    const orders =

      await Order.find({

        userId:

          userId,

      })

      .sort({

        createdAt:
          -1,

      });


    return res.status(200).json({

      success:
        true,

      orders:
        orders,

    });

  }

  catch (
    error
  ) {

    console.log(

      "Get User Orders Error:",

      error

    );


    return res.status(500).json({

      success:
        false,

      message:
        "Unable to fetch orders.",

    });

  }

};


// ==========================================================
// ADMIN: GET ALL ORDERS
// ==========================================================

export const allOrders = async (
  req,
  res
) => {

  try {

    const orders =

      await Order.find({})

      .sort({

        createdAt:
          -1,

      });


    return res.status(200).json({

      success:
        true,

      orders:
        orders,

    });

  }

  catch (
    error
  ) {

    console.log(

      "Get All Orders Error:",

      error

    );


    return res.status(500).json({

      success:
        false,

      message:
        "Unable to fetch all orders.",

    });

  }

};


// ==========================================================
// ADMIN: UPDATE ORDER STATUS
// ==========================================================

export const updateStatus = async (
  req,
  res
) => {

  try {

    const {

      orderId,

    } = req.params;


    const {

      status,

    } = req.body;


    // ------------------------------------------------------
    // VALIDATION
    // ------------------------------------------------------

    if (
      !orderId
    ) {

      return res.status(400).json({

        success:
          false,

        message:
          "Order ID is required.",

      });

    }


    if (
      !status
    ) {

      return res.status(400).json({

        success:
          false,

        message:
          "Order status is required.",

      });

    }


    // ------------------------------------------------------
    // ALLOWED STATUS VALUES
    // ------------------------------------------------------

    const validStatuses = [

      "Placed",

      "Processing",

      "Shipped",

      "Out for delivery",

      "Delivered",

      "Cancelled",

    ];


    if (

      !validStatuses.includes(
        status
      )

    ) {

      return res.status(400).json({

        success:
          false,

        message:
          "Invalid order status.",

      });

    }


    // ------------------------------------------------------
    // UPDATE ORDER
    // ------------------------------------------------------

    const updatedOrder =

      await Order.findByIdAndUpdate(

        orderId,

        {

          status:
            status,

        },

        {

          new:
            true,

        }

      );


    // ------------------------------------------------------
    // ORDER NOT FOUND
    // ------------------------------------------------------

    if (
      !updatedOrder
    ) {

      return res.status(404).json({

        success:
          false,

        message:
          "Order not found.",

      });

    }


    // ------------------------------------------------------
    // RESPONSE
    // ------------------------------------------------------

    return res.status(200).json({

      success:
        true,

      message:
        "Order status updated successfully.",

      order:
        updatedOrder,

    });

  }

  catch (
    error
  ) {

    console.log(

      "Update Order Status Error:",

      error

    );


    return res.status(500).json({

      success:
        false,

      message:
        "Unable to update order status.",

    });

  }

};