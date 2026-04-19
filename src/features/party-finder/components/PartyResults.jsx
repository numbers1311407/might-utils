import { forwardRef, useMemo } from "react";
import { VirtuosoGrid } from "react-virtuoso";
import { Box, Group, Paper } from "@mantine/core";
import { useFindPartiesResults } from "../hooks";
import { IconDeviceFloppy as IconDisk } from "@tabler/icons-react";
import { PartyLine } from "@/core/components";

// export const PartyResultsList = ({ parties }) => {
//   return (
//     <SimpleGrid cols={5} verticalSpacing="md" spacing="md">
//       {parties.map((party, i) => (
//         <Paper key={i} bg="secondary.9" p={8}>
//           <Box bg="dark.8" bdrs="sm" p={4} ta="center" pos="relative">
//             {party.score}{" "}
//             <IconDisk
//               size={20}
//               style={{ position: "absolute", right: 5, top: 6 }}
//             />
//           </Box>
//           <Box p="sm">
//             <PartyLine key={i} party={party.party} />
//           </Box>
//         </Paper>
//       ))}
//     </SimpleGrid>
//   );
// };

const GridList = forwardRef(({ style, children, ...props }, ref) => (
  <div
    ref={ref}
    {...props}
    style={{
      ...style,
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
      gap: "1rem",
      paddingBottom: "1rem",
    }}
  >
    {children}
  </div>
));

const GridItem = ({ children, style, ...props }) => (
  <div {...props} style={{ display: "flex", flexDirection: "row", ...style }}>
    {children}
  </div>
);

const components = {
  List: GridList,
  Item: GridItem,
};

export const PartyResultsList = ({ parties }) => {
  return (
    <VirtuosoGrid
      totalCount={parties.length}
      data={parties}
      components={components}
      useWindowScroll
      itemContent={(_i, party) => (
        <Paper p="sm" flex="1">
          <Box bg="dark.8" bdrs="sm" p={4} ta="center" pos="relative">
            {party.score}{" "}
            <IconDisk
              size={20}
              style={{ position: "absolute", right: 5, top: 6 }}
            />
          </Box>
          <Box p="sm">
            <PartyLine party={party.party} />
          </Box>
        </Paper>
      )}
    />
  );
};

export const PartyResults = ({ show = 50 }) => {
  const { parties, pool } = useFindPartiesResults();

  const hydratedParties = useMemo(() => {
    return parties
      .map((party) => ({
        ...party,
        party: [...party.party].map((idx) => pool[idx]),
      }))
      .slice(0, show);
  }, [parties, pool, show]);

  return <PartyResultsList parties={hydratedParties} />;
};
