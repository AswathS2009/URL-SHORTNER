import React, { useState } from "react";
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
    <main className="min-h-screen bg-[#0d1117] relative overflow-x-hidden">
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

      <header className="relative z-10 max-w-6xl mx-auto px-4 pt-4 flex justify-end">
        {!isAuthenticated ? (
          <div className="flex items-center gap-3">
            <button
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
              onClick={onLoginClick}
            >
              Log in
            </button>
            <button
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg transition-colors"
              onClick={onSignupClick}
            >
              Sign up
            </button>
          </div>
        ) : null}
      </header>

      <div className="relative z-10 max-w-6xl mx-auto">
        <UrlShortener
          onCopy={handleCopy}
          isAuthenticated={isAuthenticated}
          token={authToken}
          onRequireLogin={onLoginClick}
        />
      </div>

      <section className="relative z-10 max-w-6xl mx-auto px-4 pb-8" aria-labelledby="why-linkr-heading">
        <div className="grid gap-4 md:grid-cols-3 rounded-3xl border border-slate-800 bg-slate-900/40 p-6 md:p-8">
          <div>
            <h2 id="why-linkr-heading" className="text-lg font-semibold text-white mb-2">
              Why use Linkr?
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Shorten long URLs into clean links that are easier to share, track, and remember.
            </p>
          </div>
          <div>
            <h3 className="text-base font-semibold text-white mb-2">
              Custom short codes
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Create branded slugs for campaigns, social posts, and product launches.
            </p>
          </div>
          <div>
            <h3 className="text-base font-semibold text-white mb-2">
              Recent link management
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Log in to save your links, revisit past URLs, and delete anything you no longer need.
            </p>
          </div>
        </div>
      </section>

      <div className="relative z-10 max-w-4xl mx-auto px-4">
        <div className="h-px bg-slate-800 mb-10" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        <RecentLinks
          onCopy={handleCopy}
          isAuthenticated={isAuthenticated}
          token={authToken}
        />
      </div>
    </main>
  );
}
