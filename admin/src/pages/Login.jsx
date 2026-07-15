import { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import axios from "axios";
import { authDataContext } from "../context/AuthContext";
import { adminDataContext } from "../context/AdminContext";

const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export default function AdminLogin() {
  const { serverUrl } = useContext(authDataContext);
  const { getAdmin, adminData } = useContext(adminDataContext);

  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState("idle");
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    if (adminData && location.pathname === "/login") {
      navigate("/", { replace: true });
    }
  }, [adminData, location.pathname, navigate]);

  const valid = {
    email: isValidEmail(form.email),
    password: form.password.length >= 1,
  };

  const allValid = valid.email && valid.password;

  const handleChange = (field) => (e) =>
    setForm((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));

  const handleBlur = (field) => () =>
    setTouched((prev) => ({
      ...prev,
      [field]: true,
    }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    setTouched({
      email: true,
      password: true,
    });

    if (!allValid) return;

    try {
      setStatus("loading");
      setServerError("");

      const res = await axios.post(
        `${serverUrl}/api/auth/adminlogin`,
        form,
        {
          withCredentials: true,
        }
      );

      console.log("Admin Token:", res.data.token);

      await getAdmin();

      setStatus("success");

      navigate("/", { replace: true });

    } catch (error) {
      console.error(error);

      setStatus("idle");

      setServerError(
        error?.response?.data?.message || "Admin Login Failed"
      );
    }
  };



  return (
    <div
      className="min-h-screen bg-[#FAF7F1] flex items-center justify-center px-4"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="w-full max-w-lg"
      >
        <div className="text-center mb-8">

          <div className="w-20 h-20 rounded-full bg-[#3B4CE0] flex items-center justify-center mx-auto mb-5">
            <ShieldCheck
              size={38}
              className="text-white"
            />
          </div>

          <h1
            className="text-5xl text-[#14172E] mb-3"
            style={{
              fontFamily: "'Baloo 2', sans-serif",
              fontWeight: 700,
            }}
          >
            FurEver Admin
          </h1>

          <p className="text-[#8A8FB0] text-lg">
            Welcome to the FurEver Admin Portal.
          </p>

        </div>

        <div className="bg-white rounded-3xl border border-[#EFEFF6] shadow-[0_10px_40px_-12px_rgba(20,23,46,0.12)] p-10">

          {status === "success" ? (
            <div className="text-center py-8">

              <div className="w-20 h-20 rounded-full bg-[#3B4CE0] flex items-center justify-center mx-auto mb-6">
                <ShieldCheck
                  size={36}
                  className="text-white"
                />
              </div>

              <h2
                className="text-4xl text-[#14172E] mb-3"
                style={{
                  fontFamily: "'Baloo 2', sans-serif",
                  fontWeight: 700,
                }}
              >
                Login Successful
              </h2>

              <p className="text-[#8A8FB0]">
                Token printed in browser console.
              </p>

            </div>
          ) : (
            <form onSubmit={handleSubmit}>

              <div className="mb-6">

                <label className="block text-lg font-medium mb-2">
                  Email
                </label>

                <div className="relative">

                  <Mail
                    className="absolute left-5 top-1/2 -translate-y-1/2 text-[#9DA1C4]"
                    size={22}
                  />

                  <input
                    type="email"
                    placeholder="Admin Email"
                    value={form.email}
                    onChange={handleChange("email")}
                    onBlur={handleBlur("email")}
                    className="w-full pl-14 pr-5 py-4 rounded-xl border border-[#E7E7F3] outline-none focus:border-[#3B4CE0]"
                  />

                </div>

                {touched.email && !valid.email && (
                  <p className="text-red-500 mt-2">
                    Enter a valid email.
                  </p>
                )}

              </div>

              <div className="mb-6">

                <label className="block text-lg font-medium mb-2">
                  Password
                </label>

                <div className="relative">

                  <Lock
                    className="absolute left-5 top-1/2 -translate-y-1/2 text-[#9DA1C4]"
                    size={22}
                  />

                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange("password")}
                    onBlur={handleBlur("password")}
                    className="w-full pl-14 pr-14 py-4 rounded-xl border border-[#E7E7F3] outline-none focus:border-[#3B4CE0]"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? (
                      <EyeOff size={22} />
                    ) : (
                      <Eye size={22} />
                    )}
                  </button>

                </div>

              </div>

              {serverError && (
                <p className="text-red-500 text-center mb-5">
                  {serverError}
                </p>
              )}

              <button
                type="submit"
                disabled={!allValid || status === "loading"}
                className="w-full py-4 rounded-xl text-white text-lg font-semibold flex items-center justify-center gap-2 transition-all"
                style={{
                  backgroundColor: allValid ? "#3B4CE0" : "#C7CAEB",
                }}
              >
                {status === "loading" ? (
                  <span className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                ) : (
                  <>
                    Admin Login
                    <ArrowRight size={20} />
                  </>
                )}
              </button>

            </form>
          )}

        </div>
      </motion.div>
    </div>
  );
}