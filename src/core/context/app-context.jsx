import { createContext, use, useEffect, useRef, useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { useLocation } from "wouter";

export const AppContext = createContext({});
export const useAppContext = () => use(AppContext);

export const AppContextProvider = ({ children }) => {
  const [hasAside, setHasAside] = useState(false);
  const asideRef = useRef(null);

  const [pathname] = useLocation();

  const [mobileNavOpened, { close: closeMobileNav, toggle: toggleMobileNav }] =
    useDisclosure(false);

  useEffect(() => {
    closeMobileNav();
  }, [pathname]);

  const value = {
    asideRef,
    hasAside,
    setHasAside,
    mobileNavOpened,
    toggleMobileNav,
    closeMobileNav,
  };

  return <AppContext value={value}>{children}</AppContext>;
};
