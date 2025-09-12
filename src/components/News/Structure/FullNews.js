import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import MoStories from "../../Homepage/Structure/mostories";
import CarComparison from "../../Homepage/Structure/carcomparision";
import FeatureCar from "../../Homepage/Structure/featuredcars";
import Adbanner1 from "../../Homepage/Structure/Adbanner1";
import NewsSidebar from "../../Homepage/Structure/subcomponents/trendingNews";
import { Search } from "lucide-react";

const NewsPage = () => {
  const [articleDetails, setArticleDetails] = useState([]);
  const [visibleItems, setVisibleItems] = useState(9);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [activeFilter, setActiveFilter] = useState("Latest");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("POPULAR");

  // A set to track already loaded article IDs (or links) to avoid duplicates
  const loadedArticles = new Set();

  // Navigation items
  const CarDetailNav = [
    { title: "Latest" },
    { title: "Cars" },
    { title: "Bike" },
    { title: "Electric" },
    { title: "Upcoming" },
  ];

  // Fetch filtered articles based on active filter
  useEffect(() => {
    const fetchFilteredArticles = async () => {
      try {
        if (activeFilter === "Latest") {
          fetchArticles();
        } else {
          setLoading(true);
          const response = await fetch(
            `https://motoroctane.com/wp-json/allpost/v1/search?query=${activeFilter}&page=1`,
            {
              headers: {
                Authorization: "Bearer e3def277-dd44-4dbf-a67d-d709e28ab5cc",
              },
            }
          );

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          setArticleDetails(data?.posts || []);
          setVisibleItems(9); // Reset visible items when filter changes
        }
      } catch (error) {
        console.error("Error fetching filtered articles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredArticles();
  }, [activeFilter]);

  // Fetch articles
  const fetchArticles = async (page = 1) => {
    try {
      setLoading(page === 1);
      setLoadingMore(page > 1);

      const response = await fetch(
        `https://motoroctane.com/wp-json/allpost/v1/api?page=${page}`,
        {
          headers: {
            Authorization: "Bearer e3def277-dd44-4dbf-a67d-d709e28ab5cc",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data?.posts?.length > 0) {
        // Filter out articles that have already been loaded
        const newArticles = data.posts.filter((article) => {
          if (loadedArticles.has(article.link)) {
            return false; // Skip if the article is already loaded
          }
          loadedArticles.add(article.link); // Mark the article as loaded
          return true;
        });

        // If new articles are found, append them to the state
        setArticleDetails((prevDetails) => [...prevDetails, ...newArticles]);
      }
    } catch (error) {
      console.error("Error fetching articles:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Initial articles fetch
  useEffect(() => {
    fetchArticles();
  }, []);

  // Load more items functionality
  const loadMoreItems = () => {
    // Increase visible items by 9
    setVisibleItems((prevVisibleItems) => prevVisibleItems + 9);

    // If we're close to the end of currently loaded articles, fetch more
    if (visibleItems + 12 >= articleDetails.length) {
      setCurrentPage((prevPage) => {
        const nextPage = prevPage + 1;
        fetchArticles(nextPage);
        return nextPage;
      });
    }
  };

  // Filter articles based on search term and active filter
  const filteredArticles = articleDetails.filter((article) => {
    const searchFilter =
      article.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.description?.toLowerCase().includes(searchTerm.toLowerCase());

    if (activeFilter === "Latest") {
      return searchFilter;
    }

    const categoryFilter =
      article.title?.toLowerCase().includes(activeFilter.toLowerCase()) ||
      article.description?.toLowerCase().includes(activeFilter.toLowerCase());

    return searchFilter && categoryFilter;
  });

  // Function to limit description to 25 words
  const limitDescription = (description) => {
    const words = description?.split(" ");
    return words?.slice(0, 25).join(" ") + (words?.length > 25 ? "..." : "");
  };

  return (
    <>
      <div className="mt-32  ">
        <Helmet>
          <title>Motoroctane | News</title>
        </Helmet>
        <div className="md:hidden block w-full">
          {" "}
          <Adbanner1 className="w-full" />
        </div>
        {/*Bread crum menu*/}
        <div className=" onlyphoneme ">
          <div className="d-flex align-items-center w-100">
            {/* Buttons */}
            <div
              className="model-first-shape w-100"
              style={{
                clipPath:
                  "polygon(0% 0%, 100% 0px, 87% 94%, 93% 100%, 0% 100%)",
              }}
              onClick={() => setActiveTab("Home")}
            >
              <Link to="/">
                <span className="text-inside-shape3-nerew">Home</span>
              </Link>
            </div>
            <div
              className="model-second-shape w-100"
              style={{
                clipPath:
                  "polygon(13% 0px, 100% 0px, 89% 100%, 100% 100%, 0px 102%)",
              }}
              onClick={() => setActiveTab("NEWS")}
            >
              <Link to="/news">
                <span className="text-inside-shape3-nerew ml-5">News</span>
              </Link>
            </div>
            <div
              className="model-three-shape w-100"
              style={{
                clipPath: "polygon(13% 0, 100% 0, 100% 50%, 100% 100%, 0 100%)",
              }}
              onClick={() => setActiveTab("Consult us")}
            >
              <Link to="https://carconsultancy.in/">
                <span className="text-inside-shape3-nerew ml-5">
                  Consult us
                </span>
              </Link>
            </div>
          </div>
        </div>
        {/* Search Section */}
        <div className="flex justify-center flex-col items-center ">
          <div className="label ">
            <p className="FIND-YOUR-PERFECT mt-3 jgjfk ">
              <span className="text-wrapper">LOOK UP</span>
              <span className="span">&nbsp;</span>
              <span className="text-wrapper-2">NEWS</span>
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="md:block hidden">
            <ul className="search_tabs w-full flex justify-center space-x-4 ">
              <div className="full_tabs active">
                <li>SEARCH</li>
              </div>
              <div className="full_tabs">
                <li>ASSIST ME</li>
              </div>
              <div className="full_tabs">
                <li>CONSULT US</li>
              </div>
            </ul>
          </div>

          {/* Search Input */}
          <div className="p-4 flex justify-center items-center w-full">
            <div className="relative w-full max-w-md md:max-w-5xl">
              <input
                className="w-full py-3 px-2 pr-12 border border-black"
                type="text"
                placeholder="Ex: Tata Nixcon"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer" />
            </div>
          </div>
        </div>

        {/* Main Content Section */}
        <section className="flex flex-col md:flex-row justify-between mt-8">
          {/* Main Content Area */}
          <div className="w-[100%] md:w-[70%] px-4 ">
            <div className="flex justify-center items-center flex-col ">
              {/* Navigation Filter - Full Width and Centered */}
              <div className="w-full flex md:justify-start justify-center items-center overflow-auo">
                <div className="flex justify-center  space-x-2 md:space-x-4 pb-4 min-w-max w-1/2">
                  {CarDetailNav.map((item, index) => (
                    <div
                      key={index}
                      className={`
                       px-4 py-2 text-lg  md:w-auto flex justify-center items-center
                        ${
                          activeFilter === item.title
                            ? "bg-[#B10819] text-white"
                            : "bg-white text-[#8B8A8A] border border-gray-300 hover:bg-gray-100"
                        }
                      `}
                      onClick={() => setActiveFilter(item.title)}
                    >
                      {item.title}
                    </div>
                  ))}
                </div>
              </div>

              {/* Articles Grid - Centered on Mobile */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12 content-center justify-items-center w-full">
                {filteredArticles.slice(0, visibleItems).map((item, index) => (
                  <div className="w-full max-w-[300px]" key={index}>
                    <Link to={`/news/${item.link}`}>
                      <div className="card-body-com">
                        <img
                          src={item.featured_image}
                          alt="news"
                          className="com-image w-full"
                        />
                        <div>
                          <div
                            className="news-title mt-1"
                            dangerouslySetInnerHTML={{
                              __html: item.title.replace(/&#038;/g, "&"),
                            }}
                          />
                          <p className="news-description">
                            {limitDescription(item.description)}
                          </p>
                          <Link
                            className="news-url d-flex justify-content-end mt-1"
                            to={`/news/${item.link}`}
                          >
                            Read More
                          </Link>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Load More Button */}
            {visibleItems < filteredArticles.length && (
              <button
                onClick={loadMoreItems}
                className="flex justify-center items-center bg-[#AB373A] text-white px-4 py-2 mt-6 mx-auto"
              >
                {loadingMore ? (
                  <div
                    className="spinner-border text-danger"
                    role="status"
                  ></div>
                ) : (
                  "Load More"
                )}
              </button>
            )}
          </div>

          {/* Sidebar - Hidden on Mobile */}
          <div className="hidden md:block w-[30%]">
            <NewsSidebar />
          </div>
        </section>
      </div>

      {/* Additional Sections */}
      <Adbanner1 />
      <MoStories />
      <FeatureCar />
      <CarComparison />
    </>
  );
};

export default NewsPage;
