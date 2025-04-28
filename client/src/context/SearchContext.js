import React, { useState, createContext } from "react";

export const SearchContext = createContext(null);

export const SearchProvider = ({ children }) => {
  const [searchInput, setSearchInput] = useState("");

  return (
    <SearchContext.Provider value={[searchInput, setSearchInput]}>
      {children}
    </SearchContext.Provider>
  );
};
