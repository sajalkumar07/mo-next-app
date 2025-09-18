import React, { useEffect, useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

const LatestVideos = () => {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [carName, setCarName] = useState("");
  const scrollContainerRef = useRef(null);

  const params = useParams();

  const CARD_WIDTH = 254;
  const GAP = 8;
  const VISIBLE_CARDS = 5;

  // Calculate navigation
  const shouldShowArrows = videos.length > VISIBLE_CARDS;
  const maxIndex = Math.max(0, videos.length - VISIBLE_CARDS);

  const RAPIDAPI_URL = "https://yt-api.p.rapidapi.com";
  const RAPIDAPI_KEY = "a651f8322fmsh31b9418f911cfd4p1b34abjsn3a21242748da";
  const apiBaseUrl = process.env.NEXT_PUBLIC_API;

  useEffect(() => {
    const fetchCarData = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/api/cars/${params.id}`);
        const data = await response.json();
        setCarName(data.carname);
        fetchVideos(data.carname);
      } catch (error) {
        console.error("Error fetching car data:", error);
      }
    };

    const fetchVideos = async (carName) => {
      if (carName?.trim()) {
        try {
          const encodedCarName = encodeURIComponent(carName);
          const url = `${RAPIDAPI_URL}/search?query=${encodedCarName}+motoroctane&type=video`;

          const response = await fetch(url, {
            headers: {
              "X-Rapidapi-Key": RAPIDAPI_KEY,
              "X-Rapidapi-Host": "yt-api.p.rapidapi.com",
            },
          });

          const data = await response.json();

          if (data.data && Array.isArray(data.data) && data.data.length > 0) {
            const filteredVideos = data.data
              .filter(
                (video) =>
                  video.channelTitle === "MotorOctane" &&
                  parseInt(video.lengthText.split(":")[0]) >= 1
              )
              .slice(0, 10);

            setVideos(filteredVideos);
            // Reset current index when new videos are loaded
            setCurrentIndex(0);
          } else {
            console.warn(
              "No videos found for the car name in the specified channel."
            );
            setVideos([]);
          }
        } catch (error) {
          console.error("Error fetching videos:", error);
          setVideos([]);
        }
      } else {
        console.warn("Invalid car name.");
        setVideos([]);
      }
    };

    fetchCarData();
  }, [params.id, apiBaseUrl]);

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
    return publishedTimeText || "Recently";
  };

  // Smooth scroll to specific video card
  const scrollToCard = (index) => {
    if (scrollContainerRef.current) {
      const cardWidth = CARD_WIDTH + GAP;
      const scrollPosition = index * cardWidth;
      scrollContainerRef.current.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const newIndex = Math.max(0, currentIndex - 1);
      setCurrentIndex(newIndex);
      scrollToCard(newIndex);
    }
  };

  const handleNext = () => {
    if (currentIndex < maxIndex) {
      const newIndex = Math.min(maxIndex, currentIndex + 1);
      setCurrentIndex(newIndex);
      scrollToCard(newIndex);
    }
  };

  // Handle scroll events to update current index
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const scrollLeft = scrollContainerRef.current.scrollLeft;
      const cardWidth = CARD_WIDTH + GAP;
      const newIndex = Math.round(scrollLeft / cardWidth);
      if (newIndex !== currentIndex && newIndex < videos.length) {
        setCurrentIndex(newIndex);
      }
    }
  };

  return (
    <>
      <div className="mt-10 px-4">
        <section className="relative z-10 max-w-[1400px] mx-auto ">
          {/* Header Section */}
          <div className="flex justify-center items-center flex-col mb-8">
            <div className="flex justify-center items-center flex-col">
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
                  className="inline-flex items-center px-6 py-2 text-[#B60C19] rounded-md text-[14px] font-semibold"
                >
                  VIEW MORE
                </Link>
              </div>
            </div>
          </div>

          {/* Video Cards Container with Navigation */}
          <div className="relative">
            {/* Left Arrow Button - Only show when we have 5+ videos and not at start */}
            {shouldShowArrows && currentIndex > 0 && (
              <button
                className="hidden md:hidden lg:flex 2xl:flex xl:flex absolute -left-14 top-1/2 -translate-y-1/2 z-20 bg-white h-10 w-10 rounded-full shadow-md justify-center items-center border border-gray-200 hover:bg-gray-100 transition"
                onClick={handlePrevious}
                disabled={currentIndex === 0}
              >
                <ChevronLeft size={20} />
              </button>
            )}

            {/* Horizontal Scrollable Video Cards Container */}
            <div
              ref={scrollContainerRef}
              className="overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory px-2 md:px-0"
              style={{
                scrollBehavior: "smooth",
                WebkitOverflowScrolling: "touch",
                msOverflowStyle: "none",
                scrollbarWidth: "none",
              }}
              onScroll={handleScroll}
            >
              <div
                className="flex gap-2 md:gap-8"
                style={{ minWidth: "fit-content" }}
              >
                {videos.map((video, index) => (
                  <div
                    key={index}
                    className="w-[254px] cursor-pointer group snap-start bg-white border rounded-xl flex-shrink-0"
                    onClick={() => openVideo(video)}
                  >
                    {/* Video Thumbnail */}
                    <div className="relative w-full h-32 md:h-40 bg-gray-200 rounded-t-xl overflow-hidden mb-3">
                      <img
                        src={
                          video.thumbnail[0]?.url || video.thumbnail[0]?.high
                        }
                        alt={video.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />

                      {/* Play Button Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 md:w-16 md:h-16 bg-red-600 rounded-full flex items-center justify-center group-hover:bg-red-700 transition-colors">
                          <svg
                            className="w-5 h-5 md:w-6 md:h-6 text-white ml-1"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>

                      {/* Video Duration (if available) */}
                      {video.lengthText && (
                        <div className="absolute bottom-2 right-2 bg-black/40 text-white text-xs px-2 py-1 rounded-lg">
                          {video.lengthText}
                        </div>
                      )}
                    </div>

                    {/* Video Info */}
                    <p className="text-xs md:text-sm font-medium p-2 line-clamp-2">
                      {video.title}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Arrow Button - Only show when we have more than 5 videos and not at end */}
            {shouldShowArrows && currentIndex < maxIndex && (
              <button
                className="hidden md:hidden lg:flex 2xl:flex xl:flex  absolute -right-14 top-1/2 -translate-y-1/2 z-20 bg-white h-10 w-10 rounded-full shadow-md justify-center items-center border border-gray-200 hover:bg-gray-100 transition"
                onClick={handleNext}
                disabled={currentIndex >= maxIndex}
              >
                <ChevronRight size={20} />
              </button>
            )}
          </div>

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
    </>
  );
};

export default LatestVideos;
