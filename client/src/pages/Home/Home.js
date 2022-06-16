import "./Home.css";
import axios from "axios";
import { useEffect } from "react";

import React, { useCallback, useRef, useState } from "react";
import Card from "../../components/Card/Card";
function Home() {
  useEffect(() => {
    let user = JSON.parse(localStorage.getItem("user"));

    if (user) {
      localStorage.setItem(
        "favorites",
        JSON.stringify({ tv_shows: [], movies: [] })
      );
      async function getFavorites() {
        let token = user.accessToken;
        await axios
          .get("/auth/favorites", {
            headers: {
              Authorization: "Bearer " + token,
            },
          })
          .then((resp) => {
            localStorage.setItem("favorites", JSON.stringify(resp.data));
            localStorage.setItem("last_favorites_check", new Date().getTime());
          });
      }
      getFavorites();
    }
  });
  ///////////////////////////////////////
  const tmdbAPI = process.env.REACT_APP_API_KEY;
  const popularMoviesAPI = `https://api.themoviedb.org/3/movie/popular?api_key=${tmdbAPI}&language=en-US&page=1`;

  const [popularMovies, setPopularMovies] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [pagesReached, setPagesReached] = useState(false);

  /*   useEffect(() => {
  fetch(popularMoviesAPI)
    .then((res) => res.json())
    .then((data) => {
      setPopularMovies(data.results);
    });
}, []); */

  useEffect(() => {
    setLoading(true);
    setError(false);
    let cancel;
    axios({
      method: "GET",
      url: "https://api.themoviedb.org/3/trending/movie&tv/week?",
      params: {
        api_key: process.env.REACT_APP_API_KEY,
        language: "en",
        region: "us",
        page: pageNumber,
      },
      cancelToken: new axios.CancelToken((c) => (cancel = c)),
    })
      .then((response) => {
        setPopularMovies((prevMovies) => {
          return [...new Set([...prevMovies, ...response.data.results])];
        });
        setHasMore(response.data.results.length > 0);
        setLoading(false);
      })
      .catch((error) => {
        if (axios.isCancel(error)) return;
        setError(true);
      });
    return () => cancel();
  }, [pageNumber]);

  const observer = useRef();

  const lastCardRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      if (pageNumber === 40) {
        setPagesReached(true);
      } else {
        observer.current = new IntersectionObserver((entries) => {
          if (entries[0].isIntersecting && hasMore) {
            setPageNumber((prevPageNumber) => prevPageNumber + 1);
          }
        });
        if (node) observer.current.observe(node);
      }
    },
    [loading, hasMore]
  );

  /////////////////////////////////////

  return (
    <>
      <div className="cards-wrapper">
        <div className="cards-container-header">
          <h2>Popular Movies and TV Shows</h2>
        </div>
        <div className="cards-container">
          {popularMovies.map((movie, index) => {
            if (popularMovies.length === index + 1) {
              return <Card ref={lastCardRef} key={movie.id} {...movie} />;
            } else {
              return <Card key={movie.id} {...movie} />;
            }
          })}
        </div>
      </div>
    </>
  );
}

export default Home;
