import React, { useState } from "react";
import { useHistory } from "react-router-dom";

const UserContext = React.createContext(null);
const { Provider } = UserContext;

const UserProvider = ({ children }) => {
  const history = useHistory();

  const [user, setUser] = useState(null);

  const saveUserToken = (data) => {
    localStorage.setItem("token", data.token);
  };

  const saveUserDetailes = (data) => {
    setUser(data);
    saveUserToken(data);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    history.push("/login");
  };

  return (
    <Provider
      value={{
        user,
        saveUserDetailes,
        logout,
      }}
    >
      {children}
    </Provider>
  );
};

export { UserProvider, UserContext };
