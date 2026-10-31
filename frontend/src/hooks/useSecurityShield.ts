import { useState, useEffect, useCallback } from 'react';

interface SecurityShieldOptions {
  enabled?: boolean;
  onDevToolsDetected?: () => void;
  onBlurDetected?: () => void;
  onFocusRestored?: () => void;
  blockKeyboardShortcuts?: boolean;
  blockContextMenu?: boolean;
}

export const useSecurityShield = (options: SecurityShieldOptions = {}) => {
  const {
    enabled = true,
    onDevToolsDetected,
    onBlurDetected,
    onFocusRestored,
    blockKeyboardShortcuts = true,
    blockContextMenu = true,
  } = options;

  const [isDevToolsOpen, setIsDevToolsOpen] = useState(false);
  const [isWindowFocused, setIsWindowFocused] = useState(true);

  // 1. Keyboard shortcuts blocker (F12, Inspect, View Source, PrintScreen, Save)
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!enabled || !blockKeyboardShortcuts) return;

      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const cmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;

      // F12
      if (e.key === 'F12' || e.keyCode === 123) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C (Inspect, Console, Element)
      if (
        (cmdOrCtrl && e.shiftKey && ['I', 'i', 'J', 'j', 'C', 'c'].includes(e.key)) ||
        (isMac && e.metaKey && e.altKey && ['I', 'i', 'J', 'j', 'C', 'c'].includes(e.key))
      ) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // Ctrl+U / Cmd+U (View Source)
      if (cmdOrCtrl && (e.key === 'u' || e.key === 'U')) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // Ctrl+S / Cmd+S (Save Page)
      if (cmdOrCtrl && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // Ctrl+P / Cmd+P (Print Page)
      if (cmdOrCtrl && (e.key === 'p' || e.key === 'P')) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // PrintScreen / Screenshot key
      if (e.key === 'PrintScreen' || e.keyCode === 44) {
        e.preventDefault();
        // Clear clipboard if possible
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText('').catch(() => {});
        }
      }
    },
    [enabled, blockKeyboardShortcuts]
  );

  // 2. Context Menu (Right Click) Blocker
  const handleContextMenu = useCallback(
    (e: MouseEvent) => {
      if (!enabled || !blockContextMenu) return;
      e.preventDefault();
      e.stopPropagation();
      return false;
    },
    [enabled, blockContextMenu]
  );

  // 3. Tab Visibility & Window Blur Detection (Anti-Recording / Screen Capture Focus Guard)
  useEffect(() => {
    if (!enabled) return;

    const handleVisibilityChange = () => {
      if (document.hidden || document.visibilityState === 'hidden') {
        setIsWindowFocused(false);
        onBlurDetected?.();
      } else {
        setIsWindowFocused(true);
        onFocusRestored?.();
      }
    };

    const handleBlur = () => {
      setIsWindowFocused(false);
      onBlurDetected?.();
    };

    const handleFocus = () => {
      setIsWindowFocused(true);
      onFocusRestored?.();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
    };
  }, [enabled, onBlurDetected, onFocusRestored]);

  // 4. DevTools Active Detection via Window Metrics & Performance Debugger Timing
  useEffect(() => {
    if (!enabled) return;

    let checkInterval: any = null;

    const checkDevTools = () => {
      const threshold = 160;
      const widthDiff = window.outerWidth - window.innerWidth > threshold;
      const heightDiff = window.outerHeight - window.innerHeight > threshold;

      // Primary check: window size delta (fast, non-intrusive)
      let detected = widthDiff || heightDiff;

      // Secondary check: debugger execution timing differential
      if (!detected) {
        const start = performance.now();
        // eslint-disable-next-line no-debugger
        debugger;
        const duration = performance.now() - start;
        // If debugger paused execution, duration will be > 100ms
        if (duration > 100) {
          detected = true;
        }
      }

      if (detected) {
        if (!isDevToolsOpen) {
          setIsDevToolsOpen(true);
          onDevToolsDetected?.();
        }
      } else {
        if (isDevToolsOpen) {
          setIsDevToolsOpen(false);
        }
      }
    };

    // Run check periodically
    checkInterval = setInterval(checkDevTools, 1500);

    return () => {
      if (checkInterval) clearInterval(checkInterval);
    };
  }, [enabled, isDevToolsOpen, onDevToolsDetected]);

  // Attach global keyboard and context menu listeners
  useEffect(() => {
    if (!enabled) return;

    window.addEventListener('keydown', handleKeyDown, true);
    window.addEventListener('contextmenu', handleContextMenu, true);

    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
      window.removeEventListener('contextmenu', handleContextMenu, true);
    };
  }, [enabled, handleKeyDown, handleContextMenu]);

  return {
    isDevToolsOpen,
    isWindowFocused,
  };
};
