import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import Auth from "../../auth/Auth";
import "./Navbar.css";

function User() {
  const [user, setUser] = useState({});

  useEffect(() => {
    let userData = Auth.getUser();

    if (userData) {
      setUser(userData);
    }
  }, []);

  function UserLoggedIn() {
    return (
      <div className="nav-username">
        <h2>{user.username}</h2>
      </div>
    );
  }

  function GuestLoggedIn() {
    return (
      <div className="nav-username">
        <NavLink to="/login">Login </NavLink>
        or
        <NavLink to="/register"> Register</NavLink>
      </div>
    );
  }

  if (user.username) {
    return (
      <div className="dropdown">
        <UserLoggedIn />
        <div className="dropdown-menu">
          <ul>
            <li className="dropdown-menu-item">
              <button
                className="dropdown-menu-button"
                type="submit"
                onClick={Auth.logout}
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="dropdown">
      <GuestLoggedIn />
    </div>
  );
}
export default User;
