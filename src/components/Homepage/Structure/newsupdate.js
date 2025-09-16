import React, { useEffect, useState, useRef, forwardRef } from "react";
import ScrachNews from "../../../Images/scrach.png";
import Skeleton from "react-loading-skeleton";
import { Link } from "react-router-dom";
import Tyre from "../../../Images/tyremask.png";
import { ChevronRight, ChevronLeft } from "lucide-react";

const CARD_WIDTH = 323;
const GAP = 24;

const News = forwardRef((props, ref) => {
  const [newss, setNewss] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [visibleCount, setVisibleCount] = useState(1);
  const scrollContainerRef = useRef(null);

  const maxIndex = Math.max(0, newss.length - visibleCount);
  const hasOverflow = newss.length > visibleCount;

  const fetchNews = async () => {
    setLoading(true);
    try {
      const url = keyword
        ? `https://motoroctane.com/wp-json/allpost/v1/search?query=${keyword}&page=1`
        : `https://motoroctane.com/wp-json/allpost/v1/api?page=1`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: "Bearer e3def277-dd44-4dbf-a67d-d709e28ab5cc",
        },
      });

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      const data = await response.json();
      setNewss(data.posts || []);
      setCurrentIndex(0);
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  useEffect(() => {
    const measure = () => {
      const el = scrollContainerRef.current;
      if (!el) return;
      const slot = CARD_WIDTH + GAP;
      const count = Math.max(1, Math.floor((el.clientWidth + GAP) / slot));
      setVisibleCount(count);
      setCurrentIndex((idx) =>
        Math.min(idx, Math.max(0, newss.length - count))
      );
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [newss.length]);

  const handleScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const newIdx = Math.round(el.scrollLeft / (CARD_WIDTH + GAP));
    const clamped = Math.max(0, Math.min(newIdx, maxIndex));
    if (clamped !== currentIndex) setCurrentIndex(clamped);
  };

  const scrollToCard = (index) => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(index, maxIndex));
    const scrollPosition = clamped * (CARD_WIDTH + GAP);
    el.scrollTo({ left: scrollPosition, behavior: "smooth" });
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      scrollToCard(newIndex);
    }
  };

  const handleNext = () => {
    if (currentIndex < maxIndex) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      scrollToCard(newIndex);
    }
  };

  const handleSearchClick = () => fetchNews();

  const handleInputChange = (e) => {
    setKeyword(e.target.value);
    if (e.target.value === "") fetchNews();
  };

  if (loading) {
    return (
      <div className="relative w-full py-8 overflow-hidden" ref={ref}>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${Tyre})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            opacity: 0.08,
            zIndex: 0,
            pointerEvents: "none",
          }}
        />
        <div className="relative z-10 max-w-[1400px] mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <p className="text-[25px] font-bold font-sans">
              <span className="text-[#818181]">NEWS</span>
              <span className="span">&nbsp;</span>
              <span className="text-[#B60C19]">UPDATE</span>
            </p>
            <Link
              to="http://40.81.241.249:3000/news"
              className="inline-flex items-center px-6 py-2 text-[#B60C19] rounded-md text-[14px] font-semibold"
            >
              VIEW MORE
            </Link>
          </div>
          <div className="flex gap-6 px-8">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="w-[323px] h-[300px] flex-shrink-0">
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md h-full">
                  <Skeleton height={160} className="w-full" />
                  <div className="p-4 pt-2">
                    <Skeleton height={20} className="mb-2" />
                    <Skeleton height={16} count={2} className="mb-3" />
                    <Skeleton height={16} width={100} className="ml-auto" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative z-10 max-w-[1400px] mx-auto px-4 py-4" ref={ref}>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${Tyre})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          opacity: 0.08,
          zIndex: 0,
          pointerEvents: "none",
        }}
      />

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 py-4">
        <div className="flex justify-center items-center flex-col mb-8">
          <div className="flex justify-center items-center flex-col">
            <div className="text-center md:text-left">
              <p className="text-[25px] font-bold font-sans">
                <span className="text-[#818181]">NEWS</span>
                <span className="span">&nbsp;</span>
                <span className="text-[#B60C19]">UPDATE</span>
              </p>
            </div>
            <div className="flex justify-center md:justify-end">
              <Link
                to="http://40.81.241.249:3000/news"
                className="inline-flex items-center px-6 py-2 text-[#B60C19] rounded-md text-[14px] font-semibold"
              >
                VIEW MORE
              </Link>
            </div>
          </div>
        </div>

        <div className="relative">
          {/* LEFT ARROW — hidden at initial position or if no overflow */}
          {hasOverflow && currentIndex > 0 && (
            <button
              className="hidden md:flex absolute -left-20 top-[150px] -translate-y-1/2 z-20 bg-white h-10 w-10 rounded-full shadow-md justify-center items-center border border-gray-200 hover:bg-gray-100 transition"
              onClick={handlePrevious}
              aria-label="Previous"
            >
              <ChevronLeft size={20} />
            </button>
          )}

          {/* SCROLLER */}
          <div
            ref={scrollContainerRef}
            className="overflow-x-auto scrollbar-hide scroll-smooth"
            style={{
              scrollBehavior: "smooth",
              WebkitOverflowScrolling: "touch",
              msOverflowStyle: "none",
              scrollbarWidth: "none",
            }}
            onScroll={handleScroll}
          >
            <div className="flex gap-6">
              {newss.map((news, index) => (
                <div key={index} className="w-[308px] h-[300px] flex-shrink-0">
                  <a
                    href={`/news/${news.link}`}
                    className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md block h-full flex flex-col"
                  >
                    <div className="bg-gray-100 h-[160px] flex-shrink-0">
                      <img
                        src={news.featured_image}
                        alt={news.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-3 pt-2 flex flex-col h-[140px]">
                      <div className="flex-grow">
                        <div
                          className="font-semibold text-[14px] leading-tight line-clamp-2 font-[Montserrat] text-gray-900 mb-2"
                          dangerouslySetInnerHTML={{
                            __html: (news.title || "").replace(/&#038;/g, "&"),
                          }}
                        />
                        <p className="text-[12px] text-gray-600 line-clamp-3 font-[Montserrat]">
                          {news.excerpt || ""}
                        </p>
                      </div>
                      <div className="mt-auto pt-2">
                        <p className="text-[#B1081A] text-sm text-right hover:text-black transition-colors">
                          Read More..
                        </p>
                      </div>
                    </div>
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT ARROW — hidden when scrolled to end or if no overflow */}
          {hasOverflow && currentIndex < maxIndex && (
            <button
              className="hidden md:flex absolute -right-20 top-[150px] -translate-y-1/2 z-20 bg-white h-10 w-10 rounded-full shadow-md justify-center items-center border border-gray-200 hover:bg-gray-100 transition"
              onClick={handleNext}
              aria-label="Next"
            >
              <ChevronRight size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
});

export default News;
