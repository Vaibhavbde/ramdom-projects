import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const GlobalContext = createContext(null);

export default function GlobalState({ children }) {
  const [searchParam, setSearchParam] = useState(() => localStorage.getItem('searchParam') || "pizzas");
  const [loading, setLoading] = useState(false);
  const [recipeList, setRecipeList] = useState(() => {
    try { return JSON.parse(localStorage.getItem('recipeList')) || []; } catch { return []; }
  });
  const [recipeDetailsData, setRecipeDetailsData] = useState(null);
  const [favoritesList, setFavoritesList] = useState(() => {
    try { return JSON.parse(localStorage.getItem('favorites')) || []; } catch { return []; }
  })
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') === 'dark' ? 'dark' : 'light')
  const [error, setError] = useState("")
  const [info, setInfo] = useState("")

  const navigate = useNavigate();

  console.log(searchParam)
  useEffect(() => {
    const res = async () => {
      if (recipeList.length === 0) {
        try {
          const defaultData = await fetch(`https://forkify-api.herokuapp.com/api/v2/recipes?search=pizzas`);
          const fres = await defaultData.json();
          console.log()
          setRecipeList(fres.data.recipes)

        } catch (error) {
          console.log(error)
        }
      }

    }
    res()
  }, [])

  async function handleSubmit(event, param) {
    if (event) event.preventDefault();
    setLoading(true);
    setError("");
    setInfo("");

    const query = param || searchParam; // use param if provided
    try {
      const res = await fetch(
        `https://forkify-api.herokuapp.com/api/v2/recipes?search=${query}`
      );
      const data = await res.json();

      if (data?.data?.recipes?.length > 0) {
        setRecipeList(data.data.recipes);
        setInfo("");
      } else {
        setRecipeList([]);
        setInfo(`No recipes found for "${query}"`);
      }

      setLoading(false);
    } catch (e) {
      console.log(e);
      setError("Failed to fetch recipes. Please try again.");
      setLoading(false);
    }
  }





  function handleAddToFavorite(getCurrentItem){
    console.log(getCurrentItem);
    let cpyFavoritesList = [...favoritesList];
    const index = cpyFavoritesList.findIndex(item=> item.id === getCurrentItem.id)

    if(index === -1) {
      cpyFavoritesList.push(getCurrentItem)
      setInfo("Added to favorites")
    } else {
      cpyFavoritesList.splice(index, 1)
      setInfo("Removed from favorites")
    }

    setFavoritesList(cpyFavoritesList)
  }

  // set initial html class for theme on mount
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [])

  // persist favorites to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('favorites', JSON.stringify(favoritesList));
    } catch (e) {
      console.log(e);
    }
  }, [favoritesList]);

  // persist recipe list and search term
  useEffect(() => {
    try {
      localStorage.setItem('recipeList', JSON.stringify(recipeList));
    } catch (e) { console.log(e); }
  }, [recipeList]);

  useEffect(() => {
    try {
      localStorage.setItem('searchParam', searchParam);
    } catch (e) { console.log(e); }
  }, [searchParam]);

  // persist theme and update html class
  useEffect(() => {
    try {
      localStorage.setItem('theme', theme)
      document.documentElement.classList.toggle('dark', theme === 'dark')
    } catch (e) {
      console.log(e)
    }
  }, [theme])

  function toggleTheme(){
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }

  // auto-clear info messages after a short delay
  useEffect(() => {
    if (!info) return;
    const t = setTimeout(() => setInfo("") , 2000);
    return () => clearTimeout(t);
  }, [info])

  console.log(favoritesList, 'favoritesList');

  return (
    <GlobalContext.Provider
      value={{
        searchParam,
        loading,
        recipeList,
        setSearchParam,
        handleSubmit,
        recipeDetailsData,
        setRecipeDetailsData,
        handleAddToFavorite,
        favoritesList,
        theme,
        toggleTheme,
        error,
        info,
        setInfo,
        setError
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}
