import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Nav from "./components/Nav";

import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Registration from "./pages/Registration.jsx";

function App() {
  const location = useLocation();

  // Hide navbar on authentication pages
  const hideNav =
    location.pathname === "/login" ||
    location.pathname === "/signup";

  return (
    <>
      {!hideNav && <Nav />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Registration />} />
      </Routes>
    </>
  );
}

export default App;