// import React from "react";
// import Image from "next/image";
// import {
//   Facebook,
//   Twitter,
//   Instagram,
//   Youtube,
//   Linkedin,
//   MapPin,
// } from "lucide-react";

// const Footer = () => {
//   return (
//     <div className="bg-black w-full flex justify-center items-center md:p-4 p-auto">
//       <div className="w-[1400px]">
//         <div className="">
//           <div className="flex flex-col md:flex-row justify-between items-center gap-8 mt-2">
//             <div className="flex justify-center items-center -mb-4">
//               <Image
//                 src="/images/mainlogo.png"
//                 alt="Motor Octane"
//                 width={100}
//                 height={100}
//               />
//             </div>

//             {/* Center section - Links + copyright */}
//             <div className="flex flex-col items-center text-center md:block hidden">
//               <div className="flex flex-wrap justify-center items-center gap-6 text-white text-sm mb-4">
//                 <span className="text-gray-300 cursor-pointer hover:text-white transition-colors">
//                   ABOUT US
//                 </span>
//                 <span className="text-gray-300 cursor-pointer hover:text-white transition-colors">
//                   ADVERTISE
//                 </span>
//                 <span className="text-gray-300 cursor-pointer hover:text-white transition-colors">
//                   CONTACT US
//                 </span>
//                 <span className="text-gray-300 cursor-pointer hover:text-white transition-colors">
//                   SITEMAP
//                 </span>
//                 <span className="text-gray-300 cursor-pointer hover:text-white transition-colors">
//                   TERMS & CONDITIONS
//                 </span>
//               </div>

//               <p className="text-gray-400 text-xs">
//                 2006-2025. www.motoroctane.com Visitor Agreement & Privacy
//                 Policy
//               </p>
//               <p className="text-gray-400 text-xs"></p>
//             </div>

//             {/* Right section - Social + powered by */}
//             <div className="flex justify-end flex-col">
//               {/* Social icons */}
//               <div className="flex gap-4">
//                 <a
//                   href="https://www.facebook.com"
//                   className="text-white hover:text-blue-500 transition-colors"
//                 >
//                   <Facebook className="w-6 h-6" />
//                 </a>
//                 <a
//                   href="https://twitter.com"
//                   className="text-white hover:text-blue-400 transition-colors"
//                 >
//                   <Twitter className="w-6 h-6" />
//                 </a>
//                 <a
//                   href="https://www.instagram.com"
//                   className="text-white hover:text-pink-500 transition-colors"
//                 >
//                   <Instagram className="w-6 h-6" />
//                 </a>
//                 <a
//                   href="https://www.youtube.com"
//                   className="text-white hover:text-red-500 transition-colors"
//                 >
//                   <Youtube className="w-6 h-6" />
//                 </a>
//                 <a
//                   href="https://www.linkedin.com"
//                   className="text-white hover:text-blue-600 transition-colors"
//                 >
//                   <Linkedin className="w-6 h-6" />
//                 </a>
//                 <a
//                   href="#"
//                   className="text-white hover:text-green-500 transition-colors"
//                 >
//                   <MapPin className="w-6 h-6" />
//                 </a>
//               </div>

//               <div className="md:block hidden">
//                 <div className="flex justify-end items-center gap-1 mt-2 ">
//                   <span className="text-white text-center">Powered by</span>
//                   <Image
//                     src="/images/brandklin.png"
//                     alt="Brandklin"
//                     width={100}
//                     height={100}
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Center section - Links + copyright */}
//             <div className="flex flex-col items-center text-center md:hidden block">
//               <div className="flex flex-wrap justify-center items-center gap-6 text-white text-sm mb-4">
//                 <span className="text-gray-300 cursor-pointer hover:text-white transition-colors">
//                   ABOUT US
//                 </span>
//                 <span className="text-gray-300 cursor-pointer hover:text-white transition-colors">
//                   ADVERTISE
//                 </span>
//                 <span className="text-gray-300 cursor-pointer hover:text-white transition-colors">
//                   CONTACT US
//                 </span>
//                 <span className="text-gray-300 cursor-pointer hover:text-white transition-colors">
//                   SITEMAP
//                 </span>
//                 <span className="text-gray-300 cursor-pointer hover:text-white transition-colors">
//                   TERMS & CONDITIONS
//                 </span>
//               </div>

//               <p className="text-gray-400 text-xs">
//                 2006-2025. www.motoroctane.com
//               </p>
//               <p className="text-gray-400 text-xs">
//                 Visitor Agreement & Privacy Policy
//               </p>
//             </div>

//             <div className="py-2 flex justify-center md:justify-end items-center text-white text-xs gap-1 -mt-4 md:hidden block">
//               <span>Powered by</span>
//               <Image
//                 src="/images/brandklin.png"
//                 alt="Brandklin"
//                 width={100}
//                 height={100}
//               />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Footer;

import React from "react";
import Image from "next/image";
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Linkedin,
  MapPin,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-black w-full md:h-auto h-[400px]">
      {/* Responsive container (avoid fixed 1400px on mobile) */}
      <div className="w-full max-w-screen-2xl mx-auto px-4 py-6 ">
        <div className="flex flex-col 2xl:flex-row justify-between items-center gap-8">
          {/* Left: Logo */}
          <div className="flex justify-center items-center -mb-2 2xl:mb-0">
            <Image
              src="/images/mainlogo.png"
              alt="Motor Octane"
              width={140}
              height={140}
              priority
              sizes="(max-width: 768px) 64px, (max-width: 1536px) 96px, 120px"
            />
          </div>

          {/* Center: Links + copyright (DESKTOP ONLY @ 2xl+) */}
          <div className="hidden 2xl:flex flex-col items-center text-center">
            <div className="flex flex-wrap justify-center items-center gap-6 text-white text-sm mb-4">
              <span className="text-gray-300 cursor-pointer hover:text-white transition-colors">
                ABOUT US
              </span>
              <span className="text-gray-300 cursor-pointer hover:text-white transition-colors">
                ADVERTISE
              </span>
              <span className="text-gray-300 cursor-pointer hover:text-white transition-colors">
                CONTACT US
              </span>
              <span className="text-gray-300 cursor-pointer hover:text-white transition-colors">
                SITEMAP
              </span>
              <span className="text-gray-300 cursor-pointer hover:text-white transition-colors">
                TERMS & CONDITIONS
              </span>
            </div>
            <p className="text-gray-400 text-xs">
              2006-2025. www.motoroctane.com Visitor Agreement & Privacy Policy
            </p>
          </div>

          {/* Right: Social + Powered by (icons always; "Powered by" desktop @2xl) */}
          <div className="flex flex-col items-center 2xl:items-end -mt-4">
            <div className="flex gap-4">
              <a
                href="https://www.facebook.com"
                className="text-white hover:text-blue-500 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-6 h-6" />
              </a>
              <a
                href="https://twitter.com"
                className="text-white hover:text-blue-400 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-6 h-6" />
              </a>
              <a
                href="https://www.instagram.com"
                className="text-white hover:text-pink-500 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-6 h-6" />
              </a>
              <a
                href="https://www.youtube.com"
                className="text-white hover:text-red-500 transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-6 h-6" />
              </a>
              <a
                href="https://www.linkedin.com"
                className="text-white hover:text-blue-600 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-6 h-6" />
              </a>
              <a
                href="#"
                className="text-white hover:text-green-500 transition-colors"
                aria-label="Location"
              >
                <MapPin className="w-6 h-6" />
              </a>
            </div>

            {/* Desktop powered-by (2xl+) */}
            <div className="hidden 2xl:flex justify-end items-center text-white text-md gap-2 mt-2">
              <span>Powered by</span>
              <Image
                src="/images/brandklin.png"
                alt="Brandklin"
                width={100}
                height={100}
                sizes="(max-width: 1536px) 96px, 120px"
              />
            </div>
          </div>
        </div>

        {/* MOBILE/TABLET footer (visible below 2xl) */}
        <div className="mt-6 2xl:hidden">
          <div className="flex flex-wrap justify-center items-center gap-4 text-white text-sm mb-3">
            <span className="text-gray-300 cursor-pointer hover:text-white transition-colors">
              ABOUT US
            </span>
            <span className="text-gray-300 cursor-pointer hover:text-white transition-colors">
              ADVERTISE
            </span>
            <span className="text-gray-300 cursor-pointer hover:text-white transition-colors">
              CONTACT US
            </span>
            <span className="text-gray-300 cursor-pointer hover:text-white transition-colors">
              SITEMAP
            </span>
            <span className="text-gray-300 cursor-pointer hover:text-white transition-colors">
              TERMS & CONDITIONS
            </span>
          </div>
          <p className="text-gray-400 text-xs text-center">
            2006-2025. www.motoroctane.com
          </p>
          <p className="text-gray-400 text-xs text-center">
            Visitor Agreement & Privacy Policy
          </p>

          <div className="py-3 flex justify-center items-center text-white text-xs gap-2">
            <span>Powered by</span>
            <Image
              src="/images/brandklin.png"
              alt="Brandklin"
              width={100}
              height={100}
              sizes="(max-width: 768px) 96px, 120px"
            />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
