import React, { useState } from "react";
import Header from "./Header";
import Breadcrumbs from "./Breadcrumbs";
import Carousel from "./Carousel";
import RestaurantList from "./RestaurantList";
import Accordian from "./Accordian";
import Footer from "./Footer";

export default function HomePage(): React.JSX.Element {
  const [query, setQuery] = useState<string>("");
  const [location, setLocation] = useState<string>("All");

  return (
    <>
      <Header query={query} onSearchChange={setQuery} location={location} onLocationChange={setLocation} />
      <Breadcrumbs />
      <Carousel />
      <RestaurantList query={query} location={location} />
      <Accordian />
      <Footer />
    </>
  );
}
