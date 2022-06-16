import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import axios from "axios";

import CastPlayedAt from "../../components/CastPlayedAt/CastPlayedAt";
import posterPlaceholder from "../../assets/posterPlaceholder.png";

import "./PeopleDetails.css";

function PeopleDetails() {
  const params = useParams();

  const IMG_API = "https://image.tmdb.org/t/p/w1280";
  const IMG_API_ORIGINAL = "https://image.tmdb.org/t/p/original";

  const PERSON_DATA_API = `https://api.themoviedb.org/3/person/${params.id}?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`;

  const MOVIE_CAST_API = `https://api.themoviedb.org/3/person/${params.id}/movie_credits?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`;
  const TV_CAST_API = `https://api.themoviedb.org/3/person/${params.id}/tv_credits?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`;

  const [details, setDetails] = useState([]);
  const [tvCast, setTvCast] = useState([]);
  const [movieCast, setMovieCast] = useState([]);

  useEffect(() => {
    async function fetchData(data) {
      const request = await axios.get(data);
      setDetails(request.data);
    }
    async function fetchTvCast(data) {
      const request = await axios.get(data);
      let sortedRequest = request.data.cast.sort((a, b) =>
        a.popularity > b.popularity ? -1 : 1
      );
      setTvCast(sortedRequest);
    }
    async function fetchMovieCast(data) {
      const request = await axios.get(data);
      let sortedRequest = request.data.cast.sort((a, b) =>
        a.popularity > b.popularity ? -1 : 1
      );
      setMovieCast(sortedRequest);
    }

    fetchData(PERSON_DATA_API);
    fetchTvCast(TV_CAST_API);
    fetchMovieCast(MOVIE_CAST_API);
  }, []);

  return (
    <div className="details">
      <div
        className="details-background"
        style={{
          background: `linear-gradient(0deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 35%, rgba(255,80,80,1) 100%)`,

          //background: `linear-gradient(0deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 35%, rgba(0,212,255,1) 100%)`,

          // background: `linear-gradient(0deg, rgba(${Math.ceil(
          //   Math.random() * 255
          // )},${Math.ceil(Math.random() * 255)},${Math.ceil(
          //   Math.random() * 255
          // )},1) 0%, rgba(${Math.ceil(Math.random() * 255)},${Math.ceil(
          //   Math.random() * 255
          // )},${Math.ceil(Math.random() * 255)},1) 35%, rgba(${Math.ceil(
          //   Math.random() * 255
          // )},${Math.ceil(Math.random() * 255)},${Math.ceil(
          //   Math.random() * 255
          // )},1) 100%)`,
        }}
      >
        <div className="opacity_box"></div>
      </div>

      <div className="details-wrapper">
        <div className="details-headline-wrapper">
          <h1>{details.name}</h1>
        </div>
        <div className="details-content-wrapper">
          <div className="details-leftside">
            <img
              className="details-poster"
              src={
                details.profile_path
                  ? IMG_API + details.profile_path
                  : posterPlaceholder
              }
            ></img>
            {details.place_of_birth && (
              <div className="details-info">
                <p className="details-info-title">Place of Birth</p>
                <p>{details.place_of_birth}</p>
              </div>
            )}
            {details.birthday && (
              <div className="details-info">
                <p className="details-info-title">Birthday</p>
                <p>{details.birthday.split("-").join(" / ")}</p>
              </div>
            )}
            {details.deathday && (
              <div className="details-info">
                <p className="details-info-title">Died</p>
                <p>{details.deathday.split("-").join(" / ")}</p>
              </div>
            )}
            {details.known_for_department && (
              <div className="details-info">
                <p className="details-info-title">Known For</p>
                <p>{details.known_for_department}</p>
              </div>
            )}
          </div>
          <div className="details-overview-wrapper">
            {details.biography && (
              <h1 className="details-overview-title">Biography</h1>
            )}
            <p className="details-overview">{details.biography}</p>
            {movieCast?.length > 0 && (
              <div className="cast">
                <h1>Movies</h1>
              </div>
            )}
            {movieCast && (
              <div className="cast-cards">
                {movieCast.slice(0, 6).map((movie) => (
                  <CastPlayedAt key={movie.id} {...movie} type={"movie"} />
                ))}
              </div>
            )}
            {tvCast?.length > 0 && (
              <div className="cast">
                <h1>TV Shows</h1>
              </div>
            )}
            {tvCast && (
              <div className="cast-cards">
                {tvCast.slice(0, 6).map((show) => (
                  <CastPlayedAt key={show.id} {...show} type={"show"} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PeopleDetails;
