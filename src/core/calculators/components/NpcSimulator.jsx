import { Stack, Text } from "@mantine/core";
import { capitalize } from "@/utils";
import { simulateInstanceNPC } from "../npc-simulator.js";
import { ChatWindow } from "./ChatWindow.jsx";
import { ChatNpcGreetingInteraction } from "./ChatNpcGreetingInteraction.jsx";

export const NpcSimulator = ({ instance, might, ...containerProps }) => {
  return (
    <Stack gap="sm">
      <ChatWindow {...containerProps}>
        <ChatNpcGreetingInteraction tier={instance.tier} />
        <ChatWindow.Line>Your party's Might: {might}.</ChatWindow.Line>
        <ChatWindow.Divider />
        <ChatWindow.Line>
          Your options for {capitalize(instance.type)} instances (Suggested
          Might: {instance.might}, Maximum for Intense: {instance.maxIntense}):
        </ChatWindow.Line>
        {simulateInstanceNPC(
          instance.type,
          instance.might,
          might,
          instance.tier,
        ).map((line) => (
          <ChatWindow.Line key={line}>{line}</ChatWindow.Line>
        ))}
        <ChatWindow.Divider />
      </ChatWindow>
      <Text size="sm" c="dark">
        <Text span fw="bold">
          Warning:
        </Text>{" "}
        This output is experimental, incomplete, and may be inaccurate.
      </Text>
    </Stack>
  );
};
