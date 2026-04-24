import React, { useState } from "react";
import { Link2, LogOut } from "lucide-react";

const navLinks = ["Home", "Dashboard", "Analytics", "Pricing"];

export default function Navbar({
  isAuthenticated,
  authUser,
  onLoginClick,
  onSignupClick,
  onLogout,
}) {
  const [active, setActive] = useState("Home");

  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-transparent">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="text-cyan-400">
          <Link2 size={20} strokeWidth={2.5} />
        </div>
        <span className="text-white font-bold text-lg tracking-tight">Linkr</span>
      </div>

      {/* Nav Links */}
      <ul className="hidden md:flex items-center gap-8">
        {navLinks.map((link) => (
          <li key={link}>
            <button
              onClick={() => setActive(link)}
              className={`text-sm font-medium transition-colors ${
                active === link ? "text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              {link}
            </button>
          </li>
        ))}
      </ul>

      {/* Auth Buttons */}
      {!isAuthenticated ? (
        <div className="flex items-center gap-4">
          <button 
            className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
            onClick={onLoginClick}
          >
            Log in
          </button>
          <button 
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg transition-colors"
            onClick={onSignupClick}  
          >
            Sign up free
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/70 text-slate-200 text-xs sm:text-sm">
            {authUser?.name || authUser?.email || "User"}
          </div>
          <button
            onClick={onLogout}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-300 hover:text-white border border-slate-700 bg-slate-800/70 hover:bg-slate-700/70 transition-colors text-xs sm:text-sm"
          >
            <LogOut size={14} />
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}