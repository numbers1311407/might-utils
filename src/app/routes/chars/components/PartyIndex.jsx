import { useMemo } from "react";
import { List } from "@mantine/core";
import { AppLink } from "@/core/components";
import { usePartiesList, getPartyDiff, useRoster } from "@/core/hooks";

export const PartyIndex = () => {
  const parties = usePartiesList({ hydrate: true, classTags: true });
  const roster = useRoster({ activeOnly: true });
  const diffDecoratedParties = useMemo(() => {
    return parties.map((party) => ({
      ...party,
      diff: getPartyDiff(party, roster),
    }));
  }, [parties, roster]);

  return (
    <List>
      {!parties.length && <List.Item>You have no parties</List.Item>}
      {diffDecoratedParties.map((party) => (
        <List.Item key={party.id}>
          <AppLink href={`/parties/${party.id}`}>{party.name}</AppLink>
        </List.Item>
      ))}
    </List>
  );
};
