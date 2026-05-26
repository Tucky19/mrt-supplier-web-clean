"use client";

import React, { useEffect, useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { gaLineClick } from "@/lib/analytics/ga";

const LineContactButton = () => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();
  const hiddenOnPage = pathname.endsWith("/contact");

  useEffect(() => {
    const updateViewport = () => setIsMobile(window.innerWidth < 768);
    updateViewport();
    window.addEventListener("resize", updateViewport);

    if (window.innerWidth < 768 || hiddenOnPage) {
      setShowTooltip(false);

      return () => window.removeEventListener("resize", updateViewport);
    }

    const timer = setTimeout(() => {
      setShowTooltip(true);
    }, 3000);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updateViewport);
    };
  }, [hiddenOnPage]);

  if (hiddenOnPage) {
    return null;
  }

  return (
    <div className="fixed bottom-20 right-4 z-[999] flex flex-col items-end sm:bottom-6 sm:right-6">
      {showTooltip && !isMobile && (
        <div className="relative mb-3 animate-bounce-in">
          <div className="flex items-center gap-2 rounded-lg border border-gray-100 bg-white px-4 py-2 text-sm font-medium text-gray-800 shadow-xl">
            <span>"ให้ช่วยหาไหมครับ"</span>
            <button
              onClick={() => setShowTooltip(false)}
              className="text-gray-400 transition-colors hover:text-gray-600"
              aria-label="Close LINE tooltip"
            >
              <X size={14} />
            </button>
          </div>
          <div className="absolute -bottom-2 right-6 h-4 w-4 rotate-45 border-b border-r border-gray-100 bg-white" />
        </div>
      )}

      <a
        href="https://lin.ee/S676yYH"
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => {
          gaLineClick({
            source: "floating_line_button",
          });
        }}
        className="group relative flex h-12 w-12 items-center justify-center rounded-full bg-[#06C755] text-white shadow-2xl transition-all duration-300 hover:scale-110 hover:bg-[#05b34c] active:scale-95 sm:h-14 sm:w-14"
        aria-label="Contact us on LINE"
        title="Contact us on LINE"
      >
        <span className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:animate-ping-slow" />
        <MessageCircle size={isMobile ? 24 : 30} fill="currentColor" />
        <span className="absolute inset-0 -z-10 rounded-full bg-[#06C755] opacity-20 animate-ping" />
      </a>

      <style jsx>{`
        @keyframes bounce-in {
          0% {
            transform: scale(0.3);
            opacity: 0;
          }
          50% {
            transform: scale(1.05);
            opacity: 1;
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            transform: scale(1);
          }
        }
        .animate-bounce-in {
          animation: bounce-in 0.5s ease-out forwards;
        }
        @keyframes ping-slow {
          0% {
            transform: scale(1);
            opacity: 0.2;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }
        .group-hover\:animate-ping-slow {
          animation: ping-slow 1s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default LineContactButton;
