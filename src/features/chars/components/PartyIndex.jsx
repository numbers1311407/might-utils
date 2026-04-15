import { List } from "@mantine/core";
import { AppLink } from "@/core/components";
import { usePartiesList } from "@/core/hooks";

export const PartyIndex = () => {
  const parties = usePartiesList();

  // <Stack align="center" ta="center" p="3xl">
  //   <Text size="lg" c="primary">
  //     You have no saved parties.
  //   </Text>
  //   <Text size="md" style={{ maxWidth: 580 }} ta="center">
  //     Click the button in the top right to create one manually, or use the{" "}
  //     <AppLink href="/">party finder</AppLink> and save resulting parties you
  //     want to track.
  //   </Text>
  // </Stack>;

  return (
    <List>
      {!parties.length && <List.Item>You have no parties</List.Item>}
      {parties.map((party) => (
        <List.Item key={party.id}>
          <AppLink href={`/parties/${party.id}`}>{party.name}</AppLink>
        </List.Item>
      ))}
    </List>
  );
};
