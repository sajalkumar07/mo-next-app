// import { useState, useEffect } from "react";
// import { useSearchParams, useNavigate, Link } from "react-router-dom";

// export default function SearchResultsPage() {
//   const [searchParams] = useSearchParams();
//   const navigate = useNavigate();
//   const [allCars, setAllCars] = useState([]);
//   const [filteredCars, setFilteredCars] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [loadingMore, setLoadingMore] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [hasMorePages, setHasMorePages] = useState(true);
//   const [parsedSearchParams, setParsedSearchParams] = useState({});
//   const [totalLoadedPages, setTotalLoadedPages] = useState(0);

//   // Parse URL parameters
//   useEffect(() => {
//     const params = {
//       carType: searchParams.get("carType") || "new",
//       minPrice: searchParams.get("minPrice") || "",
//       maxPrice: searchParams.get("maxPrice") || "",
//       transmission: searchParams.get("transmission") || "",
//       fuelType: searchParams.get("fuelType") || "",
//       seatingCapacity: searchParams.get("seatingCapacity") || "",
//       bootSpace: searchParams.get("bootSpace") || "",
//       brand: searchParams.get("brand") || "",
//       features: searchParams.get("features")
//         ? searchParams.get("features").split(",")
//         : [],
//     };
//     setParsedSearchParams(params);

//     // Reset state when search params change
//     setAllCars([]);
//     setFilteredCars([]);
//     setCurrentPage(1);
//     setTotalLoadedPages(0);
//     setHasMorePages(true);

//     loadInitialData();
//   }, [searchParams]);

//   // Debug logs
//   useEffect(() => {
//     console.log("📊 Total cars loaded:", allCars.length);
//     console.log("🔍 Filtered cars count:", filteredCars.length);
//     console.log("📄 Current page:", currentPage);
//     console.log("📑 Total loaded pages:", totalLoadedPages);
//     console.log("🔄 Has more pages:", hasMorePages);
//   }, [allCars, filteredCars, currentPage, totalLoadedPages, hasMorePages]);

//   const loadInitialData = async () => {
//     setLoading(true);
//     try {
//       // Load first 3 pages initially for better performance
//       const pagesToLoad = 3;
//       let allLoadedCars = [];

//       for (let page = 1; page <= pagesToLoad; page++) {
//         const response = await fetch(
//           `${process.env.NEXT_PUBLIC_API}/api/allproducts/mo?page=${page}`
//         );

//         if (!response.ok) {
//           console.error(`Failed to fetch page ${page}:`, response.status);
//           break;
//         }

//         const data = await response.json();

//         if (data && Array.isArray(data.data) && data.data.length > 0) {
//           const newCars = data.data;
//           console.log(`📦 Loaded ${newCars.length} cars from page ${page}`);

//           // Fetch variants for each car
//           const carsWithVariants = await Promise.all(
//             newCars.map(async (car) => {
//               try {
//                 const variantResponse = await fetch(
//                   `${process.env.NEXT_PUBLIC_API}/api/variants/active/${car._id}`
//                 );
//                 const variantData = await variantResponse.json();
//                 return {
//                   ...car,
//                   variants: variantData.data || [],
//                 };
//               } catch (error) {
//                 console.error(`Error fetching variants for ${car._id}:`, error);
//                 return { ...car, variants: [] };
//               }
//             })
//           );

//           allLoadedCars = [...allLoadedCars, ...carsWithVariants];

//           // If we got less than 10 cars, we've reached the end
//           if (newCars.length < 10) {
//             setHasMorePages(false);
//             break;
//           }
//         } else {
//           console.log(`📭 No more cars found at page ${page}`);
//           setHasMorePages(false);
//           break;
//         }
//       }

//       console.log(
//         `🎉 Initial load complete: ${allLoadedCars.length} cars loaded`
//       );
//       setAllCars(allLoadedCars);
//       setCurrentPage(pagesToLoad);
//       setTotalLoadedPages(pagesToLoad);
//     } catch (error) {
//       console.error("❌ Error loading cars:", error);
//       setAllCars([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fixed feature checking function
//   const hasFeature = (variant, feature) => {
//     const checkField = (fieldValue) => {
//       return (
//         fieldValue &&
//         fieldValue.toString().trim() !== "" &&
//         fieldValue.toString().toLowerCase() !== "null" &&
//         fieldValue.toString().toLowerCase() !== "na"
//       );
//     };

//     switch (feature) {
//       case "Touch Screen":
//         return checkField(variant.Touch_Screen_Infotainment);
//       case "Reverse Parking Camera":
//         return checkField(variant.Reverse_Camera);
//       case "Cruise Control":
//         return checkField(variant.Cruise_Control);
//       case "Ventilated Seats":
//         return checkField(variant.Ventilated_Seats);
//       case "Sunroof":
//         return checkField(variant.sunroof);
//       case "ADAS":
//         return checkField(variant.ADAS);
//       case "Push Button Start Stop":
//         return (
//           checkField(variant.ignition) &&
//           variant.ignition.toString().trim().toUpperCase() ===
//             "PUSH BUTTON START STOP"
//         );
//       case "Ambient Lighting":
//         return checkField(variant.Ambient_Lighting);
//       case "Electric Seats Adjustment":
//         return (
//           checkField(variant.Seats_Adjustment) &&
//           variant.Seats_Adjustment.toString().toLowerCase().includes("electric")
//         );
//       case "Wireless Charging":
//         return checkField(variant.wireless_Charging);
//       case "Android Auto & Apple Carplay":
//         return checkField(variant.Android_Apple_Carplay);
//       case "Auto Headlamps":
//         return checkField(variant.automaticHeadLamp);
//       case "TPMS":
//         return checkField(variant.TMPS);
//       case "Hill Start Assist":
//         return checkField(variant.Hill_Hold_Assist);
//       case "Air Conditioning":
//         return checkField(variant.Air_Conditioning);
//       case "Air Purifier":
//         return checkField(variant.Air_Purifier);
//       default:
//         return false;
//     }
//   };

//   // Helper function to check if a car has any variants matching the criteria
//   // Fixed filtering logic - main issues and solutions:

//   // 1. MAJOR ISSUE: Multi-select fields (transmission, fuelType, etc.) are arrays in search params
//   //    but you're comparing them as single values
//   const carHasMatchingVariants = (car) => {
//     if (!car.variants || car.variants.length === 0) {
//       return false;
//     }

//     let matchingVariants = [...car.variants];
//     console.log(
//       `🔍 Checking car ${car.carname} with ${matchingVariants.length} variants`
//     );

//     // Filter by price range
//     if (parsedSearchParams.minPrice && parsedSearchParams.maxPrice) {
//       const minPrice = parseInt(parsedSearchParams.minPrice);
//       const maxPrice = parseInt(parsedSearchParams.maxPrice);
//       const beforeFilter = matchingVariants.length;

//       matchingVariants = matchingVariants.filter((variant) => {
//         const price = parseInt(variant.exShowroomPrice) || 0;
//         return price >= minPrice && price <= maxPrice;
//       });

//       console.log(
//         `💰 Price filter: ${beforeFilter} → ${matchingVariants.length} variants`
//       );
//     }

//     // FIXED: Filter by transmission (handle array of values)
//     if (
//       parsedSearchParams.transmission &&
//       parsedSearchParams.transmission.length > 0
//     ) {
//       const beforeFilter = matchingVariants.length;
//       matchingVariants = matchingVariants.filter((variant) => {
//         // Check if variant transmission matches ANY of the selected transmissions
//         return parsedSearchParams.transmission.some(
//           (selectedTransmission) =>
//             variant.transmission?.toLowerCase() ===
//             selectedTransmission.toLowerCase()
//         );
//       });
//       console.log(
//         `⚙️ Transmission filter: ${beforeFilter} → ${matchingVariants.length} variants`
//       );
//     }

//     // FIXED: Filter by fuel type (handle array of values)
//     if (parsedSearchParams.fuelType && parsedSearchParams.fuelType.length > 0) {
//       const beforeFilter = matchingVariants.length;
//       matchingVariants = matchingVariants.filter((variant) => {
//         // Check if variant fuel matches ANY of the selected fuel types
//         return parsedSearchParams.fuelType.some(
//           (selectedFuel) =>
//             variant.fuel?.toLowerCase() === selectedFuel.toLowerCase()
//         );
//       });
//       console.log(
//         `⛽ Fuel filter: ${beforeFilter} → ${matchingVariants.length} variants`
//       );
//     }

//     // FIXED: Filter by seating capacity (handle array of values)
//     if (
//       parsedSearchParams.seatingCapacity &&
//       parsedSearchParams.seatingCapacity.length > 0
//     ) {
//       const beforeFilter = matchingVariants.length;

//       matchingVariants = matchingVariants.filter((variant) => {
//         const variantSeats = variant.seater?.toString();

//         if (
//           !variantSeats ||
//           variantSeats.toLowerCase() === "null" ||
//           variantSeats.toLowerCase() === "na"
//         ) {
//           return false;
//         }

//         const seats = parseInt(variantSeats);

//         // Check if variant seating matches ANY of the selected seating options
//         return parsedSearchParams.seatingCapacity.some((requestedSeats) => {
//           if (requestedSeats === "7+") {
//             return seats >= 7;
//           } else if (requestedSeats === "5") {
//             return seats === 4 || seats === 5;
//           } else {
//             return seats === parseInt(requestedSeats);
//           }
//         });
//       });

//       console.log(
//         `🪑 Seating filter: ${beforeFilter} → ${matchingVariants.length} variants`
//       );
//     }

//     // FIXED: Filter by boot space (handle array of values)
//     if (
//       parsedSearchParams.bootSpace &&
//       parsedSearchParams.bootSpace.length > 0
//     ) {
//       const beforeFilter = matchingVariants.length;

//       matchingVariants = matchingVariants.filter((variant) => {
//         const bootSpace = variant.boot_Space?.toString();

//         if (
//           !bootSpace ||
//           bootSpace.toLowerCase() === "null" ||
//           bootSpace.toLowerCase() === "na"
//         ) {
//           // If no boot space data, only match if "1" (smallest) is selected
//           return parsedSearchParams.bootSpace.includes("1");
//         }

//         const bootValue = parseInt(bootSpace);
//         const bootBags = Math.floor(bootValue / 120);

//         // Check if variant boot space matches ANY of the selected boot space options
//         return parsedSearchParams.bootSpace.some((requestedBootSpace) => {
//           const requestedBags = parseInt(requestedBootSpace);
//           return bootBags >= requestedBags - 1;
//         });
//       });

//       console.log(
//         `🧳 Boot space filter: ${beforeFilter} → ${matchingVariants.length} variants`
//       );
//     }

//     // Features filter is already correct
//     if (parsedSearchParams.features && parsedSearchParams.features.length > 0) {
//       const beforeFilter = matchingVariants.length;

//       matchingVariants = matchingVariants.filter((variant) => {
//         const hasAllFeatures = parsedSearchParams.features.every((feature) => {
//           const hasThisFeature = hasFeature(variant, feature);
//           console.log(
//             `   🔧 Feature "${feature}": ${hasThisFeature ? "✅" : "❌"}`
//           );
//           return hasThisFeature;
//         });

//         return hasAllFeatures;
//       });

//       console.log(
//         `🔧 Features filter (${parsedSearchParams.features.join(
//           ", "
//         )}): ${beforeFilter} → ${matchingVariants.length} variants`
//       );
//     }

//     const hasMatching = matchingVariants.length > 0;
//     console.log(
//       `🏁 Final result for ${car.carname}: ${
//         hasMatching ? "✅ INCLUDED" : "❌ EXCLUDED"
//       }`
//     );
//     return hasMatching;
//   };

//   // 2. FIXED: Brand filter (handle array of values)
//   const applyFilters = () => {
//     if (!Array.isArray(allCars) || allCars.length === 0) {
//       setFilteredCars([]);
//       return;
//     }

//     console.log(`🎯 Starting filter process with ${allCars.length} cars`);
//     let filtered = [...allCars];

//     // FIXED: Filter by brand (handle array of values)
//     if (parsedSearchParams.brand && parsedSearchParams.brand.length > 0) {
//       const beforeFilter = filtered.length;
//       filtered = filtered.filter((car) => {
//         if (!car.brand) return false;

//         let brandName = "";
//         if (typeof car.brand === "object" && car.brand.name) {
//           brandName = car.brand.name;
//         } else if (typeof car.brand === "string") {
//           brandName = car.brand;
//         } else {
//           return false;
//         }

//         // Check if car brand matches ANY of the selected brands
//         return parsedSearchParams.brand.some(
//           (selectedBrand) =>
//             brandName.toLowerCase() === selectedBrand.toLowerCase()
//         );
//       });

//       console.log(
//         `🏷️ Brand filter (${parsedSearchParams.brand.join(
//           ", "
//         )}): ${beforeFilter} → ${filtered.length} cars`
//       );
//     }

//     // Rest of the filtering logic remains the same
//     const beforeVariantFilter = filtered.length;
//     filtered = filtered.filter((car) => carHasMatchingVariants(car));
//     console.log(
//       `🔍 Variant filter: ${beforeVariantFilter} → ${filtered.length} cars`
//     );

//     setFilteredCars(filtered);
//     console.log(`✅ Filter complete: ${filtered.length} cars match criteria`);
//   };

//   // 3. FIXED: Parse URL parameters to handle arrays properly
//   useEffect(() => {
//     const params = {
//       carType: searchParams.get("carType") || "new",
//       minPrice: searchParams.get("minPrice") || "",
//       maxPrice: searchParams.get("maxPrice") || "",
//       // FIXED: Parse comma-separated values as arrays, not single strings
//       transmission: searchParams.get("transmission")
//         ? searchParams
//             .get("transmission")
//             .split(",")
//             .map((t) => t.trim())
//         : [],
//       fuelType: searchParams.get("fuelType")
//         ? searchParams
//             .get("fuelType")
//             .split(",")
//             .map((f) => f.trim())
//         : [],
//       seatingCapacity: searchParams.get("seatingCapacity")
//         ? searchParams
//             .get("seatingCapacity")
//             .split(",")
//             .map((s) => s.trim())
//         : [],
//       bootSpace: searchParams.get("bootSpace")
//         ? searchParams
//             .get("bootSpace")
//             .split(",")
//             .map((b) => b.trim())
//         : [],
//       brand: searchParams.get("brand")
//         ? searchParams
//             .get("brand")
//             .split(",")
//             .map((b) => b.trim())
//         : [],
//       features: searchParams.get("features")
//         ? searchParams
//             .get("features")
//             .split(",")
//             .map((f) => f.trim())
//         : [],
//     };
//     setParsedSearchParams(params);

//     // Reset state when search params change
//     setAllCars([]);
//     setFilteredCars([]);
//     setCurrentPage(1);
//     setTotalLoadedPages(0);
//     setHasMorePages(true);

//     loadInitialData();
//   }, [searchParams]);

//   // Apply filters when cars are loaded or search params change
//   useEffect(() => {
//     if (allCars.length > 0) {
//       applyFilters();
//     }
//   }, [allCars, parsedSearchParams]);

//   const loadMoreCars = async () => {
//     if (loadingMore || !hasMorePages) return;

//     setLoadingMore(true);
//     console.log(`📥 Loading more cars from page ${currentPage + 1}...`);

//     try {
//       const nextPage = currentPage + 1;
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_API}/api/allproducts/mo?page=${nextPage}`
//       );

//       if (!response.ok) {
//         console.error(`Failed to fetch page ${nextPage}:`, response.status);
//         setHasMorePages(false);
//         return;
//       }

//       const data = await response.json();

//       if (data.data && Array.isArray(data.data) && data.data.length > 0) {
//         const newCars = data.data;
//         console.log(
//           `📦 Loaded ${newCars.length} more cars from page ${nextPage}`
//         );

//         const carsWithVariants = await Promise.all(
//           newCars.map(async (car) => {
//             try {
//               const variantResponse = await fetch(
//                 `${process.env.NEXT_PUBLIC_API}/api/variants/active/${car._id}`
//               );
//               const variantData = await variantResponse.json();
//               return {
//                 ...car,
//                 variants: variantData.data || [],
//               };
//             } catch (error) {
//               console.error(`Error fetching variants for ${car._id}:`, error);
//               return { ...car, variants: [] };
//             }
//           })
//         );

//         setAllCars((prev) => {
//           const newTotal = [...prev, ...carsWithVariants];
//           console.log(`📊 Total cars now: ${newTotal.length}`);
//           return newTotal;
//         });
//         setCurrentPage(nextPage);
//         setTotalLoadedPages(nextPage);

//         if (newCars.length < 10) {
//           console.log(`📭 End of data reached at page ${nextPage}`);
//           setHasMorePages(false);
//         }
//       } else {
//         console.log(`📭 No more cars available at page ${nextPage}`);
//         setHasMorePages(false);
//       }
//     } catch (error) {
//       console.error("❌ Error loading more cars:", error);
//       setHasMorePages(false);
//     } finally {
//       setLoadingMore(false);
//     }
//   };

//   const goBackToSearch = () => {
//     navigate(-1);
//   };

//   return (
//     <div className="min-h-screen  py-8">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header */}
//         <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <button
//                 onClick={goBackToSearch}
//                 className="flex items-center text-red-500 hover:text-red-600 mb-4 transition-colors"
//               >
//                 <svg
//                   className="w-5 h-5 mr-2"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M15 19l-7-7 7-7"
//                   />
//                 </svg>
//                 Back to Search
//               </button>
//               <h1 className="text-3xl font-bold text-gray-900 mb-2">
//                 View Results
//               </h1>
//             </div>
//           </div>
//         </div>

//         {/* Loading State */}
//         {loading && allCars.length === 0 && (
//           <div className="bg-white rounded-lg shadow-sm p-12 text-center">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
//             <p className="text-gray-600">Searching for cars...</p>
//           </div>
//         )}

//         {/* Results Grid */}
//         {!loading || allCars.length > 0 ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {filteredCars.map((car) => (
//               <Link
//                 key={car._id}
//                 to={`/product/${car.carname.replace(/\s+/g, "-")}/${car._id}`}
//                 className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 block"
//               >
//                 <div className="relative h-48 bg-gray-100 rounded-t-lg overflow-hidden">
//                   {car.heroimage ? (
//                     <img
//                       src={`${process.env.NEXT_PUBLIC_API}/productImages/${car.heroimage}`}
//                       alt={car.carname}
//                       className="w-full h-full object-contain"
//                       crossOrigin="anonymous"
//                     />
//                   ) : (
//                     <div className="flex items-center justify-center h-full text-gray-400">
//                       <svg
//                         className="w-16 h-16"
//                         fill="currentColor"
//                         viewBox="0 0 20 20"
//                       >
//                         <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
//                       </svg>
//                     </div>
//                   )}
//                   {car.NCAP && (
//                     <div className="absolute top-3 right-3 bg-white bg-opacity-90 px-2 py-1 rounded-full text-xs font-semibold text-gray-700">
//                       {car.NCAP}⭐ NCAP
//                     </div>
//                   )}
//                 </div>

//                 <div className="p-6">
//                   <div className="mb-4">
//                     <h3 className="text-xl font-bold text-gray-900 mb-1">
//                       {car.carname}
//                     </h3>
//                     <div className="flex items-center text-sm text-gray-500 space-x-2">
//                       <span>{car.brand?.name || car.brand}</span>
//                       <span>•</span>
//                       <span>{car.bodytype}</span>
//                       <span>•</span>
//                       <span>{car.variants?.length || 0} variants</span>
//                     </div>
//                   </div>

//                   <div className="mb-4">
//                     <div className="text-2xl font-bold text-gray-900">
//                       ₹
//                       {(parseInt(car.lowestExShowroomPrice) / 100000).toFixed(
//                         1
//                       )}
//                       L - ₹
//                       {(parseInt(car.highestExShowroomPrice) / 100000).toFixed(
//                         1
//                       )}
//                       L
//                     </div>
//                     <div className="text-sm text-gray-500">
//                       Ex-showroom price
//                     </div>
//                   </div>

//                   <div className="mb-4">
//                     <div className="flex flex-wrap gap-2">
//                       {car.fueltype && (
//                         <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
//                           {car.fueltype
//                             .replace(/<[^>]*>/g, "")
//                             .replace(/\s+/g, " ")
//                             .trim()}
//                         </span>
//                       )}
//                       {car.transmissiontype && (
//                         <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
//                           {car.transmissiontype
//                             .replace(/<[^>]*>/g, "")
//                             .replace(/\s+/g, " ")
//                             .trim()}
//                         </span>
//                       )}
//                       {car.seater && (
//                         <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
//                           {car.seater.replace(/<[^>]*>/g, "")} Seater
//                         </span>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </Link>
//             ))}
//           </div>
//         ) : null}

//         {/* No Results */}
//         {!loading && filteredCars.length === 0 && allCars.length > 0 && (
//           <div className="bg-white rounded-lg shadow-sm p-12 text-center">
//             <svg
//               className="w-16 h-16 text-gray-400 mx-auto mb-4"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33"
//               />
//             </svg>
//             <h3 className="text-lg font-semibold text-gray-900 mb-2">
//               No cars found
//             </h3>
//             <p className="text-gray-600 mb-4">
//               Searched {allCars.length} cars but none match your criteria. Try
//               adjusting your filters.
//             </p>
//             <button
//               onClick={goBackToSearch}
//               className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
//             >
//               Modify Search
//             </button>
//           </div>
//         )}

//         {/* Load More Button */}
//         {/* {hasMorePages && !loading && (
//           <div className="mt-8 text-center">
//             <button
//               onClick={loadMoreCars}
//               disabled={loadingMore}
//               className="bg-gray-100 hover:bg-gray-200 disabled:bg-gray-300 disabled:cursor-not-allowed text-gray-700 font-medium py-3 px-8 rounded-lg transition-colors"
//             >
//               {loadingMore ? (
//                 <div className="flex items-center">
//                   <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
//                   Loading more cars...
//                 </div>
//               ) : (
//                 `Load More Cars (Page ${currentPage + 1})`
//               )}
//             </button>
//           </div>
//         )} */}
//       </div>
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { Bookmark, Users, Fuel, Settings, Star } from "lucide-react";

export default function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [allCars, setAllCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMorePages, setHasMorePages] = useState(true);
  const [parsedSearchParams, setParsedSearchParams] = useState({});
  const [totalLoadedPages, setTotalLoadedPages] = useState(0);
  const [rtoData, setRtoData] = useState([]);
  const [bookmarkedIds, setBookmarkedIds] = useState(() => {
    const savedBookmarks = JSON.parse(
      localStorage.getItem("bookmarks") || "[]"
    );
    return savedBookmarks || [];
  });

  // Parse URL parameters
  useEffect(() => {
    const params = {
      carType: searchParams.get("carType") || "new",
      minPrice: searchParams.get("minPrice") || "",
      maxPrice: searchParams.get("maxPrice") || "",
      transmission: searchParams.get("transmission")
        ? searchParams
            .get("transmission")
            .split(",")
            .map((t) => t.trim())
        : [],
      fuelType: searchParams.get("fuelType")
        ? searchParams
            .get("fuelType")
            .split(",")
            .map((f) => f.trim())
        : [],
      seatingCapacity: searchParams.get("seatingCapacity")
        ? searchParams
            .get("seatingCapacity")
            .split(",")
            .map((s) => s.trim())
        : [],
      bootSpace: searchParams.get("bootSpace")
        ? searchParams
            .get("bootSpace")
            .split(",")
            .map((b) => b.trim())
        : [],
      brand: searchParams.get("brand")
        ? searchParams
            .get("brand")
            .split(",")
            .map((b) => b.trim())
        : [],
      features: searchParams.get("features")
        ? searchParams
            .get("features")
            .split(",")
            .map((f) => f.trim())
        : [],
    };
    setParsedSearchParams(params);

    // Reset state when search params change
    setAllCars([]);
    setFilteredCars([]);
    setCurrentPage(1);
    setTotalLoadedPages(0);
    setHasMorePages(true);

    loadInitialData();
  }, [searchParams]);

  // Fetch RTO data
  const fetchRTOData = async () => {
    const locationState = localStorage.getItem("location");
    if (!locationState) return;

    try {
      const parsedLocationState = JSON.parse(locationState);
      if (!parsedLocationState || !parsedLocationState.state) {
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/v1/onroad-procing-for-website-landingpage`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ state: parsedLocationState.state }),
        }
      );

      const result = await response.json();
      if (result.data && Array.isArray(result.data)) {
        setRtoData(result.data);
      }
    } catch (error) {
      console.error("Error fetching RTO data:", error);
      setRtoData([]);
    }
  };

  useEffect(() => {
    fetchRTOData();
  }, []);

  // Bookmark management
  const isBookmarked = (id) => bookmarkedIds.includes(id);

  const toggleBookmark = (id, e) => {
    e.preventDefault();
    e.stopPropagation();

    const updatedBookmarks = isBookmarked(id)
      ? bookmarkedIds.filter((bookmarkId) => bookmarkId !== id)
      : [...bookmarkedIds, id];
    setBookmarkedIds(updatedBookmarks);
    localStorage.setItem("bookmarks", JSON.stringify(updatedBookmarks));
  };

  // Helper function to normalize fuel type
  const normalizeFuelType = (fuelType) => {
    if (!fuelType) return "";
    const normalizedFuel = fuelType.toLowerCase();
    if (normalizedFuel.includes("hybrid")) {
      return "petrol";
    }
    return normalizedFuel;
  };

  // Format currency with Lakhs/Crore suffixes
  const formatCurrency = (value) => {
    if (value >= 1e7) {
      return `${(value / 1e7).toFixed(2)} Crore`;
    } else if (value >= 1e5) {
      return `${(value / 1e5).toFixed(2)} Lakhs`;
    } else {
      return new Intl.NumberFormat("en-IN").format(value);
    }
  };

  // On-road price calculation
  const calculateOnRoadPrice = (product, fuelType) => {
    let productPrice;
    if (typeof product === "object") {
      productPrice =
        product.exShowroomPrice || product.lowestExShowroomPrice || 0;
    } else {
      productPrice = product;
    }

    const priceStr = productPrice.toString();
    if (!/[0-9]/.test(priceStr)) return 0;
    if (!Array.isArray(rtoData) || rtoData.length === 0)
      return parseFloat(productPrice) || 0;

    const normalizedFuelType = normalizeFuelType(fuelType);

    const getDataFromRoadPriceListBasedOnFuelAndPriceRange = (
      priceList,
      productPrice,
      fuelType
    ) => {
      const price = parseFloat(productPrice) || 0;
      const fuel = (fuelType || "").toUpperCase();

      return (
        priceList.find(
          (rto) =>
            price >= parseFloat(rto.startPrice || 0) &&
            (rto.endPrice === "ABOVE"
              ? true
              : price <= parseFloat(rto.endPrice || Infinity)) &&
            (rto.fuelType || "").toUpperCase() === fuel.toUpperCase()
        ) || {}
      );
    };

    const roadPriceData = getDataFromRoadPriceListBasedOnFuelAndPriceRange(
      rtoData,
      priceStr,
      normalizedFuelType
    );

    const price = parseInt(priceStr) || 0;

    // Calculate RTO Tax
    const calculateRtoPrice = (
      productPrice,
      rtoPercentage,
      amount,
      fuelType
    ) => {
      const price = parseInt(productPrice);
      let rto = Math.ceil((parseFloat(rtoPercentage) * price) / 100);

      if (fuelType.toLowerCase() === "electric" || rtoPercentage === "0") {
        rto += parseInt(amount || "0");
      }

      return rto;
    };

    const rto = calculateRtoPrice(
      priceStr,
      roadPriceData.rtoPercentage || "0",
      roadPriceData.amount || "0",
      normalizedFuelType
    );

    // Calculate Road Safety Tax (2% of RTO)
    const roadSafetyTax = Math.ceil((rto * 2) / 100);

    // Calculate Insurance
    const calculateInsurancePrice = (productPrice, insurancePercentage) => {
      return Math.ceil(
        (parseInt(productPrice) * parseFloat(insurancePercentage)) / 100
      );
    };

    const insurance = calculateInsurancePrice(
      priceStr,
      roadPriceData.insurancePercentage || "0"
    );

    // Calculate Luxury Tax (1% for cars above ₹10L)
    const luxuryTax = price > 999999 ? Math.ceil(price / 100) : 0;

    // Additional Charges
    const hypethecationCharges = parseInt(
      roadPriceData.hypethecationCharges || "0"
    );
    const fastag = parseInt(roadPriceData.fastag || "0");
    const others = parseInt(roadPriceData.others || "0");

    return (
      price +
      rto +
      roadSafetyTax +
      insurance +
      luxuryTax +
      hypethecationCharges +
      fastag +
      others
    );
  };

  // Calculate the lowest on-road price across all variants
  const calculateLowestOnRoadPrice = (car) => {
    if (!car.variants || car.variants.length === 0) {
      return calculateOnRoadPrice(
        car.lowestExShowroomPrice,
        getFirstFuelType(car.fueltype)
      );
    }

    let minPrice = Infinity;
    car.variants.forEach((variant) => {
      const price = calculateOnRoadPrice(variant.exShowroomPrice, variant.fuel);
      if (price < minPrice) {
        minPrice = price;
      }
    });

    return minPrice;
  };

  // Parse HTML/array/string into consistent format
  const parseList = (input) => {
    if (Array.isArray(input)) {
      return input.join(" | ");
    }
    if (typeof input === "number") {
      return input.toString();
    }
    if (typeof input === "string") {
      // Remove HTML tags and extra spaces
      return input
        .replace(/<[^>]*>/g, "")
        .replace(/\s+/g, " ")
        .trim();
    }
    return "";
  };

  // Extract first fuel type from various formats
  const getFirstFuelType = (fuelData) => {
    if (Array.isArray(fuelData)) {
      return fuelData[0];
    }
    if (typeof fuelData === "string") {
      const match = fuelData.match(/<li>(.*?)<\/li>/i);
      if (match && match[1]) return match[1];
      return fuelData;
    }
    return "";
  };

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const pagesToLoad = 3;
      let allLoadedCars = [];

      for (let page = 1; page <= pagesToLoad; page++) {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API}/api/allproducts/mo?page=${page}`
        );

        if (!response.ok) {
          console.error(`Failed to fetch page ${page}:`, response.status);
          break;
        }

        const data = await response.json();

        if (data && Array.isArray(data.data) && data.data.length > 0) {
          const newCars = data.data;

          const carsWithVariants = await Promise.all(
            newCars.map(async (car) => {
              try {
                const variantResponse = await fetch(
                  `${process.env.NEXT_PUBLIC_API}/api/variants/active/${car._id}`
                );
                const variantData = await variantResponse.json();
                return {
                  ...car,
                  variants: variantData.data || [],
                };
              } catch (error) {
                console.error(`Error fetching variants for ${car._id}:`, error);
                return { ...car, variants: [] };
              }
            })
          );

          allLoadedCars = [...allLoadedCars, ...carsWithVariants];

          if (newCars.length < 10) {
            setHasMorePages(false);
            break;
          }
        } else {
          setHasMorePages(false);
          break;
        }
      }

      setAllCars(allLoadedCars);
      setCurrentPage(pagesToLoad);
      setTotalLoadedPages(pagesToLoad);
    } catch (error) {
      console.error("❌ Error loading cars:", error);
      setAllCars([]);
    } finally {
      setLoading(false);
    }
  };

  // Fixed feature checking function
  const hasFeature = (variant, feature) => {
    const checkField = (fieldValue) => {
      return (
        fieldValue &&
        fieldValue.toString().trim() !== "" &&
        fieldValue.toString().toLowerCase() !== "null" &&
        fieldValue.toString().toLowerCase() !== "na"
      );
    };

    switch (feature) {
      case "Touch Screen":
        return checkField(variant.Touch_Screen_Infotainment);
      case "Reverse Parking Camera":
        return checkField(variant.Reverse_Camera);
      case "Cruise Control":
        return checkField(variant.Cruise_Control);
      case "Ventilated Seats":
        return checkField(variant.Ventilated_Seats);
      case "Sunroof":
        return checkField(variant.sunroof);
      case "ADAS":
        return checkField(variant.ADAS);
      case "Push Button Start Stop":
        return (
          checkField(variant.ignition) &&
          variant.ignition.toString().trim().toUpperCase() ===
            "PUSH BUTTON START STOP"
        );
      case "Ambient Lighting":
        return checkField(variant.Ambient_Lighting);
      case "Electric Seats Adjustment":
        return (
          checkField(variant.Seats_Adjustment) &&
          variant.Seats_Adjustment.toString().toLowerCase().includes("electric")
        );
      case "Wireless Charging":
        return checkField(variant.wireless_Charging);
      case "Android Auto & Apple Carplay":
        return checkField(variant.Android_Apple_Carplay);
      case "Auto Headlamps":
        return checkField(variant.automaticHeadLamp);
      case "TPMS":
        return checkField(variant.TMPS);
      case "Hill Start Assist":
        return checkField(variant.Hill_Hold_Assist);
      case "Air Conditioning":
        return checkField(variant.Air_Conditioning);
      case "Air Purifier":
        return checkField(variant.Air_Purifier);
      default:
        return false;
    }
  };

  const carHasMatchingVariants = (car) => {
    if (!car.variants || car.variants.length === 0) {
      return false;
    }

    let matchingVariants = [...car.variants];

    // Filter by price range
    if (parsedSearchParams.minPrice && parsedSearchParams.maxPrice) {
      const minPrice = parseInt(parsedSearchParams.minPrice);
      const maxPrice = parseInt(parsedSearchParams.maxPrice);
      matchingVariants = matchingVariants.filter((variant) => {
        const price = parseInt(variant.exShowroomPrice) || 0;
        return price >= minPrice && price <= maxPrice;
      });
    }

    // Filter by transmission
    if (
      parsedSearchParams.transmission &&
      parsedSearchParams.transmission.length > 0
    ) {
      matchingVariants = matchingVariants.filter((variant) => {
        return parsedSearchParams.transmission.some(
          (selectedTransmission) =>
            variant.transmission?.toLowerCase() ===
            selectedTransmission.toLowerCase()
        );
      });
    }

    // Filter by fuel type
    if (parsedSearchParams.fuelType && parsedSearchParams.fuelType.length > 0) {
      matchingVariants = matchingVariants.filter((variant) => {
        return parsedSearchParams.fuelType.some(
          (selectedFuel) =>
            variant.fuel?.toLowerCase() === selectedFuel.toLowerCase()
        );
      });
    }

    // Filter by seating capacity
    if (
      parsedSearchParams.seatingCapacity &&
      parsedSearchParams.seatingCapacity.length > 0
    ) {
      matchingVariants = matchingVariants.filter((variant) => {
        const variantSeats = variant.seater?.toString();
        if (
          !variantSeats ||
          variantSeats.toLowerCase() === "null" ||
          variantSeats.toLowerCase() === "na"
        ) {
          return false;
        }

        const seats = parseInt(variantSeats);
        return parsedSearchParams.seatingCapacity.some((requestedSeats) => {
          if (requestedSeats === "7+") {
            return seats >= 7;
          } else if (requestedSeats === "5") {
            return seats === 4 || seats === 5;
          } else {
            return seats === parseInt(requestedSeats);
          }
        });
      });
    }

    // Filter by boot space
    if (
      parsedSearchParams.bootSpace &&
      parsedSearchParams.bootSpace.length > 0
    ) {
      matchingVariants = matchingVariants.filter((variant) => {
        const bootSpace = variant.boot_Space?.toString();
        if (
          !bootSpace ||
          bootSpace.toLowerCase() === "null" ||
          bootSpace.toLowerCase() === "na"
        ) {
          return parsedSearchParams.bootSpace.includes("1");
        }

        const bootValue = parseInt(bootSpace);
        const bootBags = Math.floor(bootValue / 120);
        return parsedSearchParams.bootSpace.some((requestedBootSpace) => {
          const requestedBags = parseInt(requestedBootSpace);
          return bootBags >= requestedBags - 1;
        });
      });
    }

    // Filter by features
    if (parsedSearchParams.features && parsedSearchParams.features.length > 0) {
      matchingVariants = matchingVariants.filter((variant) => {
        return parsedSearchParams.features.every((feature) =>
          hasFeature(variant, feature)
        );
      });
    }

    return matchingVariants.length > 0;
  };

  const applyFilters = () => {
    if (!Array.isArray(allCars) || allCars.length === 0) {
      setFilteredCars([]);
      return;
    }

    let filtered = [...allCars];

    // Filter by brand
    if (parsedSearchParams.brand && parsedSearchParams.brand.length > 0) {
      filtered = filtered.filter((car) => {
        if (!car.brand) return false;

        let brandName = "";
        if (typeof car.brand === "object" && car.brand.name) {
          brandName = car.brand.name;
        } else if (typeof car.brand === "string") {
          brandName = car.brand;
        } else {
          return false;
        }

        return parsedSearchParams.brand.some(
          (selectedBrand) =>
            brandName.toLowerCase() === selectedBrand.toLowerCase()
        );
      });
    }

    // Filter by variants
    filtered = filtered.filter((car) => carHasMatchingVariants(car));
    setFilteredCars(filtered);
  };

  // Apply filters when cars are loaded or search params change
  useEffect(() => {
    if (allCars.length > 0) {
      applyFilters();
    }
  }, [allCars, parsedSearchParams]);

  const loadMoreCars = async () => {
    if (loadingMore || !hasMorePages) return;

    setLoadingMore(true);
    try {
      const nextPage = currentPage + 1;
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/allproducts/mo?page=${nextPage}`
      );

      if (!response.ok) {
        console.error(`Failed to fetch page ${nextPage}:`, response.status);
        setHasMorePages(false);
        return;
      }

      const data = await response.json();

      if (data.data && Array.isArray(data.data) && data.data.length > 0) {
        const newCars = data.data;

        const carsWithVariants = await Promise.all(
          newCars.map(async (car) => {
            try {
              const variantResponse = await fetch(
                `${process.env.NEXT_PUBLIC_API}/api/variants/active/${car._id}`
              );
              const variantData = await variantResponse.json();
              return {
                ...car,
                variants: variantData.data || [],
              };
            } catch (error) {
              console.error(`Error fetching variants for ${car._id}:`, error);
              return { ...car, variants: [] };
            }
          })
        );

        setAllCars((prev) => [...prev, ...carsWithVariants]);
        setCurrentPage(nextPage);
        setTotalLoadedPages(nextPage);

        if (newCars.length < 10) {
          setHasMorePages(false);
        }
      } else {
        setHasMorePages(false);
      }
    } catch (error) {
      console.error("❌ Error loading more cars:", error);
      setHasMorePages(false);
    } finally {
      setLoadingMore(false);
    }
  };

  const goBackToSearch = () => {
    navigate(-1);
  };

  const getLocationFromLocalStorage = () => {
    const locationString = localStorage.getItem("location");
    try {
      return locationString ? JSON.parse(locationString) : null;
    } catch {
      return null;
    }
  };

  const location = getLocationFromLocalStorage();
  const state = location && location.city ? location.city : "";

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <button
                onClick={goBackToSearch}
                className="flex items-center text-red-500 hover:text-red-600 mb-4 transition-colors"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Back to Search
              </button>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                View Results
              </h1>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && allCars.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Searching for cars...</p>
          </div>
        )}

        {/* Results Grid */}
        {!loading || allCars.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCars.map((car) => (
              <div
                key={car._id}
                className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md"
              >
                <div className="bg-gray-200">
                  {/* Card Header with Bookmark */}
                  <div className="flex justify-between items-start p-4 pb-2">
                    <button
                      onClick={(e) => toggleBookmark(car._id, e)}
                      className="text-gray-400 hover:text-red-500 transition-colors flex justify-end items-end"
                    >
                      {isBookmarked(car._id) ? (
                        <Bookmark className="h-6 w-6 text-red-500 fill-[#AB373A] cursor-pointer" />
                      ) : (
                        <Bookmark className="h-6 w-6 text-gray-500 cursor-pointer" />
                      )}
                    </button>

                    {car.movrating && car.movrating !== "0" && (
                      <div className="bg-red-700 text-white text-xs font-medium px-2 py-1 rounded">
                        <span className="gap-[0.7px] flex justify-center items-center">
                          <span className="text-[13px] font-bold font-sans">
                            {car.movrating}
                          </span>
                          <Star size={13} color="white" fill="white" />
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Car Image */}
                  <Link
                    to={`/product/${car.carname.replace(/\s+/g, "-")}/${
                      car._id
                    }`}
                  >
                    <div className="px-6 py-2 flex justify-center">
                      {car.heroimage ? (
                        <img
                          className="h-32 object-contain"
                          src={`${process.env.NEXT_PUBLIC_API}/productImages/${car.heroimage}`}
                          crossOrigin="anonymous"
                          alt={car.carname}
                        />
                      ) : (
                        <div className="flex items-center justify-center h-32 text-gray-400">
                          <svg
                            className="w-16 h-16"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </Link>
                </div>

                {/* Car Info */}
                <div className="p-4 pt-2">
                  <div className="mb-3">
                    <div className="text-[#AB373A] text-[18px] font-bold">
                      {car.brand?.name || car.brand} {car.carname}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    {/* Specifications */}
                    <div className="flex-col flex text-sm text-gray-600 gap-1">
                      <div className="flex items-center gap-1">
                        <Users size={15} />
                        <span>{parseList(car.seater)} Seater</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Fuel size={15} />
                        <span>{parseList(car.fueltype)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Settings size={15} />
                        <span>{parseList(car.transmissiontype)}</span>
                      </div>
                      {car.NCAP && (
                        <div className="flex items-center gap-1">
                          <Star size={15} />
                          <span>Safety-{car.NCAP}</span>
                        </div>
                      )}
                    </div>

                    {/* Price */}
                    <div className="mb-4">
                      <div className="flex items-baseline flex-col">
                        <span className="text-[18px] font-bold text-gray-900">
                          ₹
                          {formatCurrency(
                            Math.round(calculateLowestOnRoadPrice(car))
                          )}{" "}
                          -{" "}
                          {formatCurrency(
                            Math.round(
                              calculateOnRoadPrice(
                                parseFloat(car.highestExShowroomPrice),
                                getFirstFuelType(car.fueltype)
                              )
                            )
                          )}{" "}
                        </span>
                        <span className="text-gray-500 text-sm">
                          {rtoData && rtoData.length > 0
                            ? "On-Road"
                            : "Ex-Showroom"}{" "}
                          {state}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : null}

        {/* No Results */}
        {!loading && filteredCars.length === 0 && allCars.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <svg
              className="w-16 h-16 text-gray-400 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33"
              />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No cars found
            </h3>
            <p className="text-gray-600 mb-4">
              Searched {allCars.length} cars but none match your criteria. Try
              adjusting your filters.
            </p>
            <button
              onClick={goBackToSearch}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
            >
              Modify Search
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
