import React, { useState, useMemo } from "react";

const CATEGORIES = [
  "Pizza",
  "Burgers",
  "Desserts",
  "North Indian",
  "Chinese",
  "Beverages",
  "South Indian",
];

const RESTAURANTS = [
  {
    id: 1,
    name: "Crave Pizza Co.",
    cuisine: "Pizza, Italian",
    rating: 4.4,
    priceForTwo: "₹650",
    time: "30 mins",
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    offers: ["20% off up to ₹150"],
  },
  {
    id: 2,
    name: "Spice Route",
    cuisine: "North Indian, Mughlai",
    rating: 4.2,
    priceForTwo: "₹900",
    time: "40 mins",
    image:
      "https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    offers: ["Free delivery above ₹399"],
  },
  {
    id: 3,
    name: "Noodle House",
    cuisine: "Chinese, Asian",
    rating: 4.0,
    priceForTwo: "₹550",
    time: "25 mins",
    image:
      "https://images.unsplash.com/photo-1653666322609-df808a84bc0e?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    offers: ["10% off on first order"],
  },
  {
    id: 4,
    name: "Sweet Tooth Desserts",
    cuisine: "Desserts, Bakery",
    rating: 4.6,
    priceForTwo: "₹400",
    time: "20 mins",
    image:
      "https://images.unsplash.com/photo-1511920170033-f8396924c348?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    offers: [],
  },
  {
    id: 5,
    name: "Burger Craft",
    cuisine: "Burgers, Fast Food",
    rating: 4.3,
    priceForTwo: "₹500",
    time: "30 mins",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=999&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    offers: ["Buy 1 Get 1 Free"],
  },
];

function Header() {
  return (
    <header className="bg-[#121212] text-white shadow-sm sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-red-500 font-extrabold text-2xl">ZomoClone</div>
          <div className="text-sm text-gray-400 hidden md:block">
            Delivering happiness
          </div>
        </div>
        <nav className="flex items-center gap-4">
          <button className="hidden md:inline-block text-gray-300 px-4 py-2 rounded-lg hover:text-white">
            Login
          </button>
          <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
            Sign up
          </button>
        </nav>
      </div>
    </header>
  );
}

function Hero({ onSearch }) {
  const [val, setVal] = useState("");
  return (
    <section className="bg-[#1a1a1a] text-white">
      <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Hungry? Order from the best nearby
          </h1>
          <p className="text-gray-400 mb-6">
            Restaurants, quick bites, desserts — delivered fast to your door.
          </p>

          <div className="flex gap-2">
            <input
              value={val}
              onChange={(e) => setVal(e.target.value)}
              placeholder="Search for restaurants, cuisines or dishes"
              className="flex-1 px-4 py-3 rounded-lg border border-gray-600 bg-[#222] text-gray-200 focus:outline-none"
            />
            <button
              onClick={() => onSearch(val)}
              className="bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700"
            >
              Search
            </button>
          </div>

          <div className="mt-6 flex gap-2 flex-wrap">
            {CATEGORIES.slice(0, 5).map((c) => (
              <span
                key={c}
                className="px-3 py-1 bg-[#222] border border-gray-700 rounded-full text-sm text-gray-300"
              >
                {c}
              </span>
            ))}
          </div>
        </div>

        <div className="hidden md:block">
          <img
            alt="food"
            src="https://images.unsplash.com/photo-1600891964599-f61ba0e24092?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80"
            className="w-full rounded-lg shadow-lg border border-gray-700"
          />
        </div>
      </div>
    </section>
  );
}

function CategoryBar({ selected, onSelect }) {
  return (
    <div className="max-w-6xl mx-auto px-4 py-4 overflow-x-auto bg-[#121212]">
      <div className="flex gap-3">
        <button
          className={`px-4 py-2 rounded-full ${
            selected === null
              ? "bg-red-600 text-white"
              : "bg-[#1f1f1f] border border-gray-700 text-gray-300"
          }`}
          onClick={() => onSelect(null)}
        >
          All
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => onSelect(c)}
            className={`px-4 py-2 rounded-full ${
              selected === c
                ? "bg-red-600 text-white"
                : "bg-[#1f1f1f] border border-gray-700 text-gray-300"
            }`}
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}

function RestaurantCard({ r }) {
  return (
    <div className="bg-[#1c1c1c] rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow border border-gray-800">
      <img
        src={r.image}
        alt={r.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4 text-white">
        <div className="flex items-start justify-between">
          <h3 className="font-semibold text-lg">{r.name}</h3>
          <div className="text-sm px-2 py-1 rounded-md bg-green-700 text-white">
            {r.rating} ★
          </div>
        </div>
        <p className="text-sm text-gray-400 mt-1">{r.cuisine}</p>
        <div className="flex items-center gap-3 text-sm text-gray-400 mt-3">
          <div>{r.time}</div>
          <div>•</div>
          <div>{r.priceForTwo} for two</div>
        </div>

        {r.offers && r.offers.length > 0 && (
          <div className="mt-3 text-sm text-red-400">{r.offers[0]}</div>
        )}
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="bg-[#121212] mt-12 text-gray-400">
      <div className="max-w-6xl mx-auto px-4 py-8 text-sm">
        ZomoClone static demo · made with ❤️
      </div>
    </footer>
  );
}

export default function App() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return RESTAURANTS.filter((r) => {
      const matchesQ =
        !q ||
        r.name.toLowerCase().includes(q) ||
        r.cuisine.toLowerCase().includes(q);
      const matchesCategory =
        !category ||
        r.cuisine.toLowerCase().includes(category.toLowerCase()) ||
        category === null;
      return matchesQ && matchesCategory;
    });
  }, [query, category]);

  return (
    <div className="min-h-screen bg-[#181818]">
      <Header />
      <Hero onSearch={(val) => setQuery(val)} />
      <CategoryBar selected={category} onSelect={(c) => setCategory(c)} />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6 text-white">
          <h2 className="text-2xl font-bold">Popular near you</h2>
          <div className="text-gray-400">{filtered.length} places</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((r) => (
            <RestaurantCard r={r} key={r.id} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            No restaurants found — try another search.
          </div>
        )}

        <Footer />
      </main>
    </div>
  );
}
