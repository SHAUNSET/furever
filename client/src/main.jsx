import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "./index.css";
import App from "./App";
import AuthContext from "./context/Authcontext.jsx";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <BrowserRouter>
        <AuthContext>
            <App />
        </AuthContext>
        </BrowserRouter>
    </StrictMode>
);