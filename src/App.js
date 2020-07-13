import React, { useState, useEffect, useContext, Fragment } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useHistory,
  useLocation,
} from "react-router-dom";
import axios from "axios";
import "./App.css";

const UserContext = React.createContext(null);

function App() {
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const result = await axios.get(
        "https://conduit.productionready.io/api/user",
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        }
      );
      setUser(result.data.user);
    };
    if (token) {
      getUser();
    }
  }, [token]);

  console.log(user);

  const handleToken = (event) => {
    setToken(event);
  };

  return (
    <Router>
      <div className="App">
        <nav>
          <Link to="/">
            <strong>#ce zici?</strong>
          </Link>
          <ul className="navbar">
            <li>
              <Link to="/">Home</Link>
            </li>
            {token && (
              <li>
                <Link to="/newpost">New Post</Link>
              </li>
            )}
            {token && (
              <li>
                <Link to="/settings">Profile settings</Link>
              </li>
            )}
            {!token && (
              <li>
                <Link to="/signup">Sign up</Link>
              </li>
            )}
            {!token && (
              <li>
                <Link to="/login">Login</Link>
              </li>
            )}
          </ul>
        </nav>

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <UserContext.Provider value={{ user, token, handleToken }}>
          <Switch>
            <Route path="/login">
              <Login />
            </Route>
            <Route path="/signup">
              <Signup />
            </Route>

            <AutheticatedRoute path="/settings">
              <Settings />
            </AutheticatedRoute>

            <Route path="/newpost">
              <NewPost />
            </Route>
            <Route path="/">
              <Home />
            </Route>
          </Switch>
        </UserContext.Provider>
      </div>
    </Router>
  );
}

function AutheticatedRoute({ path, children }) {
  const location = useLocation();
  const { token } = React.useContext(UserContext);

  return token ? (
    <Route path={path}>{children}</Route>
  ) : (
    <Redirect
      to={{ pathname: "/login", state: { referrer: location.pathname } }}
    />
  );
}

function Home() {
  const { user } = React.useContext(UserContext);

  return <h2>Welcome, {user ? user.username : "Anonymous"}</h2>;
}

function NewPost() {
  const { user } = React.useContext(UserContext);

  const [article, setArticle] = useState({
    title: "",
    description: "",
    body: "",
    tagList: "",
  });

  const [submitError, setSubmitError] = useState({
    title: "",
    description: "",
    body: "",
    tagList: "",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      article,
    };
    let tags = article.tagList;
    payload.article.tagList = tags.split(/\W+/g);

    console.log(payload);

    try {
      const result = await axios.post(
        "https://conduit.productionready.io/api/articles",
        payload,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Token ${user.token}`,
          },
        }
      );

      console.log(payload.article, result);
      setArticle({
        title: "",
        description: "",
        body: "",
        tagList: "",
      });
    } catch (error) {
      console.log(error.response.data.errors);
      let errorNames = Object.keys(error.response.data.errors);
      let errorObject = {
        title: "",
        description: "",
        body: "",
        tagList: "",
      };
      errorNames.forEach(
        (name) => (errorObject[name] = error.response.data.errors[name][0])
      );
      console.log(errorObject);
      setSubmitError(errorObject);
    }
  };

  const handleSubmitError = (name) => {
    if (submitError.hasOwnProperty("title") && name === "title") {
      return submitError.title;
    }
    if (submitError.hasOwnProperty("description") && name === "description") {
      return submitError.description;
    }
    if (submitError.hasOwnProperty("body") && name === "body") {
      return submitError.body;
    }
  };

  const handleChange = (event) => {
    setArticle({ ...article, [event.target.name]: event.target.value });
    setSubmitError({ ...submitError, [event.target.name]: "" });
  };

  return (
    <div className="newPost">
      <main>
        <form onSubmit={handleSubmit}>
          <FormInput
            label="Title"
            name="title"
            type="text"
            placeholder="Article Title"
            required={true}
            minLength={4}
            onValueChange={handleChange}
            value={article.title}
            submitError={handleSubmitError("title")}
          />
          <FormInput
            label="About"
            name="description"
            type="text"
            placeholder="What is this article about?"
            required={true}
            onValueChange={handleChange}
            value={article.description}
            submitError={handleSubmitError("description")}
          />
          <TextArea
            label="Content"
            name="body"
            required={true}
            rows={5}
            onValueChange={handleChange}
            value={article.body}
            submitError={handleSubmitError("body")}
          />
          <FormInput
            label="TagList"
            name="tagList"
            type="text"
            onValueChange={handleChange}
            value={article.tagList}
          />
          <button type="submit">Publish Article</button>
        </form>
      </main>
    </div>
  );
}

function Settings() {
  const capitalLetter = /([A-Z])+/g;
  const smallLetter = /([a-z])+/g;
  const digit = /([0-9])+/g;
  const emailMatch = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g;

  const { user } = React.useContext(UserContext);

  const [userSettings, setUserSettings] = useState({
    email: user.email,
    password: user.password,
    username: user.username,
    bio: user.bio,
    image: user.image,
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
      console.log(error);
      // setSubmitError(error)
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
          />
          <TextArea
            name="bio"
            placeholder="Short bio about you"
            rows={6}
            onValueChange={handleChange}
            value={userSettings.bio}
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

function Signup() {
  const history = useHistory();

  const capitalLetter = /([A-Z])+/g;
  const smallLetter = /([a-z])+/g;
  const digit = /([0-9])+/g;
  const emailMatch = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g;

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
      setUser({
        username: "",
        email: "",
        password: "",
      });
      history.push("/login");
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

  return (
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

function Login() {
  const { handleToken } = React.useContext(UserContext);
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
      handleToken(result.data.user.token);
      setUser({
        email: "",
        password: "",
      });
      goToLocation();
    } catch (error) {
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

const FormInput = ({
  label,
  name,
  type,
  placeholder,
  required,
  minLength,
  match,
  onValueChange,
  value,
  submitError,
}) => {
  const [error, setError] = useState("");

  const handleError = () => {
    if (required) {
      if (value === "") {
        setError("This field is required");
        return;
      } else {
        setError("");
      }
    }
    if (minLength) {
      if (value.length < minLength) {
        setError(`You need to enter at least ${minLength} characters`);
        return;
      } else {
        setError("");
      }
    }
    if (match) {
      if (!value.match(match) && type === "email") {
        setError("You must enter a valid email address");
        return;
      } else {
        setError("");
      }
      if (type === "password") {
        if (!value.match(match[0])) {
          setError("The password must contain at least one capital letter");
          return;
        }
        if (!value.match(match[1])) {
          setError("The password must contain at least one small letter");
          return;
        } else if (!value.match(match[2])) {
          setError("The password must contain at least one digit");
          return;
        } else {
          setError("");
        }
      }
    }
  };

  return (
    <Fragment>
      <label htmlFor={name}>{label}</label>
      <span className="error">{submitError ? submitError : error}</span>
      <input
        className={error ? "error" : ""}
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onValueChange}
        onBlur={handleError}
      />
    </Fragment>
  );
};

const TextArea = ({
  label,
  name,
  rows,
  placeholder,
  required,
  onValueChange,
  value,
  submitError,
}) => {
  const [error, setError] = useState("");

  const handleError = () => {
    if (required) {
      if (value === "") {
        setError("This field is required");
        return;
      } else {
        setError("");
      }
    }
  };

  return (
    <Fragment>
      <label htmlFor={name}>{label}</label>
      <span className="error">{submitError ? submitError : error}</span>
      <textarea
        className={error ? "error" : ""}
        name={name}
        rows={rows}
        placeholder={placeholder}
        value={value}
        onChange={onValueChange}
        onBlur={handleError}
      />
    </Fragment>
  );
};

export default App;
