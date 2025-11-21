import axios from "axios";
import React, { useEffect, useRef, useState } from "react";

export default function FoodCarousel() {
  const [foodItems, setfoodItems] = useState([]);

  const carouselRef = useRef(null);

  useEffect(() => {
    axios
      .get("https://dummyjson.com/recipes?limit=10&skip=10&select=name,image")
      .then((result) => {
        setfoodItems(result.data.recipes);
        console.log(result.data.recipes);
      })
      .catch(() => {
        toast.error("something went wrong");
      });
  }, []);

  const slide = (dir) => {
    if (carouselRef.current) {
      const scrollAmount = 250;
      carouselRef.current.scrollBy({
        left: dir === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
    <div className="bg-[#e9efef66]">
      <div className=" relative w-full max-w-6xl mx-auto py-5 my-5 md:my-10  px-5">
        <h2 className="text-[20px] md:text-2xl  md:mb-4 py-5">Inspiration for your first order</h2>

        {/* <!-- Left Arrow --> */}
        <span
          className="absolute left-0 top-1/2 text-gray-700 -translate-y-1/2 bg-white w-[30px] h-[30px] text-center p-1 rounded-full shadow cursor-pointer z-10"
          onClick={() => {
            slide("left");
          }}
        >
          &#10094;
        </span>

        {/* <!-- Right Arrow --> */}
        <span
          className="absolute right-0 top-1/2 text-gray-700 -translate-y-1/2 bg-white w-[30px] h-[30px]  p-1 text-center rounded-full shadow cursor-pointer z-10"
          onClick={() => {
            slide("right");
          }}
        >
          &#10095;
        </span>

        {/* <!-- Carousel --> */}
        <div 
        className="flex overflow-x-auto space-x-4 snap-x snap-mandatory scrollbar-hide pb-4"
        ref={carouselRef}>
          {/* <!-- Product Card --> */}

          {foodItems.map((v, i) => {
            return (
              <div className=" text-center" key= {i}>
                <div className="w-[100px] h-[100px] md:w-[150px] md:h-[150px] mt-5  snap-start bg-white rounded-full shadow-md flex-shrink-0">
                  <img
                    src={v.image}
                    className="w-full object-contain rounded-full"
                    
                  />
                </div>
                <button class="mt-3  text-black px-4 md:py-2 rounded-lg  transition">
                  {v.name}
                </button>
              </div>
            );
          })}
        </div>
      </div>
      </div>
    </>
  );
}
