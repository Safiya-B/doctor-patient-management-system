import React, { useState, createContext } from "react";

export const RefreshContext = createContext(null);

const RefreshProvider = ({ children }) => {
  const [refresh, setRefresh] = useState(null);
  return (
    <RefreshContext.Provider value={[refresh, setRefresh]}>
      {children}
    </RefreshContext.Provider>
  );
};

export default RefreshProvider;
