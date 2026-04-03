import React, { useState } from "react";
import { Link2, QrCode, ExternalLink, Copy, ArrowRight } from "lucide-react";

export default function UrlShortener({ onCopy }) {
  const [url, setUrl] = useState("");
  const [shortened, setShortened] = useState(null);

  const handleShorten = async () => {
    try {
      const response = await fetch("http://localhost:5000/shorten", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ original_url: url }),
      });
      const data = await response.json();
      console.log(data);
      setShortened({
        short: data.short_url,
        original: url,
      });
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`${shortened.short}`).catch(() => {});
    onCopy();
  };

  return (
    <section className="flex flex-col items-center text-center px-4 pt-14 pb-20 max-w-2xl mx-auto w-full">
      {/* Banner */}
      <div className="flex items-center gap-2 bg-slate-800/70 border border-slate-700 text-cyan-400 text-xs font-medium px-4 py-1.5 rounded-full mb-10">
        <Link2 size={12} />
        <span>New: Custom branded domains are now available</span>
      </div>

      {/* Headline */}
      <h1 className="text-5xl font-extrabold text-white leading-tight mb-4">
        Shorten URLs.
        <br />
        Expand your reach.
      </h1>
      <p className="text-slate-400 text-base max-w-md mb-10 leading-relaxed">
        A modern, fast, and secure URL shortener for forward-thinking teams and creators. Track every
        click and optimize your links in real-time.
      </p>

      {/* Input */}
      <div className="w-full flex items-center bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3 gap-3 mb-4">
        <Link2 size={18} className="text-slate-500 shrink-0" />
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleShorten()}
          placeholder="Paste your long URL here..."
          className="flex-1 bg-transparent text-slate-300 text-sm outline-none placeholder-slate-600"
        />
        <button
          onClick={handleShorten}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors shrink-0"
        >
          Shorten URL <ArrowRight size={14} />
        </button>
      </div>

      {/* Result Card */}
      {shortened && (
        <div className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3 flex items-center justify-between gap-4">
          <div className="text-left min-w-0">
            <p className="text-white text-sm font-semibold">{shortened.short}</p>
            <p className="text-slate-500 text-xs mt-0.5 truncate">{shortened.original}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button className="p-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 transition-colors">
              <QrCode size={16} />
            </button>
            <button className="p-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 transition-colors">
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