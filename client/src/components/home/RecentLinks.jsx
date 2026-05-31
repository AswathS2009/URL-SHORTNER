import React, { useEffect, useState } from "react";
import {
  Copy,
  BarChart2,
  Pencil,
  Trash2,
  Search,
  SlidersHorizontal,
  TrendingUp,
} from "lucide-react";
import { API_BASE_URL } from "../../config/api";

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
};

function LinkRow({ link, onCopy, onDelete }) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 py-4 gap-3 border-b border-slate-800 hover:bg-slate-800/40 transition-colors group">
      {/* Left: Short + Original */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-white text-sm font-medium truncate">{link.short}</span>
          <button
            onClick={() => onCopy(link.short)}
            className="text-slate-600 hover:text-slate-300 transition-colors opacity-0 group-hover:opacity-100"
          >
            <Copy size={13} />
          </button>
        </div>
        <p className="text-slate-500 text-xs mt-0.5 truncate max-w-full break-words">
          {link.original}
        </p>
      </div>

      {/* Date */}
      <div className="flex items-center gap-2 text-slate-500 text-sm w-full sm:w-36 justify-start sm:justify-center">
        <span className="w-2 h-2 rounded-full bg-slate-600 inline-block" />
        {link.date}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 ml-0 sm:ml-4">
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

export default function RecentLinks({ onCopy, isAuthenticated, token }) {
  const [links, setLinks] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadLinks = async () => {
      if (!isAuthenticated || !token) {
        setLinks([]);
        setError("");
        return;
      }

      setLoading(true);
      setError("");

      try {
        const response = await fetch(`${API_BASE_URL}/my-links`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (!response.ok) {
          setError(data.message || "Unable to load your links");
          setLinks([]);
          return;
        }

        const mappedLinks = (data.links || []).map((item) => ({
          id: item.id,
          shortCode: item.short_code,
          short: `${API_BASE_URL}/${item.short_code}`,
          original: item.original_url,
          clicks: Number(item.clicks || 0),
          date: formatDate(item.created_at),
        }));

        setLinks(mappedLinks);
      } catch {
        setError("Unable to connect to server");
        setLinks([]);
      } finally {
        setLoading(false);
      }
    };

    loadLinks();
  }, [isAuthenticated, token]);

  const searchTerm = search.trim().toLowerCase();
  const filtered = links.filter((link) => {
    if (!searchTerm) return true;

    return (
      link.short.toLowerCase().includes(searchTerm) ||
      link.shortCode?.toLowerCase().includes(searchTerm) ||
      link.original?.toLowerCase().includes(searchTerm)
    );
  });

  const handleDelete = async (id) => {
    if (!isAuthenticated || !token) return;

    try {
      const response = await fetch(`${API_BASE_URL}/my-links/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Unable to delete link");
        return;
      }

      setLinks((prev) => prev.filter((l) => l.id !== id));
    } catch {
      setError("Unable to connect to server");
    }
  };
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
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-slate-500 text-sm">
            Loading your links...
          </div>
        ) : error ? (
          <div className="py-16 text-center text-red-400 text-sm">{error}</div>
        ) : !isAuthenticated ? (
          <div className="py-16 text-center text-slate-500 text-sm">
            Log in to see your recent links.
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-slate-500 text-sm">
            No links found.
          </div>
        ) : (
          filtered.map((link) => (
            <LinkRow
              key={link.id}
              link={link}
              onCopy={onCopy}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </section>
  );
}
