import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const s = localStorage.getItem("quickbite_user");
      if (s) setUser(JSON.parse(s));
    } catch (e) {
      setUser(null);
    }
  }, []);

  const login = (u) => {
    setUser(u);
    localStorage.setItem("quickbite_user", JSON.stringify(u));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("quickbite_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
