import axios from "axios";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

interface Coords {
  lat: number;
  lon: number;
}

interface Recipe {
  id: number;
  name: string;
  image?: string;
  rating?: number;
  cookTimeMinutes?: number;
  location?: string;
  coords?: Coords;
}

interface Props {
  query?: string;
  location?: string;
}

export default function RestaurantList({
  query = "",
  location = "All",
}: Props): React.JSX.Element {
  const [rest, setRest] = useState<Recipe[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [page, setPage] = useState<number>(1);
  const ITEMS_PER_PAGE = 15;

  const PLACEHOLDER =
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><rect width="100%" height="100%" fill="#f3f4f6"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#9ca3af" font-family="Arial, Helvetica, sans-serif" font-size="20">Image not available</text></svg>`
    );

  const cityCoords: Record<string, Coords> = {
    Chhindwara: { lat: 22.4333, lon: 78.6167 },
    Mumbai: { lat: 19.076, lon: 72.8777 },
    Pune: { lat: 18.5204, lon: 73.8567 },
    Bangalore: { lat: 12.9716, lon: 77.5946 },
    Delhi: { lat: 28.7041, lon: 77.1025 },
  };

  // -----------------------------
  // DEFAULT DATA (dummyjson)
  // -----------------------------
  async function loadDefault() {
    try {
      const res = await axios.get("https://dummyjson.com/recipes");
      const locations = [
        "Chhindwara",
        "Mumbai",
        "Pune",
        "Bangalore",
        "Delhi",
      ];

      const withLocation: Recipe[] = res.data.recipes.map(
        (r: any, idx: number) => {
          const loc = locations[idx % locations.length];
          const coords = cityCoords[loc];

          return {
            id: r.id,
            name: r.name,
            image: r.image || `https://loremflickr.com/600/400/restaurant,food?lock=${r.id}`,
            rating: r.rating,
            cookTimeMinutes: r.cookTimeMinutes,
            location: loc,
            coords,
          };
        }
      );

      setRest(withLocation);
    } catch {
      toast.error("Failed loading default restaurants");
    }
  }

  // -----------------------------
  // REAL RESTAURANT DATA (OSM)
  // -----------------------------
  async function loadRealRestaurants(city: Coords, selectedCity: string) {
    const query = `
      [out:json];
      node(around:4000, ${city.lat}, ${city.lon})["amenity"="restaurant"];
      out center;
    `;

    try {
      const response = await axios.post(
        "https://overpass-api.de/api/interpreter",
        query,
        { headers: { "Content-Type": "text/plain" } }
      );

      const list: Recipe[] = response.data.elements.map(
        (r: any, idx: number) => ({
          id: r.id,
          name: r.tags?.name || "Unnamed Restaurant",
          image:
            (typeof r.tags?.image === "string" && r.tags.image) ||
            `https://loremflickr.com/600/400/restaurant,food?lock=${r.id || idx}`,
          rating: Math.round((Math.random() * 2 + 3) * 10) / 10,
          cookTimeMinutes: Math.floor(Math.random() * 30) + 15,
          location: selectedCity,
          coords: { lat: r.lat, lon: r.lon },
        })
      );

      setRest(list);
    } catch (err) {
      toast.error("Failed to load real restaurants");
      loadDefault(); // fallback
    }
  }

  // ----------------------------------------
  // USE EFFECT – MAIN LOGIC
  // ----------------------------------------
  useEffect(() => {
    if (!location || location === "All") {
      loadDefault();
    } else {
      const coords = cityCoords[location];
      if (coords) loadRealRestaurants(coords, location);
    }
    // reset to first page whenever location changes
    setPage(1);
  }, [location]);

  // reset page when query changes
  useEffect(() => setPage(1), [query]);

  // -----------------------------
  // Haversine Distance
  // -----------------------------
  const distanceKm = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const toRad = (v: number) => (v * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  // -----------------------------
  // UI
  // -----------------------------
  const filtered = React.useMemo(() => {
    return rest.filter((v) => {
      if (!query) return true;
      const name = (v.name || "").toLowerCase();
      return name.includes(query.toLowerCase());
    });
  }, [rest, query]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / ITEMS_PER_PAGE));
  const start = (page - 1) * ITEMS_PER_PAGE;
  const paginated = filtered.slice(start, start + ITEMS_PER_PAGE);

  // ensure page is valid when filtered changes
  React.useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [totalPages]);

  // build compact page items for pagination (numbers and ellipses)
  const getPageItems = (current: number, totalP: number) => {
    const items: (number | string)[] = [];
    const maxButtons = 5;
    if (totalP <= maxButtons) {
      for (let i = 1; i <= totalP; i++) items.push(i);
      return items;
    }

    const left = Math.max(2, current - 1);
    const right = Math.min(totalP - 1, current + 1);

    items.push(1);
    if (left > 2) items.push("...");
    for (let i = left; i <= right; i++) items.push(i);
    if (right < totalP - 1) items.push("...");
    items.push(totalP);
    return items;
  };

  return (
    <>
      <div className="mx-auto w-full mb-10 max-w-6xl">
        <h1 className="text-2xl md:text-3xl p-5">
          {location === "All" ? "Restaurants" : `${location} Restaurants`}
        </h1>

        <div className="flex flex-wrap gap-10 p-4">
          {rest.length > 0 && filtered.length === 0 ? (
            <div className="w-full p-10 text-center text-gray-500">No results found</div>
          ) : (
            paginated.map((v, i) => {
              let dist: number | null = null;

              if (location !== "All" && v.coords) {
                const city = cityCoords[location];
                dist = distanceKm(city.lat, city.lon, v.coords.lat, v.coords.lon);
              }

              return (
                <div
                  key={i}
                  className="w-full md:max-w-[30%] p-5 bg-white rounded-xl shadow-md hover:shadow-lg cursor-pointer overflow-hidden"
                >
                  <div className="relative w-full h-50 overflow-hidden rounded-lg">
                    <motion.div
                      className="absolute inset-0 bg-gray-200 blur-lg scale-110"
                      animate={{ opacity: isLoaded ? 0 : 1 }}
                      transition={{ duration: 0.4 }}
                    />
                    <motion.img
                      src={v.image || PLACEHOLDER}
                      alt={v.name}
                      className="w-full h-50 object-cover rounded-lg"
                      loading="lazy"
                      initial={{ scale: 0.5, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      viewport={{ once: true, amount: 0.5 }}
                      onLoad={() => setIsLoaded(true)}
                      onError={(e: any) => {
                        e.currentTarget.src = PLACEHOLDER;
                      }}
                    />
                  </div>

                  <div className="p-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-gray-800">{v.name}</h3>
                      <div className="flex items-center text-gray-500 text-sm">
                        <span className="ml-1 text-white bg-green-700 p-1 rounded-lg text-[16px]">{v.rating}★</span>
                      </div>
                    </div>

                    <div className="mt-2 text-right">
                      <span className="text-lg font-medium text-gray-600">{v.cookTimeMinutes} mins</span>
                      {dist !== null && <div className="text-sm text-gray-500">{dist.toFixed(1)} km away</div>}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
          {/* Pagination controls */}
          <div className="w-full flex flex-col sm:flex-row items-center justify-between mt-6 px-4 gap-2 overflow-x-hidden">
            <div className="text-sm text-gray-600">
              Showing {total === 0 ? 0 : start + 1} - {start + paginated.length} of {total}
            </div>

            <div className="flex items-center gap-2">
              <button
                className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Prev
              </button>

              {/* page buttons - hidden on small screens to avoid overflow */}
              <div className="hidden sm:flex items-center gap-2 flex-wrap">
                {getPageItems(page, totalPages).map((it, idx) =>
                  typeof it === "string" ? (
                    <span key={`e-${idx}`} className="px-3 py-1 text-gray-500">{it}</span>
                  ) : (
                    <button
                      key={it}
                      className={`px-3 py-1 rounded ${it === page ? "bg-blue-600 text-white" : "bg-gray-100 hover:bg-gray-200"}`}
                      onClick={() => setPage(it)}
                    >
                      {it}
                    </button>
                  )
                )}
              </div>

              {/* compact page indicator for small screens */}
              <div className="sm:hidden text-sm text-gray-600 px-2">{page} / {totalPages}</div>

              <button
                className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next
              </button>
            </div>
          </div>
      </div>
    </>
  );
}
