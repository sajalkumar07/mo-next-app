import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import "./newss.css";
import "./newssapm.css";
import NewsSidebar from "../../Homepage/Structure/subcomponents/sidebarNewsWithSearch";

const ScrapNews = () => {
  const { news } = useParams();
  const cleanNewsId = news.split("-").slice(1).join("-");
  const newsUrl = `https://motoroctane.com/wp-json/postdata/api/${cleanNewsId}`;

  const [newsData, setNewsData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://motoroctane.com/wp-content/themes/motane/style.css";
    document.head.appendChild(link);

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

    if (window.innerWidth <= 768) {
      const ampUrl = `${window.location.origin}${window.location.pathname}/amp`;
      window.location.replace(ampUrl);
      return;
    }
  }, [news, newsUrl]);

  const shareLink = `https://motoroctane.com/news/${cleanNewsId}`;

  return (
    <section className="mt-36 md:mt-40 flex justify-between">
      <Helmet>
        <title>{newsData?.title || "Loading..."}</title>
        <meta
          name="description"
          content={newsData?.excerpt || "Latest news from Motoroctane"}
        />
      </Helmet>

      <div className="flex flex-col justify-center w-[70%]">
        {/* Center content container for the entire article including breadcrumb */}
        <div className="mx-auto w-[90%] flex flex-col px-4 md:px-16 mt-8">
          {/* Breadcrumb */}
          <div className="w-full flex items-center flex-wrap mb-5">
            <div className="flex justify-start w-full items-center">
              <div className="bg-gray-600 text-white py-2 px-10 clip-path-first">
                <a href="/" className="hover:underline">
                  <span className="text-white">Home</span>
                </a>
              </div>
              <div className="bg-gray-500 text-white py-2 px-10 -ml-10 text-center clip-path-middle">
                <a href="/news" className="hover:underline">
                  <span className="text-white">News</span>
                </a>
              </div>
              <div className="bg-gray-400 text-white py-2 px-10 -ml-10 clip-path-last truncate">
                {newsData && (
                  <span
                    dangerouslySetInnerHTML={{
                      __html: newsData.title.replace(/&#038;/g, "&"),
                    }}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Title */}
          {newsData && (
            <div className="mb-4">
              <h1
                className="text-2xl md:text-4xl font-bold text-gray-800 leading-tight"
                dangerouslySetInnerHTML={{
                  __html: newsData.title.replace(/&#038;/g, "&"),
                }}
              />
            </div>
          )}

          {/* Author Info */}
          {newsData && (
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
          )}

          {/* Share Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${shareLink}`}
              title="Share Motoroctane on Facebook"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M17,2V2H17V6H15C14.31,6 14,6.81 14,7.5V10H14L17,10V14H14V22H10V14H7V10H10V6A4,4 0 0,1 14,2H17Z"
                ></path>
              </svg>
              <span>Share On Facebook</span>
            </a>
            <a
              href={`https://twitter.com/intent/tweet?text=Check%20this%20out:%20${shareLink}`}
              title="Share Motoroctane on Twitter"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-blue-400 hover:bg-blue-500 text-white px-4 py-2 rounded-md transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.46,6C21.69,6.35 20.86,6.58 20,6.69C20.88,6.16 21.56,5.32 21.88,4.31C21.05,4.81 20.13,5.16 19.16,5.36C18.37,4.5 17.26,4 16,4C13.65,4 11.73,5.92 11.73,8.29C11.73,8.63 11.77,8.96 11.84,9.27C8.28,9.09 5.11,7.38 3,4.79C2.63,5.42 2.42,6.16 2.42,6.94C2.42,8.43 3.17,9.75 4.33,10.5C3.62,10.5 2.96,10.3 2.38,10C2.38,10 2.38,10 2.38,10.03C2.38,12.11 3.86,13.85 5.82,14.24C5.46,14.34 5.08,14.39 4.69,14.39C4.42,14.39 4.15,14.36 3.89,14.31C4.43,16 6,17.26 7.89,17.29C6.43,18.45 4.58,19.13 2.56,19.13C2.22,19.13 1.88,19.11 1.54,19.07C3.44,20.29 5.7,21 8.12,21C16,21 20.33,14.46 20.33,8.79C20.33,8.6 20.33,8.42 20.32,8.23C21.16,7.63 21.88,6.87 22.46,6Z"
                ></path>
              </svg>
              <span>Share On Twitter</span>
            </a>
          </div>

          {/* Article Content */}
          <div className="w-full overflow-hidden">
            {newsData ? (
              <div className="news-content">
                <style jsx>{`
                  .news-content p {
                    @apply text-lg leading-relaxed mb-5 text-gray-800;
                  }
                  .news-content h2,
                  .news-content h3,
                  .news-content h4 {
                    @apply text-orange-500 font-bold mt-8 mb-4;
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
                  .clip-path-first {
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
      </div>

      {/* Sidebar */}
      <div className="hidden md:block w-[30%]">
        <NewsSidebar />
      </div>
    </section>
  );
};

export default ScrapNews;
