import axios from "axios";

class Favorites {
  getUser() {
    let userData = JSON.parse(localStorage.getItem("user"));

    if (userData) {
      return userData;
    }

    return {};
  }

  getBearerToken() {
    return new Favorites().getUser()?.accessToken;
  }

  favorite(mediaType, mediaId, addToFavorite, callback) {
    let token = new Favorites().getBearerToken();

    axios
      .post(
        "/auth/favorite",
        {
          id: mediaId,
          type: mediaType,
          favorite: addToFavorite,
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      )
      .then((resp) => {
        if (addToFavorite) {
          new Favorites().pushToFavorite(mediaId, mediaType);
        } else {
          new Favorites().removeFromFavorite(mediaId, mediaType);
        }

        if (typeof callback == "function") {
          callback();
        }
      });
  }

  fetchFavorites() {
    let token = new Favorites().getBearerToken();

    axios
      .get("/auth/favorites", {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((resp) => {
        localStorage.setItem("favorites", JSON.stringify(resp.data));
        localStorage.setItem("last_favorites_check", new Date().getTime());
      });
  }

  getFavorites() {
    let lastCheckTime = localStorage.getItem("last_favorites_check");
    let currentTime = new Date().getTime();

    // If last check was 2 minutes ago or more
    if (!lastCheckTime || lastCheckTime + 120 < currentTime) {
      new Favorites().fetchFavorites();
    }

    let favorites = JSON.parse(localStorage.getItem("favorites")) || {
      movies: [],
      tv_shows: [],
    };

    return favorites;
  }

  pushToFavorite(id, type) {
    type = type == "movie" ? "movies" : "tv_shows";

    let favorites = new Favorites().getFavorites();

    let typeFavorites = favorites[type];
    typeFavorites.push(id);

    favorites[type] = typeFavorites;
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }

  removeFromFavorite(id, type) {
    type = type == "movie" ? "movies" : "tv_shows";

    let favorites = new Favorites().getFavorites();

    let typeFavorites = favorites[type].filter((typeId) => typeId != id);
    favorites[type] = typeFavorites;

    localStorage.setItem("favorites", JSON.stringify(favorites));
  }

  isFavorite(id, type) {
    let favorites = new Favorites().getFavorites();

    let typeFavorites = favorites[type];

    return typeFavorites.includes(id);
  }
}

export default new Favorites();
