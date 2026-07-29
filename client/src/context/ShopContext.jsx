import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import axios from "axios";

import { authDataContext } from "./Authcontext.jsx";
import { userDataContext } from "./UserContext.jsx";

export const shopDataContext = createContext();

function ShopContext({ children }) {
  const { serverUrl } = useContext(authDataContext);

  const { userData } = useContext(userDataContext);

  // ---------------- PRODUCTS ----------------

  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  // ---------------- CART ----------------

  const [cartItems, setCartItems] =
    useState({});

  const [cartLoading, setCartLoading] =
    useState(false);

  // ---------------- STORE SETTINGS ----------------

  const currency = "₹";

  const deliveryFee = 50;

  // ==================================================
  // GET PRODUCTS
  // ==================================================

  const getProducts = async () => {
    if (!serverUrl) {
      return;
    }

    try {
      setLoading(true);

      const response = await axios.get(
        `${serverUrl}/api/product/listproduct`
      );

      if (response.data.success) {
        setProducts(
          response.data.products || []
        );
      }

    } catch (error) {
      console.log(
        "Get Products Error:",
        error.response?.data ||
          error.message
      );

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, [serverUrl]);

  // ==================================================
  // GET CART FROM BACKEND
  // ==================================================

  const getCartData = async () => {
    if (
      !userData?._id ||
      !serverUrl
    ) {
      setCartItems({});
      return;
    }

    try {
      setCartLoading(true);

      const response = await axios.get(
        `${serverUrl}/api/cart/get`,
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setCartItems(
          response.data.cartData || {}
        );
      } else {
        setCartItems({});
      }

    } catch (error) {
      console.log(
        "Get Cart Error:",
        error.response?.data ||
          error.message
      );

      setCartItems({});

    } finally {
      setCartLoading(false);
    }
  };

  // ==================================================
  // LOAD CART WHEN USER CHANGES
  // ==================================================

  useEffect(() => {
    if (
      userData?._id &&
      serverUrl
    ) {
      getCartData();

    } else {
      setCartItems({});
    }

  }, [
    userData?._id,
    serverUrl,
  ]);

  // ==================================================
  // ADD TO CART
  // ==================================================

  const addToCart = async (
    productId,
    size,
    quantity = 1
  ) => {
    if (
      !userData?._id ||
      !serverUrl
    ) {
      return false;
    }

    try {
      const response =
        await axios.post(
          `${serverUrl}/api/cart/add`,
          {
            productId,
            size,
            quantity:
              Number(quantity),
          },
          {
            withCredentials: true,
          }
        );

      if (response.data.success) {
        setCartItems(
          response.data.cartData || {}
        );

        return true;
      }

      return false;

    } catch (error) {
      console.log(
        "Add To Cart Error:",
        error.response?.data ||
          error.message
      );

      return false;
    }
  };

  // ==================================================
  // UPDATE CART QUANTITY
  // ==================================================

  const updateQuantity = async (
    productId,
    size,
    quantity
  ) => {
    if (
      !userData?._id ||
      !serverUrl
    ) {
      return false;
    }

    try {
      const response =
        await axios.post(
          `${serverUrl}/api/cart/update`,
          {
            productId,
            size,
            quantity:
              Number(quantity),
          },
          {
            withCredentials: true,
          }
        );

      if (response.data.success) {
        setCartItems(
          response.data.cartData || {}
        );

        return true;
      }

      return false;

    } catch (error) {
      console.log(
        "Update Cart Error:",
        error.response?.data ||
          error.message
      );

      return false;
    }
  };

  // ==================================================
  // REMOVE FROM CART
  // ==================================================

  const removeFromCart = async (
    productId,
    size
  ) => {
    if (
      !userData?._id ||
      !serverUrl
    ) {
      return false;
    }

    try {
      const response =
        await axios.post(
          `${serverUrl}/api/cart/remove`,
          {
            productId,
            size,
          },
          {
            withCredentials: true,
          }
        );

      if (response.data.success) {
        setCartItems(
          response.data.cartData || {}
        );

        return true;
      }

      return false;

    } catch (error) {
      console.log(
        "Remove Cart Error:",
        error.response?.data ||
          error.message
      );

      return false;
    }
  };

  // ==================================================
  // CLEAR CART
  // ==================================================

  const clearCart = async () => {
    if (
      !userData?._id ||
      !serverUrl
    ) {
      setCartItems({});

      return false;
    }

    try {
      const response =
        await axios.post(
          `${serverUrl}/api/cart/clear`,
          {},
          {
            withCredentials: true,
          }
        );

      if (response.data.success) {
        setCartItems({});

        return true;
      }

      return false;

    } catch (error) {
      console.log(
        "Clear Cart Error:",
        error.response?.data ||
          error.message
      );

      return false;
    }
  };

  // ==================================================
  // GET TOTAL CART QUANTITY
  // ==================================================

  const getCartCount = () => {
    let totalCount = 0;

    Object.values(
      cartItems || {}
    ).forEach(
      (productSizes) => {
        Object.values(
          productSizes || {}
        ).forEach(
          (quantity) => {
            totalCount +=
              Number(quantity || 0);
          }
        );
      }
    );

    return totalCount;
  };

  // ==================================================
  // GET TOTAL CART AMOUNT
  // ==================================================

  const getCartAmount = () => {
    let totalAmount = 0;

    Object.entries(
      cartItems || {}
    ).forEach(
      ([
        productId,
        productSizes,
      ]) => {
        const product =
          products.find(
            (item) =>
              item._id ===
              productId
          );

        if (!product) {
          return;
        }

        Object.values(
          productSizes || {}
        ).forEach(
          (quantity) => {
            totalAmount +=
              Number(
                product.price || 0
              ) *
              Number(
                quantity || 0
              );
          }
        );
      }
    );

    return totalAmount;
  };

  // ==================================================
  // CONTEXT VALUE
  // ==================================================

  const value = {
    // Products

    products,

    setProducts,

    loading,

    getProducts,

    // Store

    currency,

    deliveryFee,

    // Cart

    cartItems,

    setCartItems,

    cartLoading,

    getCartData,

    addToCart,

    updateQuantity,

    removeFromCart,

    clearCart,

    getCartCount,

    getCartAmount,
  };

  return (
    <shopDataContext.Provider
      value={value}
    >
      {children}
    </shopDataContext.Provider>
  );
}

export default ShopContext;