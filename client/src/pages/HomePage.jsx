import React, { useState } from "react";
import UrlShortener from "../components/home/UrlShortener";
import RecentLinks from "../components/home/RecentLinks";
import ThreeBackdrop from "../components/home/ThreeBackdrop";
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
    <main className="min-h-screen relative overflow-x-hidden bg-[#06070a] text-slate-100">
      <ThreeBackdrop />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_34%),radial-gradient(circle_at_20%_20%,rgba(148,163,184,0.08),transparent_18%),radial-gradient(circle_at_80%_0%,rgba(59,130,246,0.06),transparent_22%)]" />
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_bottom,rgba(255,255,255,0.04),transparent_18%,transparent_82%,rgba(0,0,0,0.7))]" />

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

      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-4 pt-5 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 shadow-[0_0_0_1px_rgba(255,255,255,0.06)] backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-white/80" />
          </div>
          <span className="text-lg font-semibold tracking-tight text-white">Linkr</span>
        </div>
        {!isAuthenticated ? (
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              className="rounded-md border border-white/10 bg-white/5 px-3.5 py-1.5 text-sm font-medium text-slate-200 transition-colors hover:bg-white/10 hover:text-white"
              onClick={onLoginClick}
            >
              Log in
            </button>
            <button
              className="rounded-md border border-white/10 bg-white px-3.5 py-1.5 text-sm font-semibold text-slate-950 shadow-[0_18px_50px_rgba(255,255,255,0.08)] transition-colors hover:bg-slate-100"
              onClick={onSignupClick}
            >
              Sign up
            </button>
          </div>
        ) : null}
      </header>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        <UrlShortener
          onCopy={handleCopy}
          isAuthenticated={isAuthenticated}
          token={authToken}
          onRequireLogin={onLoginClick}
          onSignupClick={onSignupClick}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 pt-10 sm:px-6 sm:pt-12">
        <RecentLinks
          onCopy={handleCopy}
          isAuthenticated={isAuthenticated}
          token={authToken}
        />
      </div>
    </main>
  );
}
