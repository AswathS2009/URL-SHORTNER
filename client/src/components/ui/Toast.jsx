import React, { useEffect } from "react";
import { CheckCircle, X } from "lucide-react";

export default function Toast({ show, onClose }) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="fixed right-6 top-6 z-50 flex min-w-64 items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.08] px-4 py-3 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl animate-fade-in">
      <div className="mt-0.5 text-white/90">
        <CheckCircle size={18} />
      </div>
      <div className="flex-1">
        <p className="text-white text-sm font-semibold">Link Copied!</p>
        <p className="mt-0.5 text-xs text-slate-300">
          The short URL is now in your clipboard.
        </p>
      </div>
      <button
        onClick={onClose}
        className="mt-0.5 text-slate-400 transition-colors hover:text-white"
      >
        <X size={16} />
      </button>
    </div>
  );
}
