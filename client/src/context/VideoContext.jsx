import React, { useState, createContext } from "react";

export const VideoContext = createContext(null);

export const VideoProvider = ({ children }) => {
  const [room, setRoom] = useState(null);

  return (
    <VideoContext.Provider value={[room, setRoom]}>
      {children}
    </VideoContext.Provider>
  );
};
