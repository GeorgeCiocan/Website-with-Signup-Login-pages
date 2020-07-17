import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import axios from "axios";
import FormInput from "./Utils/FormInput.js";
import typingErrors from "./Utils/TypingErrors";
import { UserContext } from "./Context/AuthenticatedContext";

function Signup() {
  const { capitalLetter, smallLetter, digit, emailMatch } = typingErrors;
  const { saveUserDetailes } = React.useContext(UserContext);

  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [submitError, setSubmitError] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [redirectOnSignup, setRedirectOnSignup] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      user,
    };

    try {
      const result = await axios.post(
        "https://conduit.productionready.io/api/users",
        payload
      );
      console.log(result);
      saveUserDetailes(result.data.user);
      setRedirectOnSignup(true);
    } catch (error) {
      let errorNames = Object.keys(error.response.data.errors);
      let errorObject = {
        username: "",
        email: "",
        password: "",
      };
      errorNames.forEach(
        (name) => (errorObject[name] = error.response.data.errors[name])
      );
      console.log(errorObject);
      setSubmitError(errorObject);
    }
  };

  const handleSubmitError = (name) => {
    if (submitError.hasOwnProperty("username") && name === "username") {
      return submitError.username;
    }
    if (submitError.hasOwnProperty("email") && name === "email") {
      return submitError.email;
    }
    if (submitError.hasOwnProperty("password") && name === "password") {
      return submitError.password;
    }
  };

  const handleChange = (event) => {
    setUser({ ...user, [event.target.name]: event.target.value });
    setSubmitError({ ...submitError, [event.target.name]: "" });
  };

  return redirectOnSignup ? (
    <Redirect to="/" />
  ) : (
    <div className="signup">
      <header>
        <h1>Sign Up</h1>
        <Link to="/login">Already have an account?</Link>
      </header>
      <main>
        <form onSubmit={handleSubmit}>
          <FormInput
            label="Username"
            name="username"
            type="text"
            required={true}
            minLength={3}
            onValueChange={handleChange}
            value={user.username}
            submitError={handleSubmitError("username")}
          />
          <FormInput
            label="Email"
            name="email"
            type="email"
            placeholder="me@example.com"
            required={true}
            match={emailMatch}
            onValueChange={handleChange}
            value={user.email}
            submitError={handleSubmitError("email")}
          />
          <FormInput
            label="Password"
            name="password"
            type="password"
            required={true}
            minLength={6}
            match={[capitalLetter, smallLetter, digit]}
            onValueChange={handleChange}
            value={user.password}
            submitError={handleSubmitError("password")}
          />
          <button type="submit">Submit</button>
        </form>
      </main>
    </div>
  );
}

export default Signup;
