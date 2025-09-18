import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Search as SearchIcon, X } from "lucide-react";

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  let activeRequestController = null;

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const debounce = (func, delay) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), delay);
    };
  };

  const handleSearch = async (term) => {
    if (activeRequestController) activeRequestController.abort();

    if (term.trim() === "" || term.length <= 2) {
      setSearchResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      activeRequestController = new AbortController();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/extra/search-product-webLandin`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ search: term }),
          signal: activeRequestController.signal,
        }
      );
      const data = await response.json();
      if (data.success) {
        const activeCars = data.cars.filter((cars) => cars?.active !== "false");
        setSearchResults(activeCars);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Error fetching search results:", error);
      }
    } finally {
      setLoading(false);
      activeRequestController = null;
    }
  };

  const debouncedSearch = debounce(handleSearch, 500);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setSearchResults([]);
      setLoading(false);
    } else if (searchTerm.length > 2) {
      debouncedSearch(searchTerm);
    }
  }, [searchTerm]);

  return (
    <div className="search-container">
      {/* CHANGE CAR button (for all devices now) */}

      <div className="mt-auto">
        <button
          className="flex justify-center items-center text-xs border border-gray-300 text-gray-700 hover:bg-[#AB373A] hover:text-white font-medium w-[140px] h-[30px] rounded-full transition-colors"
          onClick={openModal}
        >
          Change Car
        </button>
      </div>
      <div className="">
        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="w-[346px] h-[400px] rounded-[10px] bg-white overflow-hidden flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between w-full p-[20px] pb-4 border-b border-gray-100">
                <h4 className="text-[16px] font-semibold text-[#818181]">
                  SELECT YOUR <span className="text-[#B10819]">CAR</span>
                </h4>
                <button
                  onClick={closeModal}
                  className="text-black hover:text-[#B10819] transition-colors"
                >
                  <X className="text-2xl" />
                </button>
              </div>

              {/* Search input */}
              <div className="px-[20px] py-4 border-b border-gray-100">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search for a car..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full h-[40px] border border-slate-300 px-4 text-black"
                    autoFocus
                  />
                  <div className="absolute inset-y-0 right-0 flex justify-center items-center">
                    <button className="bg-black text-white w-[38px] h-[38px] flex justify-center items-center">
                      <SearchIcon size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Search results */}
              <div className="px-[20px] py-4 flex-1 overflow-y-auto scrollbar-hide">
                {loading ? (
                  <Skeleton count={6} height={50} />
                ) : searchResults.length > 0 ? (
                  searchResults.map((result) => (
                    <Link
                      key={result._id}
                      to={`/product/${result.carname}/${result._id}`}
                      className="py-3 px-4 hover:bg-gray-100 border-b border-gray-200 text-black block"
                      onClick={closeModal}
                    >
                      <div className="flex space-x-2 text-[12px] font-semibold font-[Montserrat]">
                        <span>{result.brand?.name}</span>
                        <span>{result.carname}</span>
                      </div>
                    </Link>
                  ))
                ) : (
                  searchTerm.trim() !== "" &&
                  searchTerm.length > 2 && (
                    <p className="py-3 px-4 text-gray-500">No Car Found</p>
                  )
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
