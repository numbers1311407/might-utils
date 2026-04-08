import { Text } from "@mantine/core";

const NPC_GREETINGS = {
  T6: {
    npc: "Gruub",
    response: <>Gruub says, 'hzzz... speak up before I nap.'</>,
  },
  T7: {
    npc: "Flamsy",
    response: (
      <>
        Flamsy says, 'Speak up! Do you need to learn more about{" "}
        <Text span c="magenta">
          [The Fabled Nagafen's Lair]
        </Text>
        ?'
      </>
    ),
  },
  T8: {
    npc: "Thorne Darkholme",
    response: (
      <>
        Thorne Darkholme says, 'Would you like to learn more about the{" "}
        <Text span c="magenta">
          [content of the Spider Den]
        </Text>
        ?'
      </>
    ),
  },
  T9: {
    npc: "Howard",
    response: (
      <>
        Howard says, 'Would you like to learn more about{" "}
        <Text span c="magenta">
          [The Bloodied Quarries]
        </Text>
        ?'
      </>
    ),
  },
  T10: {
    npc: "Suki the Cobra",
    response: (
      <>
        Suki the Cobra says, 'Are you unfamiliar with{" "}
        <Text span c="magenta">
          [vampires]
        </Text>
        ?'
      </>
    ),
  },
};

export const ChatNpcGreetingInteraction = ({ tier }) => {
  const greeting = NPC_GREETINGS[tier];

  if (!greeting) return null;

  return (
    <>
      <Text size="sm" c="white">
        You say, 'Hail {greeting.npc}'
      </Text>
      <Text size="sm">{greeting.response}</Text>
    </>
  );
};
