import React, { useState, createContext } from "react";

export const RefreshFilesContext = createContext(null);

const RefreshFilesProvider = ({ children }) => {
  const [refreshFiles, setRefreshFiles] = useState(null);
  return (
    <RefreshFilesContext.Provider value={[refreshFiles, setRefreshFiles]}>
      {children}
    </RefreshFilesContext.Provider>
  );
};

export default RefreshFilesProvider;
