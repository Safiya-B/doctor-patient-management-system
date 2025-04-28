import React, { createContext, useState, useContext } from "react";

const CheckboxContext = createContext();

export const CheckboxProvider = ({ children }) => {
  const [selectedItems, setSelectedItems] = useState([]);

  const value = {
    selectedItems,
    setSelectedItems,
  };

  return (
    <CheckboxContext.Provider value={value}>
      {children}
    </CheckboxContext.Provider>
  );
};

export const useCheckboxContext = () => {
  const context = useContext(CheckboxContext);

  return context;
};
