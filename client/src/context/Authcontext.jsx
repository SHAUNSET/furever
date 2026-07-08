import React, { createContext } from "react";

// This MUST be the same variable name you import in Registration.jsx
export const authDataContext = createContext();

function AuthContext({ children }) {
    let serverUrl = "http://localhost:8000";

    let value = {
        serverUrl
    };

    return (
        <authDataContext.Provider value={value}>
            {children}
        </authDataContext.Provider>
    );
}

export default AuthContext;