// import React from "react";
// import Ads from "../../../Images/banner1.png";

// const Adbanner1 = () => {
//   return (
//     <>
//       <div
//         className="onlydesptop"
//         style={{
//           width: "100%",
//           overflow: "hidden",
//           height: "126px",
//           alignItems: "center",
//           justifyContent: "center",
//           display: "flex",
//           marginTop: "-10px",
//           marginBottom: "20px",
//           zIndex: "2",
//           position: "relative",
//           marginTop: "40px",
//         }}
//       >
//         <img
//           style={{
//             width: "75%",
//             overflow: "hidden",
//             height: "auto",
//             alignItems: "center",
//             justifyContent: "center",
//             display: "flex",
//           }}
//           src={Ads}
//           alt="Advertisement Banner"
//         />
//       </div>
//       <div
//         className="onlyphoneme mt-3"
//         style={{
//           width: "100%",
//           overflow: "hidden",
//           height: "142px",
//           alignItems: "center",
//           justifyContent: "center",
//           marginTop: "-10px",
//           marginBottom: "20px",
//           zIndex: "2",
//           position: "relative",
//         }}
//       >
//         <img
//           style={{
//             width: "100%",
//             overflow: "hidden",
//             height: "142px",
//             alignItems: "center",
//             justifyContent: "center",
//             display: "flex",
//           }}
//           src={Ads}
//           alt="Advertisement Banner"
//         />
//       </div>
//     </>
//   );
// };

// export default Adbanner1;

import React from "react";
import Ads3 from "../../../Images/mainimg.png";
import Image from "next/image"; // Recommended for optimization

const Adbanner3 = () => {
  return (
    <div className="relative mb-[50px] overflow-hidden  flex justify-center items-center text-center w-full">
      {/* <img style={{ width: "inherit" }} src={Ads3} alt="Advertisement Banner" />
         <img src="https://www.adspeed.com/placeholder-999x284.gif" /> */}
      <div className="w-[1400px]">
        <Image
          className="w-full"
          src="/images/car.jpg" // public/images/mainlogo.png
          alt="Motor Octane"
          width={900} // Adjust width
          height={96} // Adjust height
        />
      </div>
    </div>
  );
};

export default Adbanner3;
