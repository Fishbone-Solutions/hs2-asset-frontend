import React, { createContext, useState } from 'react';

// Create a context
const GlobalContext = createContext();

// Create a provider component
const GlobalProvider = ({ children }) => {
  const [username, setUsername] = useState('');

  return (
    <GlobalContext.Provider value={{ username, setUsername }}>
      {children}
    </GlobalContext.Provider>
  );
};

export { GlobalContext, GlobalProvider };
