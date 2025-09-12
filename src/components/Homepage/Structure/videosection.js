import React, { useEffect, useState } from "react";

const VideoSection = () => {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  const RAPIDAPI_URL = "https://yt-api.p.rapidapi.com/channel/shorts";
  const RAPIDAPI_KEY = "a651f8322fmsh31b9418f911cfd4p1b34abjsn3a21242748da";
  const CHANNEL_ID = "UCSXOsOIzeJqJb4h0QlimDww";

  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      setIsMobile(/android|iphone|ipad|mobile|iPod/i.test(userAgent));
    };

    checkMobile();

    const fetchVideos = async () => {
      try {
        const response = await fetch(`${RAPIDAPI_URL}?id=${CHANNEL_ID}`, {
          headers: {
            "X-Rapidapi-Key": RAPIDAPI_KEY,
          },
        });

        const data = await response.json();

        if (data.data && data.data.length > 0) {
          setVideos(data.data.slice(0, 6));
        } else {
          console.error("No videos found.");
        }
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };

    fetchVideos();
  }, []);

  const openVideo = (video) => {
    if (isMobile) {
      window.location.href = `https://www.youtube.com/watch?v=${video.videoId}`;
    } else {
      setSelectedVideo(video);
    }
  };

  const closeVideo = () => setSelectedVideo(null);

  return (
    <div>
      {/* Shorts Thumbnails */}
      {/* <section className="flex flex-wrap justify-center gap-4">
        {videos.map((video, index) => (
          <div
            key={index}
            className="w-[180px] cursor-pointer"
            onClick={() => openVideo(video)}
          >
            <div className="relative">
              <img
                src={video.thumbnail[0]?.url || video.thumbnail[0]?.high}
                alt={video.title}
                className="w-[170px] h-[310px] rounded-lg object-cover"
              />
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/4/42/YouTube_icon_%282013-2017%29.png"
                alt="YouTube logo"
                className="absolute top-1/2 left-1/2 w-[50px] transform -translate-x-1/2 -translate-y-1/2"
              />
            </div>
            <p className="mt-2 text-sm text-center">{video.title}</p>
          </div>
        ))}
      </section> */}

      {/* Modal for Selected Video */}
      {selectedVideo && !isMobile && (
        <div
          className="fixed inset-0 bg-red-700 bg-opacity-80 flex items-center justify-center z-50"
          onClick={closeVideo}
        >
          <div
            className="relative bg-white rounded-lg max-w-[90%] max-h-[90%] animate-slide-up p-2"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              className="w-[400px] h-[750px] sm:w-[800px] sm:h-[450px]"
              src={`https://www.youtube.com/embed/${selectedVideo.videoId}?autoplay=1`}
              title={selectedVideo.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
            <button
              className="absolute top-[-10px] right-[-10px] bg-red-600 text-white px-2 py-1 rounded text-sm"
              onClick={closeVideo}
            >
              X
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Optional wrapper
const Video = () => (
  <section className="pt-2 mobilehid">{/* <VideoSection /> */}</section>
);

export default VideoSection;
