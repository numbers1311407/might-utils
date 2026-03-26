import { useEffect } from "react";
import { createPortal } from "react-dom";
import { Box } from "@mantine/core";
import { useAppContext } from "@/core/context";

export const Aside = ({ children, ...props }) => {
  const { setHasAside } = useAppContext();

  const el = document.getElementById("aside-slot");

  useEffect(() => {
    setHasAside(true);
    return () => setHasAside(false);
  }, [setHasAside]);

  if (!el) return null;

  return createPortal(<Box {...props}>{children}</Box>, el);
};
