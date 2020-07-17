import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  useLocation,
} from "react-router-dom";
import Navbar from "./Navbar";
import Home from "./Home";
import Signup from "./Signup";
import Login from "./Login";
import NewPost from "./Newpost";
import Settings from "./Settings";
import { UserContext, UserProvider } from "./Context/AuthenticatedContext";

import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <UserProvider>
          <Navbar />
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
