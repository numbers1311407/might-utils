import { Box, NavLink, Stack, Text, Tooltip } from "@mantine/core";
import { Link } from "wouter";
import { useTagRulesList, useTagRulesStore } from "@/core/store";
import { IconChevronLeft, IconStarFilled } from "@tabler/icons-react";

export const TagRulesNav = ({ current, children, ...props }) => {
  const list = useTagRulesList("filters");
  const { filters: activeFilters } = useTagRulesStore((store) => store.active);

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
                  c="gold"
                  style={{ visibility: active ? "visible" : "hidden" }}
                  display="flex"
                >
                  <Tooltip label="The active ruleset">
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
