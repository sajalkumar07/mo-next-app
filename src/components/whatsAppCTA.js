"use client";
import { FaWhatsapp } from "react-icons/fa";
import { motion } from "framer-motion";

export default function WhatsAppCTA() {
  return (
    <motion.a
      drag
      dragMomentum={false}
      href="https://wa.me/918779952811"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 bg-green-500 text-white p-3 rounded-full shadow-2xl shadow-black hover:bg-green-600 transition z-50 cu"
    >
      <FaWhatsapp size={28} />
    </motion.a>
  );
}
