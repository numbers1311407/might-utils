import { NumberInput, Stack, Text, List } from "@mantine/core";
import { useRoute } from "wouter";

import {
  simulateInstanceNPC,
  getTargetMightRanges,
  humanizeOffering,
} from "@/core/instances";
import { capitalize } from "@/utils";
import { PageTitle } from "@/core/components";

import { TierSelect, DifficultySelect } from "./TierSelect.jsx";
import { ChatWindow } from "./ChatWindow";
import { useCalculatorContext } from "../calculator-context.js";
import { CalculatorContextProvider } from "./CalculatorContextProvider.jsx";
import { ChatNpcGreetingInteraction } from "./ChatNpcGreetingInteraction.jsx";

export const NpcSimulator = ({ children }) => {
  const { might, setMight, instance, maxIntense } = useCalculatorContext();

  return (
    <Stack>
      <PageTitle
        section="Planning & Calc"
        title="Instance NPC Simulator"
        subtitle="Know what Suki has to say before you're in hail distance"
      />
      {children}
      <Stack>
        <NumberInput
          value={might}
          onChange={(value) => setMight(value)}
          placeholder="Enter Might"
          step={10}
          size="md"
          w={400}
        />
        {might && instance.might && (
          <ChatWindow>
            <ChatNpcGreetingInteraction tier={instance.tier} />
            <ChatWindow.Line>Your party's Might: {might}.</ChatWindow.Line>
            <ChatWindow.Divider />
            <ChatWindow.Line>
              Your options for {capitalize(instance.type)} instances (Suggested
              Might: {instance.might}, Maximum for Intense: {maxIntense}):
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
        )}
      </Stack>
    </Stack>
  );
};

export const MightRangeCalculator = ({ children }) => {
  const { difficulty, setDifficulty, instance } = useCalculatorContext();

  return (
    <Stack>
      <PageTitle
        section="Planning & Calc"
        title="Might Range Calculator"
        subtitle="Look up might ranges by tier and desired difficulty"
      />
      {children}
      <Stack>
        <DifficultySelect value={difficulty} onChange={setDifficulty} w={400} />
        {difficulty && instance.might && (
          <Stack>
            <Text size="sm">Chosen Difficulty: {difficulty}</Text>
            <List size="sm">
              {getTargetMightRanges(instance.type, instance.might, difficulty)
                .sort((a, b) => a.minMight - b.minMight)
                .map((line, i) => (
                  <List.Item key={i}>
                    {humanizeOffering({ ...line, difficulty })} {line.minMight}-
                    {line.maxMight}
                  </List.Item>
                ))}
            </List>
          </Stack>
        )}
      </Stack>
    </Stack>
  );
};

export const InstanceCalculatorMain = () => {
  const { instance, setInstance } = useCalculatorContext();
  const [isSimulator] = useRoute("/npc-simulator");
  const Page = isSimulator ? NpcSimulator : MightRangeCalculator;

  return (
    <Page>
      <TierSelect
        value={Object.values(instance).join(":")}
        onChange={setInstance}
        w={400}
      />
    </Page>
  );
};

export const InstanceCalculator = () => {
  return (
    <CalculatorContextProvider>
      <InstanceCalculatorMain />
    </CalculatorContextProvider>
  );
};
