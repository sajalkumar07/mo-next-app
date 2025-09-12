import React, { useEffect, useState } from "react";

const StoriesSection = () => {
  const [stories, setStories] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const fetchStories = async () => {
    try {
      const response = await fetch(
        "http://145.223.22.192:3060/api/web-stories"
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setStories(data);
    } catch (error) {
      console.error("Error fetching stories:", error);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  const handleNext = () => {
    setCurrentIndex((currentIndex + 1) % stories.length);
  };

  const handlePrevious = () => {
    setCurrentIndex((currentIndex - 1 + stories.length) % stories.length);
  };

  const containerStyle = {
    transform: `translateX(-${currentIndex * 17.4}%)`,
    transition: "transform 0.3s ease",
  };

  return (
    <div className="center_storie">
      <section className="brand_storie d-flex align-items-center">
        <button
          className="bg-[#818181] p-2 m-4 md:m-0 rounded-full text-white flex justify-center items-center"
          onClick={handlePrevious}
        >
          <ion-icon name="chevron-back-outline"></ion-icon>
        </button>
        <div className="w-full overflow-x-scroll">
          <div className="flex" style={containerStyle}>
            {stories.map((story, index) => (
              <a
                href={story.url}
                target="_blank"
                rel="noopener noreferrer"
                key={index}
                className="px-3" // Added padding on x-axis for each story
              >
                <div className="">
                  <img
                    src={story.image}
                    alt={story.title}
                    className="h-[255px] w-[130px] rounded-t-3xl relative object-cover -z-1"
                  />
                  <div className="p-1 bg-gradient-to-b from-[#4B4B4B] to-black w-[130px] h-[60px] rounded-b-3xl">
                    <div
                      className="font-[Montserrat] text-white text-[10px] text-ellipsis w-[120px]"
                      title={story.title}
                    >
                      {story.title}
                    </div>
                    {/* <p className="font-[Montserrat] text-white text-[10px]">
                      {story.authorDate}
                    </p> */}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
        <button
          className="bg-[#818181] p-2 m-4 md:m-0 rounded-full text-white flex justify-center items-center"
          onClick={handleNext}
        >
          <ion-icon name="chevron-forward-outline"></ion-icon>
        </button>
      </section>
    </div>
  );
};

const MoStories = () => {
  return (
    <section className="mo-storiesec">
      <div className="label">
        <p className="block md:flex justify-center items-center text-[25px] font-bold  ml-[20px] mb-2 mt-4">
          <span className="text-wrapper text-uppercase">Mo</span>
          <span className="span">&nbsp;</span>
          <span className="text-wrapper-2 text-uppercase">Stories</span>
        </p>
      </div>
      <StoriesSection />
    </section>
  );
};

export default MoStories;
