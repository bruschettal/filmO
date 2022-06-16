import { useState } from "react";
import { Link } from "react-router-dom";
import Auth from "../../auth/Auth";
import "./Register.css";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [inputErrors, setInputErrors] = useState({});

  function successHandler() {
    setIsFetching(false);
    window.location = "/";
  }

  function errorHandler(errors) {
    setIsFetching(false);
    setInputErrors(errors);
  }

  function handleRegister(e) {
    e.preventDefault();
    setIsFetching(true);

    Auth.register(
      username,
      email,
      password,
      passwordConfirm,
      successHandler,
      errorHandler
    );
  }

  function ErrorMessage({ message }) {
    return <p className="input-error-message">{message}</p>;
  }

  return (
    <>
      <div className="register-background"></div>

      <div className="register-wrapper">
        <form className="register-form">
          <div className="register-title">
            <h1>Register</h1>
          </div>
          <label htmlFor="email" className="register-input">
            <input
              name="email"
              type="email"
              placeholder="E-Mail"
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          {inputErrors.email && <ErrorMessage message={inputErrors.email} />}
          <label htmlFor="username" className="register-input">
            <input
              name="username"
              type="text"
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>
          {inputErrors.username && (
            <ErrorMessage message={inputErrors.username} />
          )}
          <label htmlFor="password" className="register-input">
            <input
              name="password"
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          {inputErrors.password && (
            <ErrorMessage message={inputErrors.password} />
          )}
          <label htmlFor="passwordConfirm" className="register-input">
            <input
              name="passwordConfirm"
              type="password"
              placeholder="Confirm Password"
              onChange={(e) => setPasswordConfirm(e.target.value)}
            />
          </label>
          {inputErrors.passwordConfirm && (
            <ErrorMessage message={inputErrors.passwordConfirm} />
          )}
          <button
            type="submit"
            className="register-button"
            onClick={handleRegister}
            disabled={isFetching}
          >
            SUBMIT
          </button>

          <h2 className="register-tologintext">
            <Link to={"/login"}>Already have an account? Sign in</Link>
          </h2>
        </form>
      </div>
    </>
  );
}

export default Register;
