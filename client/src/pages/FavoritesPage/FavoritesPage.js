import "./FavoritesPage.css";
import { useEffect, useState } from "react";
import FavoritesCards from "../../components/FavoritesCards/FavoritesCards";
import Favorites from "../../favorites/Favorites";
import axios from "axios";

function FavoritesPage() {
  useEffect(() => {}, []);

  let user = JSON.parse(localStorage.getItem("user"));
  let favorites = JSON.parse(localStorage.getItem("favorites"));

  if (user === null) {
    window.location.replace("/");
  }

  function localMovies() {
    return favorites.movies.map((movie) => (
      <FavoritesCards key={movie} id={movie} type={"movie"} />
    ));
  }
  function localShows() {
    return favorites.tv_shows.map((show) => (
      <FavoritesCards key={show} id={show} type={"show"} />
    ));
  }

  return (
    <>
      <div className="cards-wrapper">
        <h1 className="cards-container-header">Your Favorite Movies</h1>
        <div className="cards-container">{localMovies()}</div>
      </div>

      <div className="cards-wrapper">
        <h1 className="cards-container-header">Your Favorite TV Shows</h1>
        <div className="cards-container">{localShows()}</div>
      </div>
    </>
  );
}

export default FavoritesPage;
