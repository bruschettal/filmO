import axios from "axios";
import { useEffect, useState } from "react";
import "./FavoritesCards.css";
import posterPlaceholder from "../../assets/posterPlaceholder.png";
import { Link } from "react-router-dom";

function FavoritesCards(props) {
  const IMG_API = "https://image.tmdb.org/t/p/w500";

  const MOVIE_DATA_API = `https://api.themoviedb.org/3/movie/${props.id}?api_key=${process.env.REACT_APP_API_KEY}&language=en`;
  const SERIES_DATA_API = `https://api.themoviedb.org/3/tv/${props.id}?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`;

  const [movieId, setMovieId] = useState();
  const [details, setDetails] = useState([]);

  let detailRequest, imageType, titleType, lengthType, urlType;

  if (props.type === "movie") {
    detailRequest = MOVIE_DATA_API;
  } else if (props.type === "show") {
    detailRequest = SERIES_DATA_API;
  }

  useEffect(() => {
    async function fetchData() {
      const request = await axios.get(detailRequest);
      setDetails(request.data);
    }
    //console.log(props);

    fetchData();
  }, []);

  function typeHandler() {
    if (props.type === "movie") {
      urlType = `/movie/${props.id}`;
      imageType =
        details.poster_path !== null
          ? `${IMG_API}${details.poster_path}`
          : posterPlaceholder;
      titleType = `${details.title}`;
      //dateType = `${details.release_date.split("-")[0]}`;
      lengthType =
        details.runtime == null ? "Unknown" : `${details.runtime} minutes`;
    } else if (props.type === "show") {
      urlType = `/show/${details.id}`;
      imageType =
        details.poster_path !== null
          ? `${IMG_API}${details.poster_path}`
          : posterPlaceholder;
      titleType = `${details.name}`;
      lengthType = `${details.number_of_seasons} ${
        details.number_of_seasons === 1 ? "season" : "seasons"
      }`;
    }
  }

  function dateHandler() {
    if (details.release_date) {
      return <p>{details.release_date.split("-")[0]}</p>;
    } else if (details.first_air_date) {
      return <p>{details.first_air_date.split("-")[0]}</p>;
    } else {
      return <></>;
    }
  }

  return (
    <>
      {typeHandler()}
      <div className="card">
        {typeHandler()}
        <Link to={urlType}>
          <img className="card-image" src={imageType}></img>
          <div className="card-desc-wrapper">
            <h3>{titleType}</h3>
            <div className="card-year">
              {dateHandler()}
              <div className="card-length">
                {props.known_for == undefined ? (
                  <span className="span-dot">·</span>
                ) : (
                  ""
                )}
                {lengthType}
              </div>
            </div>
            <div className="card-genre">
              {details.genres !== undefined
                ? details.genres.map((element) => element.name).join(", ")
                : ``}
            </div>
          </div>
        </Link>
      </div>
    </>
  );
}

export default FavoritesCards;
