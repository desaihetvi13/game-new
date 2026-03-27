"use client";

import { FormEvent, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Flag, Heart, Loader2, Share2, Star } from "lucide-react";

interface GameActionsProps {
  slug: string;
  title: string;
  initialAverageRating: number;
  initialRatingCount: number;
}

export default function GameActions({
  slug,
  title,
  initialAverageRating,
  initialRatingCount,
}: GameActionsProps) {
  const { status, data: session } = useSession();
  const isLoggedIn = status === "authenticated";
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoadingFavorite, setIsLoadingFavorite] = useState(false);
  const [rating, setRating] = useState<number | null>(null);
  const [averageRating, setAverageRating] = useState(initialAverageRating);
  const [ratingCount, setRatingCount] = useState(initialRatingCount);
  const [ratingBusy, setRatingBusy] = useState(false);
  const [shareMessage, setShareMessage] = useState("");
  const [bugOpen, setBugOpen] = useState(false);
  const [bugEmail, setBugEmail] = useState(session?.user?.email ?? "");
  const [bugMessage, setBugMessage] = useState("");
  const [bugBusy, setBugBusy] = useState(false);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    async function bootstrap() {
      try {
        const [favoriteRes, ratingRes] = await Promise.all([
          fetch(`/api/games/${slug}/favorite`, { cache: "no-store" }),
          fetch(`/api/games/${slug}/rating`, { cache: "no-store" }),
        ]);

        if (favoriteRes.ok) {
          const favoriteData = await favoriteRes.json();
          setIsFavorite(Boolean(favoriteData?.isFavorite));
        }
        if (ratingRes.ok) {
          const ratingData = await ratingRes.json();
          setRating(ratingData?.userRating ?? null);
          if (typeof ratingData?.averageRating === "number") setAverageRating(ratingData.averageRating);
          if (typeof ratingData?.ratingCount === "number") setRatingCount(ratingData.ratingCount);
        }
      } catch {
        // Silent non-blocking fetch.
      }
    }

    void bootstrap();
  }, [slug]);

  async function handleShare() {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Play ${title}`,
          text: `Check out ${title} on GamePortal`,
          url,
        });
        setShareMessage("Shared successfully.");
      } else {
        await navigator.clipboard.writeText(url);
        setShareMessage("Link copied to clipboard.");
      }
    } catch {
      setShareMessage("Could not share. Please copy the URL manually.");
    }
    window.setTimeout(() => setShareMessage(""), 2500);
  }

  async function toggleFavorite() {
    if (!isLoggedIn) {
      setFeedback("Please sign in to save favorites.");
      return;
    }
    setIsLoadingFavorite(true);
    setFeedback("");
    try {
      const method = isFavorite ? "DELETE" : "POST";
      const response = await fetch(`/api/games/${slug}/favorite`, { method });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setFeedback(data?.error || "Failed to update favorite.");
        return;
      }
      setIsFavorite((prev) => !prev);
    } catch {
      setFeedback("Failed to update favorite.");
    } finally {
      setIsLoadingFavorite(false);
    }
  }

  async function submitRating(nextRating: number) {
    if (!isLoggedIn) {
      setFeedback("Please sign in to rate this game.");
      return;
    }
    setRatingBusy(true);
    setFeedback("");
    try {
      const response = await fetch(`/api/games/${slug}/rating`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating: nextRating }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setFeedback(data?.error || "Failed to submit rating.");
        return;
      }
      setRating(nextRating);
      setAverageRating(data.averageRating ?? averageRating);
      setRatingCount(data.ratingCount ?? ratingCount);
    } catch {
      setFeedback("Failed to submit rating.");
    } finally {
      setRatingBusy(false);
    }
  }

  async function submitBugReport(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBugBusy(true);
    setFeedback("");
    try {
      const response = await fetch(`/api/games/${slug}/report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: bugEmail,
          message: bugMessage,
          pageUrl: window.location.href,
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setFeedback(data?.error || "Failed to send bug report.");
        return;
      }
      setBugMessage("");
      setBugOpen(false);
      setFeedback("Thanks. Your bug report was submitted.");
    } catch {
      setFeedback("Failed to send bug report.");
    } finally {
      setBugBusy(false);
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 pt-2 border-t border-white/5 flex-wrap">
        <button
          type="button"
          onClick={() => setBugOpen((prev) => !prev)}
          className="flex items-center gap-2 text-white/40 hover:text-white text-sm transition-colors"
        >
          <Flag className="w-4 h-4" />
          Report a bug
        </button>
        <button
          type="button"
          onClick={handleShare}
          className="flex items-center gap-2 text-white/40 hover:text-white text-sm transition-colors"
        >
          <Share2 className="w-4 h-4" />
          Share
        </button>
        <button
          type="button"
          onClick={toggleFavorite}
          disabled={isLoadingFavorite}
          className="flex items-center gap-2 text-white/40 hover:text-white text-sm transition-colors disabled:opacity-60"
        >
          {isLoadingFavorite ? <Loader2 className="w-4 h-4 animate-spin" /> : <Heart className={`w-4 h-4 ${isFavorite ? "fill-red-400 text-red-400" : ""}`} />}
          {isFavorite ? "Remove from favourite" : "Add to favourite"}
        </button>
      </div>

      <div className="flex items-center justify-between gap-4 flex-wrap rounded-lg border border-white/10 bg-white/5 px-3 py-2">
        <div className="flex items-center gap-2 text-sm text-white/70">
          <span>Your rating:</span>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => submitRating(value)}
                disabled={ratingBusy}
                className="disabled:opacity-50"
                aria-label={`Rate ${value} star${value > 1 ? "s" : ""}`}
              >
                <Star
                  className={`w-4 h-4 ${
                    (rating ?? 0) >= value ? "text-yellow-400 fill-yellow-400" : "text-white/30"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
        <div className="text-sm text-white/50">
          Avg {averageRating.toFixed(1)} ({ratingCount})
        </div>
      </div>

      {shareMessage ? <p className="text-xs text-primary-300">{shareMessage}</p> : null}
      {feedback ? <p className="text-xs text-white/70">{feedback}</p> : null}

      {bugOpen ? (
        <form onSubmit={submitBugReport} className="rounded-lg border border-white/10 bg-surface-900/60 p-3 space-y-2">
          <label className="block text-xs text-white/60">
            Email (optional)
            <input
              type="email"
              value={bugEmail}
              onChange={(event) => setBugEmail(event.target.value)}
              className="mt-1 w-full rounded-md border border-white/10 bg-black/40 px-3 py-2 text-sm outline-none focus:border-primary/50"
              placeholder="you@example.com"
            />
          </label>
          <label className="block text-xs text-white/60">
            Bug details
            <textarea
              value={bugMessage}
              onChange={(event) => setBugMessage(event.target.value)}
              required
              minLength={8}
              rows={4}
              className="mt-1 w-full rounded-md border border-white/10 bg-black/40 px-3 py-2 text-sm outline-none focus:border-primary/50"
              placeholder="What went wrong? Steps to reproduce?"
            />
          </label>
          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={bugBusy}
              className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-white disabled:opacity-60"
            >
              {bugBusy ? "Submitting..." : "Submit report"}
            </button>
            <button
              type="button"
              onClick={() => setBugOpen(false)}
              className="rounded-md border border-white/10 px-3 py-1.5 text-sm text-white/70"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : null}
    </div>
  );
}
