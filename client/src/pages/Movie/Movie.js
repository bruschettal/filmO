import axios from "axios";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Card from "../../components/Card/Card";
import "./Movie.css";

function Movie() {
  const tmdbAPI = process.env.REACT_APP_API_KEY;
  const popularMoviesAPI = `https://api.themoviedb.org/3/movie/popular?api_key=${tmdbAPI}&language=en-US&page=1`;

  const [popularMovies, setPopularMovies] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [pagesReached, setPagesReached] = useState(false);

  const [fetchUrl, setFetchUrl] = useState(
    "https://api.themoviedb.org/3/movie/popular?"
  );

  const [urlSortBy, setUrlSortBy] = useState("");
  const [urlVoteCount, setUrlVoteCount] = useState("");

  const newestAndTopRatedApi = "https://api.themoviedb.org/3/discover/movie?";
  const popularApi = "https://api.themoviedb.org/3/movie/popular?";

  /*   useEffect(() => {
    fetch(popularMoviesAPI)
      .then((res) => res.json())
      .then((data) => {
        setPopularMovies(data.results);
      });
  }, []); */

  function newestMoviesLink() {
    setPageNumber(1);
    if (urlVoteCount !== "10") {
      setPopularMovies([]);
    }
    setUrlSortBy("release_date.desc");
    setUrlVoteCount("10");
    setFetchUrl(newestAndTopRatedApi);
  }

  function topRatedMoviesLink() {
    setPageNumber(1);
    if (urlVoteCount !== "500") {
      setPopularMovies([]);
    }
    setUrlSortBy("vote_average.desc");
    setUrlVoteCount("500");
    setFetchUrl(newestAndTopRatedApi);
  }

  function popularMoviesLink() {
    setPageNumber(1);
    if (fetchUrl !== popularApi) {
      setPopularMovies([]);
    }
    setUrlSortBy("");
    setUrlVoteCount("");
    setFetchUrl(popularApi);
  }

  useEffect(() => {
    setLoading(true);
    setError(false);
    let cancel;
    axios({
      method: "GET",
      url: fetchUrl,
      params: {
        api_key: process.env.REACT_APP_API_KEY,
        language: "en",
        page: pageNumber,
        sort_by: urlSortBy,
        include_adult: "false",
        include_video: "false",
        "vote_count.gte": urlVoteCount,
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
  }, [pageNumber, urlSortBy]);

  const observer = useRef();

  const lastCardRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      if (pageNumber === 50) {
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

  return (
    <>
      <div className="cards-wrapper">
        <div className="cards-container-header">
          <h2
            onClick={popularMoviesLink}
            className={urlVoteCount === "" ? "sort-links active" : "sort-links"}
          >
            Popular Movies
          </h2>
          <h3
            onClick={newestMoviesLink}
            className={
              urlVoteCount === "10" ? "sort-links active" : "sort-links"
            }
          >
            Newest
          </h3>
          <h3
            onClick={topRatedMoviesLink}
            className={
              urlVoteCount === "500" ? "sort-links active" : "sort-links"
            }
          >
            Top Rated
          </h3>
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

export default Movie;

{
  /* <div className="cards-container">
          {popularMovies.map((movie, index) => (
            <Card key={movie.id} {...movie} />
          ))}
        </div> */
}
