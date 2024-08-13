import React, { createContext, useState } from "react";

const GlobalContext = createContext();
const GlobalProvider = ({ children }) => {
  const [username, setUsername] = useState("");

  return (
    <GlobalContext.Provider value={{ username, setUsername }}>
      {children}
    </GlobalContext.Provider>
  );
};

export { GlobalContext, GlobalProvider };
