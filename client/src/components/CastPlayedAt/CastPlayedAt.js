import "./CastPlayedAt.css";
import placeholder from "../../assets/castPlaceholder.png";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

function CastPlayedAt(props) {
  const IMG_API_PROFILE = "https://image.tmdb.org/t/p/w185";

  const [linkAddress, setLinkAddress] = useState("");
  const [mediaName, setMediaName] = useState("");

  useEffect(() => {
    if (props.type === "movie") {
      setLinkAddress("movie");
      setMediaName(props.title);
    } else if (props.type === "show") {
      setLinkAddress("show");
      setMediaName(props.name);
    }
  }, []);

  return (
    <div className="cast-card">
      <Link to={`/${linkAddress}/${props.id}`}>
        <img
          className="cast-image"
          src={
            props.poster_path !== null
              ? IMG_API_PROFILE + props.poster_path
              : placeholder
          }
        ></img>
        <div className="cast-name-wrapper">
          <div className="cast-name">{mediaName}</div>
          <div className="cast-character-name">
            {props.character === "" ? "Self" : props.character}
          </div>
        </div>
      </Link>
    </div>
  );
}

export default CastPlayedAt;
