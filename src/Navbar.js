import React from "react";
import { Link } from "react-router-dom";
import { UserContext } from "./Context/AuthenticatedContext";

function Navbar() {
  const { user } = React.useContext(UserContext);
  return user ? (
    <nav>
      <Link to="/">
        <strong>#ce zici?</strong>
      </Link>
      <ul className="navbar">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/newpost">New Post</Link>
        </li>
        <li>
          <Link to="/settings">Profile settings</Link>
        </li>
      </ul>
    </nav>
  ) : (
    <nav>
      <Link to="/">
        <strong>#ce zici?</strong>
      </Link>
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
  );
}

export default Navbar;
