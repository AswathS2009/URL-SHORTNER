import React, { useState } from "react";
import { Link2 } from "lucide-react";

const navLinks = ["Home", "Dashboard", "Analytics", "Pricing"];

export default function Navbar() {
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
      <div className="flex items-center gap-4">
        <button className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
          Log in
        </button>
        <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg transition-colors">
          Sign up free
        </button>
      </div>
    </nav>
  );
}