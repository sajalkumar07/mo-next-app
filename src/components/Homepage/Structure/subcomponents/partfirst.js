import React from "react";
import "../../../main.css"; // Keep this if needed
import Link from "next/link";
import Image from "next/image"; // Recommended for optimization

export const PartFirst = () => {
  return (
    <div className="w-24">
      <a href="/">
        <Image
          src="/images/mainlogo.png" // public/images/mainlogo.png
          alt="Motor Octane"
          width={96} // Adjust width
          height={96} // Adjust height
        />
      </a>
    </div>
  );
};

export default PartFirst;
