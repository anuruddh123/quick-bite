import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { HomePage } from "./components/HomePage";
import { AdminLogin } from "./components/AdminLogin";
import { AdminPanel } from "./components/AdminPanel";

export default function App() {
  const [isAdminAuth, setIsAdminAuth] = useState(false);
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("quickbite_menu");

      if (stored) {
        setMenuItems(JSON.parse(stored));
      } else {
        setMenuItems([]);
      }
    } catch (e) {
      setMenuItems([]);
    }
  }, []);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <HomePage
            menuItems={menuItems}
            setMenuItems={setMenuItems}
          />
        }
      />

      <Route
        path="/admin"
        element={
          isAdminAuth ? (
            <AdminPanel
              menuItems={menuItems}
              setMenuItems={setMenuItems}
              onExit={() => setIsAdminAuth(false)}
            />
          ) : (
            <AdminLogin
              onSuccess={() => setIsAdminAuth(true)}
              onExit={() => window.location.assign("/")}
            />
          )
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}