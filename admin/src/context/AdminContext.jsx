import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { authDataContext } from "./AuthContext";

export const adminDataContext = createContext();

function AdminContext({ children }) {
  const [adminData, setAdminData] = useState(null);
  const [adminLoading, setAdminLoading] = useState(true);

  const { serverUrl } = useContext(authDataContext);

  // Get Current Admin
  const getAdmin = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/user/getadmin`,
        {
          withCredentials: true,
        }
      );

      setAdminData(result.data.admin);
    } catch (error) {
      console.log("Get Admin Error:", error);
      setAdminData(null);
    } finally {
      setAdminLoading(false);
    }
  };

  // Run when AdminContext loads
  useEffect(() => {
    getAdmin();
  }, []);

  const value = {
    adminData,
    setAdminData,
    adminLoading,
    serverUrl,
    getAdmin,
  };

  return (
    <adminDataContext.Provider value={value}>
      {children}
    </adminDataContext.Provider>
  );
}

export default AdminContext;