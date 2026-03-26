"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Edit2, Trash2, ExternalLink, CheckCircle, XCircle } from "lucide-react";
import { formatPlays } from "@/lib/utils";
import type { Game } from "@/lib/games";

export default function AdminGamesPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadForm, setUploadForm] = useState({
    file: null as File | null,
    title: "",
    description: "",
    category: "Action",
    developer: "",
    thumbnail: "",
  });

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      const resp = await fetch("/api/games");
      const data = await resp.json();
      setGames(data.games || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredGames = games.filter(g => 
    g.title.toLowerCase().includes(search.toLowerCase()) || 
    g.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (slug: string) => {
    if (!confirm("Are you sure you want to delete this game?")) return;
    try {
      await fetch(`/api/games/${slug}`, { method: "DELETE" });
      fetchGames();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadForm.file || !uploadForm.title.trim()) {
      setUploadError("ZIP file and title are required.");
      return;
    }
    setUploadError("");
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", uploadForm.file);
      formData.append("title", uploadForm.title.trim());
      formData.append("description", uploadForm.description.trim());
      formData.append("category", uploadForm.category.trim());
      formData.append("developer", uploadForm.developer.trim());
      formData.append("thumbnail", uploadForm.thumbnail.trim());

      const response = await fetch("/api/games/upload", { method: "POST", body: formData });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Upload failed");
      }
      setIsUploadOpen(false);
      setUploadForm({
        file: null,
        title: "",
        description: "",
        category: "Action",
        developer: "",
        thumbnail: "",
      });
      await fetchGames();
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Manage Games</h1>
          <p className="text-white/50 text-sm mt-1">Upload and manage your HTML5 games.</p>
        </div>
        <button 
          onClick={() => setIsUploadOpen(true)}
          className="bg-primary hover:bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all shadow-lg shadow-primary/20"
        >
          <Plus className="w-4 h-4" />
          Upload Game
        </button>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input 
            type="text" 
            placeholder="Search games..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-surface-800 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-primary/50 transition-all"
          />
        </div>
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/2">
                <th className="px-6 py-4 text-xs font-semibold text-white/40 uppercase tracking-wider">Game</th>
                <th className="px-6 py-4 text-xs font-semibold text-white/40 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-xs font-semibold text-white/40 uppercase tracking-wider">Plays</th>
                <th className="px-6 py-4 text-xs font-semibold text-white/40 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-white/40 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-white/20">Loading games...</td></tr>
              ) : filteredGames.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-white/20">No games found</td></tr>
              ) : filteredGames.map((game) => (
                <tr key={game.slug} className="hover:bg-white/2 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded bg-surface-700 overflow-hidden flex-shrink-0">
                        <img src={game.thumbnail} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-white text-sm font-medium truncate">{game.title}</p>
                        <p className="text-white/30 text-xs">/{game.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-white/60 text-sm bg-white/5 px-2 py-1 rounded-md">{game.category}</span>
                  </td>
                  <td className="px-6 py-4 text-white/60 text-sm font-mono">{formatPlays(game.plays)}</td>
                  <td className="px-6 py-4">
                    {game.active ? (
                      <span className="flex items-center gap-1.5 text-green-400 text-xs font-medium">
                        <CheckCircle className="w-3 h-3" /> Active
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-red-400 text-xs font-medium">
                        <XCircle className="w-3 h-3" /> Inactive
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <a href={`/games/${game.slug}`} target="_blank" className="p-2 text-white/40 hover:text-white transition-colors">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      <button className="p-2 text-white/40 hover:text-white transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(game.slug)}
                        className="p-2 text-white/40 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Upload Modal Placeholder */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass-card w-full max-w-xl rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Upload HTML5 Game</h2>
              <button onClick={() => setIsUploadOpen(false)} className="text-white/40 hover:text-white"><XCircle /></button>
            </div>
            <form onSubmit={handleUpload} className="space-y-4">
              <label className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-primary/50 transition-all cursor-pointer block">
                <Plus className="w-8 h-8 text-white/20 mx-auto mb-2" />
                <p className="text-white font-medium">Click to select game ZIP</p>
                <p className="text-white/40 text-xs mt-1">Must contain index.html at root level</p>
                <input
                  type="file"
                  accept=".zip,application/zip"
                  onChange={(e) => setUploadForm({ ...uploadForm, file: e.target.files?.[0] || null })}
                  className="hidden"
                  required
                />
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-white/40 uppercase">Title</label>
                  <input
                    type="text"
                    value={uploadForm.title}
                    onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                    className="w-full bg-surface-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
                    placeholder="Grand Racing"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-white/40 uppercase">Category</label>
                  <select
                    value={uploadForm.category}
                    onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value })}
                    className="w-full bg-surface-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white appearance-none"
                  >
                    <option>Action</option>
                    <option>Racing</option>
                    <option>Puzzle</option>
                    <option>Sports</option>
                    <option>Arcade</option>
                  </select>
                </div>
              </div>
              <input
                type="text"
                value={uploadForm.developer}
                onChange={(e) => setUploadForm({ ...uploadForm, developer: e.target.value })}
                className="w-full bg-surface-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
                placeholder="Developer (optional)"
              />
              <input
                type="url"
                value={uploadForm.thumbnail}
                onChange={(e) => setUploadForm({ ...uploadForm, thumbnail: e.target.value })}
                className="w-full bg-surface-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
                placeholder="Thumbnail URL (optional)"
              />
              <textarea
                value={uploadForm.description}
                onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                className="w-full bg-surface-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white min-h-20"
                placeholder="Description (optional)"
              />
              {uploadError && <p className="text-red-400 text-sm">{uploadError}</p>}
              <button 
                type="submit"
                disabled={uploading}
                className="w-full bg-primary hover:bg-primary-600 text-white font-bold py-3 rounded-xl transition-all"
              >
                {uploading ? "Uploading..." : "Upload & Publish"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
