import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Cast from "../../components/Cast/Cast";
import axios from "axios";
import Trailer from "../../components/Trailer/Trailer";
import posterPlaceholder from "../../assets/posterPlaceholder.png";
import Favorites from "../../favorites/Favorites";
import heart_outline from "../../assets/heart_outline.svg";
import heart_filled from "../../assets/heart_filled.svg";

function ShowDetails() {
  const params = useParams();

  const IMG_API = "https://image.tmdb.org/t/p/w1280";
  const IMG_API_ORIGINAL = "https://image.tmdb.org/t/p/original";

  const SHOW_DATA_API = `https://api.themoviedb.org/3/tv/${params.id}?api_key=${process.env.REACT_APP_API_KEY}&language=en&append_to_response=credits,videos`;

  const [details, setDetails] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);

  let creatorTitle = "";
  let creatorOfTitle = "";
  function creatorHandler() {
    try {
      creatorTitle = "Creator";
      creatorOfTitle = details.credits.crew.find(
        (x) => x.job === "Creator"
      ).name;
    } catch (error) {
      try {
        creatorTitle = "Executive Producer";
        creatorOfTitle = details.credits.crew.find(
          (x) => x.job === "Executive Producer"
        ).name;
      } catch (error) {
        try {
          creatorTitle = "Director";
          creatorOfTitle = details.credits.crew.find(
            (x) => x.job === "Director"
          ).name;
        } catch (error) {}
      }
    }
  }

  let videoSource;

  function videoHandler() {
    try {
      videoSource = details.videos.results.filter(
        (video) => video.site === "YouTube" && video.type === "Trailer"
      )[0].key;
    } catch (error) {
      try {
        videoSource = details.videos.results.filter(
          (video) => video.site === "YouTube" && video.type === "Teaser"
        )[0].key;
      } catch (error) {
        try {
          videoSource = details.videos.results.filter(
            (video) => video.site === "YouTube" && video.type === "Clip"
          )[0].key;
        } catch (error) {}
      }
    }
  }

  useEffect(() => {
    async function fetchData(data) {
      const request = await axios.get(data);
      setDetails(request.data);
    }

    setIsFavorite(Favorites.isFavorite(params.id, "tv_shows"));

    fetchData(SHOW_DATA_API);
  }, []);

  function handleResponse() {
    setIsFavorite(Favorites.isFavorite(params.id, "tv_shows"));
  }

  function handleFavorite() {
    let mediaType = window.location.href.split("/")[3];
    let mediaId = window.location.href.split("/")[4];
    if (localStorage.getItem("user") === null) {
      window.location.replace("/login");
    } else {
      Favorites.favorite(mediaType, mediaId, !isFavorite, handleResponse);
    }
  }

  return (
    <div className="details">
      <div
        className="details-background"
        style={{
          background: `url(${
            IMG_API_ORIGINAL + details.backdrop_path
          }) center center / cover no-repeat`,
        }}
      >
        <div className="opacity_box"></div>
      </div>

      <div className="details-wrapper">
        <div className="details-headline-wrapper">
          <h1>{details.name}</h1>
          <h3>{details.tagline}</h3>
        </div>
        <div className="details-content-wrapper">
          <div className="details-leftside">
            <img
              className="details-poster"
              src={
                details.poster_path
                  ? IMG_API + details.poster_path
                  : posterPlaceholder
              }
            ></img>
            <div className="details-rating">
              <div className="rating">
                <div className="star-icon">
                  <svg
                    version="1.1"
                    id="Capa_1"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 55.867 55.867"
                  >
                    <path
                      d="M55.818,21.578c-0.118-0.362-0.431-0.626-0.808-0.681L36.92,18.268L28.83,1.876c-0.168-0.342-0.516-0.558-0.896-0.558
	s-0.729,0.216-0.896,0.558l-8.091,16.393l-18.09,2.629c-0.377,0.055-0.689,0.318-0.808,0.681c-0.117,0.361-0.02,0.759,0.253,1.024
	l13.091,12.76l-3.091,18.018c-0.064,0.375,0.09,0.754,0.397,0.978c0.309,0.226,0.718,0.255,1.053,0.076l16.182-8.506l16.18,8.506
	c0.146,0.077,0.307,0.115,0.466,0.115c0.207,0,0.413-0.064,0.588-0.191c0.308-0.224,0.462-0.603,0.397-0.978l-3.09-18.017
	l13.091-12.761C55.838,22.336,55.936,21.939,55.818,21.578z"
                    />
                  </svg>
                </div>
                <p>{details.vote_average} / 10</p>
                <p className="details-votes">({details.vote_count} votes)</p>
              </div>
              <button
                type="submit"
                className="favorite-button"
                onClick={handleFavorite}
              >
                <img
                  className="favorite-heart"
                  src={isFavorite ? heart_filled : heart_outline}
                ></img>
                {isFavorite ? "Unfavorite" : "Favorite"}
              </button>
            </div>
            {details.genres && details.genres.length > 0 && (
              <div className="details-genre">
                {details.genres !== undefined
                  ? details.genres.map((element) => element.name).join(", ")
                  : ``}
              </div>
            )}

            {details.credits && details.credits.crew.length > 1 && (
              <div className="details-info">
                {creatorHandler()}
                <p className="details-info-title">{creatorTitle}</p>
                <p>{creatorOfTitle}</p>
              </div>
            )}

            {details.first_air_date && (
              <div className="details-info">
                <p className="details-info-title">First Episode Released</p>
                <p>{details.first_air_date.split("-").join(" / ")}</p>
              </div>
            )}
            {details.last_air_date && (
              <div className="details-info">
                <p className="details-info-title">Last Episode Released</p>
                <p>{details.last_air_date.split("-").join(" / ")}</p>
              </div>
            )}
            <div className="details-info">
              <p className="details-info-title">Seasons</p>
              <p>
                {details.number_of_seasons}{" "}
                {details.number_of_seasons === 1 ? "season" : "seasons"}
              </p>
            </div>
            <div className="details-info">
              <p className="details-info-title">Episodes</p>
              <p>{`${details.number_of_episodes} episodes`}</p>
            </div>
            {details.episode_run_time?.length > 0 && (
              <div className="details-info">
                <p className="details-info-title">Average Episode Runtime</p>
                <p>{`${details.episode_run_time} minutes`}</p>
              </div>
            )}
          </div>
          <div className="details-overview-wrapper">
            <h1 className="details-overview-title">Overview</h1>
            <p className="details-overview">{details.overview}</p>
            <div className="cast">
              {details.credits?.cast.length > 0 && <h1>Cast</h1>}
              {details.credits && (
                <div className="cast-cards">
                  {details.credits.cast.slice(0, 6).map((person) => (
                    <Cast key={person.id} {...person} />
                  ))}
                </div>
              )}
              {videoHandler()}
              {videoSource && <Trailer id={videoSource} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShowDetails;
