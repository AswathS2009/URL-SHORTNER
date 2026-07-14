import { useState } from "react";
import {
  Link2,
  QrCode,
  ExternalLink,
  Copy,
  ArrowRight,
  Lock,
} from "lucide-react";
import { API_BASE_URL } from "../../config/api";

export default function UrlShortener({
  onCopy,
  isAuthenticated,
  token,
  onRequireLogin,
}) {
  const [url, setUrl] = useState("");
  const [customCode, setCustomCode] = useState("");
  const [useCustom, setUseCustom] = useState(false);
  const [shortened, setShortened] = useState(null);
  const [authNotice, setAuthNotice] = useState("");

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
        setAuthNotice(data.message || "Unable to shorten URL");
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
    <section className="flex flex-col items-center text-center px-4 pt-14 pb-20 max-w-2xl mx-auto w-full">

      <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight mb-4">
        Shorten URLs.
        <br />
        Expand your reach.
      </h1>
      <p className="text-sm sm:text-base text-slate-400 max-w-md mb-10 leading-relaxed">
        A modern, fast, and secure URL shortener for forward-thinking teams and
        creators. Track every click and optimize your links in real-time.
      </p>

      {!isAuthenticated && (
        <div className="w-full mb-3 flex items-center justify-center gap-2 rounded-lg border border-cyan-900/50 bg-cyan-950/20 text-cyan-300 text-xs px-3 py-2">
          <Lock size={13} />
          <span>Login required if you want your short url's to be saved in Recent Links</span>
        </div>
      )}

      <div className="w-full flex flex-col gap-3 mb-2">
        <div className="w-full flex flex-col sm:flex-row items-center bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3 gap-3">
          <Link2 size={18} className="text-slate-500 shrink-0" />
          <input
            type="text"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              if (authNotice) setAuthNotice("");
            }}
            onKeyDown={(e) => e.key === "Enter" && handleShorten()}
            placeholder="Paste your long URL here..."
            className="flex-1 w-full bg-transparent text-slate-300 text-sm outline-none placeholder-slate-600"
          />
          <button
            onClick={handleShorten}
            className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors shrink-0 w-full sm:w-auto"
          >
            Shorten URL <ArrowRight size={14} />
          </button>
        </div>

        {useCustom && (
          <div className="w-full flex items-center bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3 gap-3">
            <span className="text-slate-400 text-sm font-medium shrink-0">
              {API_BASE_URL}/
            </span>
            <input
              type="text"
              value={customCode}
              onChange={(e) => setCustomCode(e.target.value)}
              placeholder="custom-code"
              className="flex-1 w-full bg-transparent text-slate-300 text-sm outline-none placeholder-slate-600"
            />
          </div>
        )}

        <button
          onClick={() => setUseCustom(!useCustom)}
          className="w-full text-left text-xs text-slate-400 hover:text-slate-300 transition-colors px-1 py-1"
        >
          {useCustom ? "✓ Custom URL" : "+ Add custom URL"}
        </button>
      </div>

      {authNotice && (
        <p className="w-full text-left text-xs text-cyan-300 mb-4">
          {authNotice}
        </p>
      )}

      {shortened && (
        <div className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="text-left min-w-0">
            <p className="text-white text-sm font-semibold">
              {shortened.short}
            </p>
            <p className="text-slate-500 text-xs mt-0.5 truncate">
              {shortened.original}
            </p>
          </div>
          <div className="flex items-center gap-2 mt-3 sm:mt-0 shrink-0">
            <button
              onClick={() =>
                window.open(shortened.short, "_blank", "noopener,noreferrer")
              }
              className="p-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 transition-colors"
            >
              <ExternalLink size={16} />
            </button>
            <button
              onClick={handleCopy}
              className="p-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 transition-colors"
            >
              <Copy size={16} />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
