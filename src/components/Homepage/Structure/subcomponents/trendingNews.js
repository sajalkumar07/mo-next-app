import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CarBanner from "../../../../Images/carbanner.png";

const NewsSidebar = () => {
  const [trendingArticles, setTrendingArticles] = useState([]);
  const [visibleTrendingArticles, setVisibleTrendingArticles] = useState(5);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch trending articles for the sidebar
  const fetchTrendingArticles = async (page = 1) => {
    try {
      setLoading(true);
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
        // Append new articles to existing trending articles
        setTrendingArticles((prevArticles) => [
          ...prevArticles,
          ...data.posts.slice(0, 5), // Limit to 5 new articles per load
        ]);
      }
    } catch (error) {
      console.error("Error fetching trending articles:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrendingArticles();
  }, []);

  const loadMoreTrendingArticles = () => {
    // Increase visible trending articles
    setVisibleTrendingArticles((prev) => prev + 5);

    // If we're close to the end of currently loaded articles, fetch more
    if (visibleTrendingArticles + 5 >= trendingArticles.length) {
      setCurrentPage((prevPage) => {
        const nextPage = prevPage + 1;
        fetchTrendingArticles(nextPage);
        return nextPage;
      });
    }
  };

  return (
    <div className="w-full flex flex-col items-center  p-4">
      {/* Advertisement Banner */}
      <div className="mb-4">
        <img
          src={CarBanner}
          alt="Ad"
          className="w-[350px] h-[500px] object-cover"
        />
      </div>

      {/* Trending News Section */}
      <div className="w-[90%]">
        <div className="flex gap-1 items-center">
          <h2 className="text-black">TRENDING</h2>
          <h2 className="text-red-500"> NEWS</h2>
        </div>

        {loading && trendingArticles.length === 0 ? (
          <div className="text-center py-4 text-gray-600">Loading...</div>
        ) : (
          <>
            {trendingArticles
              .slice(0, visibleTrendingArticles)
              .map((item, index) => (
                <div
                  className="trending-news-item mb-4 border-gray-200"
                  key={index}
                >
                  <Link
                    to={`/news/${item.link}`}
                    className="block no-underline text-inherit hover:text-gray-700"
                  >
                    <div className="flex items-center">
                      <div className="trending-content flex-grow">
                        <div
                          className="text-sm font-semibold leading-tight"
                          dangerouslySetInnerHTML={{
                            __html: item.title.replace(/&#038;/g, "&"),
                          }}
                        />
                      </div>

                      <div className="trending-image w-20 ml-2">
                        <img
                          src={item.featured_image}
                          alt="trending news"
                          className="w-full h-20 object-cover"
                        />
                      </div>
                    </div>
                  </Link>
                </div>
              ))}

            {/* Show More Button */}
            {visibleTrendingArticles < trendingArticles.length && (
              <div className="text-center my-4">
                <button
                  onClick={loadMoreTrendingArticles}
                  className="inline-block px-4 py-2 bg-red-600 text-white 
                             hover:bg-gray-200 transition-colors duration-300 
                             focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  {loading ? "Loading..." : "Show More"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default NewsSidebar;
