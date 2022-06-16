import "./Cast.css";
import placeholder from "../../assets/castPlaceholder.png";
import { Link } from "react-router-dom";

function Cast(props) {
  const IMG_API_PROFILE = "https://image.tmdb.org/t/p/w185";
  return (
    <div className="cast-card">
      <Link to={`/people/${props.id}`}>
        <img
          className="cast-image"
          src={
            props.profile_path !== null
              ? IMG_API_PROFILE + props.profile_path
              : placeholder
          }
        ></img>
        <div className="cast-name-wrapper">
          <div className="cast-name">{props.name}</div>
          <div className="cast-character-name">{props.character}</div>
        </div>
      </Link>
    </div>
  );
}

export default Cast;
