import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

const TopPicksVideoSection = () => {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef(null);

  const CARD_WIDTH = 323;
  const GAP = 24;

  const [visibleCount, setVisibleCount] = useState(1);

  const maxIndex = Math.max(0, videos.length - visibleCount);
  const hasOverflow = videos.length > visibleCount;

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

  const RAPIDAPI_URL = "https://yt-api.p.rapidapi.com";
  const RAPIDAPI_KEY = "a651f8322fmsh31b9418f911cfd4p1b34abjsn3a21242748da";

  useEffect(() => {
    const fetchComparisonVideos = async () => {
      try {
        const url = `${RAPIDAPI_URL}/search?query=comparison+motoroctane&type=video`;

        const response = await fetch(url, {
          headers: {
            "X-Rapidapi-Key": RAPIDAPI_KEY,
          },
        });

        const data = await response.json();

        if (data.data && Array.isArray(data.data) && data.data.length > 0) {
          const comparisonKeywords = [
            "comparison",
            "compare",
            "vs",
            "versus",
            "which is better",
          ];

          const filteredVideos = data.data
            .filter((video) => {
              const isMotorOctane = video.channelTitle === "MotorOctane";

              const hasValidDuration =
                video.lengthText &&
                parseInt(video.lengthText.split(":")[0] || "0") >= 1;

              const titleLower = (video.title || "").toLowerCase();
              const hasComparisonKeyword = comparisonKeywords.some((keyword) =>
                titleLower.includes(keyword.toLowerCase())
              );

              return isMotorOctane && hasValidDuration && hasComparisonKeyword;
            })
            .slice(0, 10);

          setVideos(filteredVideos);
        } else {
          console.warn("No comparison videos found for MotorOctane channel.");
          setVideos([]);
        }
      } catch (error) {
        console.error("Error fetching comparison videos:", error);
        setVideos([]);
      }
    };

    fetchComparisonVideos();
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
    return publishedTimeText || "Recently";
  };

  const scrollToCard = (index) => {
    if (scrollContainerRef.current) {
      const cardWidth = 288;
      const gap = 24;
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

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const scrollLeft = scrollContainerRef.current.scrollLeft;
      const cardWidth = 288 + 24;
      const newIndex = Math.round(scrollLeft / cardWidth);
      if (newIndex !== currentIndex && newIndex < videos.length) {
        setCurrentIndex(newIndex);
      }
    }
  };

  return (
    <div className="bg-[#f5f5f5]">
      <section className="relative z-10 max-w-[1400px] mx-auto px-4 py-4">
        <div className="flex justify-center items-center flex-col mb-4">
          <div className="flex justify-center items-center flex-col">
            <div className="text-center md:text-left">
              <p className="text-[25px] font-bold font-sans">
                <span className="text-[#818181]">TOP PICKS FOR</span>{" "}
                <span className="text-[#B60C19]">YOU</span>
              </p>
            </div>
          </div>
        </div>

        {hasOverflow && currentIndex > 0 && (
          <button
            className="hidden md:flex absolute -left-10 top-[250px] -translate-y-1/2 z-20 bg-white h-10 w-10 rounded-full shadow-md justify-center items-center border border-gray-200 hover:bg-gray-100 transition"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
          >
            <ChevronLeft size={20} />
          </button>
        )}

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
                className="w-[323px] h-[300px] cursor-pointer group snap-start bg-white border rounded-xl"
                onClick={() => openVideo(video)}
              >
                <div className="relative w-full  bg-gray-200 rounded-t-xl overflow-hidden ">
                  <img
                    src={
                      video.thumbnail?.[0]?.url || "/api/placeholder/275/160"
                    }
                    alt={video.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />

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

                  {video.lengthText && (
                    <div className="absolute bottom-2 right-2 bg-black/60  text-white text-xs px-2 py-1 rounded-lg">
                      {video.lengthText}
                    </div>
                  )}
                </div>

                <p className="text-[14px] font-medium p-2">{video.title}</p>
              </div>
            ))}
          </div>
        </div>

        {hasOverflow && currentIndex < maxIndex && (
          <button
            className="hidden md:flex absolute -right-10 top-[250px] -translate-y-1/2 z-20 bg-white h-10 w-10 rounded-full shadow-md justify-center items-center border border-gray-200 hover:bg-gray-100 transition"
            onClick={handleNext}
            disabled={currentIndex === videos.length - 1}
          >
            <ChevronRight size={20} />
          </button>
        )}

        {selectedVideo && (
          <div
            className="fixed inset-0 bg-black/30  flex items-center justify-center z-50 p-4"
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
                <span className="text-[25px]">×</span>
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

const TopPicksForYou = () => {
  return (
    <section className="relative w-full mb-[50px] overflow-hidden ">
      <TopPicksVideoSection />
    </section>
  );
};

export default TopPicksForYou;
