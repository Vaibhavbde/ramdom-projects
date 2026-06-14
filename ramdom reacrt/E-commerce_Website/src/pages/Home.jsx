import { useEffect, useState } from "react";
import Spinner from "../components/Spinner";
import Product from "../components/Product";
import { useDispatch, useSelector } from "react-redux";
import { setProducts, setSelectedCategory, setSelectedPrice, updateFilteredProducts } from "../redux/Slices/CartSlice";

const Home = () => {
  const API_URL = "https://fakestoreapi.com/products";
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);

  const dispatch = useDispatch();
  const { filtered, selectedCategory, selectedPrice } = useSelector((state) => state.products);




  // Fetch products from API
  async function fetchProductData() {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setPosts(data);
      dispatch(setProducts(data));
      dispatch(updateFilteredProducts(data));
    } catch (err) {
      alert("Error loading products");
      setPosts([]);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchProductData();
  }, []);

  // 🔹 Apply filters whenever category or price changes
  useEffect(() => {
    let filteredData = posts;

    // Filter by category
    if (selectedCategory && selectedCategory !== "All") {
      filteredData = filteredData.filter(
        (item) => item.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filter by price
    if (selectedPrice) {
      filteredData = filteredData.filter((item) => {
        if (selectedPrice === "0-50") return item.price >= 0 && item.price <= 50;
        if (selectedPrice === "50-100") return item.price > 50 && item.price <= 100;
        if (selectedPrice === "100+") return item.price > 100;
        return true;
      });
    }

    dispatch(updateFilteredProducts(filteredData));
  }, [selectedCategory, selectedPrice, posts, dispatch]);

  const uniqueCategories = ["All", ...new Set(posts.map((e) => e.category))];

  console.log(filtered)

  return (
    <div className="flex bg-gray-100 p-10 mx-auto space-x-4">
      {/* Sidebar filters */}
      <div className="w-64 p-4 rounded border-r-2 border-gray-200 bg-white shadow-sm">
        {/* Category Filter */}
        <div className="mb-6 mt-5">
          <p className="font-semibold text-lg mb-2">Category</p>
          <div className="flex flex-col mt-2 space-y-1">
            {uniqueCategories.map((cat) => (
              <button
                key={cat}
                className={`text-left px-2 py-1 rounded hover:bg-gray-200 ${selectedCategory === cat ? "bg-gray-300 font-semibold" : ""
                  }`}
                onClick={() => dispatch(setSelectedCategory(cat))}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Price Filter */}
        <div className="mb-4">
          <p className="font-semibold text-lg mb-2">Price</p>
          <div className="flex flex-col mt-2 space-y-2">
            <label className="cursor-pointer">
              <input
                type="radio"
                name="price"
                value="0-50"
                checked={selectedPrice === "0-50"}
                onChange={(e) => dispatch(setSelectedPrice(e.target.value))}
                className="mr-2"
              />
              $0 - $50
            </label>

            <label className="cursor-pointer">
              <input
                type="radio"
                name="price"
                value="50-100"
                checked={selectedPrice === "50-100"}
                onChange={(e) => dispatch(setSelectedPrice(e.target.value))}
                className="mr-2"
              />
              $50 - $100
            </label>

            <label className="cursor-pointer">
              <input
                type="radio"
                name="price"
                value="100+"
                checked={selectedPrice === "100+"}
                onChange={(e) => dispatch(setSelectedPrice(e.target.value))}
                className="mr-2"
              />
              $100+
            </label>

          </div>
        </div>
      </div>

      {/* Product grid */}
      <div className="flex-1 grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {loading ? (
          <Spinner />
        ) : filtered.length > 0 ? (
          filtered.map((post) => <Product key={post.id} post={post} />)
        ) : (
          <p>No data found</p>
        )}
      </div>
    </div>
  );
};

export default Home;
