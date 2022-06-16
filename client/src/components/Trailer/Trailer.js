import "./Trailer.css";

function Trailer(props) {
  return (
    <div className="trailer">
      <h1>Trailer</h1>
      <div className="trailer-container">
        <iframe
          src={`https://www.youtube.com/embed/${props.id}`}
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}

export default Trailer;
