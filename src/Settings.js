import React, { useState } from "react";
import axios from "axios";
import FormInput from "./Utils/FormInput.js";
import TextArea from "./Utils/TextArea.js";
import typingErrors from "./Utils/TypingErrors";
import { UserContext } from "./Context/AuthenticatedContext";

function Settings() {
  const { emailMatch } = typingErrors;

  const { user } = React.useContext(UserContext);

  const [userSettings, setUserSettings] = useState({
    email: user.email,
    password: user.password,
    username: user.username,
    bio: user.bio ? user.bio : "",
    image: "",
  });

  const [submitError, setSubmitError] = useState({
    email: "",
    password: "",
    username: "",
    bio: "",
    image: "",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    let payload = {
      ...userSettings,
    };

    console.log(payload);

    try {
      const result = await axios.put(
        "https://conduit.productionready.io/api/user",
        payload,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Token ${user.token}`,
          },
        }
      );

      console.log(result);
      setUserSettings({
        email: "",
        password: "",
        username: "",
        bio: "",
        image: "",
      });
    } catch (error) {
      let errorNames = Object.keys(error.response.data.errors);
      let errorObject = {
        email: "",
        password: "",
        username: "",
        bio: "",
        image: "",
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
    if (submitError.hasOwnProperty("bio") && name === "bio") {
      return submitError.bio;
    }
    if (submitError.hasOwnProperty("image") && name === "image") {
      return submitError.image;
    }
  };

  const handleChange = (event) => {
    setUserSettings({
      ...userSettings,
      [event.target.name]: event.target.value,
    });
    setSubmitError({ ...submitError, [event.target.name]: "" });
  };

  return (
    <div className="Settings">
      <main>
        <form onSubmit={handleSubmit}>
          <p>User, your settings</p>
          <FormInput
            name="image"
            type="text"
            placeholder="URL of desired profile picture"
            onValueChange={handleChange}
            value={userSettings.image}
            submitError={handleSubmitError("image")}
          />
          <TextArea
            name="bio"
            placeholder="Short bio about you"
            rows={6}
            onValueChange={handleChange}
            value={userSettings.bio}
            submitError={handleSubmitError("bio")}
          />
          <FormInput
            name="email"
            type="email"
            placeholder="Change email"
            match={emailMatch}
            onValueChange={handleChange}
            value={userSettings.email}
            submitError={handleSubmitError("email")}
          />
          {/*           <p>Change password</p>
          <FormInput
            name="password"
            type="password"
            placeholder="New password"
            required={true}
            minLength={6}
            match={[capitalLetter, smallLetter, digit]}
            onValueChange={handleChange}
            value={user.password}
          />
          <FormInput
            name="retype-password"
            type="password"
            placeholder="Retype new password"
            minLength={6}
            match={[capitalLetter, smallLetter, digit]}
            onValueChange={handleChange}
            value={user.password}
          /> */}
          <button type="submit">Update Settings</button>
        </form>
      </main>
    </div>
  );
}

export default Settings;
