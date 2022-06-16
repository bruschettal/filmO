import axios from "axios";

class Auth {
  getUser() {
    let userData = JSON.parse(localStorage.getItem("user"));

    if (userData) {
      return userData;
    }

    return {};
  }

  getBearerToken() {
    return new Auth().getUser()?.accessToken;
  }

  login(email, password, successCallback, errorCallback) {
    axios
      .post("/auth/login", {
        email: email,
        password: password,
      })
      .then((resp) => {
        localStorage.setItem("user", JSON.stringify(resp.data));

        if (typeof successCallback == "function") {
          successCallback();
        }

        window.location = "/";
      })
      .catch((err) => {
        let errorMessage = err.response?.data?.message;

        if (errorMessage && typeof errorCallback == "function") {
          errorCallback(errorMessage);
        }
      });
  }

  register(
    username,
    email,
    password,
    passwordConfirm,
    successCallback,
    errorCallback
  ) {
    if (email.trim().length < 3) {
      errorCallback({
        email: "Email cannot be empty or less than 3 characters",
      });
      return;
    }

    if (username.trim().length < 3) {
      errorCallback({
        username: "Username cannot be empty or less than 3 characters",
      });
      return;
    }

    if (password.trim().length < 3) {
      errorCallback({
        password: "Password cannot be empty or less than 3 characters",
      });
      return;
    }

    if (password !== passwordConfirm) {
      errorCallback({
        passwordConfirm: "Passwords do not match",
      });
      return;
    }

    axios
      .post("/auth/register", {
        email: email,
        username: username,
        password: password,
      })
      .then((resp) => {
        localStorage.setItem("user", JSON.stringify(resp.data));
        if (typeof successCallback == "function") {
          successCallback();
        }
      })
      .catch((err) => {
        let errorInputs = err.response?.data || {};

        if (typeof errorCallback == "function") {
          errorCallback(errorInputs);
        }
      });
  }

  logout() {
    let token = new Auth().getBearerToken();

    axios
      .post(
        "/auth/logout",
        {},
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      )
      .then(() => {
        localStorage.removeItem("user");
        localStorage.removeItem("favorites");
        localStorage.removeItem("last_favorites_check");
        window.location = "/";
      });
  }
}

export default new Auth();
