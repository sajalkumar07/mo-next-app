import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

const VideoSection = () => {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef(null);

  const CARD_WIDTH = 323;
  const GAP = 24;

  // Add state for visible count
  const [visibleCount, setVisibleCount] = useState(1);

  // Calculate maxIndex and hasOverflow
  const maxIndex = Math.max(0, videos.length - visibleCount);
  const hasOverflow = videos.length > visibleCount;

  // Add resize effect to calculate visible cards
  useEffect(() => {
    const measure = () => {
      const el = scrollContainerRef.current;
      if (!el) return;
      const slot = CARD_WIDTH + GAP;
      const count = Math.max(1, Math.floor((el.clientWidth + GAP) / slot));
      setVisibleCount(count);
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [videos.length]);

  const RAPIDAPI_URL = "https://yt-api.p.rapidapi.com/channel/videos";
  const RAPIDAPI_KEY = "a651f8322fmsh31b9418f911cfd4p1b34abjsn3a21242748da";
  const CHANNEL_ID = "UCSXOsOIzeJqJb4h0QlimDww";

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch(`${RAPIDAPI_URL}?id=${CHANNEL_ID}`, {
          headers: {
            "X-Rapidapi-Key": RAPIDAPI_KEY,
          },
        });

        const data = await response.json();

        if (data.data && data.data.length > 0) {
          setVideos(data.data.slice(0, 10));
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
    setSelectedVideo(video);
  };

  const closeVideo = () => setSelectedVideo(null);

  const formatViews = (views) => {
    if (views >= 1000000) {
      return Math.floor(views / 1000000) + "M";
    } else if (views >= 1000) {
      return Math.floor(views / 1000) + "K";
    }
    return views;
  };

  const formatTimeAgo = (publishedTimeText) => {
    // Simple time formatting - you might want to enhance this based on your API response
    return publishedTimeText || "Recently";
  };

  // Smooth scroll to specific video card
  const scrollToCard = (index) => {
    if (scrollContainerRef.current) {
      const cardWidth = 288; // 72 * 4 = 288px (w-72 in Tailwind)
      const gap = 24; // gap-6 = 24px
      const scrollPosition = index * (cardWidth + gap);
      scrollContainerRef.current.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      scrollToCard(newIndex);
    }
  };

  const handleNext = () => {
    if (currentIndex < videos.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      scrollToCard(newIndex);
    }
  };

  // Handle scroll events to update current index
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const scrollLeft = scrollContainerRef.current.scrollLeft;
      const cardWidth = 288 + 24; // card width + gap
      const newIndex = Math.round(scrollLeft / cardWidth);
      if (newIndex !== currentIndex && newIndex < videos.length) {
        setCurrentIndex(newIndex);
      }
    }
  };

  return (
    <div className=" bg-[#f5f5f5] ">
      <section className="relative z-10 max-w-[1400px] mx-auto px-4 py-4">
        {/* Header Section */}
        <div className="flex justify-center items-center flex-col mb-8">
          <div className=" flex justify-center items-center flex-col">
            {/* Title */}
            <div className="text-center md:text-left">
              <p className="text-[25px] font-bold font-sans">
                <span className="text-[#818181]">YOUTUBE</span>{" "}
                <span className="text-[#B60C19]">VIDEOS</span>
              </p>
            </div>

            {/* View More Button */}
            <div className="flex justify-center md:justify-end _target-blank">
              <Link
                target="_blank"
                rel="noopener noreferrer"
                to="https://m.youtube.com/@motoroctane"
                className="inline-flex items-center px-6 py-2  text-[#B60C19] rounded-md  text-[14px] font-semibold"
              >
                VIEW MORE
              </Link>
            </div>
          </div>
        </div>

        {/* Video Cards Container with Navigation */}

        {/* Left Arrow Button */}
        {hasOverflow && currentIndex > 0 && (
          <button
            className="hidden md:flex absolute -left-10 top-[250px] -translate-y-1/2 z-20 bg-white h-10 w-10 rounded-full shadow-md justify-center items-center border border-gray-200 hover:bg-gray-100 transition"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
          >
            <ChevronLeft size={20} />
          </button>
        )}

        {/* Horizontal Scrollable Video Cards Container */}
        <div
          ref={scrollContainerRef}
          className="overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory px-8"
          style={{
            scrollBehavior: "smooth",
            WebkitOverflowScrolling: "touch",
            msOverflowStyle: "none",
            scrollbarWidth: "none",
          }}
          onScroll={handleScroll}
        >
          <div className="flex gap-2" style={{ minWidth: "fit-content" }}>
            {videos.map((video, index) => (
              <div
                key={index}
                className="w-[254px] cursor-pointer group snap-start bg-white border rounded-xl"
                onClick={() => openVideo(video)}
              >
                {/* Video Thumbnail */}
                <div className="relative w-full h-36 md:h-40 bg-gray-200 rounded-t-xl overflow-hidden mb-3">
                  <img
                    src={video.thumbnail[0]?.url || video.thumbnail[0]?.high}
                    alt={video.title}
                    className="w-full h-full object-cover  "
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />

                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center group-hover:bg-red-700 transition-colors">
                      <svg
                        className="w-6 h-6 text-white ml-1"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>

                  {/* Video Duration (if available) */}
                  {video.lengthSeconds && (
                    <div className="absolute bottom-2 right-2 bg-black/40 text-white text-xs px-2 py-1 rounded-lg">
                      {Math.floor(video.lengthSeconds / 60)}:
                      {(video.lengthSeconds % 60).toString().padStart(2, "0")}
                    </div>
                  )}
                </div>

                {/* Video Info */}
                <p className="text-[14px] font-medium p-2 ">{video.title}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Arrow Button */}
        {hasOverflow && currentIndex < maxIndex && (
          <button
            className="hidden md:flex absolute -right-10 top-[250px]  -translate-y-1/2 z-20 bg-white h-10 w-10 rounded-full shadow-md justify-center items-center border border-gray-200 hover:bg-gray-100 transition"
            onClick={handleNext}
            disabled={currentIndex === videos.length - 1}
          >
            <ChevronRight size={20} />
          </button>
        )}

        {/* Modal for Selected Video */}
        {selectedVideo && (
          <div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
            onClick={closeVideo}
          >
            <div
              className="relative bg-black rounded-lg max-w-4xl w-full max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="aspect-video">
                <iframe
                  className="w-full h-full rounded-lg"
                  src={`https://www.youtube.com/embed/${selectedVideo.videoId}?autoplay=1`}
                  title={selectedVideo.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              <button
                className="absolute -top-2 -right-2 bg-[#B60C19] hover:bg-red-700 text-white rounded-full w-10 h-10 flex items-center justify-center text-sm font-bold transition-colors"
                onClick={closeVideo}
              >
                ×
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

const VideoSectionFull = () => {
  return (
    <section className="relative w-full mb-[50px] overflow-hidden">
      <VideoSection />
    </section>
  );
};

export default VideoSectionFull;
