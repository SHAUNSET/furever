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
import ProductDetail from "./pages/ProductDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";

import {
  userDataContext,
} from "./context/UserContext";

function App() {
  const { userData } =
    useContext(userDataContext);

  const location =
    useLocation();

  return (
    <Routes>

      {/* HOME */}

      <Route
        path="/"
        element={<Home />}
      />


      {/* LOGIN */}

      <Route
        path="/login"
        element={
          userData ? (
            <Navigate
              to={
                location.state?.from ||
                "/"
              }
              replace
            />
          ) : (
            <Login />
          )
        }
      />


      {/* SIGN UP */}

      <Route
        path="/signup"
        element={
          userData ? (
            <Navigate
              to={
                location.state?.from ||
                "/"
              }
              replace
            />
          ) : (
            <Registration />
          )
        }
      />


      {/* COLLECTIONS */}

      <Route
        path="/collections"
        element={
          <Collections />
        }
      />


      {/* PRODUCT DETAIL */}

      <Route
        path="/product/:id"
        element={
          <ProductDetail />
        }
      />


      {/* CART */}

      <Route
        path="/cart"
        element={
          userData ? (
            <Cart />
          ) : (
            <Navigate
              to="/login"
              state={{
                from: "/cart",
              }}
              replace
            />
          )
        }
      />


      {/* ABOUT */}

      <Route
        path="/about"
        element={<About />}
      />


      {/* CONTACT */}

      <Route
        path="/contact"
        element={
          <Contact />
        }
      />


      {/* INVALID ROUTES */}

      <Route
        path="*"
        element={
          <Navigate
            to="/"
            replace
          />
        }
      />

    </Routes>
  );
}

export default App;