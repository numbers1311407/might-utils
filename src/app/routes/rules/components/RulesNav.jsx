import { Box, NavLink, Stack, Text, Tooltip } from "@mantine/core";
import { Link } from "wouter";
import { useRulesStore } from "@/model/store";
import { useRulesList } from "@/core/hooks";
import { IconChevronLeft, IconStarFilled } from "@tabler/icons-react";

export const RulesNav = ({ current, children, ...props }) => {
  const list = useRulesList("filters");
  const { filters: activeFilters } = useRulesStore((store) => store.active);

  return (
    <Box {...props}>
      <Text size="lg" py={8} px={14}>
        Your Rulesets
      </Text>
      <Stack gap={4} component="nav">
        {children}
        {list.map((ruleset) => {
          const active = activeFilters.includes(ruleset.id);

          return (
            <NavLink
              key={ruleset.id}
              component={Link}
              active={current === ruleset.id}
              leftSection={<IconChevronLeft size={16} />}
              rightSection={
                <Box
                  c="primary"
                  style={{ visibility: active ? "visible" : "hidden" }}
                  display="flex"
                >
                  <Tooltip
                    multiline
                    w={180}
                    label="This ruleset is active in the party generator"
                  >
                    <IconStarFilled size={20} />
                  </Tooltip>
                </Box>
              }
              label={ruleset.name}
              href={`/rulesets/${ruleset.id}`}
            />
          );
        })}
      </Stack>
    </Box>
  );
};
