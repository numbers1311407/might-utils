import { Box, Group, Text } from "@mantine/core";
import { LoadingPage } from "@/core/components";
import { PartyResults } from "./PartyResults.jsx";
import { useFindPartiesResults } from "../hooks";
import { PartySortSelect } from "./PartySortSelect.jsx";
import { MAX_RESPONSE_LENGTH } from "../find-parties/find-parties.js";

const PartyFinderResultsCount = ({ parties, ...props }) => (
  <Text {...props}>
    <Text span>{parties.length} Parties Found</Text>
    {parties.length === MAX_RESPONSE_LENGTH ? (
      <Text c="dark" span>
        {" "}
        (max reached)
      </Text>
    ) : null}
  </Text>
);

export const PartyFinderResults = () => {
  const { parties, isPending } = useFindPartiesResults();

  if (isPending) {
    return <LoadingPage />;
  }

  // TODO here's where we wanna show errors about why using the
  // error reports and telemetry data in the response
  if (!parties.length) {
    return "No results";
  }

  return (
    <>
      <Group
        bg="var(--mantine-color-body-custom)"
        py="xl"
        mt="-lg"
        style={{
          position: "sticky",
          top: 66,
          zIndex: 200,
        }}
      >
        <PartyFinderResultsCount parties={parties} flex="1" />
        <PartySortSelect />
      </Group>
      <PartyResults />
    </>
  );
};
