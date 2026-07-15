import React, { useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Lock, User, ArrowLeft } from "lucide-react";

export function AdminLogin({ onSuccess, onExit }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    if (username === "admin" && password === "admin123") {
      onSuccess();
    } else {
      setError("Invalid credentials. Access denied.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md rounded-xl bg-gray-900 p-8 shadow-xl"
      >
        <button
          type="button"
          onClick={onExit}
          className="absolute right-5 top-5 text-gray-400 hover:text-white"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="text-center mb-6">
          <ShieldCheck
            className="mx-auto mb-3 text-yellow-400"
            size={40}
          />
          <h2 className="text-xl font-bold text-white">
            Admin Access
          </h2>
          <p className="text-sm text-gray-400">
            Secure login required
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400">
              Username
            </label>
            <div className="relative">
              <User
                className="absolute left-3 top-3 text-gray-500"
                size={16}
              />
              <input
                type="text"
                value={username}
                onChange={(e) =>
                  setUsername(e.target.value)
                }
                className="w-full rounded-md bg-gray-800 py-2 pl-9 pr-3 text-white"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400">
              Password
            </label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-3 text-gray-500"
                size={16}
              />
              <input
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                className="w-full rounded-md bg-gray-800 py-2 pl-9 pr-3 text-white"
                required
              />
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full rounded-md bg-yellow-500 py-2 font-semibold text-black hover:bg-yellow-400"
          >
            Login
          </button>
        </form>
      </motion.div>
    </div>
  );
}