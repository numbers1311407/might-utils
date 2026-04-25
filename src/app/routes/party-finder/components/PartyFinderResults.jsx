import { Group, Stack, Title, Text } from "@mantine/core";
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

const PartyFinderResultsHeader = ({ parties }) => (
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
);

export const PartyFinderResults = () => {
  const { parties, isPending } = useFindPartiesResults();

  if (isPending) {
    return <LoadingPage />;
  }

  // TODO here's where we wanna show errors about why using the
  // error reports and telemetry data in the response
  if (!parties.length) {
    return (
      <Stack>
        <Title order={3} c="warning.7">
          No Results Found
        </Title>
        <Text>
          Make sure all your desired roster characters are active and that your
          total roster score is well above your target might score, such that
          plenty of candidate party combinations can be found.
        </Text>
        <Text>
          There are no glaring errors, so insufficient might score in the roster
          to generate party combinations is the most likely problem.
        </Text>
        <Text>
          If you have plenty of might and your min/max party size and char
          levels are correct, take a look at your rules to make sure they're set
          up as you intended.
        </Text>
      </Stack>
    );
  }

  return (
    <>
      <PartyFinderResultsHeader parties={parties} />
      <PartyResults />
    </>
  );
};
