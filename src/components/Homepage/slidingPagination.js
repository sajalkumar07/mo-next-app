import React, { useState, useEffect } from "react";

const SlidingPagination = ({
  totalItems,
  activeDot,
  onDotClick,
  showPagination = true,
  dotsPerGroup = 5,
}) => {
  const [currentGroup, setCurrentGroup] = useState(0);
  const totalGroups = Math.ceil(totalItems / dotsPerGroup);

  useEffect(() => {
    const newGroup = Math.floor(activeDot / dotsPerGroup);
    setCurrentGroup(newGroup);
  }, [activeDot, dotsPerGroup]);

  if (!showPagination || totalItems <= 1) {
    return null;
  }

  const renderGroup = () => {
    const start = currentGroup * dotsPerGroup;
    const end = Math.min(start + dotsPerGroup, totalItems);

    // Always show exactly 5 dots, filling with empty dots if needed
    return Array.from({ length: dotsPerGroup }, (_, index) => {
      const dotIndex = start + index;
      const isActive = activeDot === dotIndex;
      const isRealDot = dotIndex < totalItems;

      return (
        <div
          key={dotIndex}
          className={`dot ${isActive ? "active" : ""} ${
            !isRealDot ? "empty" : ""
          }`}
          onClick={() => isRealDot && onDotClick(dotIndex)}
        />
      );
    });
  };

  return (
    <div className="pagination-wrapper">
      <div className="pagination-container">
        <div
          className={`pagination-group slide-${
            currentGroup % 2 ? "left" : "right"
          }`}
          key={`group-${currentGroup}`}
        >
          {renderGroup()}
        </div>
      </div>
      <PaginationStyles dotsPerGroup={dotsPerGroup} />
    </div>
  );
};

const PaginationStyles = ({ dotsPerGroup }) => (
  <style jsx>{`
    .pagination-wrapper {
      display: flex;
      justify-content: center;
      margin: 20px 0;
      width: 100%;
    }

    .pagination-container {
      width: ${dotsPerGroup * 20}px;
      height: 30px;
      position: relative;
      overflow: hidden;
    }

    .pagination-group {
      display: flex;
      gap: 3px;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      align-items: center;
      justify-content: center;
    }

    .slide-left {
      animation: slideInLeft 0.4s ease-out;
    }

    .slide-right {
      animation: slideInRight 0.4s ease-out;
    }

    @keyframes slideInLeft {
      0% {
        transform: translateX(100%);
        opacity: 0;
      }
      100% {
        transform: translateX(0);
        opacity: 1;
      }
    }

    @keyframes slideInRight {
      0% {
        transform: translateX(-100%);
        opacity: 0;
      }
      100% {
        transform: translateX(0);
        opacity: 1;
      }
    }

    .dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background-color: #ccc;
      transition: all 0.3s ease;
      cursor: pointer;
      flex-shrink: 0;
    }

    .dot.empty {
      visibility: hidden;
      pointer-events: none;
    }

    .dot.active {
      background-color: #b1081a;
      transform: scale(1);
      box-shadow: 0 0 0 2px rgba(255, 0, 0, 0.3);
    }

    @media (max-width: 768px) {
      .pagination-group {
        gap: 3px;
      }

      .dot {
        width: 10px;
        height: 10px;
      }
    }
  `}</style>
);

export default SlidingPagination;
