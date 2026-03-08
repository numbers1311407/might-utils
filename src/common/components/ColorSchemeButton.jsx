import { ActionIcon, useMantineColorScheme } from "@mantine/core";
import { IconSun, IconMoon } from "@tabler/icons-react";

export const ColorSchemeButton = (props) => {
  const { colorScheme, setColorScheme } = useMantineColorScheme();

  return (
    <ActionIcon
      size="x1"
      aria-label="Change color scheme"
      onClick={() => setColorScheme(colorScheme === "dark" ? "light" : "dark")}
      {...props}
    >
      {colorScheme === "dark" ? <IconSun /> : <IconMoon />}
    </ActionIcon>
  );
};
