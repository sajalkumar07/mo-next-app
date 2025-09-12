import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LatestVideos = ({ channelLink }) => {
  const [latestVideos, setLatestVideos] = useState([]);

  useEffect(() => {
    const channelId = channelLink.split('/channel/')[1];

    axios.get(`https://www.googleapis.com/youtube/v3/channels`, {
      params: {
        part: 'contentDetails',
        id: channelId,
        key: 'AIzaSyD0AD3vrbUccDWBPdpnz1wU1vuvptfJytY',
      },
    })
    .then(response => {
      const playlistId = response.data.items[0].contentDetails.relatedPlaylists.uploads;

      // Fetch all videos from the uploads playlist (handle pagination)
      fetchAllVideos(playlistId);
    })
    .catch(error => {
      console.error('Error fetching videos:', error);
    });
  }, [channelLink]);

  const fetchAllVideos = async (playlistId, nextPageToken = null) => {
    const maxResults = 8;
    let videos = [];

    try {
      while (true) {
        const response = await axios.get(`https://www.googleapis.com/youtube/v3/playlistItems`, {
          params: {
            part: 'snippet',
            playlistId: playlistId,
            maxResults: maxResults,
            pageToken: nextPageToken,
            key: 'AIzaSyD0AD3vrbUccDWBPdpnz1wU1vuvptfJytY',
          },
        });

        videos = videos.concat(response.data.items);

        if (!response.data.nextPageToken || videos.length >= maxResults) {
          break;
        }

        nextPageToken = response.data.nextPageToken;
      }

      setLatestVideos(videos);
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
  };

  if (!latestVideos.length) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Latest Videos</h2>
      <div className="video-list">
        {latestVideos.map(video => (
          <div key={video.id} className="video-item">
            <iframe
              title={video.snippet.title}
              width="280"
              height="157"
              src={`https://www.youtube.com/embed/${video.snippet.resourceId.videoId}`}
              frameBorder="0"
              allowFullScreen
            ></iframe>
            <h3>{video.snippet.title}</h3>
            <p>{video.snippet.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LatestVideos;
