import React, { useState } from "react";
import Navbar from "../components/layout/Navbar";
import UrlShortener from "../components/home/UrlShortener";
import RecentLinks from "../components/home/RecentLinks";
import Toast from "../components/ui/Toast";
import LoginModel from "../components/auth/LoginModel";
import SignupModel from "../components/auth/SignupModel";
export default function HomePage({
  activeModal,
  isAuthenticated,
  authUser,
  authToken,
  onLoginClick,
  onSignupClick,
  onCloseModal,
  onAuthSuccess,
  onLogout,
}) {
  const [showToast, setShowToast] = useState(false);

  const handleCopy = async (text) => {
    if (!text) return;

    let copied = false;

    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        copied = true;
      } else {
        throw new Error("Clipboard API unavailable");
      }
    } catch {
      try {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "fixed";
        textarea.style.top = "-9999px";
        document.body.appendChild(textarea);
        textarea.select();
        copied = document.execCommand("copy");
        document.body.removeChild(textarea);
      } catch {
        copied = false;
      }
    }

    if (copied) {
      setShowToast(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] relative overflow-x-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-175 h-100 bg-indigo-900/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-32 left-1/2 -translate-x-1/2 w-100 h-50 bg-cyan-900/10 rounded-full blur-2xl pointer-events-none" />

      {/* Toast */}
      <Toast show={showToast} onClose={() => setShowToast(false)} />

      <LoginModel
        isOpen={activeModal === "login"}
        onClose={onCloseModal}
        onSwitchToSignup={onSignupClick}
        onSuccess={onAuthSuccess}
      />

      <SignupModel
        isOpen={activeModal === "signup"}
        onClose={onCloseModal}
        onSwitchToLogin={onLoginClick}
        onSuccess={onAuthSuccess}
      />

      {/* Navbar */}
      <div className="relative z-10 max-w-6xl mx-auto">
        <Navbar
          isAuthenticated={isAuthenticated}
          authUser={authUser}
          onLoginClick={onLoginClick}
          onSignupClick={onSignupClick}
          onLogout={onLogout}
        />
      </div>

      {/* Hero + URL Shortener */}
      <div className="relative z-10 max-w-6xl mx-auto">
        <UrlShortener
          onCopy={handleCopy}
          isAuthenticated={isAuthenticated}
          token={authToken}
          onRequireLogin={onLoginClick}
        />
      </div>

      {/* Divider */}
      <div className="relative z-10 max-w-4xl mx-auto px-4">
        <div className="h-px bg-slate-800 mb-10" />
      </div>

      {/* Recent Links */}
      <div className="relative z-10 max-w-6xl mx-auto">
        <RecentLinks
          onCopy={handleCopy}
          isAuthenticated={isAuthenticated}
          token={authToken}
        />
      </div>
    </div>
  );
}
