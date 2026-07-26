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

  const currency = "₹";
  const deliveryFee = 50;

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
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  const value = {
    products,
    setProducts,
    loading,
    getProducts,
    currency,
    deliveryFee,
  };

  return (
    <shopDataContext.Provider value={value}>
      {children}
    </shopDataContext.Provider>
  );
}

export default ShopContext;