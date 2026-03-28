import { Text } from "@mantine/core";
import { simulateInstanceNPC, instanceData } from "@/core/instances";

export const InstanceCalculator = () => {
  return (
    <Text size="xs" component="pre">
      {JSON.stringify(
        {
          "group/1200/800": simulateInstanceNPC("group", 1200, 800),
          "raid/2200/800": simulateInstanceNPC("raid", 2200, 800),
          "group/750/1540": simulateInstanceNPC("group", 750, 1540),
        },
        null,
        2,
      )}
    </Text>
  );
};
