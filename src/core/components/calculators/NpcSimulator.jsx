import { simulateInstanceNPC } from "@/core/instances";
import { capitalize } from "@/utils";
import { ChatWindow } from "./ChatWindow.jsx";
import { ChatNpcGreetingInteraction } from "./ChatNpcGreetingInteraction.jsx";

export const NpcSimulator = ({
  instance,
  might,
  maxIntense,
  ...containerProps
}) => {
  return (
    <ChatWindow {...containerProps}>
      <ChatNpcGreetingInteraction tier={instance.tier} />
      <ChatWindow.Line>Your party's Might: {might}.</ChatWindow.Line>
      <ChatWindow.Divider />
      <ChatWindow.Line>
        Your options for {capitalize(instance.type)} instances (Suggested Might:{" "}
        {instance.might}, Maximum for Intense: {maxIntense}):
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
  );
};
