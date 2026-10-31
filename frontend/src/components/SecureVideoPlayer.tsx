import React, { useRef, useState, useEffect, useCallback } from 'react';
import Hls from 'hls.js';
import { useSecurityShield } from '../hooks/useSecurityShield';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  RotateCcw,
  RotateCw,
  AlertTriangle,
  ShieldAlert,
  Loader2,
  Lock,
} from 'lucide-react';

interface SecureVideoPlayerProps {
  src: string;
  poster?: string;
  title?: string;
  autoPlay?: boolean;
  onEnded?: () => void;
  className?: string;
}

export const SecureVideoPlayer: React.FC<SecureVideoPlayerProps> = ({
  src,
  poster,
  title,
  autoPlay = false,
  onEnded,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const controlsTimeoutRef = useRef<any>(null);

  // Player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isBuffering, setIsBuffering] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [videoError, setVideoError] = useState<string | null>(null);

  // Security shield integration
  const [securityBlockReason, setSecurityBlockReason] = useState<'devtools' | 'blur' | null>(null);

  const handleDevToolsDetected = useCallback(() => {
    if (videoRef.current && !videoRef.current.paused) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
    setSecurityBlockReason('devtools');
  }, []);

  const handleBlurDetected = useCallback(() => {
    if (videoRef.current && !videoRef.current.paused) {
      videoRef.current.pause();
      setIsPlaying(false);
      setSecurityBlockReason('blur');
    }
  }, []);

  const handleFocusRestored = useCallback(() => {
    if (securityBlockReason === 'blur') {
      setSecurityBlockReason(null);
    }
  }, [securityBlockReason]);

  const { isDevToolsOpen } = useSecurityShield({
    enabled: true,
    onDevToolsDetected: handleDevToolsDetected,
    onBlurDetected: handleBlurDetected,
    onFocusRestored: handleFocusRestored,
    blockKeyboardShortcuts: true,
    blockContextMenu: true,
  });

  // Re-check devtools state change
  useEffect(() => {
    if (!isDevToolsOpen && securityBlockReason === 'devtools') {
      setSecurityBlockReason(null);
    }
  }, [isDevToolsOpen, securityBlockReason]);

  // Format seconds to mm:ss or hh:mm:ss
  const formatTime = (time: number): string => {
    if (isNaN(time) || time < 0) return '00:00';
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);

    const pad = (n: number) => n.toString().padStart(2, '0');
    if (hours > 0) {
      return `${hours}:${pad(minutes)}:${pad(seconds)}`;
    }
    return `${pad(minutes)}:${pad(seconds)}`;
  };

  // 1. Setup Video Source (HLS / Encrypted Stream / Native / Fallback)
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    setVideoError(null);
    setIsBuffering(true);

    // Destroy existing Hls instance if any
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    const isHls = src.includes('.m3u8') || src.includes('format=hls');

    if (isHls && Hls.isSupported()) {
      const token = localStorage.getItem('jaheshkar_token');
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        xhrSetup: (xhr) => {
          if (token) {
            const authHeader = token.startsWith('Bearer ') || token.startsWith('Token ')
              ? token
              : token.startsWith('eyJ')
                ? `Bearer ${token}`
                : `Token ${token}`;
            xhr.setRequestHeader('Authorization', authHeader);
          }
        },
      });

      hls.loadSource(src);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setIsBuffering(false);
        if (autoPlay) {
          video.play().catch(() => {});
        }
      });

      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls.recoverMediaError();
              break;
            default:
              hls.destroy();
              setVideoError('خطا در بارگذاری جریان امن ویدیو.');
              break;
          }
        }
      });

      hlsRef.current = hls;
    } else if (isHls && video.canPlayType('application/vnd.apple.mpegurl')) {
      // Native Safari iOS/macOS HLS
      video.src = src;
      if (autoPlay) {
        video.play().catch(() => {});
      }
    } else {
      // Standard Video / MP4 / Blob URL
      video.src = src;
      if (autoPlay) {
        video.play().catch(() => {});
      }
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [src, autoPlay]);

  // Video event handlers
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      setIsBuffering(false);
    }
  };

  const handleWaiting = () => setIsBuffering(true);
  const handlePlaying = () => {
    setIsBuffering(false);
    setIsPlaying(true);
  };
  const handlePause = () => setIsPlaying(false);

  // User Actions
  const togglePlay = () => {
    if (securityBlockReason) return;
    const video = videoRef.current;
    if (!video) return;

    if (video.paused || video.ended) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleSkip = (seconds: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.max(0, Math.min(duration, videoRef.current.currentTime + seconds));
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
      setIsMuted(val === 0);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    videoRef.current.muted = nextMuted;
    if (!nextMuted && volume === 0) {
      setVolume(0.5);
      videoRef.current.volume = 0.5;
    }
  };

  const handleSpeedChange = (rate: number) => {
    setPlaybackRate(rate);
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
  };

  const toggleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;

    if (!document.fullscreenElement) {
      container.requestFullscreen?.().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen?.().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Controls auto-hide on mouse idle
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying && !securityBlockReason) {
        setShowControls(false);
      }
    }, 2800);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      onContextMenu={(e) => e.preventDefault()}
      className={`relative select-none aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl border border-slate-800 group ${className}`}
    >
      {/* 1. Underlying Video Element (Controls completely disabled, protected attributes) */}
      <video
        ref={videoRef}
        poster={poster}
        playsInline
        disablePictureInPicture
        controlsList="nodownload noplaybackrate nopictureinpicture"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onWaiting={handleWaiting}
        onPlaying={handlePlaying}
        onPause={handlePause}
        onEnded={onEnded}
        onContextMenu={(e) => e.preventDefault()}
        onDragStart={(e) => e.preventDefault()}
        className="w-full h-full object-contain pointer-events-none"
      />

      {/* 2. Invisible Shield Overlay (Prevents download extensions from injecting into video) */}
      <div
        onClick={togglePlay}
        onDoubleClick={toggleFullscreen}
        onContextMenu={(e) => e.preventDefault()}
        className="absolute inset-0 z-10 cursor-pointer"
      />

      {/* 3. Security Alert Overlay: DevTools Block */}
      {securityBlockReason === 'devtools' && (
        <div className="absolute inset-0 z-30 bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center space-y-4 animate-in fade-in">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center border border-rose-500/20">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div className="space-y-1 max-w-md">
            <h3 className="text-lg font-black text-white">ابزار توسعه‌دهنده (Inspect) شناسایی شد</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              برای حفاظت از محتوای آموزشی دوره و رعایت کپی‌رایت، پخش ویدیو هنگام باز بودن کنسول یا بازرسی مرورگر مسدود می‌شود. لطفاً پنجره Inspect را ببندید.
            </p>
          </div>
        </div>
      )}

      {/* 4. Security Alert Overlay: Blur / Anti-Recording Shield */}
      {securityBlockReason === 'blur' && (
        <div
          onClick={() => {
            setSecurityBlockReason(null);
            togglePlay();
          }}
          className="absolute inset-0 z-30 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center space-y-3 cursor-pointer animate-in fade-in"
        >
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <div className="space-y-1 max-w-sm">
            <h3 className="text-base font-bold text-white">پخش ویدیو متوقف شد</h3>
            <p className="text-xs text-slate-400">
              صفحه از تمرکز خارج شد. برای ادامه تماشا اینجا کلیک کنید.
            </p>
          </div>
        </div>
      )}

      {/* 5. Video Error Display */}
      {videoError && (
        <div className="absolute inset-0 z-20 bg-slate-950/90 flex flex-col items-center justify-center p-6 text-center space-y-3">
          <AlertTriangle className="w-8 h-8 text-rose-500" />
          <p className="text-sm font-bold text-white">{videoError}</p>
        </div>
      )}

      {/* 6. Buffering Spinner */}
      {isBuffering && !videoError && !securityBlockReason && (
        <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-slate-900/80 backdrop-blur-xs flex items-center justify-center border border-slate-700">
            <Loader2 className="w-7 h-7 text-amber-400 animate-spin" />
          </div>
        </div>
      )}

      {/* 7. Center Play/Pause Indicator (Shown when paused) */}
      {!isPlaying && !isBuffering && !securityBlockReason && !videoError && (
        <div
          onClick={togglePlay}
          className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none"
        >
          <div className="w-16 h-16 rounded-full bg-emerald-800/90 text-amber-300 border border-amber-500/40 flex items-center justify-center shadow-xl shadow-emerald-950/60 transform hover:scale-110 transition-transform">
            <Play className="w-7 h-7 fill-amber-300 translate-x-0.5" />
          </div>
        </div>
      )}

      {/* 8. Sleek Custom Controls Bar */}
      <div
        className={`absolute bottom-0 inset-x-0 z-20 p-4 bg-gradient-to-t from-slate-950/95 via-slate-950/70 to-transparent transition-opacity duration-300 ${
          showControls || !isPlaying ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Scrubber / Progress Bar */}
        <div className="relative group/scrub mb-3 flex items-center">
          <input
            type="range"
            min={0}
            max={duration || 100}
            step="0.1"
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1.5 bg-slate-700/80 rounded-lg appearance-none cursor-pointer accent-amber-400 focus:outline-none transition-all hover:h-2.5"
          />
          {/* Progress fill */}
          <div
            className="absolute top-0 left-0 h-1.5 bg-gradient-to-r from-emerald-500 to-amber-400 rounded-lg pointer-events-none transition-all group-hover/scrub:h-2.5"
            style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
          />
        </div>

        {/* Buttons Row */}
        <div className="flex items-center justify-between text-white text-xs gap-3">
          {/* Left Controls: Play, Skip, Volume, Timer */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={togglePlay}
              className="p-1.5 hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
              title={isPlaying ? 'توقف (Space)' : 'پخش (Space)'}
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white" />}
            </button>

            <button
              onClick={() => handleSkip(-10)}
              className="p-1.5 hover:bg-white/10 rounded-xl transition-colors cursor-pointer text-slate-300 hover:text-white"
              title="۱۰ ثانیه قبل"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={() => handleSkip(10)}
              className="p-1.5 hover:bg-white/10 rounded-xl transition-colors cursor-pointer text-slate-300 hover:text-white"
              title="۱۰ ثانیه بعد"
            >
              <RotateCw className="w-4 h-4" />
            </button>

            {/* Volume */}
            <div className="flex items-center gap-1 group/vol">
              <button
                onClick={toggleMute}
                className="p-1.5 hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4 h-4 text-rose-400" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-14 sm:w-18 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-400 opacity-80 hover:opacity-100"
              />
            </div>

            {/* Timer */}
            <div className="text-[11px] font-mono text-slate-300 ltr ml-2" dir="ltr">
              <span>{formatTime(currentTime)}</span>
              <span className="text-slate-500 mx-1">/</span>
              <span className="text-slate-400">{formatTime(duration)}</span>
            </div>
          </div>

          {/* Right Controls: Speed, Title/Badge, Fullscreen */}
          <div className="flex items-center gap-2">
            {/* Speed Selector */}
            <div className="flex items-center bg-slate-800/80 rounded-xl p-0.5 border border-slate-700 text-[11px]">
              {[0.75, 1, 1.25, 1.5, 2].map((rate) => (
                <button
                  key={rate}
                  onClick={() => handleSpeedChange(rate)}
                  className={`px-1.5 py-0.5 rounded-lg transition-colors cursor-pointer ${
                    playbackRate === rate ? 'bg-amber-500 text-stone-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {rate}x
                </button>
              ))}
            </div>

            {/* Protected stream badge */}
            <div className="hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px]">
              <Lock className="w-3 h-3" />
              <span>پخش محافظت‌شده</span>
            </div>

            {/* Fullscreen Button */}
            <button
              onClick={toggleFullscreen}
              className="p-1.5 hover:bg-white/10 rounded-xl transition-colors cursor-pointer text-slate-300 hover:text-white"
              title="تمام صفحه"
            >
              {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
