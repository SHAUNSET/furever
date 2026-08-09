import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import axios from "axios";

import { authDataContext } from "./AuthContext";

export const adminDataContext = createContext();

function AdminContext({ children }) {
  const [adminData, setAdminData] = useState(null);
  const [adminLoading, setAdminLoading] = useState(true);

  const { serverUrl } = useContext(authDataContext);

  // ==========================================
  // GET CURRENT ADMIN
  // ==========================================

  const getAdmin = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/user/getadmin`,
        {
          withCredentials: true,
        }
      );

      console.log(
        "GET ADMIN SUCCESS:",
        result.data
      );

      setAdminData(
        result.data.admin
      );

      // Authentication verified successfully
      return true;

    } catch (error) {

      console.log(
        "GET ADMIN FAILED:",
        error.response?.status,
        error.response?.data ||
          error.message
      );

      setAdminData(null);

      // Authentication failed
      return false;

    } finally {

      setAdminLoading(false);

    }
  };

  // ==========================================
  // RUN WHEN ADMIN CONTEXT LOADS
  // ==========================================

  useEffect(() => {
    getAdmin();
  }, []);

  // ==========================================
  // CONTEXT VALUE
  // ==========================================

  const value = {
    adminData,
    setAdminData,
    adminLoading,
    serverUrl,
    getAdmin,
  };

  return (
    <adminDataContext.Provider
      value={value}
    >
      {children}
    </adminDataContext.Provider>
  );
}

export default AdminContext;