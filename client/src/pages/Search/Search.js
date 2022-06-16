import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Card from "../../components/Card/Card";

function Search() {
  const [searchParams] = useSearchParams();
  const [searchResults, setSearchResults] = useState([]);
  const query = searchParams.get("query");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [pagesReached, setPagesReached] = useState(false);

  useEffect(() => {
    setSearchResults([]);
    setPageNumber(1);
  }, [query]);

  useEffect(() => {
    setLoading(true);
    setError(false);
    let cancel;
    axios({
      method: "GET",
      url: "https://api.themoviedb.org/3/search/multi?",
      params: {
        api_key: process.env.REACT_APP_API_KEY,
        query: query,
        language: "en",
        region: "us",
        page: pageNumber,
      },
      cancelToken: new axios.CancelToken((c) => (cancel = c)),
    })
      .then((response) => {
        setSearchResults((prevMovies) => {
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
  }, [pageNumber, query]);

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
    <div className="search-wrapper">
      <div className="cards-wrapper">
        <div className="cards-container-header">
          <h2>Search results for "{query}"</h2>
        </div>
        <div className="cards-container">
          {searchResults !== undefined
            ? searchResults.map((result, index) => {
                if (searchResults.length === index + 1) {
                  return <Card ref={lastCardRef} key={result.id} {...result} />;
                } else {
                  return <Card key={result.id} {...result} />;
                }
              })
            : "loading"}
        </div>
      </div>
    </div>
  );
}

export default Search;
