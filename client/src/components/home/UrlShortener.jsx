import { useEffect, useState } from "react";
import {
  ArrowRight,
  BarChart3,
  Copy,
  ExternalLink,
  Globe2,
  Link2,
  Lock,
  ShieldCheck,
} from "lucide-react";
import { API_BASE_URL } from "../../config/api";

export default function UrlShortener({
  onCopy,
  isAuthenticated,
  token,
  onRequireLogin,
  onSignupClick,
  onAuthExpired,
}) {
  const [url, setUrl] = useState("");
  const [customCode, setCustomCode] = useState("");
  const [useCustom, setUseCustom] = useState(false);
  const [shortened, setShortened] = useState(null);
  const [authNotice, setAuthNotice] = useState("");
  const [totalShortened, setTotalShortened] = useState(null);
  const [totalClicks, setTotalClicks] = useState(null);

  useEffect(() => {
    const loadTotalShortened = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/stats/shortened`);

        const data = await response.json();
        if (!response.ok) {
          setTotalShortened(0);
          return;
        }

        setTotalShortened(Number(data.totalUrls || 0));
      } catch {
        setTotalShortened(0);
      }
    };

    loadTotalShortened();
  }, []);

  useEffect(() => {
    const loadTotalClicks = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/stats/clicks`);

        const data = await response.json();
        if (!response.ok) {
          setTotalClicks(0);
          return;
        }

        setTotalClicks(Number(data.totalClicks || 0));
      } catch {
        setTotalClicks(0);
      }
    };

    loadTotalClicks();
  }, []);

  const heroStats = [
    { value: totalShortened === null ? "Loading" : totalShortened.toLocaleString(), label: "Links Shortened" },
    { value: totalClicks === null ? "Loading" : totalClicks.toLocaleString(), label: "Total Clicks" },
    { value: "99.9%", label: "Uptime SLA" },
    { value: "< 50ms", label: "Redirect Speed" },
  ];

  const handleAuthFailure = (message) => {
    const normalized = (message || "").toLowerCase();
    const expired =
      normalized.includes("not authorized") ||
      normalized.includes("invalid token") ||
      normalized.includes("token missing") ||
      normalized.includes("user not found");

    if (expired) {
      onAuthExpired?.();
      return true;
    }

    return false;
  };

  const handleShorten = async () => {
    setAuthNotice(
      isAuthenticated
        ? ""
        : "You can create this link without logging in. Log in to save it to Recent Links."
    );

    try {
      const payload = { original_url: url };
      if (useCustom && customCode.trim()) {
        payload.custom_code = customCode.trim();
      }

      const headers = { "Content-Type": "application/json" };
      if (isAuthenticated && token) headers.Authorization = `Bearer ${token}`;

      const response = await fetch(`${API_BASE_URL}/shorten`, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        if (!handleAuthFailure(data.message)) {
          setAuthNotice(data.message || "Unable to shorten URL");
        }
        return;
      }

      setShortened({
        short: data.short_url,
        original: url,
      });
      setCustomCode("");
      setUseCustom(false);
    } catch (error) {
      setAuthNotice("Unable to connect to server");
      console.log("Error: ", error);
    }
  };

  const handleCopy = () => {
    if (!shortened?.short) return;
    onCopy?.(shortened.short);
  };

  

  return (
    <section className="mx-auto flex w-full max-w-5xl flex-col items-center px-4 pb-6 pt-6 text-center sm:px-6">
      <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] font-medium text-slate-200 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] backdrop-blur sm:text-xs">
        <span className="h-1.5 w-1.5 rounded-full bg-slate-100 shadow-[0_0_12px_rgba(255,255,255,0.45)]" />
        Trusted by 50,000+ creators & teams worldwide
      </div>

      <div className="mt-10 max-w-3xl">
        <h1 className="text-5xl font-black leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-7xl">
          Shorten URLs.
          <br />
          <span className="text-slate-300">Expand your reach.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-slate-400 sm:text-lg">
          A blazing-fast, secure URL shortener with real-time analytics.
          Built for teams who care about every click.
        </p>
      </div>

      {!isAuthenticated && (
        <div className="mt-8 w-full max-w-3xl rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] text-slate-300 sm:text-xs backdrop-blur">
          <div className="flex items-center justify-center gap-2">
            <Lock size={13} />
            <span>Login required if you want your short links to be saved in Recent Links</span>
          </div>
        </div>
      )}

      <div className="mt-4 w-full max-w-3xl space-y-3">
        <div className="flex flex-col gap-3 rounded-[28px] border border-white/10 bg-white/[0.04] px-4 py-4 shadow-[0_30px_80px_rgba(0,0,0,0.4)] backdrop-blur-xl sm:flex-row sm:items-center sm:px-5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-black/20 text-slate-200/80">
            <Link2 size={18} />
          </div>
          <input
            type="text"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              if (authNotice) setAuthNotice("");
            }}
            onKeyDown={(e) => e.key === "Enter" && handleShorten()}
            placeholder="Paste your long URL here..."
            className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-500 sm:text-base"
          />
          <button
            onClick={handleShorten}
            className="inline-flex min-w-[148px] items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white px-5 py-3 text-sm font-extrabold text-slate-950 shadow-[0_12px_32px_rgba(255,255,255,0.08)] transition-colors hover:bg-slate-100"
          >
            Shorten URL <ArrowRight size={14} />
          </button>
        </div>

        {useCustom && (
          <div className="flex items-center gap-3 rounded-[22px] border border-white/10 bg-white/[0.04] px-4 py-3 backdrop-blur-xl">
            <span className="shrink-0 text-xs font-medium text-slate-400">
              {API_BASE_URL}/
            </span>
            <input
              type="text"
              value={customCode}
              onChange={(e) => setCustomCode(e.target.value)}
              placeholder="custom-code"
              className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
            />
          </div>
        )}

        <div className="flex items-center justify-between gap-3 px-1">
          <button
            onClick={() => setUseCustom(!useCustom)}
            className="text-xs font-medium text-slate-400 transition-colors hover:text-slate-200"
          >
            {useCustom ? "✓ Custom URL" : "+ Add custom slug"}
          </button>
          {!isAuthenticated && onSignupClick ? (
            <button
              onClick={onSignupClick}
              className="text-xs font-medium text-slate-300 transition-colors hover:text-white"
            >
              Create an account
            </button>
          ) : null}
        </div>
      </div>

      {authNotice && (
        <p className="mt-2 w-full max-w-3xl text-left text-xs text-slate-300">
          {authNotice}
        </p>
      )}

      {shortened && (
        <div className="mt-5 w-full max-w-3xl rounded-[24px] border border-white/10 bg-white/[0.04] px-4 py-4 text-left shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:px-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/20 text-slate-200">
                <Globe2 size={18} />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white sm:text-base">
                  {shortened.short}
                </p>
                <p className="mt-0.5 truncate text-xs text-slate-500">
                  {shortened.original}
                </p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <button
                onClick={() =>
                  window.open(shortened.short, "_blank", "noopener,noreferrer")
                }
                className="inline-flex h-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 px-3 text-slate-200 transition-colors hover:bg-white/10"
              >
                <ExternalLink size={16} />
              </button>
              <button
                onClick={handleCopy}
                className="inline-flex h-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 px-3 text-slate-200 transition-colors hover:bg-white/10"
              >
                <Copy size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-10 grid w-full grid-cols-2 gap-3 lg:grid-cols-4 sm:gap-4">
        {heroStats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-5 text-center backdrop-blur-xl"
          >
            <div className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              {stat.value}
            </div>
            <div className="mt-1 text-[11px] uppercase tracking-[0.18em] text-slate-400 sm:text-xs">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid w-full gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 text-left text-sm text-slate-300 backdrop-blur-xl">
          <div className="mb-2 flex items-center gap-2 text-slate-100">
            <ShieldCheck size={15} />
            Secure by design
          </div>
          JWT auth, custom slugs, and link ownership keep your workspace clean.
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 text-left text-sm text-slate-300 backdrop-blur-xl">
          <div className="mb-2 flex items-center gap-2 text-slate-100">
            <BarChart3 size={15} />
            Real-time tracking
          </div>
          See what gets clicked and iterate on campaigns faster.
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 text-left text-sm text-slate-300 backdrop-blur-xl">
          <div className="mb-2 flex items-center gap-2 text-slate-100">
            <Globe2 size={15} />
            Built for sharing
          </div>
          Clean short links that look good everywhere you post them.
        </div>
      </div>
    </section>
  );
}
