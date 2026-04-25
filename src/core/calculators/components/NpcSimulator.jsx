import { Button, Stack, Text } from "@mantine/core";
import { Link } from "wouter";
import { capitalize } from "@/utils";
import { simulateInstanceNPC } from "../npc-simulator.js";
import { ChatWindow } from "./ChatWindow.jsx";
import { ChatNpcGreetingInteraction } from "./ChatNpcGreetingInteraction.jsx";
import { CalculatorDisclaimer } from "./CalculatorDisclaimer.jsx";

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
      <CalculatorDisclaimer mt={-6} />
      <Button
        component={Link}
        size="compact-sm"
        variant="subtle"
        href={`/party-generator?targetScore=${might}`}
      >
        Search for parties with {might} might
      </Button>
    </Stack>
  );
};
