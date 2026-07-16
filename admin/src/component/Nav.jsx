import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LogOut } from "lucide-react";
import axios from "axios";
import { authDataContext } from "../context/AuthContext";
import { adminDataContext } from "../context/AdminContext";

export default function Nav() {
  const navigate = useNavigate();

  const { serverUrl } = useContext(authDataContext);
  const { setAdminData } = useContext(adminDataContext);

const handleLogout = async () => {
  try {
    await axios.post(
      `${serverUrl}/api/auth/logout`,
      {},
      {
        withCredentials: true,
      }
    );

    setAdminData(null);
    navigate("/login");
  } catch (error) {
    console.log(error);
  }
};

  return (
    <header
      className="sticky top-0 z-50 w-full bg-[#FFFBF7] border-b border-[#F2E6DC] shadow-sm"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-16">
        <div className="h-20 flex items-center justify-between">

          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 cursor-pointer group"
          >
            <img
              src="/paws.png"
              alt="FurEver"
              className="w-11 h-11 object-contain transition-transform duration-300 group-hover:scale-110"
            />

            <h1
              className="text-4xl text-[#14172E] transition-colors duration-300 group-hover:text-[#FF6A3D]"
              style={{
                fontFamily: "'Baloo 2', sans-serif",
                fontWeight: 700,
              }}
            >
              Fur<span className="text-[#FF6A3D]">Ever</span>
            </h1>
          </Link>

          {/* Logout */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleLogout}
            className="flex items-center gap-2 bg-[#FF5C35] hover:bg-[#F24C22] text-white px-5 py-3 rounded-xl font-semibold transition-all shadow-sm"
          >
            <LogOut size={18} />
            Logout
          </motion.button>

        </div>
      </div>
    </header>
  );
}