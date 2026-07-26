import React, { useContext } from "react";
import {
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import Collections from "./pages/Collections";
import Product from "./pages/Product";
import About from "./pages/About";
import Contact from "./pages/Contact";

import { userDataContext } from "./context/UserContext";

function App() {
  const { userData } = useContext(userDataContext);
  const location = useLocation();

  return (
    <Routes>
      {/* Home */}
      <Route path="/" element={<Home />} />

      {/* Login */}
      <Route
        path="/login"
        element={
          userData ? (
            <Navigate
              to={location.state?.from || "/"}
              replace
            />
          ) : (
            <Login />
          )
        }
      />

      {/* Registration */}
      <Route
        path="/signup"
        element={
          userData ? (
            <Navigate
              to={location.state?.from || "/"}
              replace
            />
          ) : (
            <Registration />
          )
        }
      />

      {/* Collections */}
      <Route
        path="/collections"
        element={<Collections />}
      />

      {/* Product Details */}
      <Route
        path="/product/:id"
        element={<Product />}
      />

      {/* About */}
      <Route
        path="/about"
        element={<About />}
      />

      {/* Contact */}
      <Route
        path="/contact"
        element={<Contact />}
      />

      {/* Invalid Routes */}
      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  );
}

export default App;