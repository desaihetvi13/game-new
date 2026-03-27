"use client";

import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import {
  Maximize2,
  Minimize2,
  RotateCcw,
} from "lucide-react";
import { useSession } from "next-auth/react";

interface GamePlayerProps {
  slug: string;
  src: string;
  title: string;
}

interface PersistedProgress {
  elapsedSec: number;
  progressPct?: number;
  state?: unknown;
  updatedAt: string;
}

function getGuestKey(slug: string) {
  return `gp:progress:${slug}`;
}

export default function GamePlayer({ slug, src, title }: GamePlayerProps) {
  const { status } = useSession();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [resumeMessage, setResumeMessage] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const startedAtRef = useRef<number>(Date.now());
  const latestStateRef = useRef<unknown>(undefined);
  const latestProgressPctRef = useRef<number | undefined>(undefined);
  const lastSavedSecRef = useRef<number>(0);

  const guestStorageKey = useMemo(() => getGuestKey(slug), [slug]);

  const readGuestProgress = useCallback((): PersistedProgress | null => {
    if (typeof window === "undefined") return null;
    try {
      const raw = window.localStorage.getItem(guestStorageKey);
      if (!raw) return null;
      return JSON.parse(raw) as PersistedProgress;
    } catch {
      return null;
    }
  }, [guestStorageKey]);

  const writeGuestProgress = useCallback(
    (value: PersistedProgress) => {
      if (typeof window === "undefined") return;
      try {
        window.localStorage.setItem(guestStorageKey, JSON.stringify(value));
      } catch {
        // Ignore storage failures.
      }
    },
    [guestStorageKey],
  );

  const saveProgress = useCallback(
    async (force = false) => {
      const elapsedSec = Math.max(
        0,
        Math.floor((Date.now() - startedAtRef.current) / 1000) + lastSavedSecRef.current,
      );
      if (!force && elapsedSec < 3) return;

      const payload: PersistedProgress = {
        elapsedSec,
        progressPct: latestProgressPctRef.current,
        state: latestStateRef.current,
        updatedAt: new Date().toISOString(),
      };

      writeGuestProgress(payload);

      if (status === "authenticated") {
        void fetch(`/api/games/${slug}/progress`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            elapsedSec: payload.elapsedSec,
            progressPct: payload.progressPct,
            state: payload.state,
          }),
        });
      }
    },
    [slug, status, writeGuestProgress],
  );

  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true));
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false));
    }
  }, []);

  const reload = () => {
    if (iframeRef.current) {
      iframeRef.current.src = src;
      setIsLoading(true);
    }
  };

  useEffect(() => {
    startedAtRef.current = Date.now();
    lastSavedSecRef.current = 0;
    latestStateRef.current = undefined;
    latestProgressPctRef.current = undefined;
    setResumeMessage("");
  }, [slug]);

  useEffect(() => {
    async function loadResume() {
      const localProgress = readGuestProgress();
      let serverProgress: PersistedProgress | null = null;

      if (status === "authenticated") {
        try {
          const response = await fetch(`/api/games/${slug}/progress`, { cache: "no-store" });
          if (response.ok) {
            const data = await response.json();
            if (data?.progress) {
              serverProgress = {
                elapsedSec: data.progress.elapsedSec,
                progressPct: data.progress.progressPct ?? undefined,
                state: data.progress.stateJson ?? undefined,
                updatedAt: data.progress.updatedAt,
              };
            }
          }
        } catch {
          // Non-blocking.
        }
      }

      const chosen =
        serverProgress && localProgress
          ? new Date(serverProgress.updatedAt).getTime() > new Date(localProgress.updatedAt).getTime()
            ? serverProgress
            : localProgress
          : serverProgress || localProgress;

      if (!chosen) return;

      lastSavedSecRef.current = chosen.elapsedSec || 0;
      latestProgressPctRef.current = chosen.progressPct;
      latestStateRef.current = chosen.state;
      setResumeMessage(
        chosen.progressPct !== undefined
          ? `Resumed from ${chosen.progressPct}% progress`
          : "Resumed your previous session",
      );
    }

    void loadResume();
  }, [readGuestProgress, slug, status]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      void saveProgress();
    }, 12000);

    const onBeforeUnload = () => {
      void saveProgress(true);
    };

    window.addEventListener("beforeunload", onBeforeUnload);
    return () => {
      window.clearInterval(interval);
      window.removeEventListener("beforeunload", onBeforeUnload);
      void saveProgress(true);
    };
  }, [saveProgress]);

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (!event?.data || typeof event.data !== "object") return;
      const data = event.data as { type?: string; payload?: unknown };
      if (data.type === "GAME_STATE_UPDATE") {
        latestStateRef.current = data.payload;
      }
      if (data.type === "GAME_PROGRESS_UPDATE" && data.payload && typeof data.payload === "object") {
        const progress = (data.payload as { progressPct?: number }).progressPct;
        if (typeof progress === "number" && progress >= 0 && progress <= 100) {
          latestProgressPctRef.current = Math.round(progress);
        }
      }
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  const handleFrameLoaded = () => {
    setIsLoading(false);
    if (iframeRef.current?.contentWindow && latestStateRef.current !== undefined) {
      iframeRef.current.contentWindow.postMessage(
        {
          type: "GAME_STATE_RESTORE",
          payload: latestStateRef.current,
        },
        "*",
      );
    }
  };

  return (
    <div className="rounded-xl overflow-hidden border border-white/10 bg-black">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-surface-800 border-b border-white/5">
        <div className="min-w-0">
          <span className="text-white/70 text-sm font-medium truncate block">{title}</span>
          {resumeMessage ? (
            <span className="text-xs text-primary-300/90">{resumeMessage}</span>
          ) : null}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={reload}
            title="Reload"
            className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-all"
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Game iframe */}
      <div ref={containerRef} className="relative" style={{ paddingTop: "56.25%" }}>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              <span className="text-white/40 text-sm">Loading game…</span>
            </div>
          </div>
        )}
        <iframe
          ref={iframeRef}
          src={src}
          title={title}
          className="absolute inset-0 w-full h-full border-none"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
          onLoad={handleFrameLoaded}
          sandbox="allow-scripts allow-same-origin allow-forms allow-pointer-lock allow-popups"
        />
      </div>
    </div>
  );
}
