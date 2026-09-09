import React, { useState } from "react";
import { ArrowUpRight, Link2, Menu, ShieldCheck } from "lucide-react";
import UrlShortener from "../components/home/UrlShortener";
import RecentLinks from "../components/home/RecentLinks";
import ThreeBackdrop from "../components/home/ThreeBackdrop";
import Toast from "../components/ui/Toast";
import LoginModel from "../components/auth/LoginModel";
import SignupModel from "../components/auth/SignupModel";
export default function HomePage({
  activeModal,
  isAuthenticated,
  authToken,
  onLoginClick,
  onSignupClick,
  onCloseModal,
  onAuthSuccess,
  onLogout,
  onAuthExpired,
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
    <main className="relative min-h-screen overflow-x-hidden bg-[#08110f] text-slate-100">
      <ThreeBackdrop />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(52,211,153,0.12),transparent_30%),radial-gradient(circle_at_85%_14%,rgba(251,191,36,0.08),transparent_23%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(8,17,15,0.97),rgba(8,17,15,0.76)_42%,rgba(8,17,15,0.94))]" />

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

      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:py-7">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-300 text-emerald-950 shadow-[0_10px_30px_rgba(52,211,153,0.18)]">
            <Link2 size={19} strokeWidth={2.5} />
          </div>
          <div>
            <span className="block text-lg font-black tracking-tight text-white">Linkr</span>
            <span className="hidden text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-200/60 sm:block">Make every click count</span>
          </div>
        </div>
        <nav className="hidden items-center gap-7 text-sm text-slate-300 lg:flex" aria-label="Primary navigation">
          <a href="#features" className="transition-colors hover:text-emerald-200">Features</a>
          <a href="#workflow" className="transition-colors hover:text-emerald-200">How it works</a>
          <a href="#security" className="transition-colors hover:text-emerald-200">Security</a>
        </nav>
        <div className="flex items-center gap-2 sm:gap-3">
          <button className="hidden p-2 text-slate-300 lg:hidden" aria-label="Open navigation">
            <Menu size={19} />
          </button>
          {!isAuthenticated ? (
            <>
            <button
              className="rounded-lg px-3.5 py-2 text-sm font-semibold text-slate-300 transition-colors hover:text-white"
              onClick={onLoginClick}
            >
              Log in
            </button>
            <button
              className="rounded-lg bg-emerald-300 px-4 py-2 text-sm font-bold text-emerald-950 shadow-[0_12px_28px_rgba(52,211,153,0.18)] transition-colors hover:bg-emerald-200"
              onClick={onSignupClick}
            >
              Get started
            </button>
            </>
          ) : (
            <button
              className="rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200 transition-colors hover:bg-white/10 hover:text-white"
              onClick={onLogout}
            >
              Log out
            </button>
          )}
        </div>
      </header>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        <UrlShortener
          onCopy={handleCopy}
          isAuthenticated={isAuthenticated}
          token={authToken}
          onRequireLogin={onLoginClick}
          onSignupClick={onSignupClick}
          onAuthExpired={onAuthExpired}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 pt-10 sm:px-6 sm:pt-12">
        <RecentLinks
          onCopy={handleCopy}
          isAuthenticated={isAuthenticated}
          token={authToken}
          onAuthExpired={onAuthExpired}
        />
      </div>

      <section id="workflow" className="relative z-10 mx-auto grid max-w-7xl gap-5 px-4 pb-16 pt-4 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:pt-8">
        <div className="rounded-3xl border border-white/10 bg-[#10201b]/80 p-6 sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">A better link workflow</p>
          <h2 className="mt-3 max-w-xl text-3xl font-black tracking-tight text-white sm:text-4xl">From long URL to a link people trust.</h2>
          <div className="mt-7 grid gap-5 sm:grid-cols-3">
            {[
              ["01", "Paste", "Drop in any URL and create a clean shareable link."],
              ["02", "Customize", "Choose a memorable slug that fits your campaign."],
              ["03", "Measure", "Keep an eye on clicks from your personal workspace."],
            ].map(([number, title, copy]) => (
              <div key={number}>
                <span className="text-xs font-black text-amber-300">{number}</span>
                <h3 className="mt-2 text-sm font-bold text-white">{title}</h3>
                <p className="mt-1.5 text-sm leading-6 text-slate-400">{copy}</p>
              </div>
            ))}
          </div>
        </div>
        <div id="security" className="rounded-3xl border border-emerald-200/15 bg-emerald-300 p-6 text-emerald-950 sm:p-8">
          <ShieldCheck size={23} />
          <h2 className="mt-8 text-2xl font-black tracking-tight">Simple by default. Thoughtful underneath.</h2>
          <p className="mt-3 text-sm leading-6 text-emerald-950/75">Your links stay organized in one place, with ownership, custom slugs, QR codes, and click counts built into the workflow.</p>
          <a href="#features" className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-emerald-950 underline decoration-emerald-950/30 underline-offset-4 hover:decoration-emerald-950">Explore features <ArrowUpRight size={15} /></a>
        </div>
      </section>

      <section id="features" className="relative z-10 mx-auto max-w-7xl border-t border-white/10 px-4 py-14 sm:px-6 lg:py-20">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">Everything around the link</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">Built for the moment after “shorten”.</h2>
        </div>
        <div className="mt-9 grid gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Custom slugs", "Create links that are easy to remember and easy to say out loud."],
            ["QR codes", "Turn every short link into a scannable offline touchpoint."],
            ["Click tracking", "See which links are getting attention from your workspace."],
            ["Link library", "Search, reuse, and clean up your links whenever you need."],
          ].map(([title, copy]) => (
            <article key={title} className="bg-[#0d1a17] p-5 sm:p-6">
              <div className="h-2 w-2 rounded-full bg-amber-300" />
              <h3 className="mt-7 text-base font-bold text-white">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/10 px-4 py-8 sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 font-bold text-slate-200"><Link2 size={16} className="text-emerald-300" /> Linkr</div>
          <p>Short links for the things worth sharing.</p>
          <div className="flex gap-5"><a href="#features" className="hover:text-white">Features</a><a href="#security" className="hover:text-white">Security</a><a href="mailto:hello@linkr.example" className="hover:text-white">Contact</a></div>
        </div>
      </footer>
    </main>
  );
}
