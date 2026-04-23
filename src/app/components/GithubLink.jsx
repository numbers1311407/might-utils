import { Anchor, Image, VisuallyHidden } from "@mantine/core";
import logoWhite from "@/assets/github-white.png";
import logoBlack from "@/assets/github-black.png";

export const GithubLink = (props) => {
  return (
    <Anchor
      {...props}
      style={{ display: "flex", alignItems: "center", gap: "8px" }}
    >
      <Image src={logoBlack} darkHidden h={26} />
      <Image src={logoWhite} lightHidden h={26} />
      <VisuallyHidden>Source Code</VisuallyHidden>
    </Anchor>
  );
};
