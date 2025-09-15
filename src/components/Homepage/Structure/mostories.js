import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

const StoriesSection = () => {
  const [stories, setStories] = useState([]);
  const [selectedStory, setSelectedStory] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef(null);

  // Dummy stories data
  // const dummyStories = [
  //   {
  //     id: 1,
  //     title: "Latest Car Models Revealed at Auto Expo",
  //     image: "https://via.placeholder.com/254x144/333333/FFFFFF?text=Car+Story",
  //     url: "#",
  //     excerpt:
  //       "Check out the newest models showcased at the international auto expo this year.",
  //   },
  //   {
  //     id: 2,
  //     title: "Electric Vehicles: Future of Transportation",
  //     image: "https://via.placeholder.com/254x144/555555/FFFFFF?text=EV+News",
  //     url: "#",
  //     excerpt:
  //       "How electric vehicles are transforming the automotive industry worldwide.",
  //   },
  //   {
  //     id: 3,
  //     title: "Top SUVs of the Year 2023",
  //     image:
  //       "https://via.placeholder.com/254x144/777777/FFFFFF?text=SUV+Review",
  //     url: "#",
  //     excerpt: "Our picks for the best SUVs available in the market this year.",
  //   },
  //   {
  //     id: 4,
  //     title: "Auto Show Highlights & Updates",
  //     image: "https://via.placeholder.com/254x144/999999/FFFFFF?text=Auto+Show",
  //     url: "#",
  //     excerpt:
  //       "All the exciting reveals and announcements from the major auto shows.",
  //   },
  //   {
  //     id: 5,
  //     title: "Performance Car Reviews: Speed Demons",
  //     image:
  //       "https://via.placeholder.com/254x144/BBBBBB/FFFFFF?text=Performance",
  //     url: "#",
  //     excerpt:
  //       "In-depth reviews of the fastest production cars available today.",
  //   },
  //   {
  //     id: 6,
  //     title: "Classic Car Restoration Stories",
  //     image:
  //       "https://via.placeholder.com/254x144/DDDDDD/333333?text=Classic+Cars",
  //     url: "#",
  //     excerpt:
  //       "Beautiful restoration projects of vintage and classic automobiles.",
  //   },
  // ];

  useEffect(() => {
    // Simulate API fetch with timeout
    const fetchData = async () => {
      try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // For now, use dummy data
        setStories(dummyStories);

        /* 
        // Actual API call (commented out)
        const response = await fetch("http://145.223.22.192:3060/api/web-stories");
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        setStories(data.length > 0 ? data : dummyStories);
        */
      } catch (error) {
        console.error("Error fetching stories:", error);
        setStories(dummyStories);
      }
    };

    fetchData();
  }, []);

  const openStory = (story) => {
    setSelectedStory(story);
  };

  const closeStory = () => setSelectedStory(null);

  // Smooth scroll to specific story card
  const scrollToCard = (index) => {
    if (scrollContainerRef.current) {
      const cardWidth = 254; // Story card width
      const gap = 16; // gap between cards
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
    if (currentIndex < stories.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      scrollToCard(newIndex);
    }
  };

  // Handle scroll events to update current index
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const scrollLeft = scrollContainerRef.current.scrollLeft;
      const cardWidth = 254 + 16; // card width + gap
      const newIndex = Math.round(scrollLeft / cardWidth);
      if (newIndex !== currentIndex && newIndex < stories.length) {
        setCurrentIndex(newIndex);
      }
    }
  };

  return (
    <div className="relative w-full mb-[50px] overflow-hidden">
      <section className="relative z-10 max-w-[1400px] mx-auto px-4">
        {/* Header Section */}
        <div className="flex justify-center items-center flex-col mb-4">
          <div className="flex justify-center items-center flex-col">
            {/* Title */}
            <div className="text-center md:text-left">
              <p className="text-[25px] font-bold font-sans">
                <span className="text-[#818181]">MO</span>{" "}
                <span className="text-[#B60C19]">STORIES</span>
              </p>
            </div>
          </div>
        </div>

        {/* Stories Cards Container with Navigation */}

        {/* Left Arrow Button */}
        {stories.length > 0 && (
          <button
            className="hidden md:flex absolute left-0 top-[225px] -translate-y-1/2 z-20 bg-white h-10 w-10 rounded-full shadow-md justify-center items-center border border-gray-200 hover:bg-gray-100 transition"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
          >
            <ChevronLeft size={20} />
          </button>
        )}

        {/* Horizontal Scrollable Story Cards Container */}
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
          <div className="flex gap-4" style={{ minWidth: "fit-content" }}>
            {stories.map((story, index) => (
              <div
                key={index}
                className="w-[257px] h-[450px] cursor-pointer group snap-start bg-white border rounded-xl overflow-hidden"
                onClick={() => openStory(story)}
              >
                {/* Story Image */}
                <div className="relative w-full h-36 bg-gray-200 overflow-hidden">
                  <img
                    src={story.image}
                    alt={story.title}
                    className="w-full h-full object-cover"
                  />

                  {/* Overlay with Read Story button */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black bg-opacity-50 transition-opacity">
                    <div className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium">
                      Read Story
                    </div>
                  </div>
                </div>

                {/* Story Info */}
                <div className="p-3">
                  <p className="text-[14px] font-medium line-clamp-2">
                    {story.title}
                  </p>
                  <p className="text-[12px] text-gray-600 mt-1 line-clamp-2">
                    {story.excerpt}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Arrow Button */}
        {stories.length > 0 && (
          <button
            className="hidden md:flex absolute right-0 top-[225px] -translate-y-1/2 z-20 bg-white h-10 w-10 rounded-full shadow-md justify-center items-center border border-gray-200 hover:bg-gray-100 transition"
            onClick={handleNext}
            disabled={currentIndex === stories.length - 1}
          >
            <ChevronRight size={20} />
          </button>
        )}

        {/* Modal for Selected Story */}
        {selectedStory && (
          <div
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
            onClick={closeStory}
          >
            <div
              className="relative bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="h-48 bg-gray-200">
                <img
                  src={selectedStory.image}
                  alt={selectedStory.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-6 overflow-y-auto max-h-[calc(90vh-12rem)]">
                <h3 className="text-xl font-bold mb-4">
                  {selectedStory.title}
                </h3>
                <p className="text-gray-700 mb-6">{selectedStory.excerpt}</p>

                <div className="flex justify-between items-center">
                  <a
                    href={selectedStory.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                  >
                    Read Full Story
                  </a>

                  <button
                    onClick={closeStory}
                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>

              <button
                className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold transition-colors"
                onClick={closeStory}
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

const MoStories = () => {
  return (
    <section>
      <StoriesSection />
    </section>
  );
};

export default MoStories;
