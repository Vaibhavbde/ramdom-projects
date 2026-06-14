import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { GlobalContext } from "../../context";
import Loader from "../../components/Loader";
import ReviewSection from "./ReviewSection";

export default function Details() {
  const { id } = useParams();
  const {
    recipeDetailsData,
    setRecipeDetailsData,
    favoritesList,
    handleAddToFavorite,
    error,
    info,
  } = useContext(GlobalContext);

  useEffect(() => {
    async function getRecipeDetails() {
      try {
        const response = await fetch(
          `https://forkify-api.herokuapp.com/api/v2/recipes/${id}`
        );
        const data = await response.json();
        if (data?.data) setRecipeDetailsData(data?.data);
      } catch (e) {
        console.log(e);
      }
    }
    getRecipeDetails();
  }, [id, setRecipeDetailsData]);

  if (!recipeDetailsData && !error) return <Loader />;

  const recipe = recipeDetailsData?.recipe;

  return (
    <div className="container mx-auto py-10 px-4 ">
      <div className="bg-white  dark:bg-neutral-900 rounded-2xl shadow-lg overflow-hidden grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* --- Left Side: Image --- */}
        <div className="flex items-center justify-center bg-gray-50 dark:bg-neutral-800 p-4">
          <img
            src={recipe?.image_url}
            alt={recipe?.title || "recipe image"}
            loading="lazy"
            className="rounded-xl object-cover w-full h-72 lg:h-full shadow-md hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* --- Right Side: Content --- */}
        <div className="flex flex-col justify-center gap-5 p-8">
          <div>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {recipe?.title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              by {recipe?.publisher}
            </p>
          </div>

          {/* Description Placeholder */}
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
            This delicious dish is easy to make and packed with flavor. Perfect
            for family dinners or gatherings with friends.
          </p>

          {/* Tags (Optional badges like “Main Course”, etc.) */}
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-rose-100 text-rose-700 text-xs font-semibold rounded-full">
              Main Course
            </span>
            <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full">
              American
            </span>
            <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full">
              Vegetarian
            </span>
          </div>

          {/* --- Price / Button Section --- */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4">
            <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              Rs. 210
            </p>
            <button
              onClick={() => handleAddToFavorite(recipe)}
              className="w-full sm:w-auto bg-[#800020] hover:bg-[#9c0030] text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-200"
            >
              {favoritesList &&
                favoritesList.length > 0 &&
                favoritesList.findIndex((item) => item.id === recipe?.id) !== -1
                ? "Remove from Favorites"
                : "Add to Favorites"}
            </button>
          </div>

          {info && (
            <p className="text-green-600 dark:text-green-400 text-sm">
              {info}
            </p>
          )}

          {/* --- Ingredients --- */}
          <div className="mt-6">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Ingredients:
            </h4>
            <ul className="space-y-2">
              {recipe?.ingredients?.map((ingredient, i) => (
                <li
                  key={i}
                  className="flex items-center text-gray-700 dark:text-gray-300 text-sm"
                >
                  <span className="font-medium mr-2">
                    {ingredient?.quantity || ""} {ingredient?.unit || ""}
                  </span>
                  <span>{ingredient?.description}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* --- Error --- */}
          {error && (
            <p className="text-center text-red-600 dark:text-red-400 font-semibold mt-4">
              {error}
            </p>
          )}
        </div>

      </div>
      <ReviewSection />
    </div>
  );
}
