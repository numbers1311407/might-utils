import { useEffect } from "react";
import { createPortal } from "react-dom";
import { Box, useMantineTheme } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useAppContext } from "@/core/context";

const BaseAside = ({ children, ...props }) => {
  const el = document.getElementById("aside-slot");
  const { setHasAside } = useAppContext();

  useEffect(() => {
    setHasAside(true);
    return () => setHasAside(false);
  }, [setHasAside]);

  if (!el) return null;

  return createPortal(<Box {...props}>{children}</Box>, el);
};

const ResponsiveAside = ({ hidden, breakpoint, ...props }) => {
  const theme = useMantineTheme();
  const value = theme.breakpoints[breakpoint];
  const query = `(${hidden ? "max" : "min"}-width: ${value})`;
  return useMediaQuery(query, false) ? <BaseAside {...props} /> : null;
};

export const Aside = ({ visibleFrom, hiddenFrom, ...props }) => {
  const breakpoint = hiddenFrom || visibleFrom;
  const hidden = !!breakpoint && hiddenFrom;

  return breakpoint ? (
    <ResponsiveAside breakpoint={breakpoint} hidden={hidden} {...props} />
  ) : (
    <BaseAside {...props} />
  );
};
