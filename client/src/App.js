import "./App.css";
import Movie from "./pages/Movie/Movie";
import MovieDetails from "./pages/MovieDetails/MovieDetails";
import ShowDetails from "./pages/ShowDetails/ShowDetails";
import Shows from "./pages/Shows/Shows";
import Search from "./pages/Search/Search";

import {
  Routes,
  Route,
  BrowserRouter,
  Navigate,
  useLocation,
} from "react-router-dom";
import Home from "./pages/Home/Home";
import Navbar from "./components/Navbar/Navbar";
import { useLayoutEffect } from "react";
import PeopleDetails from "./pages/PeopleDetails/PeopleDetails";
import Register from "./pages/Register/Register";
import Login from "./pages/Login/Login";
import FavoritesPage from "./pages/FavoritesPage/FavoritesPage";
import axios from "axios";

function App() {
  axios.defaults.baseURL = "http://localhost:5000/api/";

  const Wrapper = ({ children }) => {
    const location = useLocation();
    useLayoutEffect(() => {
      document.documentElement.scrollTo(0, 0);
    }, [location.pathname]);
    return children;
  };

  return (
    <>
      <BrowserRouter>
        <Wrapper>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movies" element={<Movie />} />
            <Route path="/movie/:id" element={<MovieDetails />} />
            <Route path="/show/:id" element={<ShowDetails />} />
            <Route path="/shows" element={<Shows />} />
            <Route path="/people/:id" element={<PeopleDetails />} />
            <Route path="/search" element={<Search />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/*" element={<Navigate to="/" />} />
          </Routes>
        </Wrapper>
      </BrowserRouter>
    </>
  );
}

export default App;

/*
<Routes>
<Route path="/home" element={<Home />} />
<Route path="/movie" element={<Movie />} />
</Routes>

*/
