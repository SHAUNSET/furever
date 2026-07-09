import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import axios from "axios";
import { signInWithPopup } from "firebase/auth";
import googleLogo from "../assets/google.png";
import { authDataContext } from "../context/Authcontext.jsx";
import { auth, provider } from "../utils/Firebase.js";
import { userDataContext } from "../context/UserContext.jsx";

const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export default function Login() {
  const { serverUrl } = useContext(authDataContext);
  const navigate = useNavigate();

  const { getCurrentUser } = useContext(userDataContext);

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState("idle"); // idle | loading | success
  const [serverError, setServerError] = useState("");

  const valid = {
    email: isValidEmail(form.email),
    password: form.password.length >= 6,
  };
  const allValid = valid.email && valid.password;

  const handleChange = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleBlur = (field) => () =>
    setTouched((t) => ({ ...t, [field]: true }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    if (!allValid) return;

    setServerError("");
    setStatus("loading");

    try {
      const res = await axios.post(
        `${serverUrl}/api/auth/login`,
        {
          email: form.email,
          password: form.password,
        },
        { withCredentials: true }
      );
      console.log(res.data);

await getCurrentUser();

setStatus("success");

setTimeout(() => {
  navigate("/");
}, 1200);
    } catch (error) {
      console.error("Error logging in user:", error);
      setServerError(
        error?.response?.data?.message || "Invalid email or password. Please try again."
      );
      setStatus("idle");
    }
  };

const handleGoogleLogin = async () => {
  try {
    setServerError("");
    setStatus("loading");

    const response = await signInWithPopup(auth, provider);

    const name = response.user.displayName;
    const email = response.user.email;

    const res = await axios.post(
      `${serverUrl}/api/auth/google-login`,
      { name, email },
      { withCredentials: true }
    );

console.log(res.data);

await getCurrentUser();

setStatus("success");

setTimeout(() => {
  navigate("/");
}, 800);

  } catch (error) {
    setStatus("idle");

    console.error(error);

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
      {/* Header: logo left, sign-up link right */}
      <div className="flex items-center justify-between px-6 sm:px-10 py-6 sm:py-8">
        <a href="/" className="inline-flex items-center gap-2.5 group">
          <img
            src="/paws.png"
            alt="FurEver"
            className="w-10 h-10 sm:w-12 sm:h-12 object-contain group-hover:scale-105 transition-transform"
          />
          <span
            className="text-[#14172E] text-2xl sm:text-3xl"
            style={{ fontFamily: "'Baloo 2', sans-serif", fontWeight: 700 }}
          >
            FurEver
          </span>
        </a>

        <a
          href="/signup"
          className="inline-flex items-center gap-2 text-[#14172E] text-sm sm:text-base font-medium border border-[#E7E7F3] bg-white rounded-full px-4 sm:px-5 py-2 sm:py-2.5 hover:border-[#3B4CE0] hover:text-[#3B4CE0] transition-colors"
        >
          <span className="hidden sm:inline text-[#8A8FB0]">New here?</span>
          Sign up
        </a>
      </div>

      {/* Centered form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-lg"
        >
          {/* Heading + message above the card */}
          <div className="text-center mb-7 sm:mb-9">
            <h1
              className="text-[#14172E] text-4xl sm:text-5xl mb-3"
              style={{ fontFamily: "'Baloo 2', sans-serif", fontWeight: 700 }}
            >
              Welcome back 🐾
            </h1>
            <p className="text-[#8A8FB0] text-lg sm:text-xl">
              Log in to pick up right where you left off.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-[#EFEFF6] shadow-[0_10px_40px_-12px_rgba(20,23,46,0.12)] p-7 sm:p-14">
            {status === "success" ? (
              <div className="text-center py-8">
                <div className="w-20 h-20 rounded-full bg-[#3B4CE0] flex items-center justify-center mx-auto mb-6">
                  <img src="/paws.png" alt="" className="w-10 h-10 object-contain brightness-0 invert" />
                </div>
                <h2
                  className="text-[#14172E] text-4xl mb-3"
                  style={{ fontFamily: "'Baloo 2', sans-serif", fontWeight: 700 }}
                >
                  Good to see you!
                </h2>
                <p className="text-[#8A8FB0] text-lg">You're logged in.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {/* Email */}
                <div className="mb-6">
                  <label htmlFor="email" className="block text-lg font-medium text-[#14172E] mb-2.5">
                    Email
                  </label>
                  <div className="relative">
                    <Mail size={22} className="absolute left-5 top-1/2 -translate-y-1/2 text-[#9DA1C4]" />
                    <input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange("email")}
                      onBlur={handleBlur("email")}
                      placeholder="you@example.com"
                      className="w-full pl-14 pr-5 rounded-xl border border-[#E7E7F3] bg-white text-lg text-[#14172E] placeholder:text-[#B0B3CC] outline-none focus:border-[#3B4CE0] focus:ring-2 focus:ring-[#3B4CE0]/15 transition-all"
                      style={{ paddingTop: "1.1rem", paddingBottom: "1.1rem" }}
                    />
                  </div>
                  {touched.email && !valid.email && (
                    <p className="text-[#FF7A5C] text-base mt-2">Enter a valid email address.</p>
                  )}
                </div>

                {/* Password */}
                <div className="mb-3">
                  <label htmlFor="password" className="block text-lg font-medium text-[#14172E] mb-2.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock size={22} className="absolute left-5 top-1/2 -translate-y-1/2 text-[#9DA1C4]" />
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={handleChange("password")}
                      onBlur={handleBlur("password")}
                      placeholder="Your password"
                      className="w-full pl-14 pr-14 rounded-xl border border-[#E7E7F3] bg-white text-lg text-[#14172E] placeholder:text-[#B0B3CC] outline-none focus:border-[#3B4CE0] focus:ring-2 focus:ring-[#3B4CE0]/15 transition-all"
                      style={{ paddingTop: "1.1rem", paddingBottom: "1.1rem" }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      className="absolute right-5 top-1/2 -translate-y-1/2 text-[#9DA1C4] hover:text-[#3B4CE0] transition-colors"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                    </button>
                  </div>
                  {touched.password && !valid.password && (
                    <p className="text-[#FF7A5C] text-base mt-2">Password needs at least 6 characters.</p>
                  )}
                </div>

                <div className="text-right mb-6">
                  <a href="/forgot-password" className="text-[#3B4CE0] text-base font-medium hover:underline">
                    Forgot password?
                  </a>
                </div>

                {serverError && (
                  <p className="text-[#FF7A5C] text-base mb-4 text-center">{serverError}</p>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full py-4.5 rounded-xl text-white font-semibold text-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-70"
                  style={{
                    backgroundColor: allValid ? "#3B4CE0" : "#C7CAEB",
                    cursor: allValid ? "pointer" : "not-allowed",
                    paddingTop: "1.1rem",
                    paddingBottom: "1.1rem",
                  }}
                >
                  {status === "loading" ? (
                    <span
                      className="rounded-full border-2 border-white/40 border-t-white animate-spin"
                      style={{ width: 22, height: 22 }}
                    />
                  ) : (
                    <>
                      Log in
                      <ArrowRight size={20} />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Or log in with Google */}
          {status !== "success" && (
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full mt-5 bg-white rounded-2xl border border-[#EFEFF6] shadow-[0_4px_20px_-8px_rgba(20,23,46,0.1)] px-6 flex items-center justify-center gap-3 hover:border-[#3B4CE0]/40 hover:shadow-[0_6px_24px_-8px_rgba(20,23,46,0.14)] transition-all"
              style={{ paddingTop: "1.1rem", paddingBottom: "1.1rem" }}
            >
              <img src={googleLogo} alt="" className="w-6 h-6 object-contain" />
              <span className="text-[#14172E] text-lg font-medium">
                Log in with Google
              </span>
            </button>
          )}

          
        </motion.div>
      </div>
    </div>
  );
}