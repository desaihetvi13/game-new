"use client";

import { useState, useRef, useCallback } from "react";
import {
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  RotateCcw,
  Flag,
  Share2,
  Star,
} from "lucide-react";

interface GamePlayerProps {
  src: string;
  title: string;
}

export default function GamePlayer({ src, title }: GamePlayerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

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

  return (
    <div className="rounded-xl overflow-hidden border border-white/10 bg-black">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-surface-800 border-b border-white/5">
        <span className="text-white/70 text-sm font-medium truncate">{title}</span>
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
          onLoad={() => setIsLoading(false)}
          sandbox="allow-scripts allow-same-origin allow-forms allow-pointer-lock allow-popups"
        />
      </div>
    </div>
  );
}
