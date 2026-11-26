"use client";
import { useEffect, useRef, useState } from "react";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";
import { chromaKey, estimateKey, type Rgb } from "@/lib/chroma-key";

const MAX_HEIGHT = 720;
const clock = (s: number) =>
  Number.isFinite(s)
    ? Math.floor(s / 60) + ":" + String(Math.floor(s % 60)).padStart(2, "0")
    : "0:00";

/** Video berlatar bluescreen: latar dihapus frame demi frame di canvas. */
export function ChromaVideo({
  src,
  label,
  controls = false,
  autoPlay = false,
}: {
  src: string;
  label: string;
  controls?: boolean;
  autoPlay?: boolean;
}) {
  const video = useRef<HTMLVideoElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [length, setLength] = useState(0);
  const [muted, setMuted] = useState(!controls);

  useEffect(() => {
    const v = video.current;
    const c = canvas.current;
    if (!v || !c) return;
    const ctx = c.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;
    let key: Rgb | null = null;
    let handle = 0;
    const useCallback = "requestVideoFrameCallback" in v;

    function draw() {
      if (!v || !c || !ctx || v.readyState < 2 || !v.videoWidth) return;
      const scale = Math.min(1, MAX_HEIGHT / v.videoHeight);
      const w = Math.round(v.videoWidth * scale);
      const h = Math.round(v.videoHeight * scale);
      if (c.width !== w || c.height !== h) {
        c.width = w;
        c.height = h;
      }
      // Buang 2 px tepi kanan/bawah: kolom piksel sisa encoding bukan warna latar.
      ctx.drawImage(v, 0, 0, v.videoWidth - 2, v.videoHeight - 2, 0, 0, w, h);
      const frame = ctx.getImageData(0, 0, w, h);
      key ??= estimateKey(frame.data, w, h);
      chromaKey(frame.data, key);
      ctx.putImageData(frame, 0, 0);
    }
    function tick() {
      draw();
      schedule();
    }
    function schedule() {
      if (!v || v.paused || v.ended) return;
      handle = useCallback
        ? v.requestVideoFrameCallback(tick)
        : requestAnimationFrame(tick);
    }
    const onPlay = () => {
      setPlaying(true);
      schedule();
    };
    const onPause = () => {
      setPlaying(false);
      draw();
    };
    const onTime = () => setTime(v.currentTime);
    const onMeta = () => setLength(v.duration);
    const onVolume = () => setMuted(v.muted);
    v.addEventListener("loadeddata", draw);
    v.addEventListener("seeked", draw);
    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("loadedmetadata", onMeta);
    v.addEventListener("volumechange", onVolume);
    if (v.readyState >= 2) draw();
    if (v.readyState >= 1) onMeta();
    if (!v.paused) onPlay();
    return () => {
      if (useCallback) v.cancelVideoFrameCallback(handle);
      else cancelAnimationFrame(handle);
      v.removeEventListener("loadeddata", draw);
      v.removeEventListener("seeked", draw);
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("loadedmetadata", onMeta);
      v.removeEventListener("volumechange", onVolume);
    };
  }, []);

  function toggle() {
    const v = video.current;
    if (!v) return;
    if (v.paused) void v.play();
    else v.pause();
  }

  return (
    <div className="chroma">
      <video
        ref={video}
        src={controls ? src : src + "#t=0.1"}
        className="chroma-source"
        preload={controls ? "auto" : "metadata"}
        autoPlay={autoPlay}
        muted={!controls}
        playsInline
        aria-hidden="true"
        tabIndex={-1}
      />
      <div className="chroma-view">
        <canvas
          ref={canvas}
          className="chroma-canvas"
          role="img"
          aria-label={label}
        />
      </div>
      {controls && (
        <div className="chroma-controls">
          <button
            type="button"
            onClick={toggle}
            aria-label={playing ? "Jeda video" : "Putar video"}
          >
            {playing ? <Pause size={18} /> : <Play size={18} />}
          </button>
          <span className="chroma-time">{clock(time)}</span>
          <input
            type="range"
            min={0}
            max={length || 0}
            step={0.1}
            value={time}
            aria-label="Posisi video"
            onChange={(e) => {
              const v = video.current;
              if (v) v.currentTime = Number(e.target.value);
            }}
          />
          <span className="chroma-time">{clock(length)}</span>
          <button
            type="button"
            onClick={() => {
              const v = video.current;
              if (v) v.muted = !v.muted;
            }}
            aria-label={muted ? "Nyalakan suara" : "Matikan suara"}
          >
            {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
        </div>
      )}
    </div>
  );
}
