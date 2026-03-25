import { createContext, use, useRef, useState } from "react";

export const AppContext = createContext({});
export const useAppContext = () => use(AppContext);

export const AppContextProvider = ({ children }) => {
  const [hasAside, setHasAside] = useState(false);
  const asideRef = useRef(null);

  const value = {
    asideRef,
    hasAside,
    setHasAside,
  };

  return <AppContext value={value}>{children}</AppContext>;
};
