import React, { useState } from "react";
import faqdata from "./faqdata";

export default function Accordion() {
  const [faqData, setFaqData] = useState(faqdata);
  const [openIndex, setOpenIndex] = useState(null);
  const handleClick = (index) => {
    setOpenIndex(openIndex === index ? null : index);
    console.log(openIndex);
  };

  return (
    <>
    <div className="bg-[#ececf259]">
      <div className=" mx-auto mt-20 px-3 md:px-10  w-full pb-10 max-w-6xl">
        <h1 className="text-3xl p-5">Explore Us</h1>
        <div className=" p-5 w-full ">
          {faqData.map((item, index) => {
            return (
              <div className=" mb-1">
                <div
                  className="p-3 bg-white md:text-2xl flex justify-between"
                  onClick={() => handleClick(index)}
                >
                  <span>{item.question}</span>
                  <span>{openIndex === index ? "-" : "+"}</span>
                </div>
                <div
                  className={`transition-all duration-200  ${
                    openIndex === index
                      ? "p-3 bg-gray-50 text-2xl"
                      : "hidden"
                  }`}
                >
                  {item.answer}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      </div>
    </>
  );
}
