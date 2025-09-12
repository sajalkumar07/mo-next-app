import React, { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useParams } from "react-router-dom";
import backimage from "../../../Images/imagebrand.png";
import { Facebook, Youtube, Instagram, Globe } from "lucide-react";
import Adbanner1 from "../../Productpage/Structure/Adbanner2";
import People from "../../../Images/aboutus.jpg";
import FacebookIcon from "@mui/icons-material/Facebook";
import YouTubeIcon from "@mui/icons-material/YouTube";
import InstagramIcon from "@mui/icons-material/Instagram";
import GlobeIcon from "@mui/icons-material/Language";

const About = () => {
  const [visibleComponent, setVisibleComponent] = useState("AllImages");
  const [vvisibleComponent, setVVisibleComponent] = useState("AlllImages");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const cards = [
    {
      description:
        "India's foremost automotive expert and founder of MotorOctane, Rachit holds a BE in Automotive Engineering and oversees all editorial collaborations at MotorOctane.",
      image:
        "https://raw.githubusercontent.com/brandkiln/motor-octane-app/refs/heads/main/assets/image/Rachit_Hirani.png?token=GHSAT0AAAAAACZXMORTVDRUEXZ4T335AQV2Z23DYAA",
      name: "Rachit Hirani",
      designation: "Founder",
    },
    {
      description:
        "As co-founder and Business Strategist of MotorOctane, Dipika oversees all marketing and industry alliances at MotorOctane.",
      image:
        "https://raw.githubusercontent.com/brandkiln/motor-octane-app/refs/heads/main/assets/image/Dipika_Thawani.jpeg?token=GHSAT0AAAAAACZXMORSAHG7J2W3ITJ3KZCSZ23DZDQ",
      name: "Dipika Thawani",
      designation: "Business Strategist",
    },
    {
      description:
        "Karthik ensures that our processes run smoothly and effectively. His strategic approach and meticulous management ensure that MotorOctane operates seamlessly across mediums.",
      image:
        "https://raw.githubusercontent.com/brandkiln/motor-octane-app/refs/heads/main/assets/image/Karthik.jpg?token=GHSAT0AAAAAACZXMORSAT422YL3JT4JFRSGZ23DZOQ",
      name: "Karthik Shetty",
      designation: "Operations",
    },
    {
      description:
        "Oversees the production workflow, ensuring all content is crafted with precision and upholds our commitment to excellence.",
      image:
        "https://raw.githubusercontent.com/brandkiln/motor-octane-app/refs/heads/main/assets/image/Danish_Irfanshah.jpeg?token=GHSAT0AAAAAACZXMORTB34BHWDCJX4Y2USUZ23DZ2A",
      name: "Danish Irfanshah",
      designation: "Production",
    },
    {
      description:
        "Handles media sales and partnerships, driving revenue and expanding MotorOctane's reach through strategic deals and collaborations.",
      image:
        "https://raw.githubusercontent.com/brandkiln/motor-octane-app/refs/heads/main/assets/image/Sumit_Kumar.jpeg?token=GHSAT0AAAAAACZXMORTSHDZZYNGMW6QZBH2Z23D2BQ",
      name: "Sumit Kumar",
      designation: "Media Sales",
    },
  ];

  const cardContainerRef = useRef(null);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const isSwiping = useRef(false);

  // Auto-slide functionality (optional)
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isDragging) {
        setCurrentIndex((prevIndex) =>
          prevIndex === cards.length - 1 ? 0 : prevIndex + 1
        );
      }
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [isDragging, cards.length]);

  const moveSlide = (direction) => {
    const nextIndex = currentIndex + direction;
    if (nextIndex < 0) {
      setCurrentIndex(cards.length - 1);
    } else if (nextIndex >= cards.length) {
      setCurrentIndex(0);
    } else {
      setCurrentIndex(nextIndex);
    }
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  // Touch/Mouse handlers for mobile swipe
  const handleTouchStart = (e) => {
    const touch = e.touches ? e.touches[0] : e;
    touchStartX.current = touch.clientX;
    touchStartY.current = touch.clientY;
    isSwiping.current = false;
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    if (!touchStartX.current) return;

    const touch = e.touches ? e.touches[0] : e;
    const deltaX = touch.clientX - touchStartX.current;
    const deltaY = touch.clientY - touchStartY.current;

    // Determine if this is a horizontal swipe
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
      isSwiping.current = true;
      e.preventDefault(); // Prevent scrolling
    }
  };

  const handleTouchEnd = (e) => {
    if (!touchStartX.current || !isSwiping.current) {
      setIsDragging(false);
      return;
    }

    const touch = e.changedTouches ? e.changedTouches[0] : e;
    const deltaX = touch.clientX - touchStartX.current;
    const threshold = 50; // Minimum distance for swipe

    if (Math.abs(deltaX) > threshold) {
      if (deltaX > 0) {
        moveSlide(-1);
      } else {
        moveSlide(1);
      }
    }

    touchStartX.current = 0;
    touchStartY.current = 0;
    isSwiping.current = false;
    setIsDragging(false);
  };

  return (
    <div className="md:max-w-7xl w-full mx-auto md:px-4 px-0 sm:px-6 lg:px-8">
      <div className="mt-36">
        <div className="label flex justify-center items-center">
          <p className="varienttxt mt-3">
            <span className="text-wrapper">ABOUT US &</span>
            <span className="span">&nbsp;</span>
            <span className="text-wrapper-2">CAREER</span>
          </p>
        </div>
        <div className="flex justify-center">
          <img src={People} className="w-full max-w-4xl" alt="About us"></img>
        </div>
      </div>

      <section className="md:mt-[100px] mt-10 md:h-[220px] h-[200px]">
        {/* Mobile Grid Layout - 2x2 */}
        <div className="flex flex-col justify-start items-start">
          <div className="label d-flex">
            <p className="varienttxt mt-3 lefttext-mob">
              <span className="text-wrapper">FACT</span>
              <span className="span">&nbsp;</span>
              <span className="text-wrapper-2">FILE</span>
            </p>
          </div>
          <div className="flex justify-center items-center w-full space-x-4 mx-auto px-4 md:hidden font-[Montserrat]">
            <div className="bg-[#818181] p-4 flex flex-col items-center justify-center space-y-2 w-[110px] h-[80px]">
              <div className="bg-red-600 rounded-full p-3 flex items-center justify-center w-[30px] h-[30px]">
                <FacebookIcon sx={{ color: "white", fontSize: 15 }} />
              </div>
              <div className="text-center">
                <div className="text-white text-xs">780k</div>
                <div className="text-white text-xs">Followers</div>
              </div>
            </div>
            <div className="w-px bg-gray-400 h-[60px]"></div>
            <div className="bg-[#818181] p-4 flex flex-col items-center justify-center space-y-2 w-[110px] h-[80px]">
              <div className="bg-red-600 rounded-full p-3 flex items-center justify-center w-[30px] h-[30px]">
                <InstagramIcon sx={{ color: "white", fontSize: 15 }} />
              </div>
              <div className="text-center">
                <div className="text-white text-xs">1.1 Million</div>
                <div className="text-white text-xs">Followers</div>
              </div>
            </div>
            <div className="w-px bg-gray-400 h-[60px]"></div>
            <div className="bg-[#818181] p-4 flex flex-col items-center justify-center space-y-2 w-[110px] h-[80px]">
              <div className="bg-red-600 rounded-full p-3 flex items-center justify-center w-[30px] h-[30px]">
                <YouTubeIcon sx={{ color: "white", fontSize: 15 }} />
              </div>
              <div className="text-center">
                <div className="text-white text-xs">4.5 Million</div>
                <div className="text-white text-xs">Subscribers</div>
              </div>
            </div>
            <div className="w-px bg-gray-400 h-[60px]"></div>
            <div className="bg-[#818181] p-4 flex flex-col items-center justify-center space-y-2 w-[110px] h-[80px]">
              <div className="bg-red-600 rounded-full p-3 flex items-center justify-center w-[30px] h-[30px]">
                <GlobeIcon sx={{ color: "white", fontSize: 15 }} />
              </div>
              <div className="text-center">
                <div className="text-white text-xs">6 Million</div>
                <div className="text-white text-xs">Monthly Visitors</div>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Layout - Original horizontal layout */}
        <div className="hidden md:flex justify-center items-center w-full space-x-20 mt-10">
          <div className="flex flex-col justify-center items-center">
            <span className="bg-red-600 rounded-full p-3">
              <FacebookIcon sx={{ fontSize: 80, color: "white" }} />
            </span>
            <span className="text-red-500">780k</span>
            <span className="text-red-500">Followers</span>
          </div>
          <div className="flex flex-col justify-center items-center">
            <span className="icon-container bg-red-600 rounded-full p-3">
              <YouTubeIcon sx={{ fontSize: 80, color: "white" }} />
            </span>
            <span className="text-red-500">1.1 Million</span>
            <span className="text-red-500">Followers</span>
          </div>
          <div className="flex flex-col justify-center items-center">
            <span className="icon-container bg-red-600 rounded-full p-3">
              <InstagramIcon sx={{ fontSize: 80, color: "white" }} />
            </span>
            <span className="text-red-500">4.5 Million</span>
            <span className="text-red-500">Subscribers</span>
          </div>
          <div className="flex flex-col justify-center items-center">
            <span className="icon-container bg-red-600 rounded-full p-3">
              <GlobeIcon sx={{ fontSize: 80, color: "white" }} />
            </span>
            <span className="text-red-500">9 Million</span>
            <span className="text-red-500">Monthly Visitors</span>
          </div>
        </div>
      </section>

      <section className="flex flex-col -mt-10 md:mt-20 ">
        <section>
          <div className="label d-flex">
            <p className="varienttxt lefttext-mob">
              <span className="text-wrapper">OUR</span>
              <span className="span">&nbsp;</span>
              <span className="text-wrapper-2">MISSION</span>
            </p>
          </div>
        </section>
        <div className="mb-4">
          <div className="d-flex flex-column align-items-start h-100 ml-12">
            <div className="text-[14px] font-[Montserrat] font-bold">
              Car Simplified!
            </div>
            <span className="text-[12px] font-[Montserrat] font-medium">
              We love cars and understand them very well. However, most of us
              don't and end up losing a lot of our fortune buying lemons.{" "}
            </span>
          </div>
          <div className="md:flex hidden justify-center mt-6">
            <iframe
              width="560"
              height="315"
              src="https://www.youtube.com/embed/mAp6SC2BjnY?si=clIot2cnVQkoKfCl"
              title="YouTube video player"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerpolicy="strict-origin-when-cross-origin"
              allowfullscreen
              className="rounded-lg shadow-lg"
            ></iframe>
          </div>
        </div>
      </section>

      {/*slider section*/}
      <section className="flex justify-center pb-6 bg-[#D9D9D9] flex-col mt-4 h-[230px]">
        <section className="mt-4">
          <div className="label d-flex">
            <p className="varienttxt mt-3 lefttext-mob">
              <span className="text-wrapper">OUR</span>
              <span className="span">&nbsp;</span>
              <span className="text-wrapper-2">SERVICES</span>
            </p>
          </div>
        </section>
        <div className="w-full max-w-4xl mx-auto px-4">
          <div className="w-full">
            <div className="flex items-center -space-x-11">
              {/* Tab 1 - Content Creation */}
              <div
                className="relative flex-1 h-12 md:h-16 bg-[#5D5C5A] cursor-pointer flex items-center justify-center"
                style={{
                  clipPath:
                    "polygon(0% 0%, 100% 0%, 87% 94%, 93% 100%, 0% 100%)",
                }}
                onClick={() => setVisibleComponent("AllImages")}
              >
                <span
                  className={`text-[12px] font-[Montserrat] md:text-sm lg:text-base font-medium px-2 text-center leading-tight ${
                    visibleComponent === "AllImages"
                      ? "text-black"
                      : "text-white"
                  }`}
                >
                  CONTENT CREATION
                </span>
              </div>
              {/* Tab 2 - Car Consultation */}
              <div
                className="relative flex-1 h-12 md:h-16 bg-[#828282] cursor-pointer flex items-center justify-center"
                style={{
                  clipPath:
                    "polygon(13% 0%, 100% 0%, 100% 100%, 89% 100%, 0% 102%)",
                }}
                onClick={() => setVisibleComponent("AllImages2")}
              >
                <span
                  className={`text-[12px] font-[Montserrat] md:text-sm lg:text-base font-medium px-2 text-center leading-tight ${
                    visibleComponent === "AllImages2"
                      ? "text-black"
                      : "text-white"
                  }`}
                >
                  CAR CONSULTATION
                </span>
              </div>
            </div>
          </div>

          {/* Content Display */}
          <div className="w-full mt-4">
            {visibleComponent === "AllImages" && (
              <div className="bg-white p-6 shadow-md shadow-blck/30 border rounded-lg">
                <p className="text-black text-sm md:text-base leading-relaxed font-medium font-[Montserrat]">
                  If you are an automotive business and need to appeal to
                  audiences via premium content, we are your one-stop shop. As
                  India's No 1 automotive channel, we are happy to support your
                  needs.
                </p>
                <div className="flex justify-center mt-4">
                  <button className="text-xs bg-white border shadow-md shadow-black/30 py-2 px-4 font-medium font-[Montserrat] hover:bg-gray-50 transition-colors">
                    Let us help you!
                  </button>
                </div>
              </div>
            )}
            {visibleComponent === "AllImages2" && (
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <p className="text-black text-sm md:text-base leading-relaxed font-medium font-[Montserrat]">
                  Landing up with a car that doesn't suit your needs can be an
                  expensive mistake and a long-term regret. Over 10,000 car
                  buyers have availed our consulting services for choosing their
                  ride.
                </p>
                <div className="flex justify-center mt-4">
                  <button className="text-xs bg-white border shadow-md shadow-black/30 py-2 px-4 font-medium font-[Montserrat] hover:bg-gray-50 transition-colors">
                    Let us help you!
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="flex flex-col bg-[#F8F0F5] border-t-[20px] border-red-700 py-8">
        <section className="mt-4">
          <div className="label d-flex">
            <p className="varienttxt mt-3 lefttext-mob">
              <span className="text-wrapper">WE ARE</span>
              <span className="span">&nbsp;</span>
              <span className="text-wrapper-2">MOTOROCTANE</span>
            </p>
          </div>
        </section>
        <section className="relative w-full overflow-hidden mb-4 px-4">
          {/* Desktop Navigation Buttons */}
          <button
            className="hidden md:flex absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white border border-gray-300 rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-200 hover:bg-gray-50"
            onClick={() => moveSlide(-1)}
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>

          <button
            className="hidden md:flex absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white border border-gray-300 rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-200 hover:bg-gray-50"
            onClick={() => moveSlide(1)}
          >
            <ChevronRight className="w-6 h-6 text-gray-600" />
          </button>

          {/* Cards Container */}
          <div
            className="flex transition-transform duration-500 ease-in-out cursor-grab active:cursor-grabbing"
            ref={cardContainerRef}
            style={{
              transform: `translateX(-${
                currentIndex * (window.innerWidth < 768 ? 100 : 33.333)
              }%)`,
            }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleTouchStart}
            onMouseMove={handleTouchMove}
            onMouseUp={handleTouchEnd}
            onMouseLeave={handleTouchEnd}
          >
            {cards.map((card, index) => (
              <div key={index} className="flex-shrink-0 w-full md:w-1/3 px-4">
                <div className="font-[Montserrat] bg-white border shadow-md shadow-black/30 rounded-3xl w-full max-w-[230px] h-[300px] mx-auto flex flex-col items-center justify-center p-6 gap-16 hover:shadow-xl transition-shadow duration-300">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                    <img
                      src={card.image}
                      alt={card.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src =
                          "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik01MCA1MEMyMi4zODYgNTAgMCA3Mi4zODYgMCAxMDBIMTAwQzEwMCA3Mi4zODYgNzcuNjE0IDUwIDUwIDUwWiIgZmlsbD0iI0Q5REREREQiLz4KPGNpcmNsZSBjeD0iNTAiIGN5PSIzNyIgcj0iMTIiIGZpbGw9IiNEOURERERkIi8+Cjwvc3ZnPgo=";
                      }}
                    />
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-bold text-gray-800 mb-1">
                      {card.name}
                    </h3>
                    <p className="text-sm font-medium text-gray-600 mb-3">
                      {card.designation}
                    </p>
                    <p className="text-xs text-gray-600 font-medium leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Dot Indicators */}
          <div className="flex justify-center space-x-2 mt-6">
            {cards.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  currentIndex === index
                    ? "bg-red-600"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
        </section>
      </div>

      <Adbanner1></Adbanner1>

      <section className="flex flex-col py-8">
        <section>
          <div className="label d-flex">
            <p className="varienttxt lefttext-mob">
              <span className="text-wrapper">OUR</span>
              <span className="span">&nbsp;</span>
              <span className="text-wrapper-2">WORK CULTURE</span>
            </p>
          </div>
        </section>
        <div className="mb-4 px-4">
          <div className="d-flex flex-column align-items-start h-100 ml-12">
            <span className="text-[12px] font-[Montserrat] font-medium">
              Fuelled by passion, out yound and dynamic team, hailing from all
              corners of India, is united is delivering the fines automotive
              content. Guided by a love for cars, we embrace excellence daily.
            </span>
          </div>
          <div className="md:flex hidden justify-center mt-6">
            <iframe
              width="560"
              height="315"
              src="https://www.youtube.com/embed/mAp6SC2BjnY?si=clIot2cnVQkoKfCl"
              title="YouTube video player"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerpolicy="strict-origin-when-cross-origin"
              allowfullscreen
              className="rounded-lg shadow-lg"
            ></iframe>
          </div>
        </div>
      </section>

      <section className="flex flex-col justify-center pb-8 px-4">
        <section>
          <div className="label d-flex">
            <p className="varienttxt lefttext-mob">
              <span className="text-wrapper">WE NEED</span>
              <span className="span">&nbsp;</span>
              <span className="text-wrapper-2">YOU</span>
            </p>
          </div>
        </section>
        <div className="flex flex-col w-full max-w-4xl mx-auto">
          <div className="flex justify-center items-center">
            <div className="flex justify-center items-center -space-x-14 w-full">
              <div
                className="w-33 h-[35px] bg-[#5D5C5A] flex justify-center items-center"
                style={{
                  clipPath:
                    "polygon(0% 0%, 100% 0, 89% 50%, 78% 100%, 0% 100%)",
                }}
              >
                <span className="text-center font-[Montserrat] text-white flex justify-center items-center mr-4">
                  CONTENT CREATOR
                </span>
              </div>
              <div
                className="w-33 h-[35px] bg-[#828282] flex justify-center items-center"
                style={{
                  clipPath:
                    "polygon(20% 0%, 100% 0, 89% 50%, 78% 100%, 0% 100%)",
                }}
              >
                <span className="text-center font-[Montserrat] text-white flex justify-center items-center">
                  VIDEO EDITOR
                </span>
              </div>
              <div
                className="w-33 h-[35px] bg-[#AFACAD] flex justify-center items-center"
                style={{
                  clipPath:
                    "polygon(20% 0, 100% 0, 100% 50%, 100% 100%, 0 100%)",
                }}
              >
                <span className="text-center font-[Montserrat] text-white flex justify-center items-center">
                  MORE
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-center items-center mt-4">
            <div className="w-full bg-white border shadow-md shadow-black/30 rounded-lg">
              <p className="p-4 font-medium font-[Montserrat]">
                Do you want to be a part of Asia's largest automotive YouTube
                channel? Here is a golden opportunity! Use your talent and make
                a difference everyday while still being part of something
                exciting!
              </p>
              <div className="flex justify-center items-center w-full p-4">
                <button className="mt-2 text-xs bg-white border shadow-md shadow-black/30 py-2 px-4 font-medium font-[Montserrat] hover:bg-gray-50 transition-colors">
                  SUBMIT
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
