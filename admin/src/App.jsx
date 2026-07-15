import React, { useContext } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Orders from "./pages/Orders";
import Login from "./pages/Login";
import List from "./pages/List";
import Add from "./pages/Add";
import { adminDataContext } from "./context/AdminContext";

function App() {
  const { adminData, adminLoading } = useContext(adminDataContext);

  // Wait until authentication check completes
  if (adminLoading) {
    return (
      <div className="h-screen flex items-center justify-center text-2xl">
        Loading...
      </div>
    );
  }

  return (
    <Routes>
      {/* Login */}
      <Route
        path="/login"
        element={
          adminData ? <Navigate to="/" replace /> : <Login />
        }
      />

      {/* Home */}
      <Route
        path="/"
        element={
          adminData ? <Home /> : <Navigate to="/login" replace />
        }
      />

      {/* Add */}
      <Route
        path="/add"
        element={
          adminData ? <Add /> : <Navigate to="/login" replace />
        }
      />

      {/* List */}
      <Route
        path="/lists"
        element={
          adminData ? <List /> : <Navigate to="/login" replace />
        }
      />

      {/* Orders */}
      <Route
        path="/orders"
        element={
          adminData ? <Orders /> : <Navigate to="/login" replace />
        }
      />

      {/* Unknown routes */}
      <Route
        path="*"
        element={<Navigate to={adminData ? "/" : "/login"} replace />}
      />
    </Routes>
  );
}

export default App;