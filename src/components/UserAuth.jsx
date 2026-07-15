import React, { useState, useContext } from "react";
import { AuthContext } from "../AuthContext";
import { motion } from "framer-motion";
import { User, Phone, X } from "lucide-react";

export function UserAuth({ open, onClose }) {
  const { user, login, logout } = useContext(AuthContext);
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");

  const handleLogin = (e) => {
    e?.preventDefault();
    const u = { name: name || "Guest", phone: phone || "", role: "user" };
    login(u);
    onClose && onClose();
  };

  if (!open) return null;

  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-stone-900 w-full max-w-md rounded-xl p-6"
      >
        <button onClick={onClose} className="absolute right-4 top-4 text-gray-400">
          <X />
        </button>

        <h3 className="text-lg font-bold text-amber-400 mb-3">Welcome to Quick Bite</h3>

        {user ? (
          <div className="space-y-4">
            <p className="text-gray-300">Signed in as <strong className="text-amber-300">{user.name}</strong></p>
            <p className="text-gray-400 text-sm">Phone: {user.phone || "—"}</p>
            <div className="flex gap-2">
              <button onClick={()=>{logout(); onClose&&onClose();}} className="bg-red-500 px-4 py-2 rounded">Sign out</button>
              <button onClick={onClose} className="bg-stone-700 px-4 py-2 rounded">Close</button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400">Full name</label>
              <div className="relative">
                <User className="absolute left-3 top-3 text-gray-500" size={16} />
                <input value={name} onChange={(e)=>setName(e.target.value)} className="w-full rounded-md bg-stone-800 py-2 pl-9 pr-3 text-white" required />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400">Phone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 text-gray-500" size={16} />
                <input value={phone} onChange={(e)=>setPhone(e.target.value)} className="w-full rounded-md bg-stone-800 py-2 pl-9 pr-3 text-white" />
              </div>
            </div>

            <div className="flex gap-2">
              <button type="submit" className="bg-amber-500 px-4 py-2 rounded text-black">Sign in</button>
              <button type="button" onClick={onClose} className="bg-stone-700 px-4 py-2 rounded">Cancel</button>
            </div>
          </form>
        )}
      </motion.div>
    </motion.div>
  );
}

export default UserAuth;
