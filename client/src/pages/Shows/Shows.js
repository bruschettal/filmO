import axios from "axios";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Card from "../../components/Card/Card";

function Shows() {
  const tmdbAPI = process.env.REACT_APP_API_KEY;
  const popularShowsAPI = `https://api.themoviedb.org/3/tv/popular?api_key=${tmdbAPI}&language=en-US&page=1`;

  const [popularShows, setPopularShows] = useState([]);

  /*   useEffect(() => {
    fetch(popularShowsAPI)
      .then((res) => res.json())
      .then((data) => {
        setPopularShows(data.results);
      });
  }, []); */

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [pagesReached, setPagesReached] = useState(false);

  const [fetchUrl, setFetchUrl] = useState(
    "https://api.themoviedb.org/3/tv/popular?"
  );

  const [urlSortBy, setUrlSortBy] = useState("");
  const [urlVoteCount, setUrlVoteCount] = useState("");

  const newestAndTopRatedApi = "https://api.themoviedb.org/3/discover/tv?";
  const popularApi = "https://api.themoviedb.org/3/tv/popular?";

  /*   useEffect(() => {
    fetch(popularMoviesAPI)
      .then((res) => res.json())
      .then((data) => {
        setPopularMovies(data.results);
      });
  }, []); */

  function newestShowsLink() {
    setPageNumber(1);
    if (urlVoteCount !== "10") {
      setPopularShows([]);
    }
    setUrlSortBy("release_date.desc");
    setUrlVoteCount("10");
    setFetchUrl(newestAndTopRatedApi);
  }

  function topRatedShowsLink() {
    setPageNumber(1);
    if (urlVoteCount !== "500") {
      setPopularShows([]);
    }
    setUrlSortBy("vote_average.desc");
    setUrlVoteCount("1000");
    setFetchUrl(newestAndTopRatedApi);
  }

  function popularShowsLink() {
    setPageNumber(1);
    if (fetchUrl !== popularApi) {
      setPopularShows([]);
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
        region: "us",
        page: pageNumber,
        sort_by: urlSortBy,
        include_null_first_air_dates: "false",
        "vote_count.gte": urlVoteCount,
      },
      cancelToken: new axios.CancelToken((c) => (cancel = c)),
    })
      .then((response) => {
        setPopularShows((prevShows) => {
          return [...new Set([...prevShows, ...response.data.results])];
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
            onClick={popularShowsLink}
            className={urlVoteCount === "" ? "sort-links active" : "sort-links"}
          >
            Popular TV Shows
          </h2>
          <h3
            onClick={newestShowsLink}
            className={
              urlVoteCount === "10" ? "sort-links active" : "sort-links"
            }
          >
            Newest
          </h3>
          <h3
            onClick={topRatedShowsLink}
            className={
              urlVoteCount === "1000" ? "sort-links active" : "sort-links"
            }
          >
            Top Rated
          </h3>
        </div>
        <div className="cards-container">
          {popularShows.map((show, index) => {
            if (popularShows.length === index + 1) {
              return <Card ref={lastCardRef} key={show.id} {...show} />;
            } else {
              return <Card key={show.id} {...show} />;
            }
          })}
        </div>
      </div>
    </>
  );
}

export default Shows;

{
  /* <div className="cards-container">
{popularMovies.map((movie, index) => {
  if (popularMovies.length === index + 1) {
    return <Card ref={lastCardRef} key={movie.id} {...movie} />;
  } else {
    return <Card key={movie.id} {...movie} />;
  }
})}
</div>

<div className="cards-container">
          {popularShows.map((show) => (
            <Card key={show.id} {...show} />
          ))}
        </div> */
}
