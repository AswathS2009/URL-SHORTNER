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
    <div className="fixed top-6 right-6 z-50 flex items-start gap-3 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl px-4 py-3 min-w-64 animate-fade-in">
      <div className="mt-0.5 text-emerald-400">
        <CheckCircle size={18} />
      </div>
      <div className="flex-1">
        <p className="text-white text-sm font-semibold">Link Copied!</p>
        <p className="text-slate-400 text-xs mt-0.5">
          The short URL is now in your clipboard.
        </p>
      </div>
      <button
        onClick={onClose}
        className="text-slate-500 hover:text-slate-300 transition-colors mt-0.5"
      >
        <X size={16} />
      </button>
    </div>
  );
}
