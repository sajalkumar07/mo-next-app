// import React from "react";
// import Ads3 from "../../../Images/mainimg.png";

// const Adbanner3 = () => {
//   return (
//     <div
//       style={{
//         width: "100%",
//         overflow: "hidden",
//         height: "215px",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         marginTop: "10px",
//       }}
//     >
//       {/* <img style={{ width: 'inherit' }}src={Ads3} alt='Advertisement Banner'/> */}
//       <img src="https://www.adspeed.com/placeholder-999x284.gif" />
//     </div>
//   );
// };

// export default Adbanner3;

import React from "react";
import Ads3 from "../../../Images/mainimg.png";

import Image from "next/image"; // Recommended for optimization

const Adbanner3 = () => {
  return (
    <div className="relative mb-[50px] overflow-hidden  flex justify-center items-center text-center w-full mt-20">
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
