import React, { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import "../../../App.css";

import { Search } from "lucide-react";

const ScrapNews = () => {
  const { news } = useParams();
  const cleanNewsId = news.split("-").slice(1).join("-");
  const newsUrl = `https://motoroctane.com/wp-json/postdata/api/${cleanNewsId}`;
  const postsUrl = "https://motoroctane.com/wp-json/allpost/v1/api?page=1";

  const [newsData, setNewsData] = useState(null);
  const [relatedNews, setRelatedNews] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("POPULAR");
  const [activeFilter, setActiveFilter] = useState("Latest");
  const [loading, setLoading] = useState(false);
  const [articleDetails, setArticleDetails] = useState([]);
  const [visibleItems, setVisibleItems] = useState(9);
  const [loadingMore, setLoadingMore] = useState(false);
  const loadedArticles = new Set();

  // Fetch main news data
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(newsUrl, {
          method: "GET",
          headers: {
            Authorization: "Bearer e3def277-dd44-4dbf-a67d-d709e28ab5cc",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        // Replace specific links in content
        if (data.content) {
          const updatedContent = data.content.replace(
            /https:\/\/motoroctane.com\/news\/\d+-[a-z0-9-]+/g,
            (match) => {
              return match.replace("https://motoroctane.com", "");
            }
          );
          data.content = updatedContent;
        }

        setNewsData(data);
      } catch (err) {
        console.error("Error fetching news:", err.message);
        setError(err.message);
      }
    };

    fetchNews();
  }, [news]);

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

  const limitDescription = (description) => {
    const words = description?.split(" ");
    return words?.slice(0, 25).join(" ") + (words?.length > 25 ? "..." : "");
  };

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

  useEffect(() => {
    const fetchRelatedNews = async () => {
      try {
        const response = await fetch(postsUrl, {
          method: "GET",
          headers: {
            Authorization: "Bearer e3def277-dd44-4dbf-a67d-d709e28ab5cc",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const postsData = data.posts;

        if (Array.isArray(postsData)) {
          // Filter out posts with the same ID as the current news
          const filteredPosts = postsData.filter((post) => {
            const cleanedLink = post.link.replace(/^\d+-/, "");
            return cleanedLink !== cleanNewsId;
          });

          // Fetch full details for the first 2 related posts, excluding the current news
          const relatedDetails = await Promise.all(
            filteredPosts.slice(0, 2).map(async (post) => {
              const cleanedLink = post.link.replace(/^\d+-/, "");
              const relatedResponse = await fetch(
                `https://motoroctane.com/wp-json/postdata/api/${cleanedLink}`,
                {
                  method: "GET",
                  headers: {
                    Authorization:
                      "Bearer e3def277-dd44-4dbf-a67d-d709e28ab5cc",
                  },
                }
              );

              if (!relatedResponse.ok) {
                throw new Error(
                  `HTTP error! Status: ${relatedResponse.status}`
                );
              }

              return relatedResponse.json();
            })
          );

          setRelatedNews(relatedDetails);
        } else {
          console.error(
            "Expected posts data to be an array, but got:",
            postsData
          );
          setError("Failed to fetch related posts: Invalid data format");
        }
      } catch (err) {
        console.error("Error fetching related posts:", err.message);
        setError(err.message);
      }
    };

    fetchRelatedNews();
  }, []);

  const shareLink = `https://motoroctane.com/news/${cleanNewsId}`;

  const CarDetailNav = [
    { title: "Latest" },
    { title: "Cars" },
    { title: "Bike" },
    { title: "Electric" },
    { title: "Upcoming" },
  ];

  return (
    <section className="mt-36 md:mt-40 font-sans ">
      <Helmet>
        <title>{newsData?.title || "Loading..."}</title>
        <meta
          name="description"
          content={newsData?.excerpt || "Latest news from Motoroctane"}
        />
      </Helmet>

      <div className=" onlyphoneme ">
        <div className="d-flex -mt-5 mb-4 align-items-center w-100">
          {/* Buttons */}
          <div
            className="model-first-shape w-100"
            style={{
              clipPath: "polygon(0% 0%, 100% 0px, 87% 94%, 93% 100%, 0% 100%)",
            }}
            onClick={() => setActiveTab("   ")}
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
              <span className="text-inside-shape3-nerew ml-5">Consult us</span>
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
          <div className="relative w-full max-w-5xl md:max-w-5xl">
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

      <div className="w-[100%] flex md:justify-start justify-center items-center overflow-auto">
        <div className="flex justify-center  space-x-2 md:space-x-4 pb-4 w-full">
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

      <div className="mx-auto w-[100%] flex flex-col md:flex-row md:space-x-6 px-4 md:px-16">
        <div className="w-full overflow-hidden">
          {newsData ? (
            <div className="p-4 md:p-6">
              {/* Breadcrumb */}
              <div className="md:block hidden">
                <div></div>
              </div>

              {/* Title */}
              <div className="mb-4">
                <h1
                  className="text-2xl md:text-4xl font-bold text-gray-800 leading-tight"
                  dangerouslySetInnerHTML={{
                    __html: newsData.title.replace(/&#038;/g, "&"),
                  }}
                />
              </div>

              {/* Author Info */}
              <div className="pb-4 mb-4 border-b border-gray-200">
                <div>
                  <span className="text-gray-500 text-sm block">
                    {newsData.date}
                  </span>
                  <span className="text-gray-700">
                    By{" "}
                    <a
                      href="https://motoroctane.com/author/prathamesh-shanbhag"
                      className="text-orange-500 hover:underline font-medium"
                    >
                      Prathamesh Shanbhag
                    </a>
                  </span>
                </div>
              </div>

              {/* Share Buttons */}
              <div className="flex flex-col sm:flex-row gap-1 w-1/2">
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${shareLink}`}
                  title="Share Motoroctane on Facebook"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white p-2.5 transition-colors"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M17,2V2H17V6H15C14.31,6 14,6.81 14,7.5V10H14L17,10V14H14V22H10V14H7V10H10V6A4,4 0 0,1 14,2H17Z"
                    ></path>
                  </svg>
                  <button className="text-sm">Share On Facebook</button>
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?text=Check%20this%20out:%20${shareLink}`}
                  title="Share Motoroctane on Twitter"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 bg-blue-400 hover:bg-blue-500 text-white p-2.5 transition-colors"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.46,6C21.69,6.35 20.86,6.58 20,6.69C20.88,6.16 21.56,5.32 21.88,4.31C21.05,4.81 20.13,5.16 19.16,5.36C18.37,4.5 17.26,4 16,4C13.65,4 11.73,5.92 11.73,8.29C11.73,8.63 11.77,8.96 11.84,9.27C8.28,9.09 5.11,7.38 3,4.79C2.63,5.42 2.42,6.16 2.42,6.94C2.42,8.43 3.17,9.75 4.33,10.5C3.62,10.5 2.96,10.3 2.38,10C2.38,10 2.38,10 2.38,10.03C2.38,12.11 3.86,13.85 5.82,14.24C5.46,14.34 5.08,14.39 4.69,14.39C4.42,14.39 4.15,14.36 3.89,14.31C4.43,16 6,17.26 7.89,17.29C6.43,18.45 4.58,19.13 2.56,19.13C2.22,19.13 1.88,19.11 1.54,19.07C3.44,20.29 5.7,21 8.12,21C16,21 20.33,14.46 20.33,8.79C20.33,8.6 20.33,8.42 20.32,8.23C21.16,7.63 21.88,6.87 22.46,6Z"
                    ></path>
                  </svg>
                  <button className="text-sm">Share On Twitter</button>
                </a>
              </div>

              {/* Article Content */}
              <div className="mt-6 news-content">
                <style jsx>{`
                  .news-content p {
                    @apply text-lg leading-relaxed mb-5 text-gray-800;
                  }
                  .news-content h2,
                  .news-content h3,
                  .news-content h4 {
                    @apply text-red-500 font-bold mt-8 mb-4;
                  }
                  .news-content h2 {
                    @apply text-2xl;
                  }
                  .news-content h3 {
                    @apply text-xl;
                  }
                  .news-content h4 {
                    @apply text-lg;
                  }
                  .news-content iframe {
                    @apply w-full h-96 border-0 my-5 md:my-6;
                  }
                  .news-content img {
                    @apply w-full h-auto rounded-lg my-5;
                  }

                  .news-content a {
                    @apply text-blue-600 hover:text-blue-800 font-medium;
                  }

                  ip-path-first {
                    clip-path: polygon(
                      0% 0%,
                      100% 0,
                      89% 50%,
                      78% 100%,
                      0% 100%
                    );
                  }
                  .clip-path-middle {
                    clip-path: polygon(
                      21% 0,
                      100% 0,
                      89% 50%,
                      78% 100%,
                      0 100%
                    );
                  }
                  .clip-path-last {
                    clip-path: polygon(
                      6% 0,
                      100% 0,
                      100% 50%,
                      100% 100%,
                      0 100%
                    );
                  }
                  @media (max-width: 768px) {
                    .news-content iframe {
                      @apply h-56;
                    }
                  }
                `}</style>
                <div dangerouslySetInnerHTML={{ __html: newsData.content }} />
              </div>
            </div>
          ) : error ? (
            <div className="p-5 bg-red-50 border border-red-200 text-red-700 rounded-md">
              Error: {error}
            </div>
          ) : (
            <div className="p-10 text-center text-orange-500 text-xl">
              Loading...
            </div>
          )}
        </div>
      </div>
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
    </section>
  );
};

export default ScrapNews;
