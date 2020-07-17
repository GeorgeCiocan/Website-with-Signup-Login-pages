import React, { useState } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import axios from "axios";
import FormInput from "./Utils/FormInput.js";
import { UserContext } from "./Context/AuthenticatedContext";

function Login() {
  const { saveUserDetailes } = React.useContext(UserContext);
  const location = useLocation();
  const history = useHistory();

  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const [submitError, setSubmitError] = useState("");

  const goToLocation = () => {
    if (location.state) {
      history.push(location.state.referrer);
    } else {
      history.push("/");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      user,
    };
    console.log(payload.user);
    try {
      const result = await axios.post(
        "https://conduit.productionready.io/api/users/login",
        payload
      );
      saveUserDetailes(result.data.user);
      goToLocation();
    } catch (error) {
      console.log(error);
      let errorObject = error.response.data.errors;
      let errorField = Object.keys(errorObject)[0];
      let errorMessage = errorObject[errorField];
      let message = errorField + " " + errorMessage[0];

      setSubmitError(message);
    }
  };

  const handleChange = (event) => {
    setUser({ ...user, [event.target.name]: event.target.value });
    setSubmitError("");
  };

  return (
    <div className="login">
      <header>
        <h1>Login</h1>
        <Link to="/signup">Don't have an account?</Link>
      </header>
      <main>
        <form onSubmit={handleSubmit}>
          <FormInput
            label="Email"
            name="email"
            type="email"
            required={true}
            onValueChange={handleChange}
            value={user.email}
            submitError={submitError}
          />
          <FormInput
            label="Password"
            name="password"
            type="password"
            required={true}
            onValueChange={handleChange}
            value={user.password}
            submitError={submitError}
          />
          <button type="submit">Submit</button>
        </form>
      </main>
    </div>
  );
}

export default Login;
