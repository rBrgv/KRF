'use client';

import { useEffect, useRef, useState } from 'react';

export function BookLaunchVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const skipTo5DoneRef = useRef(false);
  const isMobileRef = useRef(false);

  // Detect mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      const mobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768;
      isMobileRef.current = mobile;
      setIsMobile(mobile);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container) return;

    const handleLoadedMetadata = () => {
      if (video.duration && isFinite(video.duration)) {
        setDuration(video.duration);
      }
    };

    const handleDurationChange = () => {
      if (video.duration && isFinite(video.duration)) {
        setDuration(video.duration);
      }
    };

    const handleError = (e: Event) => {
      console.error('Video loading error:', e);
      setIsLoading(false);
    };

    const handleCanPlay = () => {
      setIsLoading(false);
      if (video.duration && isFinite(video.duration)) {
        setDuration(video.duration);
      }
    };

    const handleLoadedData = () => {
      if (video.duration && isFinite(video.duration)) {
        setDuration(video.duration);
      }
      setIsLoading(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      if (video.duration && isFinite(video.duration) && video.duration !== duration) {
        setDuration(video.duration);
      }
      
      // Skip to 5 seconds once when video starts playing (only if we haven't done it yet)
      // On mobile, wait for more buffered data (readyState >= 4)
      const minReadyState = isMobileRef.current ? 4 : 3;
      if (isPlaying && !skipTo5DoneRef.current && video.currentTime > 0 && video.currentTime < 1 && video.readyState >= minReadyState) {
        skipTo5DoneRef.current = true;
        // On mobile, add a small delay to ensure smooth seek
        if (isMobileRef.current) {
          setTimeout(() => {
            if (video.readyState >= 4) {
              video.currentTime = 5;
              setCurrentTime(5);
            }
          }, 300);
        } else {
          video.currentTime = 5;
          setCurrentTime(5);
        }
      }
    };

    const handleSeeked = () => {
      setIsLoading(false);
    };

    const handlePlay = () => {
      setIsPlaying(true);
      setIsLoading(false);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleVolumeChange = () => {
      setVolume(video.volume);
      setIsMuted(video.muted);
    };

    const handleWaiting = () => setIsLoading(true);
    const handleCanPlayThrough = () => setIsLoading(false);

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    const resetControlsTimeout = () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      if (isPlaying) {
        controlsTimeoutRef.current = setTimeout(() => {
          setShowControls(false);
        }, 3000);
      }
    };

    const handleMouseMove = () => {
      setShowControls(true);
      resetControlsTimeout();
    };

    const handleMouseLeave = () => {
      if (isPlaying) {
        resetControlsTimeout();
      }
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('durationchange', handleDurationChange);
    video.addEventListener('error', handleError);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('canplaythrough', handleCanPlayThrough);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('seeked', handleSeeked);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('volumechange', handleVolumeChange);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);
    container.addEventListener('touchstart', handleMouseMove);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('durationchange', handleDurationChange);
      video.removeEventListener('error', handleError);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('canplaythrough', handleCanPlayThrough);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('seeked', handleSeeked);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('volumechange', handleVolumeChange);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      container.removeEventListener('touchstart', handleMouseMove);
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [isPlaying, duration]);

  const togglePlay = async () => {
    const video = videoRef.current;
    if (!video) return;
    
    if (isPlaying) {
      video.pause();
    } else {
      try {
        setIsLoading(true);
        // Reset skip flag when starting to play
        if (video.currentTime < 1) {
          skipTo5DoneRef.current = false;
        }
        
        // On mobile, ensure we have enough data before playing
        if (isMobileRef.current && video.readyState < 3) {
          // Wait for more data to load
          await new Promise((resolve) => {
            const checkReady = () => {
              if (video.readyState >= 3) {
                video.removeEventListener('canplay', checkReady);
                video.removeEventListener('progress', checkReady);
                resolve(undefined);
              }
            };
            video.addEventListener('canplay', checkReady);
            video.addEventListener('progress', checkReady);
            // Timeout after 5 seconds
            setTimeout(() => {
              video.removeEventListener('canplay', checkReady);
              video.removeEventListener('progress', checkReady);
              resolve(undefined);
            }, 5000);
          });
        }
        
        await video.play();
      } catch (error) {
        console.error('Error playing video:', error);
        setIsLoading(false);
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;
    const newTime = parseFloat(e.target.value);
    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;
    const newVolume = parseFloat(e.target.value);
    video.volume = newVolume;
    setVolume(newVolume);
    if (newVolume > 0 && isMuted) {
      video.muted = false;
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const handlePlaybackRateChange = (rate: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.playbackRate = rate;
    setPlaybackRate(rate);
  };

  const toggleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;
    
    if (!document.fullscreenElement) {
      container.requestFullscreen().catch(err => {
        console.error('Error attempting to enable fullscreen:', err);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const skip = (seconds: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.max(5, Math.min(video.currentTime + seconds, duration));
  };

  const formatTime = (seconds: number) => {
    if (!isFinite(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="mb-12 max-w-5xl mx-auto">
      <div className="premium-card rounded-2xl p-4 md:p-6 overflow-hidden">
        <div 
          ref={containerRef}
          className="relative bg-black rounded-xl overflow-hidden aspect-video group cursor-pointer"
        >
          <div className="w-full h-full flex justify-center items-center relative overflow-hidden">
            <video
              ref={videoRef}
              style={{
                width: '100%',
                height: '100%',
                transform: 'rotate(-90deg) scale(1.3)',
                transformOrigin: 'center center',
                objectFit: 'contain',
              }}
              playsInline
              preload={isMobile ? "metadata" : "auto"}
              onClick={togglePlay}
            >
              <source src="/book-launch.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            {/* Loading Indicator */}
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}

            {/* Center Play Button (when paused) */}
            {!isPlaying && !isLoading && (
              <button
                onClick={togglePlay}
                className="absolute inset-0 flex items-center justify-center z-10 bg-black/20 hover:bg-black/30 transition-colors"
                aria-label="Play"
              >
                <div className="w-16 h-16 md:w-20 md:h-20 bg-red-600/90 hover:bg-red-600 rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-8 h-8 md:w-10 md:h-10 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </button>
            )}
            
            {/* Custom Controls */}
            <div 
              className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/80 to-transparent transition-opacity duration-300 z-10 ${
                showControls ? 'opacity-100' : 'opacity-0'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Progress Bar */}
              <div className="px-3 md:px-4 pt-3 md:pt-4">
                <input
                  type="range"
                  min="5"
                  max={duration > 0 ? duration : 100}
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-1.5 md:h-2 bg-gray-700/50 rounded-lg appearance-none cursor-pointer mb-2 md:mb-3"
                  style={{
                    background: duration > 5 ? `linear-gradient(to right, #dc2626 0%, #dc2626 ${((currentTime - 5) / (duration - 5)) * 100}%, #4b5563 ${((currentTime - 5) / (duration - 5)) * 100}%, #4b5563 100%)` : 'linear-gradient(to right, #4b5563 0%, #4b5563 100%)'
                  }}
                />
              </div>
              
              {/* Controls Row */}
              <div className="px-3 md:px-4 pb-3 md:pb-4">
                <div className="flex items-center gap-2 md:gap-4">
                  {/* Play/Pause Button */}
                  <button
                    onClick={togglePlay}
                    className="text-white hover:text-red-500 transition-colors p-1.5 md:p-2 rounded-lg hover:bg-white/10 touch-manipulation"
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? (
                      <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    )}
                  </button>

                  {/* Skip Backward */}
                  <button
                    onClick={() => skip(-5)}
                    className="text-white hover:text-red-500 transition-colors p-1.5 md:p-2 rounded-lg hover:bg-white/10 touch-manipulation hidden sm:block"
                    aria-label="Skip backward 5 seconds"
                  >
                    <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M11.99 5V1l-5 5 5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6h-2c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/>
                      <path d="M10 9v6l5-3z"/>
                    </svg>
                  </button>

                  {/* Skip Forward */}
                  <button
                    onClick={() => skip(5)}
                    className="text-white hover:text-red-500 transition-colors p-1.5 md:p-2 rounded-lg hover:bg-white/10 touch-manipulation hidden sm:block"
                    aria-label="Skip forward 5 seconds"
                  >
                    <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 5V1l5 5-5 5V7c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6h2c0 4.42-3.58 8-8 8s-8-3.58-8-8 3.58-8 8-8z"/>
                      <path d="M14 9v6l-5-3z"/>
                    </svg>
                  </button>
                  
                  {/* Time Display */}
                  <span className="text-white text-xs md:text-sm font-mono min-w-[80px] md:min-w-[100px]">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                  
                  {/* Playback Speed (Desktop) */}
                  <div className="hidden md:flex items-center gap-1 ml-auto">
                    <select
                      value={playbackRate}
                      onChange={(e) => handlePlaybackRateChange(parseFloat(e.target.value))}
                      className="bg-black/50 text-white text-xs px-2 py-1 rounded border border-gray-600 hover:border-red-500 transition-colors cursor-pointer"
                    >
                      <option value="0.5">0.5x</option>
                      <option value="0.75">0.75x</option>
                      <option value="1">1x</option>
                      <option value="1.25">1.25x</option>
                      <option value="1.5">1.5x</option>
                      <option value="2">2x</option>
                    </select>
                  </div>

                  {/* Volume Control */}
                  <div className="flex items-center gap-1 md:gap-2 ml-auto">
                    <button
                      onClick={toggleMute}
                      className="text-white hover:text-red-500 transition-colors p-1.5 md:p-2 rounded-lg hover:bg-white/10 touch-manipulation"
                      aria-label={isMuted ? 'Unmute' : 'Mute'}
                    >
                      {isMuted || volume === 0 ? (
                        <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                        </svg>
                      ) : volume < 0.5 ? (
                        <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z"/>
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                        </svg>
                      )}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      className="w-16 md:w-24 h-1 md:h-1.5 bg-gray-700/50 rounded-lg appearance-none cursor-pointer hover:bg-gray-600/50 transition-colors"
                    />
                  </div>

                  {/* Fullscreen Button */}
                  <button
                    onClick={toggleFullscreen}
                    className="text-white hover:text-red-500 transition-colors p-1.5 md:p-2 rounded-lg hover:bg-white/10 touch-manipulation"
                    aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                  >
                    {isFullscreen ? (
                      <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/>
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
