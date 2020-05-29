import React, { useState, Fragment } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';


function App() {
  return (
    <Router>
      <div className="App">
        <nav>
        <Link to="/"><strong>#ce zici?</strong></Link>
          <ul className="navbar">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/signup">Sign up</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
          </ul>
        </nav>

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/signup">
            <Signup />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

function Home() {
  return <h2>Home</h2>;
}






function Signup() {

  const capitalLetter = /([A-Z])+/g;
  const smallLetter = /([a-z])+/g;
  const digit = /([0-9])+/g;
  const emailMatch = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g;

  const [user, setUser] = useState({
    username: "",
    email: "",
    password: ""
  });

  const [submitError, setSubmitError] = useState({
    username: "",
    email: "",
    password: ""
  }) 

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      user
    }

    try {
      const result = await axios.post("https://conduit.productionready.io/api/users", payload)
      console.log(result.data)
    } catch (error) {
      let errorNames = Object.keys(error.response.data.errors)
      let errorObject = {
        username: "",
        email: "",
        password: ""
      };
      errorNames.forEach(name => errorObject[name] = error.response.data.errors[name])
      console.log(errorObject)
      setSubmitError(errorObject) 
    }      
  }

  const handleSubmitError = (name) => {
    if (submitError.hasOwnProperty("username") && name ==="username") {
      return submitError.username
    }
    if (submitError.hasOwnProperty("email") && name ==="email") {
      return submitError.email
    }
    if (submitError.hasOwnProperty("password") && name ==="password") {
      return submitError.password
    }
  }


  const handleChange = (event) => {
    setUser({...user, [event.target.name]: event.target.value})
    setSubmitError({...submitError, [event.target.name]: ""})
  }

  return (
    <div className="signup">
    <header>
      <h1>Sign Up</h1>
      <Link to="/login">Already have an account?</Link>
    </header>
    <main>
    <form onSubmit={handleSubmit}>
      <FormInput label="Username" name="username" type="text" required={true} minLength={3} onValueChange={handleChange} value={user.username} submitError={handleSubmitError("username")} />
      <FormInput label="Email" name="email" type="email" placeholder="me@example.com" required={true} match={emailMatch} onValueChange={handleChange} value={user.email} submitError={handleSubmitError("email")}/>
      <FormInput label="Password" name="password" type="password" required={true} minLength={6} match={[capitalLetter, smallLetter, digit]} onValueChange={handleChange} value={user.password} submitError={handleSubmitError("password")}/>
      <button type="submit">Submit</button>
    </form>
    </main>
    </div>
  )
}






function Login() {

  const [user, setUser] = useState({
    email: "",
    password: ""
  });

  const [submitError, setSubmitError] = useState("") 

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      user
    }
    console.log(payload.user)
    try {
      const result = await axios.post("https://conduit.productionready.io/api/users/login", payload)
      console.log(result.data)
    } catch (error) {
      let errorObject = error.response.data.errors
      let errorField = Object.keys(errorObject)[0]
      let errorMessage = errorObject[errorField]
      let message = errorField + " " + errorMessage[0]
      console.log(message)
      setSubmitError(message)
    }
  }



  const handleChange = (event) => {
    setUser({...user, [event.target.name]: event.target.value})
    setSubmitError("")
  }

  return (
    <div className="login">
    <header>
      <h1>Login</h1>
      <Link to="/signup">Don't have an account?</Link>
    </header>
    <main>
    <form onSubmit={handleSubmit}>
      <FormInput label="Email" name="email" type="email" required={true} onValueChange={handleChange} value={user.email} submitError={submitError} />
      <FormInput label="Password" name="password" type="password" required={true} onValueChange={handleChange} value={user.password} submitError={submitError} />
      <button type="submit">Submit</button>
    </form>
    </main>
    </div>
  )
}







const FormInput = ({ label, name, type, placeholder, required, onValueChange, value, submitError }) => {

  const [error, setError] = useState("");

  const handleError = () => {
    if (required) {
      if (value === "") {
      setError("This field is required")
      return
      } else {
        setError("")
      } 
    }
  }

  return (
  <Fragment>
  <label htmlFor={name}>{label}</label> 
  <span className="error">
    {submitError ? submitError : error}
  </span>
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
  )
}




export default App;
