import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useLocation,
} from "react-router-dom";
import Home from "./Home";
import Signup from "./Signup";
import Login from "./Login";
import NewPost from "./Newpost";
import Settings from "./Settings";
import { UserContext, UserProvider } from "./Context/AuthenticatedContext";

import "./App.css";

function App() {
  const token = null;

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
        <UserProvider>
          <Switch>
            <Route path="/login">
              <Login />
            </Route>
            <Route path="/signup">
              <Signup />
            </Route>
            <AuthenticatedRoute path="/settings">
              <Settings />
            </AuthenticatedRoute>
            <AuthenticatedRoute path="/newpost">
              <NewPost />
            </AuthenticatedRoute>
            <Route path="/">
              <Home />
            </Route>
          </Switch>
        </UserProvider>
      </div>
    </Router>
  );
}

function AuthenticatedRoute({ path, children }) {
  const location = useLocation();
  const { user } = React.useContext(UserContext);

  return user ? (
    <Route path={path}>{children}</Route>
  ) : (
    <Redirect
      to={{ pathname: "/login", state: { referrer: location.pathname } }}
    />
  );
}

export default App;
