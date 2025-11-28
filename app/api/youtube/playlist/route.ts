import { NextRequest, NextResponse } from 'next/server';

// ============================================================================
// YOUTUBE PLAYLIST API
// ============================================================================
// Fetches videos from a YouTube playlist using YouTube Data API v3
//
// Setup:
// 1. Get YouTube Data API key from: https://console.cloud.google.com/apis/credentials
// 2. Enable YouTube Data API v3
// 3. Add to .env.local: YOUTUBE_API_KEY=your_api_key_here

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const playlistId = searchParams.get('playlistId');
    const maxResults = parseInt(searchParams.get('maxResults') || '10');

    if (!playlistId) {
      return NextResponse.json(
        { error: 'playlistId is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.YOUTUBE_API_KEY;

    if (!apiKey) {
      // Return empty result if API key is not configured
      // Frontend will fall back to playlist embed
      return NextResponse.json({
        success: false,
        message: 'YouTube API key not configured',
        videos: [],
      });
    }

    // Extract playlist ID from URL if full URL is provided
    let extractedPlaylistId = playlistId;
    if (playlistId.includes('list=')) {
      const match = playlistId.match(/[?&]list=([^&]+)/);
      if (match) {
        extractedPlaylistId = match[1];
      }
    }

    // Fetch playlist items from YouTube Data API
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${extractedPlaylistId}&maxResults=${maxResults}&key=${apiKey}`
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('YouTube API error:', errorData);
      return NextResponse.json(
        { error: 'Failed to fetch playlist videos', details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Transform YouTube API response to our format
    const videos = (data.items || []).map((item: any) => ({
      id: item.snippet.resourceId.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url,
      publishedAt: item.snippet.publishedAt,
      description: item.snippet.description,
    }));

    return NextResponse.json({
      success: true,
      videos,
      totalResults: data.pageInfo?.totalResults || 0,
    });
  } catch (error: any) {
    console.error('Error fetching YouTube playlist:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}




