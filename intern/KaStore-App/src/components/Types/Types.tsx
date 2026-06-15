
export type MoviesType = {
    id: number;
    title: string;
    overview: string;
    popularity: number;
    backdrop_path: string;
    genre_ids:number[];
    poster_path: string;
    release_date: string;
    vote_average: number;
    vote_count: number;
    original_language:string;
  };
  export type TVShowsType = {
    id: number;
    name: string;
    overview: string;
    popularity: number;
    backdrop_path: string;
    genre_ids:number[];
    poster_path: string;
    first_air_date: string;
    vote_average: number;
    vote_count: number;
    original_language:string;
  };
  export type MovieGenreType ={
    id:number,
    name:string;
  }
  export type TVShowsDetailsType = {
    id: number;
    name: string;
    tagline:string;
    overview: string;
    popularity: number;
    backdrop_path: string;
    homepage:string;
    genres: { id: number; name: string }[];
    poster_path: string;
    first_air_date: string;
    vote_average: number;
    vote_count: number;
    status:string;
    director:string;
    production_countries: {
      iso_3166_1: string,
    name: string}[]
  };
  export type MovieDetailsType = {
    id: number;
    title: string;
    tagline:string;
    overview: string;
    popularity: number;
    backdrop_path: string;
    homepage:string;
    genres: { id: number; name: string }[];
    poster_path: string;
    release_date: string;
    vote_average: number;
    vote_count: number;
    status:string;
    director:string;
    production_countries: {
      iso_3166_1: string,
    name: string}[]
  }
  export type CastType = {
    id: number;
    name: string;
    character: string;
    profile_path: string;
  };
  
  export type CrewType = {
    id: number;
    name: string;
    job: string;
    department:string;
  };
export type CombinedType = {
  id: number;
  title?: string; 
  name?: string;  
  release_date?: string; 
  first_air_date?: string; 
  poster_path?: string; 
};
export type LanguageType = {
  iso_639_1: string;
  english_name:string,
  name: string;  
};
