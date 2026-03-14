import { useEffect } from "react";
import { useLocation } from "wouter";

// fixes an annoyance with wouter nav where the scroll position is
// retained on nav.
export const ScrollToTop = () => {
  const [pathname] = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};
