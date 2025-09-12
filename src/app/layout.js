"use client"; // required because Provider is client-side

import { Provider } from "react-redux";
import store from "../redux/store"; // adjust path if needed
import { Montserrat, Poppins, Roboto, Lato } from "next/font/google";
import "./globals.css"; // optional: your global CSS\
import WhatsAppCTA from "@/components/whatsAppCTA";

// Google Fonts
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["200", "400", "500", "600", "700", "800", "900"],
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
});

const lato = Lato({
  subsets: ["latin"],
  weight: ["100", "300", "400", "700", "900"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.className} ${poppins.className} ${roboto.className} ${lato.className}`}
      >
        {/* Redux Provider wraps all children */}
        <Provider store={store}>
          {children}
          <WhatsAppCTA />
        </Provider>
      </body>
    </html>
  );
}
