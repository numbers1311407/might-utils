import { Alert, Group, Stack, Title, Text } from "@mantine/core";
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

const PartyFinderResultsHeader = ({ parties, mx = 12 }) => (
  <Group
    bg="var(--mantine-color-body-custom)"
    py="xl"
    mt="-lg"
    ml={mx * -1}
    mr={mx * -1}
    pl={mx + 8}
    pr={mx + 8}
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
        <Alert bg="light-dark(var(--mantine-color-secondary-5), var(--mantine-color-secondary-filled))">
          <Title order={3} c="warning.5">
            No Results Found
          </Title>
          <Text c="warning.2">
            No specific issues were encountered so either your search is too
            restrictive or an unknown error was encountered.
          </Text>
        </Alert>
        <Title order={4}>Tips:</Title>
        <Text>
          Make sure all your desired roster characters are active and that your
          total roster score is well above your target might score, such that
          plenty of candidate party combinations can be found.
        </Text>
        <Text>
          If you have plenty of might in your roster and your min/max party size
          and char levels are correct, take a look at your rules to make sure
          they're set up as you intended.
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
