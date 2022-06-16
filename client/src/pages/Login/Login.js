import { useState } from "react";
import { Link } from "react-router-dom";
import Auth from "../../auth/Auth";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState();

  const loginSuccessHandler = function () {};

  const loginErrorHandler = function (message) {
    setErrorMessage(message);
  };

  function ErrorMessage(props) {
    return <p className="input-error-message">{props.message}</p>;
  }

  const handleLogin = (e) => {
    e.preventDefault();
    // login({ email, password }, dispatch);
    Auth.login(email, password, loginSuccessHandler, loginErrorHandler);
  };

  return (
    <>
      <div className="login-background"></div>

      <div className="login-wrapper">
        <form className="login-form">
          <div className="login-title">
            <h1>Login</h1>
          </div>
          <label htmlFor="username" className="login-input">
            <input
              name="email"
              type="email"
              placeholder="E-mail"
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label htmlFor="password" className="login-input">
            <input
              name="password"
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <ErrorMessage message={errorMessage} />
          <button type="submit" className="login-button" onClick={handleLogin}>
            SUBMIT
          </button>
          <h2 className="login-toregistertext">
            <Link to={"/register"}>Don't have an account? Register</Link>
          </h2>
        </form>
      </div>
    </>
  );
}

export default Login;
