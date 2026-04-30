import React, { useEffect, useState } from "react";
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
  const [showDeployNotice, setShowDeployNotice] = useState(false);

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

  useEffect(() => {
    const dismissed = localStorage.getItem("deployNoticeDismissed");
    if (!dismissed) setShowDeployNotice(true);
  }, []);

  const handleCloseDeployNotice = () => {
    localStorage.setItem("deployNoticeDismissed", "true");
    setShowDeployNotice(false);
  };

  return (
    <div className="min-h-screen bg-[#0d1117] relative overflow-x-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-175 h-100 bg-indigo-900/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-32 left-1/2 -translate-x-1/2 w-100 h-50 bg-cyan-900/10 rounded-full blur-2xl pointer-events-none" />

      {/* Toast */}
      <Toast show={showToast} onClose={() => setShowToast(false)} />

      {showDeployNotice && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
          <button
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleCloseDeployNotice}
            aria-label="Close notice"
          />
          <div className="relative w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
              <span className="text-sm font-semibold text-cyan-400">
                Heads up about link length
              </span>
              <button
                onClick={handleCloseDeployNotice}
                className="p-1.5 text-slate-500 hover:text-slate-300 transition-colors"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <div className="p-5 space-y-3">
              <p className="text-sm text-slate-300">
                Right now the short URLs look a bit longer because the app is
                hosted on Vercel and the subdomain cannot be shorter.
              </p>
              <p className="text-sm text-slate-400">
                I will be buying a custom domain soon, and then the short URLs
                will be much shorter.
              </p>
              <div className="flex justify-end">
                <button
                  onClick={handleCloseDeployNotice}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
                >
                  Got it
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
