"use client";

import React, { useState, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react'; // อย่าลืมติดตั้ง lucide-react นะครับ

const LineContactButton = () => {
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    // แสดง Tooltip หลังจากผ่านไป 3 วินาที เพื่อไม่ให้รบกวนสายตาเกินไปในตอนแรก
    const timer = setTimeout(() => {
      setShowTooltip(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-[999] flex flex-col items-end">
      
      {/* Tooltip Message */}
      {showTooltip && (
        <div className="mb-3 relative animate-bounce-in">
          <div className="bg-white text-gray-800 text-sm font-medium py-2 px-4 rounded-lg shadow-xl border border-gray-100 flex items-center gap-2">
            <span>"หาเบอร์ไหนไม่เจอ... ทักให้เราช่วยหาได้นะครับ"</span>
            <button 
              onClick={() => setShowTooltip(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={14} />
            </button>
          </div>
          {/* Arrow */}
          <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white border-r border-b border-gray-100 transform rotate-45"></div>
        </div>
      )}

      {/* LINE Floating Button */}
      <a
        href="https://lin.ee/R3vfZW0"
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center justify-center w-14 h-14 bg-[#06C755] text-white rounded-full shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 hover:bg-[#05b34c]"
        aria-label="Contact us on LINE"
      >
        {/* Shine Effect */}
        <span className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:animate-ping-slow"></span>
        
        {/* LINE Icon (ใช้ MessageCircle แทน หรือจะใช้ SVG โลโก้ LINE ก็ได้ครับ) */}
        <MessageCircle size={30} fill="currentColor" />
        
        {/* Pulse Background */}
        <span className="absolute -z-10 inset-0 rounded-full bg-[#06C755] opacity-20 animate-ping"></span>
      </a>

      <style jsx>{`
        @keyframes bounce-in {
          0% { transform: scale(0.3); opacity: 0; }
          50% { transform: scale(1.05); opacity: 1; }
          70% { transform: scale(0.9); }
          100% { transform: scale(1); }
        }
        .animate-bounce-in {
          animation: bounce-in 0.5s ease-out forwards;
        }
        @keyframes ping-slow {
          0% { transform: scale(1); opacity: 0.2; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        .group-hover\:animate-ping-slow {
          animation: ping-slow 1s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default LineContactButton;