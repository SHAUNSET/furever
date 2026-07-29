import User from "../models/userModel.js";

// ======================================================
// ADD TO CART
// ======================================================

export const addToCart = async (req, res) => {
  try {
    const userId = req.user._id;

    const {
      productId,
      size,
      quantity = 1,
    } = req.body;

    // ---------------- VALIDATION ----------------

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required.",
      });
    }

    if (Number(quantity) <= 0) {
      return res.status(400).json({
        success: false,
        message:
          "Quantity must be greater than zero.",
      });
    }

    // ---------------- FIND USER ----------------

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // ---------------- GET CART ----------------

    const cartData = user.cartData || {};

    const selectedSize = size || "default";

    // Create product object if it does not exist

    if (!cartData[productId]) {
      cartData[productId] = {};
    }

    // Same product + same size:
    // increase quantity

    if (cartData[productId][selectedSize]) {
      cartData[productId][selectedSize] +=
        Number(quantity);
    } else {
      cartData[productId][selectedSize] =
        Number(quantity);
    }

    // Save modified cart

    user.cartData = cartData;

    user.markModified("cartData");

    await user.save();

    return res.status(200).json({
      success: true,
      message:
        "Product added to cart successfully.",
      cartData: user.cartData,
    });

  } catch (error) {
    console.log(
      "Add To Cart Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to add product to cart.",
    });
  }
};


// ======================================================
// GET CART DATA
// ======================================================

export const getCartData = async (
  req,
  res
) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(
      userId
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      cartData:
        user.cartData || {},
    });

  } catch (error) {
    console.log(
      "Get Cart Data Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to fetch cart data.",
    });
  }
};


// ======================================================
// UPDATE CART QUANTITY
// ======================================================

export const updateCart = async (
  req,
  res
) => {
  try {
    const userId = req.user._id;

    const {
      productId,
      size,
      quantity,
    } = req.body;

    // ---------------- VALIDATION ----------------

    if (
      !productId ||
      quantity === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Product ID and quantity are required.",
      });
    }

    const user = await User.findById(
      userId
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const cartData =
      user.cartData || {};

    const selectedSize =
      size || "default";

    // Check whether item exists

    if (
      !cartData[productId] ||
      cartData[productId][
        selectedSize
      ] === undefined
    ) {
      return res.status(404).json({
        success: false,
        message:
          "Product not found in cart.",
      });
    }

    // Quantity 0 removes item

    if (Number(quantity) <= 0) {
      delete cartData[productId][
        selectedSize
      ];

      // Remove product if no sizes remain

      if (
        Object.keys(
          cartData[productId]
        ).length === 0
      ) {
        delete cartData[productId];
      }

    } else {
      cartData[productId][
        selectedSize
      ] = Number(quantity);
    }

    user.cartData = cartData;

    user.markModified(
      "cartData"
    );

    await user.save();

    return res.status(200).json({
      success: true,
      message:
        "Cart updated successfully.",
      cartData:
        user.cartData,
    });

  } catch (error) {
    console.log(
      "Update Cart Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to update cart.",
    });
  }
};


// ======================================================
// REMOVE FROM CART
// ======================================================

export const removeFromCart = async (
  req,
  res
) => {
  try {
    const userId = req.user._id;

    const {
      productId,
      size,
    } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message:
          "Product ID is required.",
      });
    }

    const user = await User.findById(
      userId
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const cartData =
      user.cartData || {};

    const selectedSize =
      size || "default";

    // Check whether item exists

    if (
      !cartData[productId] ||
      cartData[productId][
        selectedSize
      ] === undefined
    ) {
      return res.status(404).json({
        success: false,
        message:
          "Product not found in cart.",
      });
    }

    // Remove selected size

    delete cartData[productId][
      selectedSize
    ];

    // Remove product if no sizes remain

    if (
      Object.keys(
        cartData[productId]
      ).length === 0
    ) {
      delete cartData[productId];
    }

    user.cartData = cartData;

    user.markModified(
      "cartData"
    );

    await user.save();

    return res.status(200).json({
      success: true,
      message:
        "Product removed from cart.",
      cartData:
        user.cartData,
    });

  } catch (error) {
    console.log(
      "Remove Cart Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to remove product.",
    });
  }
};


// ======================================================
// CLEAR ENTIRE CART
// ======================================================

export const clearCart = async (
  req,
  res
) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(
      userId
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    user.cartData = {};

    user.markModified(
      "cartData"
    );

    await user.save();

    return res.status(200).json({
      success: true,
      message:
        "Cart cleared successfully.",
      cartData: {},
    });

  } catch (error) {
    console.log(
      "Clear Cart Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to clear cart.",
    });
  }
};