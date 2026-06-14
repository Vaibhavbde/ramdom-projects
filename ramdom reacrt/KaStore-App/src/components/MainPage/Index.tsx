import React, { FC, useEffect, useState } from "react";
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import { TVShowsType } from "../Types/Types";
import { MoviesType } from "../Types/Types";


interface IndexProps {
  addToFavorites:(item:any) => void;
}
const Index: FC<IndexProps> = ({addToFavorites}) => {
  const [trendingmovies, setTrendingmovies] = useState<MoviesType[]>([]);
  const [ratedTVShows, setRatedTVShows] = useState<TVShowsType[]>([]);
  const [upComingMovies, setUpComingMovies] = useState<MoviesType[]>([]);
  const [ratedMovies, setRatedMovies] = useState<MoviesType[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchQuery, setsearchQuery] = useState<MoviesType[]>([]);
  const [searchQueryTV, setsearchQueryTV] = useState<TVShowsType[]>([]);


  const FetchData = async () => {
    const movieapikey = process.env.REACT_APP_MOVIES_API_KEY;
    const movieapiurl = process.env.REACT_APP_MOVIES_API_URL;

    const TrendingMovies = `${movieapiurl}/trending/movie/day?api_key=${movieapikey}&language=en-US&page=6`;
    const RatedTVShows = `${movieapiurl}/tv/top_rated?api_key=${movieapikey}&language=en-US&page=1`;
    const UpcomingMovieUrl = `${movieapiurl}/movie/upcoming?api_key=${movieapikey}`;
    const RatedMovieUrl = `${movieapiurl}/movie/top_rated?api_key=${movieapikey}`;
    const SearchMovieUrl = `${movieapiurl}/search/movie?api_key=${movieapikey}&query=${searchTerm}`;
    const SearchTVUrl = `${movieapiurl}/search/tv?api_key=${movieapikey}&query=${searchTerm}`;
 
    try {
      const [
        trendingresponse,
        RatedTVresponse,
        upcomingResponse,
        ratedResponse,
        searchmovieresponse,
        searchtvresponse,
] = await Promise.all([
        fetch(TrendingMovies),
        fetch(RatedTVShows),
        fetch(UpcomingMovieUrl),
        fetch(RatedMovieUrl),
        fetch(SearchMovieUrl),
        fetch(SearchTVUrl),
      ]);

      const trendingmovie = await trendingresponse.json();
      const ratedtvshows = await RatedTVresponse.json();
      const upcomingMovies = await upcomingResponse.json();
      const ratedMovie = await ratedResponse.json();
      const searchMovie = await searchmovieresponse.json();
      const searchTv = await searchtvresponse.json();

      setTrendingmovies(trendingmovie.results);
      setRatedTVShows(ratedtvshows.results);
      setUpComingMovies(upcomingMovies.results);
      setRatedMovies(ratedMovie.results);
      setsearchQuery(searchMovie.results);
      setsearchQueryTV(searchTv.results)
    } catch (error) {
      console.error("Error fetching movies", error);
    }
  };
  const FormSubmitHandle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm) {
      console.log("Please enter a search term"); 
      return;
    }
  };

  useEffect(() => {
    FetchData();
  }, [searchTerm]);

  return (
    <div>
      <Header
      addToFavorites ={addToFavorites}
        trendingmovies={trendingmovies}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        searchQuery={searchQuery}
        searchQueryTV={searchQueryTV}
        FormSubmitHandle={FormSubmitHandle}

      />
      <Main ratedtvshows={ratedTVShows} upcomingmovies={upComingMovies} />
      <Footer />
    </div>
  );
};

export default Index;
