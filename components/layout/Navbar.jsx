'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <nav className="fixed w-full bg-white shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* 1. โลโก้เว็บ */}
        <Link href="/" className="font-bold text-xl text-blue-950">
          MRT Supplier
        </Link>

        {/* 2. เมนูและช่องค้นหา */}
        <div className="flex items-center gap-6">
          <Link href="/" className="text-gray-600 hover:text-blue-950">หน้าแรก</Link>
          <Link href="/products" className="text-gray-600 hover:text-blue-950">สินค้า</Link>
          <Link href="/contact" className="text-gray-600 hover:text-blue-950">ติดต่อ</Link>

          {/* ช่องค้นหาแบบขยายได้ */}
          <div
            className={`flex items-center border rounded-full transition-all duration-300 ${
              isSearchOpen ? 'w-64 px-3' : 'w-10 px-0 justify-center'
            } h-10 border-gray-300 bg-gray-50`}
          >
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="text-gray-500 focus:outline-none"
              aria-label="Search"
            >
              🔍
            </button>
            <input
              type="text"
              placeholder="ค้นหา Part Number..."
              className={`bg-transparent focus:outline-none text-sm transition-all duration-300 ${
                isSearchOpen ? 'w-full ml-2 opacity-100' : 'w-0 opacity-0'
              }`}
            />
          </div>

          {/* 3. ปุ่ม Call to Action */}
          <Link href="/quote" className="bg-blue-950 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-900 transition">
            ขอใบเสนอราคา
          </Link>
        </div>

      </div>
    </nav>
  );
}
