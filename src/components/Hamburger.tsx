"use client";
import { useState } from "react";
import Image from "next/image";

export default function Hamburger({ profile }: { profile: any }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block text-left">
      {/* Hamburger or User Avatar */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-full focus:outline-none"
      >
        <Image
          src="/img/Hamburger.png"
          alt="User avatar"
          width={22}
          height={22}
        //   className="rounded-full"
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-6 w-32 bg-white rounded-lg shadow-lg z-50">
          {/* <div className="px-4 py-3 text-sm text-gray-900 border-b">
            <div className="font-medium">{profile.name}</div>
            <div className="text-gray-500 text-xs">{profile.email}</div>
          </div> */}
          <ul className="py-1 text-sm text-gray-700">
            <li>
              <a href="/mybooking" className="block px-4 py-2 hover:bg-gray-100">
                { profile.role=='admin'? "All Bookings"
                : "My Bookings" }
              </a>
            </li>
            <li>
              <a href="/payment" className="block px-4 py-2 hover:bg-gray-100">
                { profile.role=='admin'? "All Payments"
                : "My Payments" }
              </a>
            </li>
            <li>
              <a href="/booking" className="block px-4 py-2 hover:bg-gray-100">
                Rating
              </a>
            </li>
            <li></li>
          </ul>
          <div className="py-1">
            <a
              href="/api/auth/signout"
              className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
            >
              Sign out
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
