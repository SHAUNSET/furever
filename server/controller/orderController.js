import Order from "../models/orderModel.js";
import User from "../models/userModel.js";

export const placeOrder = async (req, res) => {
  try {
    const {
      items,
      amount,
      address,
    } = req.body;

    const userId = req.user._id;

    // ---------------- VALIDATION ----------------

    if (
      !items ||
      Object.keys(items).length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty.",
      });
    }

    if (!amount) {
      return res.status(400).json({
        success: false,
        message:
          "Order amount is required.",
      });
    }

    if (!address) {
      return res.status(400).json({
        success: false,
        message:
          "Delivery address is required.",
      });
    }

    // ---------------- ORDER DATA ----------------

    const orderData = {
      userId,

      items,

      amount,

      address,

      status: "Placed",

      paymentMethod: "COD",

      payment: false,
    };

    // ---------------- CREATE ORDER ----------------

    const newOrder =
      await Order.create(
        orderData
      );

    // ---------------- CLEAR USER CART ----------------

    await User.findByIdAndUpdate(
      userId,
      {
        cartData: {},
      }
    );

    // ---------------- RESPONSE ----------------

    return res.status(201).json({
      success: true,

      message:
        "Order placed successfully.",

      order: newOrder,
    });

  } catch (error) {

    console.log(
      "Place Order Error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Unable to place order.",
    });
  }
};

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

  } catch (error) {

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

