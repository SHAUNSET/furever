import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import axios from "axios";
import { authDataContext } from "./Authcontext.jsx";

export const userDataContext = createContext();

function UserContext({ children }) {
  const [userData, setUserData] = useState(null);

  const { serverUrl } = useContext(authDataContext);

  const getCurrentUser = async () => {
    try {
      const response = await axios.post(
        `${serverUrl}/api/user/getcurrentuser`,
        {},
        {
          withCredentials: true,
        }
      );

      console.log("✅ Current User Response:", response.data);

      setUserData(response.data.user);
    } catch (error) {
      console.log("❌ Status:", error.response?.status);
      console.log("❌ Response:", error.response?.data);
      console.log("❌ URL:", error.config?.url);

      console.error("Error fetching current user:", error);

      setUserData(null);
    }
  };

  useEffect(() => {
    getCurrentUser();
  }, []);

  const value = {
    userData,
    setUserData,
    getCurrentUser,
  };

  return (
    <userDataContext.Provider value={value}>
      {children}
    </userDataContext.Provider>
  );
}

export default UserContext;