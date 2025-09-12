"use client";
import { FaWhatsapp } from "react-icons/fa";

export default function WhatsAppCTA() {
  return (
    <a
      href="https://wa.me/918779952811"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 bg-green-500 text-white p-3 rounded-full shadow-2xl shadow-black hover:bg-green-600 transition z-50"
    >
      <FaWhatsapp size={28} />
    </a>
  );
}
