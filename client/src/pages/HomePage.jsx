import React, { useState } from "react";
import Navbar from "../components/layout/Navbar";
import UrlShortener from "../components/home/UrlShortener";
import RecentLinks from "../components/home/RecentLinks";
import Toast from "../components/ui/Toast";

export default function HomePage() {
  const [showToast, setShowToast] = useState(false);

  const handleCopy = () => {
    setShowToast(true);
  };

  return (
    <div className="min-h-screen bg-[#0d1117] relative overflow-x-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-indigo-900/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-32 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-cyan-900/10 rounded-full blur-2xl pointer-events-none" />

      {/* Toast */}
      <Toast show={showToast} onClose={() => setShowToast(false)} />

      {/* Navbar */}
      <div className="relative z-10 max-w-6xl mx-auto">
        <Navbar />
      </div>

      {/* Hero + URL Shortener */}
      <div className="relative z-10 max-w-6xl mx-auto">
        <UrlShortener onCopy={handleCopy} />
      </div>

      {/* Divider */}
      <div className="relative z-10 max-w-4xl mx-auto px-4">
        <div className="h-px bg-slate-800 mb-10" />
      </div>

      {/* Recent Links */}
      <div className="relative z-10 max-w-6xl mx-auto">
        <RecentLinks onCopy={handleCopy} />
      </div>
    </div>
  );
}