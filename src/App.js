"use client";

import React, { useRef, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import LoadingBar from "react-top-loading-bar"; // Import the library
import Homepage from "./components/Pages/Homepage";
import Productpage from "./components/Pages/Productpage";
import Allbrandcars from "./components/Pages/Allbrandcars";
import Variantpage from "./components/Pages/Variantpage";
import Pricebreakup from "./components/Pages/Pricebreakup";
import Emicalculator from "./components/Pages/Emicalculator";
import ServiceCenters from "./components/Pages/Servicecenter";
import Aboutus from "./components/Pages/Aboutus.js";
import PrivacyPolicy from "./components/Pages/Privacypolicy.js";
import TermsConditions from "./components/Pages/Tearm.js";
import News from "./components/Pages/News.js";
import NewNews from "./components/Pages/FullNews.js";
import AMPNews from "./components/Pages/AmpNews.js";
import Compero from "./components/Pages/Compero.js";
import ReloadHandler from "./components/Homepage/Structure/subcomponents/login/ReloadHandler";
import OwnerReview from "./components/Pages/OwnerReview.js";
import DetailVarient from "./components/Pages/DeatailVarient.js";
import Header from "./components/Homepage/Structure/header.js";
import Footer from "./components/Homepage/Structure/footer.js";
import SearchResult from "./components/Pages/SearchResult";

// Layout Component for consistent width
const Layout = ({ children }) => {
  return (
    <div className="lg:flex lg:justify-center lg:items-center w-full min-h-screen">
      <div className="w-full ">{children}</div>
    </div>
  );
};

// Component to handle loading bar on route change
const LoadingBarHandler = ({ setProgress }) => {
  const location = useLocation();

  useEffect(() => {
    // Trigger loading bar on route change
    setProgress(30);
    const timer = setTimeout(() => setProgress(100), 300); // Simulate load completion

    return () => clearTimeout(timer); // Clean up the timer
  }, [location, setProgress]);

  return null;
};

const App = () => {
  const loadingBarRef = useRef(null);

  const setProgress = (value) => {
    if (loadingBarRef.current) {
      loadingBarRef.current.continuousStart(value);
    }
  };

  // Disable inspect and console - Fixed for SSR
  useEffect(() => {
    // Check if we're in the browser
    if (typeof window === "undefined") return;

    // Disable right-click
    const handleContextMenu = (e) => e.preventDefault();

    // Disable F12, Ctrl+Shift+I/J, Ctrl+U
    const handleKeyDown = (e) => {
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && ["I", "J"].includes(e.key.toUpperCase())) ||
        (e.ctrlKey && e.key.toUpperCase() === "U")
      ) {
        e.preventDefault();
      }
    };

    // Disable console
    for (let method of ["log", "warn", "error", "info", "debug"]) {
      console[method] = () => {};
    }

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <BrowserRouter>
      <ReloadHandler />
      <LoadingBar color="#f11946" ref={loadingBarRef} />
      <LoadingBarHandler setProgress={setProgress} />
      <Header />
      <Layout>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/owner-review" element={<OwnerReview />} />
          <Route path="/product/:name/:id" element={<Productpage />} />
          <Route path="/variant/:name/:id" element={<Variantpage />} />
          <Route path="/brand/:name/:id" element={<Allbrandcars />} />
          <Route path="/pricebreakup/:id" element={<Pricebreakup />} />
          <Route
            path="/EMI-Calculator/:brandId?/:productId?/:id?"
            element={<Emicalculator />}
          />
          <Route path="/Service-centers/:id?" element={<ServiceCenters />} />
          <Route path="/About-us" element={<Aboutus />} />
          <Route path="/Privacy-Policy" element={<PrivacyPolicy />} />
          <Route path="/Terms-and-Conditions" element={<TermsConditions />} />
          <Route path="/news/:news?" element={<News />} />
          <Route path="/news/:news?/amp" element={<AMPNews />} />
          <Route path="/news/" element={<NewNews />} />
          <Route path="/detailvarient/:id" element={<DetailVarient />} />
          <Route path="/Car-Compero/:Car1?/:Car2?" element={<Compero />} />
          <Route path="/search-results" element={<SearchResult />} />
        </Routes>
      </Layout>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
