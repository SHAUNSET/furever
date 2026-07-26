import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import axios from "axios";
import { authDataContext } from "./Authcontext.jsx";

export const shopDataContext = createContext();

function ShopContext({ children }) {
  const { serverUrl } = useContext(authDataContext);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("furever-cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const currency = "₹";
  const deliveryFee = 50;

  // ---------------- GET PRODUCTS ----------------

  const getProducts = async () => {
    try {
      setLoading(true);

      const result = await axios.get(
        `${serverUrl}/api/product/listproduct`
      );

      if (result.data.success) {
        setProducts(result.data.products);
      }
    } catch (error) {
      console.log("Get Products Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  // ---------------- SAVE CART ----------------

  useEffect(() => {
    localStorage.setItem(
      "furever-cart",
      JSON.stringify(cartItems)
    );
  }, [cartItems]);

  // ---------------- ADD TO CART ----------------

  const addToCart = (productId, size, quantity = 1) => {
  setCartItems((prev) => {
    const existingItem = prev.find(
      (item) =>
        item.productId === productId &&
        item.size === size
    );

    if (existingItem) {
      return prev.map((item) =>
        item.productId === productId &&
        item.size === size
          ? {
              ...item,
              quantity: item.quantity + quantity,
            }
          : item
      );
    }

    return [
      ...prev,
      {
        productId,
        size,
        quantity,
      },
    ];
  });
};

  // ---------------- REMOVE FROM CART ----------------

  const removeFromCart = (productId, size) => {
    setCartItems((prev) =>
      prev.filter(
        (item) =>
          !(
            item.productId === productId &&
            item.size === size
          )
      )
    );
  };

  // ---------------- UPDATE QUANTITY ----------------

  const updateQuantity = (
    productId,
    size,
    quantity
  ) => {
    if (quantity <= 0) {
      removeFromCart(productId, size);
      return;
    }

    setCartItems((prev) =>
      prev.map((item) =>
        item.productId === productId &&
        item.size === size
          ? {
              ...item,
              quantity,
            }
          : item
      )
    );
  };

  // ---------------- CART COUNT ----------------

  const getCartCount = () => {
    return cartItems.reduce(
      (total, item) =>
        total + item.quantity,
      0
    );
  };

  // ---------------- CART TOTAL ----------------

  const getCartAmount = () => {
    return cartItems.reduce(
      (total, item) => {
        const product = products.find(
          (product) =>
            product._id === item.productId
        );

        if (!product) return total;

        return (
          total +
          product.price * item.quantity
        );
      },
      0
    );
  };

  const value = {
    products,
    setProducts,
    loading,
    getProducts,

    currency,
    deliveryFee,

    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    getCartCount,
    getCartAmount,
  };

  return (
    <shopDataContext.Provider value={value}>
      {children}
    </shopDataContext.Provider>
  );
}

export default ShopContext;