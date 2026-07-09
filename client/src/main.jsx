import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "./index.css";
import App from "./App";
import AuthContext from "./context/Authcontext.jsx";
import { User } from "lucide-react";
import UserContext from "./context/UserContext.jsx";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <BrowserRouter>
        <AuthContext>
        <UserContext>
            <App />
        </UserContext>
        </AuthContext>
        </BrowserRouter>
    </StrictMode>
);