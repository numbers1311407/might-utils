import { useMemo } from "react";
import { Table } from "@mantine/core";

export const PartyStatsTable = ({ stats, ...props }) => {
  const rows = useMemo(() => {
    return [
      ["Might Average", stats.mightAvg],
      [
        "Might Range",
        `${stats.mightRangeBounds[0]}-${stats.mightRangeBounds[1]}`,
      ],
      ["Might Std Dev", stats.mightSD],
      ["Level Average", stats.levelAvg],
      ["Total Warden Ranks", stats.wardenRankTotal],
      [
        "Score from Levels",
        `${stats.levelMightTotal} (${stats.levelMightPct}%)`,
      ],
      [
        "Score from Warden Mult",
        `${stats.wardenMightTotal} (${stats.wardenMightPct}%)`,
      ],
    ].map(([label, value]) => (
      <Table.Tr key={label}>
        <Table.Th py={4} pl={0} pr={8} fw="400">
          {label}
        </Table.Th>
        <Table.Td ta="right" ff="mono" py={4} pr={0} pl={8}>
          {value}
        </Table.Td>
      </Table.Tr>
    ));
  }, [stats]);

  return (
    <Table
      orientation="vertical"
      withRowBorders
      withColumnBorders
      size="sm"
      {...props}
    >
      <Table.Tbody>{rows}</Table.Tbody>
    </Table>
  );
};
