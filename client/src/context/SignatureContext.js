import { createContext, useState } from "react";

export const SignatureContext = createContext({});

export const SignatureProvider = ({ children }) => {
  const [signature, setSignature] = useState({});

  return (
    <SignatureContext.Provider value={{ signature, setSignature }}>
      {children}
    </SignatureContext.Provider>
  );
};
