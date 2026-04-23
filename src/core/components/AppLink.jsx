import { Link } from "wouter";
import { Anchor } from "@mantine/core";

export const AppLink = (props) => {
  return <Anchor component={Link} {...props} />;
};
