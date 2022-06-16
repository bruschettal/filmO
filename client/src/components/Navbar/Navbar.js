import { useContext, useEffect, useState } from "react";
import {
  createSearchParams,
  Link,
  NavLink,
  useNavigate,
} from "react-router-dom";
import "./Navbar.css";
import User from "./User";

function Navbar() {
  const [show, handleShow] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 100) {
        handleShow(true);
      } else handleShow(false);
    });
    return () => {
      window.removeEventListener("scroll", null);
    };
  }, []);

  const navigate = useNavigate();

  useEffect(() => {
    let timer = setTimeout(() => {
      if (searchInput) {
        navigate({
          pathname: "search",
          search: createSearchParams({
            query: `${searchInput}`,
          }).toString(),
        });
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [searchInput]);

  /*
  useEffect(() => {
    console.log(searchInput);
  }, [searchInput]);
*/
  return (
    <div className={`nav${show ? " black" : ""}`}>
      {/* <img
        className="nav-logo"
        src="https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg"
      ></img> */}
      <h1 className="nav-logo-text">
        <Link to={"/"}>filmO</Link>
      </h1>
      <ul className="nav-tab">
        <li className="nav-links">
          <NavLink
            className={(navData) => (navData.isActive ? "active" : "inactive")}
            to="/"
          >
            Home
          </NavLink>
        </li>
        <li className="nav-links">
          <NavLink
            className={(navData) => (navData.isActive ? "active" : "inactive")}
            to="/movies"
          >
            Movies
          </NavLink>
        </li>
        <li className="nav-links">
          <NavLink
            className={(navData) => (navData.isActive ? "active" : "inactive")}
            to="/shows"
          >
            TV Shows
          </NavLink>
        </li>
        <li className="nav-links">
          <NavLink
            className={(navData) => (navData.isActive ? "active" : "inactive")}
            to="/favorites"
          >
            Favorites
          </NavLink>
        </li>
      </ul>
      <div className="nav-secondary">
        <svg
          className="search-icon"
          viewBox="0 0 30 30"
          width="30px"
          height="30px"
        >
          <g id="surface1792644">
            <path d="M 13 3 C 7.488281 3 3 7.488281 3 13 C 3 18.511719 7.488281 23 13 23 C 15.398438 23 17.597656 22.148438 19.324219 20.734375 L 25.292969 26.707031 C 25.542969 26.96875 25.917969 27.074219 26.265625 26.980469 C 26.617188 26.890625 26.890625 26.617188 26.980469 26.265625 C 27.074219 25.917969 26.96875 25.542969 26.707031 25.292969 L 20.734375 19.320312 C 22.148438 17.597656 23 15.398438 23 13 C 23 7.488281 18.511719 3 13 3 Z M 13 5 C 17.429688 5 21 8.570312 21 13 C 21 17.429688 17.429688 21 13 21 C 8.570312 21 5 17.429688 5 13 C 5 8.570312 8.570312 5 13 5 Z M 13 5 " />
          </g>
        </svg>
        <div className="search-Input">
          <input
            type="text"
            id="search-Input"
            onChange={(e) => {
              setSearchInput(e.target.value);
            }}
            value={searchInput}
          />
        </div>
        <User />
      </div>
    </div>
  );
}

export default Navbar;
