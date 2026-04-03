import React, { useState } from "react";
import { Copy, BarChart2, Pencil, Trash2, Search, SlidersHorizontal, TrendingUp } from "lucide-react";

const initialLinks = [
  {
    id: 1,
    short: "linkr.co/dribbble-post",
    original: "https://dribbble.com/shots/12345678-Design-Concept-Dashboard",
    clicks: 1248,
    date: "Oct 24, 2023",
    trend: "up",
  },
  {
    id: 2,
    short: "linkr.co/newsletter-aug",
    original: "https://mailchimp.com/campaigns/view/newsletter-august-2023-final",
    clicks: 856,
    date: "Oct 21, 2023",
    trend: "up",
  },
  {
    id: 3,
    short: "linkr.co/app-download",
    original: "https://apps.apple.com/us/app/example-app/id123456789",
    clicks: 14092,
    date: "Sep 12, 2023",
    trend: "up",
  },
];

function LinkRow({ link, onCopy, onDelete }) {
  return (
    <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 hover:bg-slate-800/40 transition-colors group">
      {/* Left: Short + Original */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-white text-sm font-medium">{link.short}</span>
          <button
            onClick={() => onCopy(link.short)}
            className="text-slate-600 hover:text-slate-300 transition-colors opacity-0 group-hover:opacity-100"
          >
            <Copy size={13} />
          </button>
        </div>
        <p className="text-slate-500 text-xs mt-0.5 truncate max-w-xs">{link.original}</p>
      </div>

      {/* Clicks */}
      <div className="flex items-center gap-1.5 text-emerald-400 text-sm font-medium w-32 justify-center">
        <TrendingUp size={14} />
        <span>{link.clicks.toLocaleString()} clicks</span>
      </div>

      {/* Date */}
      <div className="flex items-center gap-2 text-slate-500 text-sm w-36 justify-center">
        <span className="w-2 h-2 rounded-full bg-slate-600 inline-block" />
        {link.date}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 ml-4">
        <button className="p-1.5 text-slate-500 hover:text-slate-300 transition-colors">
          <BarChart2 size={15} />
        </button>
        <button className="p-1.5 text-slate-500 hover:text-slate-300 transition-colors">
          <Pencil size={15} />
        </button>
        <button
          onClick={() => onDelete(link.id)}
          className="p-1.5 text-slate-500 hover:text-red-400 transition-colors"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}

export default function RecentLinks({ onCopy }) {
  const [links, setLinks] = useState(initialLinks);
  const [search, setSearch] = useState("");

  const filtered = links.filter(
    (l) =>
      l.short.toLowerCase().includes(search.toLowerCase()) ||
      l.original.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id) => setLinks((prev) => prev.filter((l) => l.id !== id));

  return (
    <section className="max-w-4xl mx-auto w-full px-4 pb-16">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-white text-xl font-bold">Recent Links</h2>
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2">
            <Search size={14} className="text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search your links..."
              className="bg-transparent text-slate-300 text-xs outline-none placeholder-slate-600 w-44"
            />
          </div>
          {/* Filter */}
          <button className="flex items-center gap-2 bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium px-3 py-2 rounded-lg hover:bg-slate-700 transition-colors">
            <SlidersHorizontal size={13} />
            Filter
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-slate-500 text-sm">No links found.</div>
        ) : (
          filtered.map((link) => (
            <LinkRow key={link.id} link={link} onCopy={onCopy} onDelete={handleDelete} />
          ))
        )}
      </div>
    </section>
  );
}