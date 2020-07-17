import React from "react";

import { UserContext } from "./Context/AuthenticatedContext";

function Home() {
  const { user } = React.useContext(UserContext);

  return <h2>Welcome, {user ? user.username : "Anonymous"}</h2>;
}

export default Home;
