'use client';

import { useState, useEffect } from 'react';
import { Play, ExternalLink, Youtube } from 'lucide-react';

interface YouTubeVideo {
  id: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
  description?: string;
}

interface YouTubePlaylistProps {
  playlistId: string;
  maxVideos?: number;
}

export function YouTubePlaylist({ playlistId, maxVideos = 6 }: YouTubePlaylistProps) {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlaylistVideos = async () => {
      try {
        setLoading(true);
        
        // Extract playlist ID from URL if full URL is provided
        let extractedPlaylistId = playlistId;
        if (playlistId.includes('list=')) {
          const match = playlistId.match(/[?&]list=([^&]+)/);
          if (match) {
            extractedPlaylistId = match[1];
          }
        }

        const response = await fetch(
          `/api/youtube/playlist?playlistId=${extractedPlaylistId}&maxResults=${maxVideos}`
        );
        const result = await response.json();

        if (result.success && result.videos) {
          setVideos(result.videos);
        } else {
          // API key not configured or error - will show playlist embed
          setError(null); // Not really an error, just no API key
        }
      } catch (err: any) {
        console.error('Error fetching playlist:', err);
        setError('Unable to load individual videos');
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylistVideos();
  }, [playlistId, maxVideos]);

  // Extract playlist ID for embed
  const getPlaylistId = () => {
    if (playlistId.includes('list=')) {
      const match = playlistId.match(/[?&]list=([^&]+)/);
      return match ? match[1] : playlistId;
    }
    return playlistId;
  };

  const playlistIdExtracted = getPlaylistId();

  // If we have individual videos, show them in a grid
  if (videos.length > 0) {
    return (
      <div className="space-y-6">
        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <div
              key={video.id}
              className="group premium-card rounded-xl overflow-hidden hover:border-red-500/50 transition-all cursor-pointer"
              onClick={() => setSelectedVideo(video.id)}
            >
              {/* Thumbnail */}
              <div className="relative aspect-video bg-gray-800 overflow-hidden">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                {/* Play Overlay */}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-red-600/90 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="w-8 h-8 text-white ml-1" fill="currentColor" />
                  </div>
                </div>
              </div>
              
              {/* Video Info */}
              <div className="p-4">
                <h4 className="font-semibold text-white mb-2 line-clamp-2 group-hover:text-red-400 transition-colors">
                  {video.title}
                </h4>
                <p className="text-xs text-gray-400">
                  {new Date(video.publishedAt).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Link to full playlist */}
        <div className="text-center">
          <a
            href={`https://www.youtube.com/playlist?list=${playlistIdExtracted}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold hover:from-red-700 hover:to-red-800 transition-all shadow-lg shadow-red-600/30 hover:shadow-red-600/50"
          >
            <Youtube className="w-5 h-5" />
            <span>View Full Playlist on YouTube</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* Video Modal */}
        {selectedVideo && (
          <div
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedVideo(null)}
          >
            <div
              className="relative w-full max-w-5xl aspect-video bg-black rounded-xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedVideo(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <iframe
                src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1`}
                title="YouTube video player"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  // Fallback: Show playlist embed if no individual videos
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
        <p className="text-gray-400 mt-4">Loading videos...</p>
      </div>
    );
  }

  // Fallback to playlist embed
  return (
    <div className="space-y-6">
      {/* Playlist Embed - Shows all videos */}
      <div className="premium-card rounded-2xl p-6 overflow-hidden">
        <div className="aspect-video w-full rounded-xl overflow-hidden bg-gray-800">
          <iframe
            src={`https://www.youtube.com/embed/videoseries?list=${playlistIdExtracted}&autoplay=0&rel=0`}
            title="YouTube Playlist"
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>

      {/* Link to full playlist */}
      <div className="text-center">
        <a
          href={`https://www.youtube.com/playlist?list=${playlistIdExtracted}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold hover:from-red-700 hover:to-red-800 transition-all shadow-lg shadow-red-600/30 hover:shadow-red-600/50"
        >
          <Youtube className="w-5 h-5" />
          <span>View Full Playlist on YouTube</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}
