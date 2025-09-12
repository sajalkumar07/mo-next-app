import React, { useEffect, useState, useRef, forwardRef } from "react";
import ScrachNews from "../../../Images/scrach.png";
import Skeleton from "react-loading-skeleton";
import { Link } from "react-router-dom";
import Tyre from "../../../Images/tyremask.png";

const News = forwardRef((props, ref) => {
  const [newss, setNewss] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  const scrollContainerRef = useRef(null);

  // Check if device is tablet/iPad (same function as VideoSection)
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

  // Fetch news when the component is mounted or when the keyword changes
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
      setNewss(data.posts);
      console.log(data);
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
    const checkDevice = () => {
      setIsMobile(window.innerWidth <= 768);
      setIsTablet(isTabletOrIPad());
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);

    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  // Function to scroll to the left (previous)
  const handlePrevious = () => {
    if (scrollContainerRef.current) {
      const scrollAmount = 316;
      scrollContainerRef.current.scrollBy({
        left: -scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Function to scroll to the right (next)
  const handleNext = () => {
    if (scrollContainerRef.current) {
      const scrollAmount = 316;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleSearchClick = () => {
    fetchNews();
  };

  const handleInputChange = (e) => {
    setKeyword(e.target.value);
    if (e.target.value === "") {
      fetchNews();
    }
  };

  if (loading) {
    return (
      <div className="relative w-full" ref={ref}>
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
        <section
          className="w-full max-w-6xl mx-auto relative"
          style={{ zIndex: 10 }}
        >
          <img className="scrach-image-news" src={ScrachNews} alt="scrach" />
          <div className="flex justify-center">
            <section className="flex items-center">
              <div className="flex gap-4 mt-1 mb-5 items-center justify-center">
                <div>
                  <Skeleton height={227.18} width={273.44} />
                  <Skeleton className="mt-2" height={20} width={273.44} />
                  <Skeleton className="mt-1" height={20} width={273.44} />
                </div>
                <div>
                  <Skeleton height={227.18} width={273.44} />
                  <Skeleton className="mt-2" height={20} width={273.44} />
                  <Skeleton className="mt-1" height={20} width={273.44} />
                </div>
                <div className="hidden md:block">
                  <Skeleton height={227.18} width={273.44} />
                  <Skeleton className="mt-2" height={20} width={273.44} />
                  <Skeleton className="mt-1" height={20} width={273.44} />
                </div>
              </div>
            </section>
          </div>
          <div className="mt-5"></div>
        </section>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center w-full ">
      <div className="relative w-full -mt-48" ref={ref}>
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
        <section
          className="w-full mx-auto md:px-6 py-4 relative"
          id="news"
          style={{ marginTop: "130px", zIndex: 10 }}
        >
          <img className="scrach-image-news" src={ScrachNews} alt="scrach" />

          {/* Conditional rendering for tab/iPad view */}
          <div className="w-full mx-auto px-2 flex justify-center items-center">
            {isTablet ? (
              <div className="flex flex-col items-center justify-center w-full mt-12 ml-8">
                {/* Title centered */}
                <div className="label flex justify-center items-center mb-4">
                  <p className="text-[25px] font-bold text-center">
                    <span className="text-wrapper">NEWS</span>
                    <span className="span">&nbsp;</span>
                    <span className="text-wrapper-2">UPDATE</span>
                  </p>
                </div>

                {/* View More button centered below title */}
                <div className="input_box">
                  <Link to="http://40.81.241.249:3000/news">
                    <div className="flex justify-center items-center -mt-14">
                      <svg
                        width="89"
                        height="35"
                        viewBox="0 0 89 35"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g filter="url(#filter0_d_2273_3050)">
                          <path
                            d="M5 2.67578C5 1.57121 5.89543 0.675781 7 0.675781H82C83.1046 0.675781 84 1.57121 84 2.67578V23.6758C84 24.7804 83.1046 25.6758 82 25.6758H7C5.89543 25.6758 5 24.7804 5 23.6758V2.67578Z"
                            fill="white"
                          />
                          <path
                            d="M7 1.17578H82V0.175781H7V1.17578ZM83.5 2.67578V23.6758H84.5V2.67578H83.5ZM82 25.1758H7V26.1758H82V25.1758ZM5.5 23.6758V2.67578H4.5V23.6758H5.5ZM7 25.1758C6.17157 25.1758 5.5 24.5042 5.5 23.6758H4.5C4.5 25.0565 5.61929 26.1758 7 26.1758V25.1758ZM83.5 23.6758C83.5 24.5042 82.8284 25.1758 82 25.1758V26.1758C83.3807 26.1758 84.5 25.0565 84.5 23.6758H83.5ZM82 1.17578C82.8284 1.17578 83.5 1.84735 83.5 2.67578H84.5C84.5 1.29507 83.3807 0.175781 82 0.175781V1.17578ZM7 0.175781C5.61929 0.175781 4.5 1.29507 4.5 2.67578H5.5C5.5 1.84735 6.17157 1.17578 7 1.17578V0.175781Z"
                            fill="#D9D9D9"
                          />
                          <path
                            d="M20.2737 17.1758L17.2137 10.1758H18.6237L21.3537 16.5058H20.5437L23.3037 10.1758H24.6037L21.5537 17.1758H20.2737ZM25.2712 17.1758V11.8358H26.5212V17.1758H25.2712ZM25.9012 10.9558C25.6678 10.9558 25.4745 10.8824 25.3212 10.7358C25.1745 10.5891 25.1012 10.4124 25.1012 10.2058C25.1012 9.99245 25.1745 9.81578 25.3212 9.67578C25.4745 9.52911 25.6678 9.45578 25.9012 9.45578C26.1345 9.45578 26.3245 9.52578 26.4712 9.66578C26.6245 9.79911 26.7012 9.96911 26.7012 10.1758C26.7012 10.3958 26.6278 10.5824 26.4812 10.7358C26.3345 10.8824 26.1412 10.9558 25.9012 10.9558ZM30.6718 17.2458C30.0785 17.2458 29.5585 17.1291 29.1118 16.8958C28.6718 16.6558 28.3285 16.3291 28.0818 15.9158C27.8418 15.5024 27.7218 15.0324 27.7218 14.5058C27.7218 13.9724 27.8385 13.5024 28.0718 13.0958C28.3118 12.6824 28.6385 12.3591 29.0518 12.1258C29.4718 11.8924 29.9485 11.7758 30.4818 11.7758C31.0018 11.7758 31.4651 11.8891 31.8718 12.1158C32.2785 12.3424 32.5985 12.6624 32.8318 13.0758C33.0651 13.4891 33.1818 13.9758 33.1818 14.5358C33.1818 14.5891 33.1785 14.6491 33.1718 14.7158C33.1718 14.7824 33.1685 14.8458 33.1618 14.9058H28.7118V14.0758H32.5018L32.0118 14.3358C32.0185 14.0291 31.9551 13.7591 31.8218 13.5258C31.6885 13.2924 31.5051 13.1091 31.2718 12.9758C31.0451 12.8424 30.7818 12.7758 30.4818 12.7758C30.1751 12.7758 29.9051 12.8424 29.6718 12.9758C29.4451 13.1091 29.2651 13.2958 29.1318 13.5358C29.0051 13.7691 28.9418 14.0458 28.9418 14.3658V14.5658C28.9418 14.8858 29.0151 15.1691 29.1618 15.4158C29.3085 15.6624 29.5151 15.8524 29.7818 15.9858C30.0485 16.1191 30.3551 16.1858 30.7018 16.1858C31.0018 16.1858 31.2718 16.1391 31.5118 16.0458C31.7518 15.9524 31.9651 15.8058 32.1518 15.6058L32.8218 16.3758C32.5818 16.6558 32.2785 16.8724 31.9118 17.0258C31.5518 17.1724 31.1385 17.2458 30.6718 17.2458ZM35.4648 17.1758L33.5048 11.8358H34.6848L36.3648 16.5458H35.8048L37.5648 11.8358H38.6148L40.3248 16.5458H39.7748L41.5048 11.8358H42.6148L40.6448 17.1758H39.4448L37.8848 13.0058H38.2548L36.6648 17.1758H35.4648ZM46.358 17.1758V10.1758H47.428L50.488 15.2858H49.928L52.938 10.1758H54.008L54.018 17.1758H52.788L52.778 12.1058H53.038L50.478 16.3758H49.898L47.298 12.1058H47.598V17.1758H46.358ZM58.1888 17.2458C57.6421 17.2458 57.1554 17.1291 56.7288 16.8958C56.3021 16.6558 55.9654 16.3291 55.7188 15.9158C55.4721 15.5024 55.3488 15.0324 55.3488 14.5058C55.3488 13.9724 55.4721 13.5024 55.7188 13.0958C55.9654 12.6824 56.3021 12.3591 56.7288 12.1258C57.1554 11.8924 57.6421 11.7758 58.1888 11.7758C58.7421 11.7758 59.2321 11.8924 59.6588 12.1258C60.0921 12.3591 60.4288 12.6791 60.6688 13.0858C60.9154 13.4924 61.0388 13.9658 61.0388 14.5058C61.0388 15.0324 60.9154 15.5024 60.6688 15.9158C60.4288 16.3291 60.0921 16.6558 59.6588 16.8958C59.2321 17.1291 58.7421 17.2458 58.1888 17.2458ZM58.1888 16.1758C58.4954 16.1758 58.7688 16.1091 59.0088 15.9758C59.2488 15.8424 59.4354 15.6491 59.5688 15.3958C59.7088 15.1424 59.7788 14.8458 59.7788 14.5058C59.7788 14.1591 59.7088 13.8624 59.5688 13.6158C59.4354 13.3624 59.2488 13.1691 59.0088 13.0358C58.7688 12.9024 58.4988 12.8358 58.1988 12.8358C57.8921 12.8358 57.6188 12.9024 57.3788 13.0358C57.1454 13.1691 56.9588 13.3624 56.8188 13.6158C56.6788 13.8624 56.6088 14.1591 56.6088 14.5058C56.6088 14.8458 56.6788 15.1424 56.8188 15.3958C56.9588 15.6491 57.1454 15.8424 57.3788 15.9758C57.6188 16.1091 57.8888 16.1758 58.1888 16.1758ZM62.2341 17.1758V11.8358H63.4241V13.3058L63.2841 12.8758C63.4441 12.5158 63.6941 12.2424 64.0341 12.0558C64.3807 11.8691 64.8107 11.7758 65.3241 11.7758V12.9658C65.2707 12.9524 65.2207 12.9458 65.1741 12.9458C65.1274 12.9391 65.0807 12.9358 65.0341 12.9358C64.5607 12.9358 64.1841 13.0758 63.9041 13.3558C63.6241 13.6291 63.4841 14.0391 63.4841 14.5858V17.1758H62.2341ZM68.8456 17.2458C68.2523 17.2458 67.7323 17.1291 67.2856 16.8958C66.8456 16.6558 66.5023 16.3291 66.2556 15.9158C66.0156 15.5024 65.8956 15.0324 65.8956 14.5058C65.8956 13.9724 66.0123 13.5024 66.2456 13.0958C66.4856 12.6824 66.8123 12.3591 67.2256 12.1258C67.6456 11.8924 68.1223 11.7758 68.6556 11.7758C69.1756 11.7758 69.639 11.8891 70.0456 12.1158C70.4523 12.3424 70.7723 12.6624 71.0056 13.0758C71.239 13.4891 71.3556 13.9758 71.3556 14.5358C71.3556 14.5891 71.3523 14.6491 71.3456 14.7158C71.3456 14.7824 71.3423 14.8458 71.3356 14.9058H66.8856V14.0758H70.6756L70.1856 14.3358C70.1923 14.0291 70.129 13.7591 69.9956 13.5258C69.8623 13.2924 69.679 13.1091 69.4456 12.9758C69.219 12.8424 68.9556 12.7758 68.6556 12.7758C68.349 12.7758 68.079 12.8424 67.8456 12.9758C67.619 13.1091 67.439 13.2958 67.3056 13.5358C67.179 13.7691 67.1156 14.0458 67.1156 14.3658V14.5658C67.1156 14.8858 67.189 15.1691 67.3356 15.4158C67.4823 15.6624 67.689 15.8524 67.9556 15.9858C68.2223 16.1191 68.529 16.1858 68.8756 16.1858C69.1756 16.1858 69.4456 16.1391 69.6856 16.0458C69.9256 15.9524 70.139 15.8058 70.3256 15.6058L70.9956 16.3758C70.7556 16.6558 70.4523 16.8724 70.0856 17.0258C69.7256 17.1724 69.3123 17.2458 68.8456 17.2458Z"
                            fill="#858585"
                          />
                        </g>
                        <defs>
                          <filter
                            id="filter0_d_2273_3050"
                            x="0.5"
                            y="0.175781"
                            width="88"
                            height="34"
                            filterUnits="userSpaceOnUse"
                            color-interpolation-filters="sRGB"
                          >
                            <feFlood
                              flood-opacity="0"
                              result="BackgroundImageFix"
                            />
                            <feColorMatrix
                              in="SourceAlpha"
                              type="matrix"
                              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                              result="hardAlpha"
                            />
                            <feOffset dy="4" />
                            <feGaussianBlur stdDeviation="2" />
                            <feComposite in2="hardAlpha" operator="out" />
                            <feColorMatrix
                              type="matrix"
                              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                            />
                            <feBlend
                              mode="normal"
                              in2="BackgroundImageFix"
                              result="effect1_dropShadow_2273_3050"
                            />
                            <feBlend
                              mode="normal"
                              in="SourceGraphic"
                              in2="effect1_dropShadow_2273_3050"
                              result="shape"
                            />
                          </filter>
                        </defs>
                      </svg>
                    </div>
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <div className="label flex-1 flex md:justify-center justify-start items-center mt-12 md:-mr-20  ml-7 ">
                  <p className="text-[25px] font-bold text-center">
                    <span className="text-wrapper">NEWS</span>
                    <span className="span">&nbsp;</span>
                    <span className="text-wrapper-2">UPDATE</span>
                  </p>
                </div>

                <div className="input_box">
                  <Link to="http://40.81.241.249:3000/news">
                    <div className="flex justify-center items-center mt-8 ml-20">
                      <svg
                        width="89"
                        height="35"
                        viewBox="0 0 89 35"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g filter="url(#filter0_d_2273_3050)">
                          <path
                            d="M5 2.67578C5 1.57121 5.89543 0.675781 7 0.675781H82C83.1046 0.675781 84 1.57121 84 2.67578V23.6758C84 24.7804 83.1046 25.6758 82 25.6758H7C5.89543 25.6758 5 24.7804 5 23.6758V2.67578Z"
                            fill="white"
                          />
                          <path
                            d="M7 1.17578H82V0.175781H7V1.17578ZM83.5 2.67578V23.6758H84.5V2.67578H83.5ZM82 25.1758H7V26.1758H82V25.1758ZM5.5 23.6758V2.67578H4.5V23.6758H5.5ZM7 25.1758C6.17157 25.1758 5.5 24.5042 5.5 23.6758H4.5C4.5 25.0565 5.61929 26.1758 7 26.1758V25.1758ZM83.5 23.6758C83.5 24.5042 82.8284 25.1758 82 25.1758V26.1758C83.3807 26.1758 84.5 25.0565 84.5 23.6758H83.5ZM82 1.17578C82.8284 1.17578 83.5 1.84735 83.5 2.67578H84.5C84.5 1.29507 83.3807 0.175781 82 0.175781V1.17578ZM7 0.175781C5.61929 0.175781 4.5 1.29507 4.5 2.67578H5.5C5.5 1.84735 6.17157 1.17578 7 1.17578V0.175781Z"
                            fill="#D9D9D9"
                          />
                          <path
                            d="M20.2737 17.1758L17.2137 10.1758H18.6237L21.3537 16.5058H20.5437L23.3037 10.1758H24.6037L21.5537 17.1758H20.2737ZM25.2712 17.1758V11.8358H26.5212V17.1758H25.2712ZM25.9012 10.9558C25.6678 10.9558 25.4745 10.8824 25.3212 10.7358C25.1745 10.5891 25.1012 10.4124 25.1012 10.2058C25.1012 9.99245 25.1745 9.81578 25.3212 9.67578C25.4745 9.52911 25.6678 9.45578 25.9012 9.45578C26.1345 9.45578 26.3245 9.52578 26.4712 9.66578C26.6245 9.79911 26.7012 9.96911 26.7012 10.1758C26.7012 10.3958 26.6278 10.5824 26.4812 10.7358C26.3345 10.8824 26.1412 10.9558 25.9012 10.9558ZM30.6718 17.2458C30.0785 17.2458 29.5585 17.1291 29.1118 16.8958C28.6718 16.6558 28.3285 16.3291 28.0818 15.9158C27.8418 15.5024 27.7218 15.0324 27.7218 14.5058C27.7218 13.9724 27.8385 13.5024 28.0718 13.0958C28.3118 12.6824 28.6385 12.3591 29.0518 12.1258C29.4718 11.8924 29.9485 11.7758 30.4818 11.7758C31.0018 11.7758 31.4651 11.8891 31.8718 12.1158C32.2785 12.3424 32.5985 12.6624 32.8318 13.0758C33.0651 13.4891 33.1818 13.9758 33.1818 14.5358C33.1818 14.5891 33.1785 14.6491 33.1718 14.7158C33.1718 14.7824 33.1685 14.8458 33.1618 14.9058H28.7118V14.0758H32.5018L32.0118 14.3358C32.0185 14.0291 31.9551 13.7591 31.8218 13.5258C31.6885 13.2924 31.5051 13.1091 31.2718 12.9758C31.0451 12.8424 30.7818 12.7758 30.4818 12.7758C30.1751 12.7758 29.9051 12.8424 29.6718 12.9758C29.4451 13.1091 29.2651 13.2958 29.1318 13.5358C29.0051 13.7691 28.9418 14.0458 28.9418 14.3658V14.5658C28.9418 14.8858 29.0151 15.1691 29.1618 15.4158C29.3085 15.6624 29.5151 15.8524 29.7818 15.9858C30.0485 16.1191 30.3551 16.1858 30.7018 16.1858C31.0018 16.1858 31.2718 16.1391 31.5118 16.0458C31.7518 15.9524 31.9651 15.8058 32.1518 15.6058L32.8218 16.3758C32.5818 16.6558 32.2785 16.8724 31.9118 17.0258C31.5518 17.1724 31.1385 17.2458 30.6718 17.2458ZM35.4648 17.1758L33.5048 11.8358H34.6848L36.3648 16.5458H35.8048L37.5648 11.8358H38.6148L40.3248 16.5458H39.7748L41.5048 11.8358H42.6148L40.6448 17.1758H39.4448L37.8848 13.0058H38.2548L36.6648 17.1758H35.4648ZM46.358 17.1758V10.1758H47.428L50.488 15.2858H49.928L52.938 10.1758H54.008L54.018 17.1758H52.788L52.778 12.1058H53.038L50.478 16.3758H49.898L47.298 12.1058H47.598V17.1758H46.358ZM58.1888 17.2458C57.6421 17.2458 57.1554 17.1291 56.7288 16.8958C56.3021 16.6558 55.9654 16.3291 55.7188 15.9158C55.4721 15.5024 55.3488 15.0324 55.3488 14.5058C55.3488 13.9724 55.4721 13.5024 55.7188 13.0958C55.9654 12.6824 56.3021 12.3591 56.7288 12.1258C57.1554 11.8924 57.6421 11.7758 58.1888 11.7758C58.7421 11.7758 59.2321 11.8924 59.6588 12.1258C60.0921 12.3591 60.4288 12.6791 60.6688 13.0858C60.9154 13.4924 61.0388 13.9658 61.0388 14.5058C61.0388 15.0324 60.9154 15.5024 60.6688 15.9158C60.4288 16.3291 60.0921 16.6558 59.6588 16.8958C59.2321 17.1291 58.7421 17.2458 58.1888 17.2458ZM58.1888 16.1758C58.4954 16.1758 58.7688 16.1091 59.0088 15.9758C59.2488 15.8424 59.4354 15.6491 59.5688 15.3958C59.7088 15.1424 59.7788 14.8458 59.7788 14.5058C59.7788 14.1591 59.7088 13.8624 59.5688 13.6158C59.4354 13.3624 59.2488 13.1691 59.0088 13.0358C58.7688 12.9024 58.4988 12.8358 58.1988 12.8358C57.8921 12.8358 57.6188 12.9024 57.3788 13.0358C57.1454 13.1691 56.9588 13.3624 56.8188 13.6158C56.6788 13.8624 56.6088 14.1591 56.6088 14.5058C56.6088 14.8458 56.6788 15.1424 56.8188 15.3958C56.9588 15.6491 57.1454 15.8424 57.3788 15.9758C57.6188 16.1091 57.8888 16.1758 58.1888 16.1758ZM62.2341 17.1758V11.8358H63.4241V13.3058L63.2841 12.8758C63.4441 12.5158 63.6941 12.2424 64.0341 12.0558C64.3807 11.8691 64.8107 11.7758 65.3241 11.7758V12.9658C65.2707 12.9524 65.2207 12.9458 65.1741 12.9458C65.1274 12.9391 65.0807 12.9358 65.0341 12.9358C64.5607 12.9358 64.1841 13.0758 63.9041 13.3558C63.6241 13.6291 63.4841 14.0391 63.4841 14.5858V17.1758H62.2341ZM68.8456 17.2458C68.2523 17.2458 67.7323 17.1291 67.2856 16.8958C66.8456 16.6558 66.5023 16.3291 66.2556 15.9158C66.0156 15.5024 65.8956 15.0324 65.8956 14.5058C65.8956 13.9724 66.0123 13.5024 66.2456 13.0958C66.4856 12.6824 66.8123 12.3591 67.2256 12.1258C67.6456 11.8924 68.1223 11.7758 68.6556 11.7758C69.1756 11.7758 69.639 11.8891 70.0456 12.1158C70.4523 12.3424 70.7723 12.6624 71.0056 13.0758C71.239 13.4891 71.3556 13.9758 71.3556 14.5358C71.3556 14.5891 71.3523 14.6491 71.3456 14.7158C71.3456 14.7824 71.3423 14.8458 71.3356 14.9058H66.8856V14.0758H70.6756L70.1856 14.3358C70.1923 14.0291 70.129 13.7591 69.9956 13.5258C69.8623 13.2924 69.679 13.1091 69.4456 12.9758C69.219 12.8424 68.9556 12.7758 68.6556 12.7758C68.349 12.7758 68.079 12.8424 67.8456 12.9758C67.619 13.1091 67.439 13.2958 67.3056 13.5358C67.179 13.7691 67.1156 14.0458 67.1156 14.3658V14.5658C67.1156 14.8858 67.189 15.1691 67.3356 15.4158C67.4823 15.6624 67.689 15.8524 67.9556 15.9858C68.2223 16.1191 68.529 16.1858 68.8756 16.1858C69.1756 16.1858 69.4456 16.1391 69.6856 16.0458C69.9256 15.9524 70.139 15.8058 70.3256 15.6058L70.9956 16.3758C70.7556 16.6558 70.4523 16.8724 70.0856 17.0258C69.7256 17.1724 69.3123 17.2458 68.8456 17.2458Z"
                            fill="#858585"
                          />
                        </g>
                        <defs>
                          <filter
                            id="filter0_d_2273_3050"
                            x="0.5"
                            y="0.175781"
                            width="88"
                            height="34"
                            filterUnits="userSpaceOnUse"
                            color-interpolation-filters="sRGB"
                          >
                            <feFlood
                              flood-opacity="0"
                              result="BackgroundImageFix"
                            />
                            <feColorMatrix
                              in="SourceAlpha"
                              type="matrix"
                              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                              result="hardAlpha"
                            />
                            <feOffset dy="4" />
                            <feGaussianBlur stdDeviation="2" />
                            <feComposite in2="hardAlpha" operator="out" />
                            <feColorMatrix
                              type="matrix"
                              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                            />
                            <feBlend
                              mode="normal"
                              in2="BackgroundImageFix"
                              result="effect1_dropShadow_2273_3050"
                            />
                            <feBlend
                              mode="normal"
                              in="SourceGraphic"
                              in2="effect1_dropShadow_2273_3050"
                              result="shape"
                            />
                          </filter>
                        </defs>
                      </svg>
                    </div>
                  </Link>
                </div>
              </>
            )}
          </div>

          <div className="flex items-center justify-center ">
            <div className="flex items-center justify-center w-[100%] ">
              {/* Previous button */}
              <button
                className="bg-gray-500 p-2 rounded-full text-white justify-center items-center md:flex hidden m-4 md:m-0 z-10"
                onClick={handlePrevious}
                aria-label="Previous slide"
              >
                <ion-icon name="chevron-back-outline"></ion-icon>
              </button>

              {/* Cards container */}
              <div
                ref={scrollContainerRef}
                className="flex overflow-x-auto gap-4 px-4 py-2  md:overflow-hidden scroll-smooth  scrollbar-hide "
                style={{ scrollBehavior: "smooth" }}
              >
                {newss.map((news, index) => (
                  <a
                    href={`/news/${news.link}${isMobile ? "/amp" : ""}`}
                    key={index}
                    className="min-w-[300px] max-w-[300px] bg-white border shadow-md overflow-hidden flex-shrink-0"
                  >
                    <img
                      src={news.featured_image}
                      alt={news.title}
                      className="w-full h-[180px] object-cover"
                      loading="lazy"
                    />
                    <div className="p-3">
                      <p
                        className="font-semibold text-[11px] leading-tight line-clamp-2 font-[Montserrat]"
                        dangerouslySetInnerHTML={{
                          __html: news.title.replace(/&#038;/g, "&"),
                        }}
                      />
                      <p className="text-[11px] text-gray-600 mt-1 line-clamp-2 font-[Montserrat]">
                        {news.excerpt || ""}
                      </p>
                      <p className="text-[#B1081A] text-sm text-right mt-2 hover:underline">
                        Read More..
                      </p>
                    </div>
                  </a>
                ))}
              </div>

              {/* Next button */}
              <button
                className="bg-gray-500 p-2 rounded-full text-white m-4 md:m-0 justify-center items-center md:flex hidden z-10"
                onClick={handleNext}
                aria-label="Next slide"
              >
                <ion-icon name="chevron-forward-outline"></ion-icon>
              </button>
            </div>
          </div>
          <div className="mt-5"></div>
        </section>
      </div>
    </div>
  );
});

export default News;
