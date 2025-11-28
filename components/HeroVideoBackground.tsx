"use client";

import { useEffect, useRef } from "react";

interface VideoSegment {
  start: number; // Start time in seconds
  end: number; // End time in seconds
}

interface HeroVideoBackgroundProps {
  youtubeId?: string;
  youtubeUrl?: string;
  segments?: VideoSegment[]; // Array of segments to play in sequence
}

// Convert time string (MM:SS or M:SS) to seconds
const timeToSeconds = (timeStr: string): number => {
  const parts = timeStr.split(':').map(Number);
  if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  }
  return 0;
};

export function HeroVideoBackground({ youtubeId, youtubeUrl, segments }: HeroVideoBackgroundProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const playerRef = useRef<any>(null);
  const currentSegmentIndex = useRef(0);
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Extract YouTube ID from URL if provided
  const getYouTubeId = () => {
    if (youtubeId) return youtubeId;
    if (youtubeUrl) {
      const match = youtubeUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
      return match ? match[1] : null;
    }
    return null;
  };

  const videoId = getYouTubeId();

  useEffect(() => {
    if (!videoId || !segments || segments.length === 0) return;

    // Load YouTube IFrame API with preload
    if (!window.YT) {
      // Preload link for faster loading
      const preloadLink = document.createElement('link');
      preloadLink.rel = 'preload';
      preloadLink.as = 'script';
      preloadLink.href = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(preloadLink);
      
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      tag.async = true;
      const firstScriptTag = document.getElementsByTagName('script')[0];
      if (firstScriptTag && firstScriptTag.parentNode) {
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      } else {
        document.head.appendChild(tag);
      }
    }

    const playNextSegment = () => {
      if (!segments) return;
      const nextIndex = (currentSegmentIndex.current + 1) % segments.length;
      playSegment(nextIndex);
    };

    const playSegment = (index: number) => {
      if (!playerRef.current || !segments || index >= segments.length) return;
      
      // Clear any existing interval
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
        checkIntervalRef.current = null;
      }
      
      const segment = segments[index];
      currentSegmentIndex.current = index;
      
      playerRef.current.seekTo(segment.start, true);
      playerRef.current.playVideo();

      // Set up interval to check if we've reached the end time
      checkIntervalRef.current = setInterval(() => {
        if (playerRef.current) {
          try {
            const currentTime = playerRef.current.getCurrentTime();
            if (currentTime >= segment.end) {
              if (checkIntervalRef.current) {
                clearInterval(checkIntervalRef.current);
                checkIntervalRef.current = null;
              }
              playNextSegment();
            }
          } catch (e) {
            // Handle any errors silently
          }
        }
      }, 100);
    };

    const onYouTubeIframeAPIReady = () => {
      // Reduced delay for faster initialization
      setTimeout(() => {
        if (iframeRef.current && !playerRef.current && window.YT && window.YT.Player) {
            try {
              playerRef.current = new window.YT.Player(iframeRef.current, {
                videoId: videoId,
                playerVars: {
                  autoplay: 1,
                  mute: 1,
                  controls: 0,
                  showinfo: 0,
                  rel: 0,
                  iv_load_policy: 3,
                  modestbranding: 1,
                  playsinline: 1,
                  enablejsapi: 1,
                  loop: 0,
                  playlist: videoId, // Required for looping segments
                  start: segments[0]?.start || 0, // Start at first segment immediately
                },
                events: {
                  onReady: (event: any) => {
                    console.log('YouTube player ready');
                    // Start playing immediately, no delay
                    playSegment(0);
                  },
                  onStateChange: (event: any) => {
                    // When video ends or reaches end time, play next segment
                    if (event.data === window.YT.PlayerState.ENDED) {
                      playNextSegment();
                    }
                  },
                  onError: (event: any) => {
                    console.error('YouTube player error:', event.data);
                  },
                },
              });
              console.log('YouTube player created');
            } catch (error) {
              console.error('Error creating YouTube player:', error);
            }
        }
      }, 100);
    };

    // Wait for YouTube API to be ready - check more frequently
    let checkAPI: NodeJS.Timeout | null = null;
    
    const initPlayer = () => {
      if (window.YT && window.YT.Player && iframeRef.current && !playerRef.current) {
        onYouTubeIframeAPIReady();
      } else if (!window.YT) {
        // Check more frequently (50ms instead of 100ms) for faster detection
        checkAPI = setInterval(() => {
          if (window.YT && window.YT.Player) {
            if (checkAPI) clearInterval(checkAPI);
            onYouTubeIframeAPIReady();
          }
        }, 50);
      }
    };

    // Set global callback if API loads
    const originalCallback = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (checkAPI) clearInterval(checkAPI);
      if (originalCallback) originalCallback();
      onYouTubeIframeAPIReady();
    };

    // Try to initialize immediately or wait for API
    initPlayer();

    return () => {
      if (checkAPI) {
        clearInterval(checkAPI);
        checkAPI = null;
      }
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
        checkIntervalRef.current = null;
      }
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch (e) {
          // Handle destroy errors
        }
        playerRef.current = null;
      }
      // Restore original callback
      if (originalCallback) {
        window.onYouTubeIframeAPIReady = originalCallback;
      } else {
        // @ts-ignore - Property may not exist
        delete window.onYouTubeIframeAPIReady;
      }
    };
  }, [videoId, segments]);

  if (!videoId) {
    return (
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-950 to-black"></div>
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ zIndex: 0 }}>
      <div
        ref={iframeRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[177.77777778vh] h-[56.25vw] min-w-full min-h-full"
        style={{ pointerEvents: 'none', zIndex: 0 }}
      />
      {/* Fallback background in case video doesn't load */}
      {!playerRef.current && (
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-950 to-black" style={{ zIndex: -1 }}></div>
      )}
    </div>
  );
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

