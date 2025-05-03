import React, { useState, createContext } from "react";

export const UserDataContext = createContext({});

export const UserDataProvider = ({ children }) => {
  const [user, setUser] = useState({});

  return (
    <UserDataContext.Provider value={{ user, setUser }}>
      {children}
    </UserDataContext.Provider>
  );
};
