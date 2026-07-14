import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Orders from "./pages/Orders";
import Login from "./pages/Login";
import List from "./pages/List";
import Add from "./pages/Add";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/add" element={<Add />} />
      <Route path="/lists" element={<List />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;