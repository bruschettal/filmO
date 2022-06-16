import { forwardRef, useEffect, useState } from "react";
import axios from "axios";
import "./Card.css";
import { Link } from "react-router-dom";
import posterPlaceholder from "../../assets/posterPlaceholder.png";
import peoplePlaceholder from "../../assets/peoplePlaceholder.jpg";

const Card = forwardRef((props, ref) => {
  const IMG_API = "https://image.tmdb.org/t/p/w500";
  const IMG_API_OLD = "https://image.tmdb.org/t/p/w1280";

  const tmdbAPI = process.env.REACT_APP_API_KEY;
  const MOVIE_DATA_API = `https://api.themoviedb.org/3/movie/${props.id}?api_key=${tmdbAPI}&language=en`;
  const SERIES_DATA_API = `https://api.themoviedb.org/3/tv/${props.id}?api_key=${tmdbAPI}&language=en-US`;
  const PEOPLE_DATA_API = `https://api.themoviedb.org/3/person/${props.id}?api_key=${tmdbAPI}&language=en-US`;

  const [details, setDetails] = useState([]);

  let currentType, detailRequest;

  if (props.known_for) {
    currentType = "people";
  } else if (props.title) {
    currentType = "movie";
  } else if (props.name) {
    currentType = `show`;
  }

  if (currentType === "movie") {
    detailRequest = MOVIE_DATA_API;
  } else if (currentType === "show") {
    detailRequest = SERIES_DATA_API;
  } else {
    detailRequest = PEOPLE_DATA_API;
  }

  useEffect(() => {
    async function fetchData() {
      const request = await axios.get(detailRequest);
      setDetails(request.data);
    }
    //console.log(props);

    fetchData();
  }, []);

  let urlType, imageType, titleType, lengthType;

  function typeHandler() {
    if (currentType === "people") {
      urlType = `/people/${props.id}`;
      imageType =
        props.profile_path !== null
          ? `${IMG_API}${props.profile_path}`
          : peoplePlaceholder;
      titleType = `${props.name}`;
    } else if (currentType === "movie") {
      urlType = `/movie/${props.id}`;
      imageType =
        props.poster_path !== null
          ? `${IMG_API}${props.poster_path}`
          : posterPlaceholder;
      titleType = `${props.title}`;
      //dateType = `${details.release_date.split("-")[0]}`;
      lengthType =
        details.runtime == null ? "Unknown" : `${details.runtime} minutes`;
    } else if (currentType === `show`) {
      urlType = `/show/${props.id}`;
      imageType =
        props.poster_path !== null
          ? `${IMG_API}${props.poster_path}`
          : posterPlaceholder;
      titleType = `${props.name}`;
      lengthType = `${details.number_of_seasons} ${
        details.number_of_seasons === 1 ? "season" : "seasons"
      }`;

      //dateType = `${details.first_air_date.split("-")[0]}`;
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
    <div className="card" ref={ref}>
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
          {currentType !== "people" && (
            <div className="card-genre">
              {details.genres !== undefined
                ? details.genres.map((element) => element.name).join(", ")
                : ``}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
});

export default Card;
