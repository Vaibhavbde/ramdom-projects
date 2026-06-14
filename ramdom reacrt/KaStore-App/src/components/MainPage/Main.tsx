import React, { FC } from "react";
import MovieCarousel from "./MovieCarousel";
import { TVShowsType } from "../Types/Types";
import { MoviesType } from "../Types/Types";
import UpcomingCarousel from "./UpcomingCarousel";

interface RatedTvshowsProps {
  ratedtvshows: TVShowsType[];
  upcomingmovies: MoviesType[];
}
const Main: FC<RatedTvshowsProps> = ({ratedtvshows,upcomingmovies}) => {
  return (
    <div>
      <section id="works" className="works">
        <div className="container">
          <div className="section-header">
            <h2>how it works</h2>
            <p>Learn More about how our website works</p>
          </div>
          <div className="works-content">
            <div className="row">
              <div className="col-md-4 col-sm-6">
                <div className="single-how-works">
                  <div className="single-how-works-icon">
                    <i className="flaticon-lightbulb-idea"></i>
                  </div>
                  <h2>
  <a title="#" href="#">
    Discover Your Favorite Shows
  </a>
</h2>
<p>
  Easily add your favorite movies and TV shows to your watchlist and keep track
  of them for later! With just a click, you can compile a personalized list of
  must-watch titles, making your viewing experience seamless and enjoyable.
  Never miss a great show or movie again.
</p>
</div>
</div>
<div className="col-md-4 col-sm-6">
  <div className="single-how-works">
    <div className="single-how-works-icon">
      <i className="flaticon-networking"></i>
    </div>
    <h2>
      <a title="#" href="#">
        Find Your Next Binge-Watch:
      </a>
    </h2>
    <p>
      Dive into our extensive catalog of movies and TV shows! Whether you're into
      drama, comedy, thrillers, or documentaries, explore a diverse range of content
      tailored to every taste. Use our filtering options to narrow down your choices
      and uncover hidden gems waiting to be watched.
    </p>

                </div>
              </div>
              <div className="col-md-4 col-sm-6">
                <div className="single-how-works">
                  <div className="single-how-works-icon">
                    <i className="flaticon-location-on-road"></i>
                  </div>
                  <h2>
  <a title="#" href="#">
    Watch Anywhere
  </a>
</h2>
<p>
  Curious about where you can watch? Easily find the streaming platforms
  available for each movie or TV show and check availability in your region.
  Our detailed information helps you make informed choices, so you can dive into
  your favorite shows and films without any hassle.
</p>

                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="MovieCarousel">
      <h1 className="ratedelement">Upcoming Movies</h1>
        <UpcomingCarousel upcomingmovies={upcomingmovies}/>
      <h1 className="ratedelement">Most Rated TV Shows</h1>
      <MovieCarousel ratedtvshows= {ratedtvshows} />
      </section> 
      <section id="statistics" className="statistics">
        <div className="container">
          <div className="statistics-counter">
            <div className="col-md-3 col-sm-6">
              <div className="single-ststistics-box">
                <div className="statistics-content">
                  <div className="counter">999 </div> <span>K+</span>
                </div>
                <h3>Media</h3>
              </div>
            </div>
            <div className="col-md-3 col-sm-6">
              <div className="single-ststistics-box">
                <div className="statistics-content">
                  <div className="counter">925</div> <span>k+</span>
                </div>
                <h3>Movies</h3>
              </div>
            </div>
            <div className="col-md-3 col-sm-6">
              <div className="single-ststistics-box">
                <div className="statistics-content">
                  <div className="counter">182</div> <span>k+</span>
                </div>
                <h3>Tv Shows</h3>
              </div>
            </div>
            <div className="col-md-3 col-sm-6">
              <div className="single-ststistics-box">
                <div className="statistics-content">
                  <div className="counter">10</div> <span>k+</span>
                </div>
                <h3>Users</h3>
              </div>
            </div>
          </div>
        </div>
      </section>
 
 
    </div>
  );
};

export default Main;
