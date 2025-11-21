import React, { useState } from "react";
import { HiMapPin } from "react-icons/hi2";
import { Search, ChevronDown, Menu, X } from "lucide-react";

interface NavbarProps {
  query?: string;
  onSearchChange?: (value: string) => void;
  location?: string;
  onLocationChange?: (loc: string) => void;
}

export default function Header({ query, onSearchChange, location, onLocationChange }: NavbarProps): React.JSX.Element {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white w-full max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
      {/* Left: Logo */}
      <div className="text-4xl font-bold italic text-gray-800">zomato</div>

      {/* Desktop Middle: Location + Search */}
      <div className="hidden md:flex items-center w-[700px] py-3 max-w-full bg-white rounded-lg shadow-lg">
        {/* Location selector */}
        <div className="flex items-center px-3 text-gray-400 min-w-[150px]">
          <HiMapPin className="text-2xl text-red-400 mr-1" />
          <select
            value={location || "All"}
            onChange={(e) => onLocationChange && onLocationChange(e.target.value)}
            className="text-[18px] bg-transparent focus:outline-none cursor-pointer"
          >
            <option value="All">All</option>
            <option value="Chhindwara">Chhindwara</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Pune">Pune</option>
            <option value="Bangalore">Bangalore</option>
            <option value="Delhi">Delhi</option>
          </select>
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-gray-300"></div>

        {/* Search */}
        <div className="flex items-center px-3 flex-1">
          <Search className="h-5 w-5 text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search for restaurant, cuisine or a dish"
            className="w-full focus:outline-none text-[20px] placeholder-gray-400"
            value={query || ""}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
          />
        </div>
      </div>

      {/* Desktop Right: Auth links */}
      <div className="hidden md:flex gap-6 text-gray-500 text-[20px] px-5 font-medium">
        <button className="hover:text-black">Log in</button>
        <button className="hover:text-black">Sign up</button>
      </div>

      {/* Mobile Hamburger */}
      <button
        className="md:hidden text-gray-800"
        onClick={() => setIsOpen(true)}
      >
        <Menu size={28} />
      </button>

      {/* Offcanvas Menu */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 md:hidden">
          {/* Panel */}
          <div className="fixed top-0 left-0 h-full w-4/5 max-w-sm bg-white shadow-lg p-6 flex flex-col">
            {/* Close Button */}
            <button
              className="self-end mb-6"
              onClick={() => setIsOpen(false)}
            >
              <X size={28} />
            </button>

            {/* Search (Mobile) */}
            <div className="flex items-center mb-4 px-3 py-2 bg-gray-100 rounded-lg shadow-sm">
              <Search className="h-5 w-5 text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search restaurant or dish"
                className="w-full focus:outline-none text-[16px] bg-transparent"
                value={query || ""}
                onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
              />
            </div>

            {/* Location (Mobile) */}
            <div className="flex items-center mb-6 px-3 py-2 bg-gray-100 rounded-lg shadow-sm">
              <HiMapPin className="h-5 w-5 text-red-400 mr-2" />
                <select
                value={location || "All"}
                onChange={(e) => onLocationChange && onLocationChange(e.target.value)}
                className="w-full bg-transparent focus:outline-none text-[16px]"
              >
                <option value="All">All</option>
                <option value="Chhindwara">Chhindwara</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Pune">Pune</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Delhi">Delhi</option>
              </select>
            </div>

            {/* Links */}
            <div className="flex flex-col gap-4 text-gray-700 text-lg font-medium">
              <button className="text-left hover:text-black">Log in</button>
              <button className="text-left hover:text-black">Sign up</button>
              <div className="flex items-center text-gray-500">
                <HiMapPin className="text-xl text-red-400 mr-2" />
                <span>Chhindwara</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
