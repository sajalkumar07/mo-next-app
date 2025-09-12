import React, { useEffect, useState, useRef } from "react";
import Videofull from "./videosectionfull.js";
import Scrach from "../../../Images/scrach.png";
import { Link } from "react-router-dom";

const VideoSection = () => {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef(null);
  const [isTablet, setIsTablet] = useState(false);

  const RAPIDAPI_URL = "https://yt-api.p.rapidapi.com/channel/videos";
  const RAPIDAPI_KEY = "a651f8322fmsh31b9418f911cfd4p1b34abjsn3a21242748da";
  const CHANNEL_ID = "UCSXOsOIzeJqJb4h0QlimDww";

  // Calculate how many videos are visible at once (approximate)
  const videosPerView = 4; // Adjust based on your design
  const videoWidth = 265 + 32; // video width + gap

  // Check if device is tablet/iPad
  const isTabletOrIPad = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    const screenWidth = window.innerWidth;

    // Check for iPad specifically
    const isIPad =
      userAgent.includes("ipad") ||
      (userAgent.includes("macintosh") && "ontouchend" in document);

    // Check for tablet screen size (768px to 1024px typically)
    const isTabletSize = screenWidth >= 768 && screenWidth <= 1024;

    return isIPad || isTabletSize;
  };

  useEffect(() => {
    const checkDevice = () => {
      setIsTablet(isTabletOrIPad());
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);

    return () => window.removeEventListener("resize", checkDevice);
  }, []);

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

  const handleNext = () => {
    const maxIndex = Math.max(0, videos.length - videosPerView);
    if (currentIndex < maxIndex) {
      const newIndex = Math.min(currentIndex + 1, maxIndex);
      setCurrentIndex(newIndex);

      // Smooth scroll for desktop
      if (scrollContainerRef.current && !isTablet) {
        scrollContainerRef.current.scrollTo({
          left: newIndex * videoWidth,
          behavior: "smooth",
        });
      }
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const newIndex = Math.max(currentIndex - 1, 0);
      setCurrentIndex(newIndex);

      // Smooth scroll for desktop
      if (scrollContainerRef.current && !isTablet) {
        scrollContainerRef.current.scrollTo({
          left: newIndex * videoWidth,
          behavior: "smooth",
        });
      }
    }
  };

  const openVideo = (video) => {
    setSelectedVideo(video);
  };

  const closeVideo = () => setSelectedVideo(null);

  // Check if we can scroll (have more videos than visible)
  const canScrollPrevious = currentIndex > 0;
  const canScrollNext =
    currentIndex < Math.max(0, videos.length - videosPerView);

  return (
    <>
      <section className="featurd_car mt-3 justify-content-center mobil-res bg-slate-400">
        <div className="w-full mx-auto px-2 flex justify-center items-center">
          {/* Conditional rendering for tab/iPad view */}
          {isTablet ? (
            <div className="flex flex-col items-center justify-center w-full mt-12">
              {/* Title centered */}
              <div className="label flex justify-center items-center mb-4">
                <p className="text-[25px] font-bold text-center">
                  <span className="text-wrapper">YOUTUBE</span>
                  <span className="span">&nbsp;</span>
                  <span className="text-wrapper-2">VIDEOS</span>
                </p>
              </div>

              {/* View More button centered below title */}
              <div className="input_box ">
                <Link to="https://m.youtube.com/@motoroctane">
                  <div className="flex justify-center items-center -mt-14">
                    <svg
                      width="89"
                      height="35"
                      viewBox="0 0 89 35"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {/* SVG content remains the same */}
                    </svg>
                  </div>
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="label flex-1 flex md:justify-center justify-start items-center mt-12 md:mr-0 ml-7">
                <p className="text-[25px] font-bold text-center">
                  <span className="text-wrapper">YOUTUBE</span>
                  <span className="span">&nbsp;</span>
                  <span className="text-wrapper-2">VIDEOS</span>
                </p>
              </div>

              <div className="input_box ">
                <Link to="https://m.youtube.com/@motoroctane">
                  <div className="flex justify-center items-center mt-7">
                    <svg
                      width="89"
                      height="35"
                      viewBox="0 0 89 35"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {/* SVG content remains the same */}
                    </svg>
                  </div>
                </Link>
              </div>
            </>
          )}
        </div>

        <div className="w-full flex justify-center items-center px-4">
          {/* Previous Button - Desktop Only */}
          <button
            className={`bg-[#818181] p-2 mr-2 md:m-0 rounded-full text-white hidden md:flex justify-center items-center flex-shrink-0 ${
              !canScrollPrevious || isTablet
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-[#666666]"
            }`}
            onClick={handlePrevious}
            disabled={!canScrollPrevious || isTablet}
          >
            <ion-icon name="chevron-back-outline"></ion-icon>
          </button>

          <div
            className="relative flex justify-center items-center"
            style={{ width: "1350px", maxWidth: "90vw" }}
          >
            <div
              ref={scrollContainerRef}
              className="w-full overflow-x-auto scrollbar-hide flex justify-start items-center"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                // Enable touch scrolling for all devices
                WebkitOverflowScrolling: "touch",
                cursor: isTablet ? "grab" : "auto",
              }}
            >
              <section className="flex gap-8 transition-transform duration-300 ease-in-out">
                {videos.map((video, index) => (
                  <div
                    key={index}
                    className="w-[265px] h-[200px] flex-shrink-0 transition-transform duration-300 cursor-pointer"
                    onClick={() => openVideo(video)}
                  >
                    <div className="relative w-[265px] h-[160px] overflow-hidden">
                      <img
                        src={
                          video.thumbnail[0]?.url || video.thumbnail[0]?.high
                        }
                        alt={video.title}
                        className="w-full h-full object-cover rounded-md"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="rounded-full w-[47px] h-[33px] flex items-center justify-center">
                          <svg
                            width="49"
                            height="34"
                            viewBox="0 0 49 34"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            {/* Red outer YouTube shape */}
                            <path
                              d="M24.478 0.0991859C27.475 0.0991859 30.3696 0.138561 33.1615 0.217311C35.9534 0.296061 38.0005 0.379186 39.3028 0.466686L41.2563 0.571686C41.2741 0.571686 41.4257 0.584811 41.7112 0.611061C41.9966 0.637311 42.2018 0.663561 42.3266 0.689811C42.4515 0.716061 42.6611 0.755436 42.9555 0.807936C43.2499 0.860436 43.5041 0.930436 43.7182 1.01794C43.9322 1.10544 44.182 1.21919 44.4674 1.35919C44.7529 1.49919 45.0294 1.66981 45.297 1.87106C45.5646 2.07231 45.8232 2.30419 46.073 2.56669C46.18 2.67169 46.3183 2.83356 46.4878 3.05231C46.6572 3.27106 46.9159 3.78294 47.2638 4.58794C47.6117 5.39294 47.8481 6.27669 47.9729 7.23919C48.1157 8.35919 48.2271 9.55356 48.3074 10.8223C48.3877 12.0911 48.4368 13.0842 48.4546 13.8017V18.4217C48.4724 20.9592 48.3119 23.4967 47.9729 26.0342C47.8481 26.9967 47.6251 27.8673 47.3039 28.6461C46.9828 29.4248 46.6974 29.9629 46.4476 30.2604L46.073 30.7067C45.8232 30.9692 45.5646 31.2011 45.297 31.4023C45.0294 31.6036 44.7529 31.7698 44.4674 31.9011C44.182 32.0323 43.9322 32.1417 43.7182 32.2292C43.5041 32.3167 43.2499 32.3867 42.9555 32.4392C42.6611 32.4917 42.4471 32.5311 42.3133 32.5573C42.1795 32.5836 41.9743 32.6098 41.6978 32.6361C41.4213 32.6623 41.2741 32.6754 41.2563 32.6754C36.7785 33.0079 31.1857 33.1742 24.478 33.1742C20.7851 33.1392 17.5784 33.0823 14.8579 33.0036C12.1373 32.9248 10.3489 32.8592 9.49258 32.8067L8.18135 32.7017L7.21801 32.5967C6.57578 32.5092 6.08964 32.4217 5.75961 32.3342C5.42957 32.2467 4.97466 32.0629 4.39487 31.7829C3.81507 31.5029 3.3111 31.1442 2.88295 30.7067C2.77591 30.6017 2.63765 30.4398 2.46817 30.2211C2.29869 30.0023 2.04002 29.4904 1.69214 28.6854C1.34427 27.8804 1.10789 26.9967 0.983011 26.0342C0.840293 24.9142 0.728795 23.7198 0.648516 22.4511C0.568237 21.1823 0.519178 20.1892 0.501338 19.4717V14.8517C0.483498 12.3142 0.644056 9.77669 0.983011 7.23919C1.10789 6.27669 1.33089 5.40606 1.652 4.62731C1.97312 3.84856 2.25855 3.31044 2.50831 3.01294L2.88295 2.56669C3.1327 2.30419 3.39138 2.07231 3.65898 1.87106C3.92657 1.66981 4.20309 1.49919 4.48852 1.35919C4.77396 1.21919 5.02372 1.10544 5.23779 1.01794C5.45187 0.930436 5.70609 0.860436 6.00044 0.807936C6.29480 0.755436 6.50442 0.716061 6.62929 0.689811C6.75417 0.663561 6.95933 0.637311 7.24477 0.611061C7.53020 0.584811 7.68184 0.571686 7.69968 0.571686C12.1775 0.256686 17.7702 0.0991859 24.478 0.0991859Z"
                              fill="#B1081A"
                            />
                            {/* White play button */}
                            <path
                              d="M19.5274 22.7267L32.4791 16.1642L19.5274 9.52294V22.7267Z"
                              fill="white"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div className="p-2 w-[265px]">
                      <h3 className="text-[12px] font-medium text-gray-800 font-sans line-clamp-2">
                        {video.title}
                      </h3>
                    </div>
                  </div>
                ))}
              </section>
            </div>
          </div>

          {/* Next Button - Desktop Only */}
          <button
            className={`bg-[#818181] p-2 ml-2 rounded-full text-white hidden md:flex justify-center items-center flex-shrink-0 ${
              !canScrollNext || isTablet
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-[#666666]"
            }`}
            onClick={handleNext}
            disabled={!canScrollNext || isTablet}
          >
            <ion-icon name="chevron-forward-outline"></ion-icon>
          </button>
        </div>

        {/* Modal for Selected Video */}
        {selectedVideo && (
          <div
            className="fixed inset-0 w-full h-full bg-black bg-opacity-80 flex items-center justify-center z-50"
            onClick={closeVideo}
          >
            <div
              className="relative bg-white rounded-lg max-w-4xl max-h-4xl"
              onClick={(e) => e.stopPropagation()}
            >
              <iframe
                width="800"
                height="450"
                src={`https://www.youtube.com/embed/${selectedVideo.videoId}?autoplay=1`}
                title={selectedVideo.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
              <button
                className="absolute -top-3 -right-3 bg-red-600 border-none rounded-full w-8 h-8 text-white text-sm flex items-center justify-center cursor-pointer"
                onClick={closeVideo}
              >
                X
              </button>
            </div>
          </div>
        )}
      </section>
    </>
  );
};

const VideoSectionFull = () => {
  return (
    <section className="">
      <VideoSection />
    </section>
  );
};

export default VideoSectionFull;

<style jsx>{`
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`}</style>;
