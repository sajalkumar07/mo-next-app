import React, { useState, useEffect, forwardRef } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Link, useParams } from "react-router-dom";
import Scrach from "../../../Images/scrach.png";

const LatestVideos = (props, ref) => {
  const [latestVideos, setLatestVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [carName, setCarName] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const params = useParams();

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
              .slice(0, 40);

            setLatestVideos(filteredVideos);
          } else {
            console.warn(
              "No videos found for the car name in the specified channel."
            );
            setLatestVideos([]);
          }
        } catch (error) {
          console.error("Error fetching videos:", error);
          setLatestVideos([]);
        } finally {
          setLoading(false);
        }
      } else {
        console.warn("Invalid car name.");
        setLatestVideos([]);
      }
    };

    fetchCarData();
  }, [params.id, apiBaseUrl]);

  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      setIsMobile(/android|iphone|ipad|mobile|iPod/i.test(userAgent));
    };

    checkMobile();
  }, []);

  const openVideo = (video) => {
    setSelectedVideo(video);
  };

  const closeVideo = () => setSelectedVideo(null);

  const chunkArray = (array, size) => {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  };

  const videoChunks = chunkArray(latestVideos.slice(0, 8), 4);

  return (
    <>
      <img className="scrach-image-2" src={Scrach} alt="scrach"></img>

      <section
        className="featurd_car mt-3 pt-3 justify-content-center mobil-res bg-slate-400"
        ref={ref}
      >
        <div className="label d-flex align-items-center justify-content-between py-4">
          <p className="FIND-YOUR-PERFECT brand mt-3 px-2">
            <span className="text-wrapper">YOUTUBE</span>
            <span className="span">&nbsp;</span>
            <span className="text-wrapper-2">VIDEOS</span>
          </p>
          <div className="input_box" style={{ marginTop: "-7px" }}>
            <Link to="https://m.youtube.com/@motoroctane">
              {" "}
              <svg
                width="88"
                height="35"
                viewBox="0 0 88 35"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g filter="url(#filter0_d_2275_2066)">
                  <path
                    d="M4.5 2.66797C4.5 1.5634 5.39543 0.667969 6.5 0.667969H81.5C82.6046 0.667969 83.5 1.5634 83.5 2.66797V23.668C83.5 24.7725 82.6046 25.668 81.5 25.668H6.5C5.39543 25.668 4.5 24.7725 4.5 23.668V2.66797Z"
                    fill="white"
                  />
                  <path
                    d="M6.5 1.16797H81.5V0.167969H6.5V1.16797ZM83 2.66797V23.668H84V2.66797H83ZM81.5 25.168H6.5V26.168H81.5V25.168ZM5 23.668V2.66797H4V23.668H5ZM6.5 25.168C5.67157 25.168 5 24.4964 5 23.668H4C4 25.0487 5.11929 26.168 6.5 26.168V25.168ZM83 23.668C83 24.4964 82.3284 25.168 81.5 25.168V26.168C82.8807 26.168 84 25.0487 84 23.668H83ZM81.5 1.16797C82.3284 1.16797 83 1.83954 83 2.66797H84C84 1.28726 82.8807 0.167969 81.5 0.167969V1.16797ZM6.5 0.167969C5.11929 0.167969 4 1.28726 4 2.66797H5C5 1.83954 5.67157 1.16797 6.5 1.16797V0.167969Z"
                    fill="#D9D9D9"
                  />
                  <path
                    d="M19.7737 17.168L16.7137 10.168H18.1237L20.8537 16.498H20.0437L22.8037 10.168H24.1037L21.0537 17.168H19.7737ZM24.7712 17.168V11.828H26.0212V17.168H24.7712ZM25.4012 10.948C25.1678 10.948 24.9745 10.8746 24.8212 10.728C24.6745 10.5813 24.6012 10.4046 24.6012 10.198C24.6012 9.98464 24.6745 9.80797 24.8212 9.66797C24.9745 9.5213 25.1678 9.44797 25.4012 9.44797C25.6345 9.44797 25.8245 9.51797 25.9712 9.65797C26.1245 9.7913 26.2012 9.9613 26.2012 10.168C26.2012 10.388 26.1278 10.5746 25.9812 10.728C25.8345 10.8746 25.6412 10.948 25.4012 10.948ZM30.1718 17.238C29.5785 17.238 29.0585 17.1213 28.6118 16.888C28.1718 16.648 27.8285 16.3213 27.5818 15.908C27.3418 15.4946 27.2218 15.0246 27.2218 14.498C27.2218 13.9646 27.3385 13.4946 27.5718 13.088C27.8118 12.6746 28.1385 12.3513 28.5518 12.118C28.9718 11.8846 29.4485 11.768 29.9818 11.768C30.5018 11.768 30.9651 11.8813 31.3718 12.108C31.7785 12.3346 32.0985 12.6546 32.3318 13.068C32.5651 13.4813 32.6818 13.968 32.6818 14.528C32.6818 14.5813 32.6785 14.6413 32.6718 14.708C32.6718 14.7746 32.6685 14.838 32.6618 14.898H28.2118V14.068H32.0018L31.5118 14.328C31.5185 14.0213 31.4551 13.7513 31.3218 13.518C31.1885 13.2846 31.0051 13.1013 30.7718 12.968C30.5451 12.8346 30.2818 12.768 29.9818 12.768C29.6751 12.768 29.4051 12.8346 29.1718 12.968C28.9451 13.1013 28.7651 13.288 28.6318 13.528C28.5051 13.7613 28.4418 14.038 28.4418 14.358V14.558C28.4418 14.878 28.5151 15.1613 28.6618 15.408C28.8085 15.6546 29.0151 15.8446 29.2818 15.978C29.5485 16.1113 29.8551 16.178 30.2018 16.178C30.5018 16.178 30.7718 16.1313 31.0118 16.038C31.2518 15.9446 31.4651 15.798 31.6518 15.598L32.3218 16.368C32.0818 16.648 31.7785 16.8646 31.4118 17.018C31.0518 17.1646 30.6385 17.238 30.1718 17.238ZM34.9648 17.168L33.0048 11.828H34.1848L35.8648 16.538H35.3048L37.0648 11.828H38.1148L39.8248 16.538H39.2748L41.0048 11.828H42.1148L40.1448 17.168H38.9448L37.3848 12.998H37.7548L36.1648 17.168H34.9648ZM45.858 17.168V10.168H46.928L49.988 15.278H49.428L52.438 10.168H53.508L53.518 17.168H52.288L52.278 12.098H52.538L49.978 16.368H49.398L46.798 12.098H47.098V17.168H45.858ZM57.6888 17.238C57.1421 17.238 56.6554 17.1213 56.2288 16.888C55.8021 16.648 55.4654 16.3213 55.2188 15.908C54.9721 15.4946 54.8488 15.0246 54.8488 14.498C54.8488 13.9646 54.9721 13.4946 55.2188 13.088C55.4654 12.6746 55.8021 12.3513 56.2288 12.118C56.6554 11.8846 57.1421 11.768 57.6888 11.768C58.2421 11.768 58.7321 11.8846 59.1588 12.118C59.5921 12.3513 59.9288 12.6713 60.1688 13.078C60.4154 13.4846 60.5388 13.958 60.5388 14.498C60.5388 15.0246 60.4154 15.4946 60.1688 15.908C59.9288 16.3213 59.5921 16.648 59.1588 16.888C58.7321 17.1213 58.2421 17.238 57.6888 17.238ZM57.6888 16.168C57.9954 16.168 58.2688 16.1013 58.5088 15.968C58.7488 15.8346 58.9354 15.6413 59.0688 15.388C59.2088 15.1346 59.2788 14.838 59.2788 14.498C59.2788 14.1513 59.2088 13.8546 59.0688 13.608C58.9354 13.3546 58.7488 13.1613 58.5088 13.028C58.2688 12.8946 57.9988 12.828 57.6988 12.828C57.3921 12.828 57.1188 12.8946 56.8788 13.028C56.6454 13.1613 56.4588 13.3546 56.3188 13.608C56.1788 13.8546 56.1088 14.1513 56.1088 14.498C56.1088 14.838 56.1788 15.1346 56.3188 15.388C56.4588 15.6413 56.6454 15.8346 56.8788 15.968C57.1188 16.1013 57.3888 16.168 57.6888 16.168ZM61.7341 17.168V11.828H62.9241V13.298L62.7841 12.868C62.9441 12.508 63.1941 12.2346 63.5341 12.048C63.8807 11.8613 64.3107 11.768 64.8241 11.768V12.958C64.7707 12.9446 64.7207 12.938 64.6741 12.938C64.6274 12.9313 64.5807 12.928 64.5341 12.928C64.0607 12.928 63.6841 13.068 63.4041 13.348C63.1241 13.6213 62.9841 14.0313 62.9841 14.578V17.168H61.7341ZM68.3456 17.238C67.7523 17.238 67.2323 17.1213 66.7856 16.888C66.3456 16.648 66.0023 16.3213 65.7556 15.908C65.5156 15.4946 65.3956 15.0246 65.3956 14.498C65.3956 13.9646 65.5123 13.4946 65.7456 13.088C65.9856 12.6746 66.3123 12.3513 66.7256 12.118C67.1456 11.8846 67.6223 11.768 68.1556 11.768C68.6756 11.768 69.139 11.8813 69.5456 12.108C69.9523 12.3346 70.2723 12.6546 70.5056 13.068C70.739 13.4813 70.8556 13.968 70.8556 14.528C70.8556 14.5813 70.8523 14.6413 70.8456 14.708C70.8456 14.7746 70.8423 14.838 70.8356 14.898H66.3856V14.068H70.1756L69.6856 14.328C69.6923 14.0213 69.629 13.7513 69.4956 13.518C69.3623 13.2846 69.179 13.1013 68.9456 12.968C68.719 12.8346 68.4556 12.768 68.1556 12.768C67.849 12.768 67.579 12.8346 67.3456 12.968C67.119 13.1013 66.939 13.288 66.8056 13.528C66.679 13.7613 66.6156 14.038 66.6156 14.358V14.558C66.6156 14.878 66.689 15.1613 66.8356 15.408C66.9823 15.6546 67.189 15.8446 67.4556 15.978C67.7223 16.1113 68.029 16.178 68.3756 16.178C68.6756 16.178 68.9456 16.1313 69.1856 16.038C69.4256 15.9446 69.639 15.798 69.8256 15.598L70.4956 16.368C70.2556 16.648 69.9523 16.8646 69.5856 17.018C69.2256 17.1646 68.8123 17.238 68.3456 17.238Z"
                    fill="#858585"
                  />
                </g>
                <defs>
                  <filter
                    id="filter0_d_2275_2066"
                    x="0"
                    y="0.167969"
                    width="88"
                    height="34"
                    filterUnits="userSpaceOnUse"
                    color-interpolation-filters="sRGB"
                  >
                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
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
                      result="effect1_dropShadow_2275_2066"
                    />
                    <feBlend
                      mode="normal"
                      in="SourceGraphic"
                      in2="effect1_dropShadow_2275_2066"
                      result="shape"
                    />
                  </filter>
                </defs>
              </svg>
            </Link>
          </div>
        </div>

        <div className="w-full max-w-screen-xl mx-auto px-2">
          <div className="w-full  scrollbar-hide overflow-x-scroll overflow-y-hidden scroll-smooth pb-4 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-400">
            <section className="flex gap-8">
              {latestVideos.slice(0, 4).map((video, index) => (
                <div
                  key={index}
                  className="w-[265px] h-[200px] flex-shrink-0 transition-transform duration-200 hover:-translate-y-1 cursor-pointer"
                  onClick={() => openVideo(video)}
                >
                  <div className="relative w-[265px] h-[160px] overflow-hidden">
                    <img
                      src={video.thumbnail[0]?.url || video.thumbnail[0]?.high}
                      alt={video.title}
                      className="w-full h-full object-cover rounded-2xl"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="rounded-full w-10 h-10 flex items-center justify-center">
                        <svg
                          width="49"
                          height="34"
                          viewBox="0 0 49 34"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          {/* Red outer YouTube shape */}
                          <path
                            d="M24.478 0.0991859C27.475 0.0991859 30.3696 0.138561 33.1615 0.217311C35.9534 0.296061 38.0005 0.379186 39.3028 0.466686L41.2563 0.571686C41.2741 0.571686 41.4257 0.584811 41.7112 0.611061C41.9966 0.637311 42.2018 0.663561 42.3266 0.689811C42.4515 0.716061 42.6611 0.755436 42.9555 0.807936C43.2499 0.860436 43.5041 0.930436 43.7182 1.01794C43.9322 1.10544 44.182 1.21919 44.4674 1.35919C44.7529 1.49919 45.0294 1.66981 45.297 1.87106C45.5646 2.07231 45.8232 2.30419 46.073 2.56669C46.18 2.67169 46.3183 2.83356 46.4878 3.05231C46.6572 3.27106 46.9159 3.78294 47.2638 4.58794C47.6117 5.39294 47.8481 6.27669 47.9729 7.23919C48.1157 8.35919 48.2271 9.55356 48.3074 10.8223C48.3877 12.0911 48.4368 13.0842 48.4546 13.8017V18.4217C48.4724 20.9592 48.3119 23.4967 47.9729 26.0342C47.8481 26.9967 47.6251 27.8673 47.3039 28.6461C46.9828 29.4248 46.6974 29.9629 46.4476 30.2604L46.073 30.7067C45.8232 30.9692 45.5646 31.2011 45.297 31.4023C45.0294 31.6036 44.7529 31.7698 44.4674 31.9011C44.182 32.0323 43.9322 32.1417 43.7182 32.2292C43.5041 32.3167 43.2499 32.3867 42.9555 32.4392C42.6611 32.4917 42.4471 32.5311 42.3133 32.5573C42.1795 32.5836 41.9743 32.6098 41.6978 32.6361C41.4213 32.6623 41.2741 32.6754 41.2563 32.6754C36.7785 33.0079 31.1857 33.1742 24.478 33.1742C20.7851 33.1392 17.5784 33.0823 14.8579 33.0036C12.1373 32.9248 10.3489 32.8592 9.49258 32.8067L8.18135 32.7017L7.21801 32.5967C6.57578 32.5092 6.08964 32.4217 5.75961 32.3342C5.42957 32.2467 4.97466 32.0629 4.39487 31.7829C3.81507 31.5029 3.3111 31.1442 2.88295 30.7067C2.77591 30.6017 2.63765 30.4398 2.46817 30.2211C2.29869 30.0023 2.04002 29.4904 1.69214 28.6854C1.34427 27.8804 1.10789 26.9967 0.983011 26.0342C0.840293 24.9142 0.728795 23.7198 0.648516 22.4511C0.568237 21.1823 0.519178 20.1892 0.501338 19.4717V14.8517C0.483498 12.3142 0.644056 9.77669 0.983011 7.23919C1.10789 6.27669 1.33089 5.40606 1.652 4.62731C1.97312 3.84856 2.25855 3.31044 2.50831 3.01294L2.88295 2.56669C3.1327 2.30419 3.39138 2.07231 3.65898 1.87106C3.92657 1.66981 4.20309 1.49919 4.48852 1.35919C4.77396 1.21919 5.02372 1.10544 5.23779 1.01794C5.45187 0.930436 5.70609 0.860436 6.00044 0.807936C6.2948 0.755436 6.50442 0.716061 6.62929 0.689811C6.75417 0.663561 6.95933 0.637311 7.24477 0.611061C7.5302 0.584811 7.68184 0.571686 7.69968 0.571686C12.1775 0.256686 17.7702 0.0991859 24.478 0.0991859Z"
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
                    <h3 className="text-[12px] font-medium text-gray-800 font-sans">
                      {video.title}
                    </h3>
                  </div>
                </div>
              ))}
            </section>
          </div>
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

export default forwardRef(LatestVideos);
