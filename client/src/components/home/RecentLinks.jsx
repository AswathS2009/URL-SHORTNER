import React, { useEffect, useState } from "react";
import { BarChart2, Clock3, Copy, Link2, Search, Trash2 } from "lucide-react";
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
    <div className="grid gap-4 border-b border-white/10 px-4 py-4 transition-colors hover:bg-white/[0.03] sm:grid-cols-[minmax(0,1.8fr)_140px_110px_72px] sm:items-center sm:px-6 group">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-200">
            <Link2 size={14} />
          </span>
          <span className="truncate text-sm font-medium text-white">{link.short}</span>
          <button
            onClick={() => onCopy(link.short)}
            className="text-slate-500 transition-colors opacity-0 hover:text-slate-200 group-hover:opacity-100"
          >
            <Copy size={13} />
          </button>
        </div>
        <p className="mt-1 truncate text-xs text-slate-500">{link.original}</p>
      </div>

      <div className="flex items-center gap-2 text-sm text-slate-400">
        <Clock3 size={14} className="text-slate-300/70" />
        {link.date}
      </div>

      <div className="flex items-center gap-2">
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200/80">
          {link.clicks.toLocaleString()} clicks
        </span>
      </div>

      <div className="flex items-center justify-start gap-2 sm:justify-end">
        <button
          onClick={() => onDelete(link.id)}
          className="inline-flex h-9 items-center justify-center rounded-lg border border-white/5 bg-white/[0.03] px-3 text-slate-400 transition-colors hover:border-red-500/20 hover:bg-red-500/10 hover:text-red-300"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}

export default function RecentLinks({ onCopy, isAuthenticated, token, onAuthExpired }) {
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
        const normalized = (data.message || "").toLowerCase();
        const expired =
          normalized.includes("not authorized") ||
          normalized.includes("invalid token") ||
          normalized.includes("token missing") ||
          normalized.includes("user not found");

        if (expired) {
          onAuthExpired?.();
          return;
        }

        setError(data.message || "Unable to delete link");
        return;
      }

      setLinks((prev) => prev.filter((l) => l.id !== id));
    } catch {
      setError("Unable to connect to server");
    }
  };

  return (
    <section className="mx-auto w-full max-w-7xl pb-20">
      <div className="mb-5 flex flex-col gap-4 px-4 sm:flex-row sm:items-end sm:justify-between sm:px-0">
        <div>
          <p className="mb-2 text-xs uppercase tracking-[0.22em] text-slate-400">
            Recent Links
          </p>
          <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
            Recent Links
          </h2>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <BarChart2 size={15} />
          Manage and reuse your latest links
        </div>
      </div>

      <div className="flex justify-end px-4 sm:px-0">
        <div className="flex w-full items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 shadow-[0_12px_40px_rgba(0,0,0,0.22)] backdrop-blur-xl sm:w-auto">
          <Search size={14} className="text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search your links..."
            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500 sm:w-56"
          />
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] shadow-[0_30px_100px_rgba(0,0,0,0.32)] backdrop-blur-xl">
        <div className="grid gap-4 border-b border-white/10 px-4 py-4 text-[11px] uppercase tracking-[0.22em] text-slate-500 sm:grid-cols-[minmax(0,1.8fr)_140px_110px_72px] sm:px-6">
          <div>Original URL</div>
          <div>Date</div>
          <div>Clicks</div>
          <div className="text-left sm:text-right">Actions</div>
        </div>

        {loading ? (
          <div className="py-16 text-center text-sm text-slate-400">
            Loading your links...
          </div>
        ) : error ? (
          <div className="py-16 text-center text-sm text-red-300">{error}</div>
        ) : !isAuthenticated ? (
          <div className="py-16 text-center text-sm text-slate-400">
            Log in to see your recent links.
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-sm text-slate-400">
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

      <div className="mt-4 flex items-center justify-between px-4 text-[11px] text-slate-500 sm:hidden">
        <div className="flex items-center gap-2">
          <BarChart2 size={12} />
          <span>Quick filters and search are available on larger screens.</span>
        </div>
      </div>
    </section>
  );
}
