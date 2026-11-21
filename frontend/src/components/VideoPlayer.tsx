import React, { useRef, useEffect } from 'react';

interface VideoPlayerProps {
  url: string;
  poster?: string;
  title?: string;
  autoPlay?: boolean;
  className?: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  url,
  poster,
  title,
  autoPlay = false,
  className = '',
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Clean and parse URL
  const trimmed = (url || '').trim();

  // Helper to parse if the user pasted raw iframe HTML
  const extractIframeSrc = (code: string): string | null => {
    if (code.includes('<iframe')) {
      const match = code.match(/src=["']([^"']+)["']/i);
      if (match && match[1]) {
        return match[1];
      }
    }
    return null;
  };

  // Helper to detect and convert Aparat URLs
  const getAparatEmbedUrl = (link: string): string | null => {
    // Already an aparat embed frame
    if (link.includes('aparat.com/video/video/embed/videohash/')) {
      return link;
    }
    // Standard aparat watch URL: https://www.aparat.com/v/XXXXX
    const match = link.match(/aparat\.com\/v\/([a-zA-Z0-9]+)/i);
    if (match && match[1]) {
      return `https://www.aparat.com/video/video/embed/videohash/${match[1]}/vt/frame`;
    }
    return null;
  };

  // Helper to detect YouTube URLs
  const getYouTubeEmbedUrl = (link: string): string | null => {
    const ytMatch = link.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/i);
    if (ytMatch && ytMatch[1]) {
      return `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?rel=0&modestbranding=1`;
    }
    return null;
  };

  // Helper to detect Vimeo URLs
  const getVimeoEmbedUrl = (link: string): string | null => {
    const vimeoMatch = link.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|)(\d+)/i);
    if (vimeoMatch && vimeoMatch[3]) {
      return `https://player.vimeo.com/video/${vimeoMatch[3]}?dnt=1`;
    }
    return null;
  };

  const iframeSrc = extractIframeSrc(trimmed);
  const aparatEmbed = getAparatEmbedUrl(trimmed);
  const ytEmbed = getYouTubeEmbedUrl(trimmed);
  const vimeoEmbed = getVimeoEmbedUrl(trimmed);

  const isEmbed = !!(iframeSrc || aparatEmbed || ytEmbed || vimeoEmbed);
  const embedSource = iframeSrc || aparatEmbed || ytEmbed || vimeoEmbed || '';

  // Intercept right-clicks & keyboard shortcuts (e.g., Ctrl+S, Ctrl+U) to prevent saving video
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent Ctrl+S, Ctrl+U
      if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S' || e.key === 'u' || e.key === 'U')) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    container.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      container.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  if (!trimmed) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-slate-950 text-slate-500 text-xs">
        ویدیویی یافت نشد.
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onContextMenu={(e) => {
        e.preventDefault();
        return false;
      }}
      className={`relative w-full h-full bg-slate-950 select-none overflow-hidden ${className}`}
      style={{
        WebkitUserSelect: 'none',
        userSelect: 'none',
        WebkitTouchCallout: 'none',
      }}
    >
      {isEmbed ? (
        <iframe
          src={embedSource}
          title={title || 'ویدیو آموزشی یاسین دهقان'}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full border-0 absolute inset-0"
        />
      ) : (
        <video
          ref={videoRef}
          key={trimmed}
          src={trimmed}
          poster={poster}
          controls
          autoPlay={autoPlay}
          playsInline
          controlsList="nodownload"
          disablePictureInPicture
          onContextMenu={(e) => {
            e.preventDefault();
            return false;
          }}
          className="w-full h-full object-contain pointer-events-auto"
        >
          <source src={trimmed} />
          مرورگر شما از پخش این فرمت ویدیو پشتیبانی نمی‌کند.
        </video>
      )}

      {/* Discreet dynamic watermark protection */}
      <div className="absolute top-3 right-3 pointer-events-none opacity-40 hover:opacity-10 transition-opacity bg-slate-900/60 backdrop-blur-xs px-2.5 py-1 rounded-md text-[10px] text-slate-300 font-mono tracking-wider border border-white/10 z-10">
        یاسین دهقان | yasindehqan.ir
      </div>
    </div>
  );
};
