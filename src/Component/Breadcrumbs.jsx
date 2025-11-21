import React, { useState } from "react";

export default function Breadcrumbs() {

  return (
    <>
      <div className="w-full max-w-6xl mx-auto">

        <div className="flex flex-wrap  justify-start mx-auto px-10 mt-8 items-center space-x-2 text-[18px] text-gray-500 font-medium">
          <button type="button" aria-label="Home">
            Home
          </button>
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6.784 15.68 11.46 4.13h1.75L8.534 15.68z"
              fill="#CBD5E1"
            />
          </svg>
          <a href="#">India</a>
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6.784 15.68 11.46 4.13h1.75L8.534 15.68z"
              fill="#CBD5E1"
            />
          </svg>
          <a href="#">Restaurants</a>
        </div>
      </div>
    </>
  );
}
