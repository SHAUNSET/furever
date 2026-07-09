import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import axios from "axios";
import googleLogo from "../assets/google.png";
import { authDataContext } from "../context/Authcontext.jsx";
import { userDataContext } from "../context/UserContext.jsx";
import { auth, provider } from "../utils/Firebase.js";
import { signInWithPopup } from "firebase/auth";

const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export default function Registration() {
  const { serverUrl } = useContext(authDataContext);
  const { getCurrentUser } = useContext(userDataContext);

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState("idle"); // idle | loading | success
  const [serverError, setServerError] = useState("");

  const valid = {
    name: form.name.trim().length >= 2,
    email: isValidEmail(form.email),
    password: form.password.length >= 6,
  };

  const allValid = valid.name && valid.email && valid.password;

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
      name: true,
      email: true,
      password: true,
    });

    if (!allValid) return;

    setServerError("");
    setStatus("loading");

    try {
      const res = await axios.post(
        `${serverUrl}/api/auth/registeration`,
        {
          name: form.name,
          email: form.email,
          password: form.password,
        },
        {
          withCredentials: true,
        }
      );

      console.log(res.data);

      await getCurrentUser();

      setStatus("success");

      setTimeout(() => {
        navigate("/");
      }, 1200);
    } catch (error) {
      console.error("Registration Error:", error);

      setServerError(
        error?.response?.data?.message ||
          "Something went wrong. Please try again."
      );

      setStatus("idle");
    }
  };

  const handleGoogleSignup = async () => {
    try {
      setServerError("");
      setStatus("loading");

      const response = await signInWithPopup(auth, provider);

      const name = response.user.displayName;
      const email = response.user.email;

      const res = await axios.post(
        `${serverUrl}/api/auth/google-login`,
        {
          name,
          email,
        },
        {
          withCredentials: true,
        }
      );

      console.log(res.data);

      await getCurrentUser();

      setStatus("success");

      setTimeout(() => {
        navigate("/");
      }, 800);
    } catch (error) {
      console.error(error);

      setStatus("idle");

      setServerError(
        error?.response?.data?.message ||
          error.message ||
          "Google Sign In Failed"
      );
    }
  };

  return (
    <div
      className="min-h-screen w-full bg-[#FAF7F1] flex flex-col"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 sm:px-10 py-6 sm:py-8">
        <a href="/" className="inline-flex items-center gap-2.5 group">
          <img
            src="/paws.png"
            alt="FurEver"
            className="w-10 h-10 sm:w-12 sm:h-12 object-contain group-hover:scale-105 transition-transform"
          />

          <span
            className="text-[#14172E] text-2xl sm:text-3xl"
            style={{
              fontFamily: "'Baloo 2', sans-serif",
              fontWeight: 700,
            }}
          >
            FurEver
          </span>
        </a>

        <a
          href="/login"
          className="inline-flex items-center gap-2 text-[#14172E] text-sm sm:text-base font-medium border border-[#E7E7F3] bg-white rounded-full px-4 sm:px-5 py-2 sm:py-2.5 hover:border-[#3B4CE0] hover:text-[#3B4CE0] transition-colors"
        >
          <span className="hidden sm:inline text-[#8A8FB0]">
            Already a member?
          </span>
          Log in
        </a>
      </div>

      {/* Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-lg"
        >
          <div className="text-center mb-8">
            <h1
              className="text-[#14172E] text-4xl sm:text-5xl mb-3"
              style={{
                fontFamily: "'Baloo 2', sans-serif",
                fontWeight: 700,
              }}
            >
              Join the pack 🐾
            </h1>

            <p className="text-[#8A8FB0] text-lg sm:text-xl">
              Sign up in seconds and start giving back with every order.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-[#EFEFF6] shadow-[0_10px_40px_-12px_rgba(20,23,46,0.12)] p-7 sm:p-14">
            {status === "success" ? (
              <div className="text-center py-8">
                <div className="w-20 h-20 rounded-full bg-[#3B4CE0] flex items-center justify-center mx-auto mb-6">
                  <img
                    src="/paws.png"
                    alt=""
                    className="w-10 h-10 brightness-0 invert"
                  />
                </div>

                <h2
                  className="text-[#14172E] text-4xl mb-3"
                  style={{
                    fontFamily: "'Baloo 2', sans-serif",
                    fontWeight: 700,
                  }}
                >
                  Welcome, {form.name.split(" ")[0]}!
                </h2>

                <p className="text-[#8A8FB0] text-lg">
                  Your account is ready.
                </p>
              </div>
            ) : (
              <>
                <form onSubmit={handleSubmit}>
                  {/* Name */}
                  <div className="mb-6">
                    <label className="block text-lg font-medium mb-2.5">
                      Name
                    </label>

                    <div className="relative">
                      <User
                        size={22}
                        className="absolute left-5 top-1/2 -translate-y-1/2 text-[#9DA1C4]"
                      />

                      <input
                        type="text"
                        value={form.name}
                        onChange={handleChange("name")}
                        onBlur={handleBlur("name")}
                        placeholder="Your full name"
                        className="w-full pl-14 pr-5 py-4 rounded-xl border border-[#E7E7F3] outline-none focus:border-[#3B4CE0]"
                      />
                    </div>

                    {touched.name && !valid.name && (
                      <p className="text-[#FF7A5C] mt-2">
                        Name needs at least 2 characters.
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="mb-6">
                    <label className="block text-lg font-medium mb-2.5">
                      Email
                    </label>

                    <div className="relative">
                      <Mail
                        size={22}
                        className="absolute left-5 top-1/2 -translate-y-1/2 text-[#9DA1C4]"
                      />

                      <input
                        type="email"
                        value={form.email}
                        onChange={handleChange("email")}
                        onBlur={handleBlur("email")}
                        placeholder="you@example.com"
                        className="w-full pl-14 pr-5 py-4 rounded-xl border border-[#E7E7F3] outline-none focus:border-[#3B4CE0]"
                      />
                    </div>

                    {touched.email && !valid.email && (
                      <p className="text-[#FF7A5C] mt-2">
                        Enter a valid email address.
                      </p>
                    )}
                  </div>

                  {/* Password */}
                  <div className="mb-8">
                    <label className="block text-lg font-medium mb-2.5">
                      Password
                    </label>

                    <div className="relative">
                      <Lock
                        size={22}
                        className="absolute left-5 top-1/2 -translate-y-1/2 text-[#9DA1C4]"
                      />

                      <input
                        type={showPassword ? "text" : "password"}
                        value={form.password}
                        onChange={handleChange("password")}
                        onBlur={handleBlur("password")}
                        placeholder="At least 6 characters"
                        className="w-full pl-14 pr-14 py-4 rounded-xl border border-[#E7E7F3] outline-none focus:border-[#3B4CE0]"
                      />

                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-5 top-1/2 -translate-y-1/2"
                      >
                        {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                      </button>
                    </div>

                    {touched.password && !valid.password && (
                      <p className="text-[#FF7A5C] mt-2">
                        Password needs at least 6 characters.
                      </p>
                    )}
                  </div>

                  {serverError && (
                    <p className="text-[#FF7A5C] text-center mb-4">
                      {serverError}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={!allValid || status === "loading"}
                    className="w-full py-4 rounded-xl text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-70"
                    style={{
                      backgroundColor: allValid ? "#3B4CE0" : "#C7CAEB",
                    }}
                  >
                    {status === "loading" ? (
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        Join FurEver
                        <ArrowRight size={20} />
                      </>
                    )}
                  </button>
                </form>

                <button
                  type="button"
                  onClick={handleGoogleSignup}
                  className="w-full mt-5 bg-white rounded-2xl border border-[#EFEFF6] px-6 py-4 flex items-center justify-center gap-3"
                >
                  <img src={googleLogo} alt="" className="w-6 h-6" />
                  <span className="text-lg font-medium">
                    Sign up with Google
                  </span>
                </button>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}