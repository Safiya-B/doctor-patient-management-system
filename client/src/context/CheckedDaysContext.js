import React, { useState, createContext } from "react";

export const CheckedDaysContext = createContext(null);

export const CheckedDaysProvider = ({ children }) => {
  const [checkedDays, setCheckDays] = useState({
    lundi: [],
    mardi: [],
    mercredi: [],
    jeudi: [],
    vendredi: [],
    samedi: [],
    dimanche: [],
  });
  return (
    <CheckedDaysContext.Provider value={[checkedDays, setCheckDays]}>
      {children}
    </CheckedDaysContext.Provider>
  );
};
