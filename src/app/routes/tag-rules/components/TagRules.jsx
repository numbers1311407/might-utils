import { useEffect, useMemo, useState } from "react";
import { IconSortAscendingNumbers, IconPlus } from "@tabler/icons-react";
import * as titles from "@/config/constants/titles";
import {
  ActionIcon,
  Button,
  Box,
  Divider,
  InputLabel,
  Group,
  Paper,
  Text,
  Title,
  Tooltip,
  Stack,
  Switch,
  SegmentedControl,
} from "@mantine/core";
import { getNumberedArray } from "@/utils";
import { useRoute, Redirect, useLocation } from "wouter";
import {
  AddSmallButton,
  Aside,
  CopySmallButton,
  EditButton,
  EditSmallButton,
  HelpIconTooltip,
  PageTitle,
  TrashButton,
  RemoveSmallButton,
  RestoreSmallButton,
} from "@/core/components";
import {
  useTagRulesStore,
  useTagRulesStoreApi as tagRulesApi,
  getConfirmation,
} from "@/model/store";
import { useTagRulesManager } from "@/core/hooks";
import { useTagRulesContext } from "../context.js";
import { TagRulesContextProvider } from "./TagRulesContextProvider.jsx";
import { TagRulesNameModal } from "./TagRulesNameModal.jsx";
import { TagRuleModal } from "./TagRuleModal.jsx";
import { TagRule } from "./TagRule.jsx";
import { TagRulesNav } from "./TagRulesNav.jsx";
import { TagRuleSizeSlider } from "./TagRuleSizeSlider.jsx";
import classes from "./TagRules.module.css";

const ActiveToggle = ({ api }) => (
  <InputLabel
    display="flex"
    style={{ alignItems: "center", gap: 12, cursor: "pointer" }}
  >
    {api.currentActive && (
      <Text span c="bright" size="md" flex="1">
        Active in the party generator
      </Text>
    )}
    {!api.currentActive && (
      <Text span c="neutral" size="md" flex="1">
        Click to activate
      </Text>
    )}
    <Switch
      mt={4}
      checked={api.currentActive}
      onChange={(e) => {
        if (e.currentTarget.checked) {
          api.activateCurrent();
        } else {
          api.deactivateCurrent();
        }
      }}
    />
  </InputLabel>
);

const RuleSizeFilterButtons = () => {
  const isTwenty = useTagRulesStore((store) => store.groupSizeTwenty);
  const { ruleSizeFilter: active, setRuleSizeFilter } = useTagRulesContext();

  useEffect(() => {
    setRuleSizeFilter();
  }, [setRuleSizeFilter]);

  const numbers = useMemo(
    () => getNumberedArray(isTwenty ? 20 : 12),
    [isTwenty],
  );

  const btnProps = (value) => ({
    size: "compact-sm",
    variant: active === value ? "filled" : "light",
    onClick: () => setRuleSizeFilter(value),
  });

  return (
    <Stack gap={4}>
      <Text size="sm" c="dark">
        Filter by group size to inspect the rules that will be applied
      </Text>
      <Group gap={6}>
        <Button {...btnProps()}>Show All</Button>
        {numbers.map((n) => (
          <Button w={36} key={n} {...btnProps(n)}>
            {n}
          </Button>
        ))}
      </Group>
    </Stack>
  );
};

const ToggleGroupSizeTwenty = () => {
  const isTwenty = useTagRulesStore((store) => store.groupSizeTwenty);

  return (
    <InputLabel
      display="flex"
      style={{ alignItems: "center", gap: 10, cursor: "pointer" }}
    >
      <Group gap={4}>
        <Text c="dark" span size="md" flex="1">
          Group Size Max
        </Text>
        <HelpIconTooltip tooltip="The number of targetable group sizes shown in the rules controls. Just here to declutter the UI if you don't need 20" />
      </Group>
      <SegmentedControl
        value={isTwenty ? "20" : "12"}
        data={["12", "20"]}
        onChange={(value) => {
          tagRulesApi.setGroupSizeTwenty(value === "20");
        }}
      />
    </InputLabel>
  );
};

const TagRulesMain = () => {
  const [_match, { id }] = useRoute("/rulesets/:id?");
  const [ruleset = {}, _setRuleset, api] = useTagRulesManager("filters", id);
  const [draftRuleset, setDraftRuleset] = useState(null);
  const [draftTagRuleProps, setDraftTagRuleProps] = useState(null);
  const [newRule, setNewRule] = useState(null);
  const [_location, setLocation] = useLocation();
  const { ruleSizeFilter: activeSize } = useTagRulesContext();

  const activeRules = useMemo(() => {
    return ruleset.rules.filter(
      (rule) =>
        activeSize === undefined ||
        (rule.size[0] <= activeSize && rule.size[1] >= activeSize),
    );
  }, [ruleset.rules, activeSize]);

  const flashRuleRow = (rule) => {
    setNewRule(rule);
    setTimeout(() => {
      setNewRule(null);
    }, 1200);
  };

  const restoreCurrent = getConfirmation(
    () => tagRulesApi.restoreDefaultSet(ruleset.id),
    {
      message:
        "This will restore this ruleset to its original defaults. This cannot be undone.",
    },
  );

  const removeCurrent = getConfirmation(
    () => {
      api.removeCurrent();
    },
    {
      title: "Are you sure you want to remove this ruleset?",
      message: "This cannot be undone.",
    },
  );

  const buttons = (
    <Group gap="xs">
      <AddSmallButton
        aria-label="Add a rule"
        onClick={() => {
          setDraftTagRuleProps({});
        }}
      >
        Add a Rule
      </AddSmallButton>

      <Tooltip
        openDelay={600}
        label="Create a copy of this ruleset and edit it immediately."
      >
        <CopySmallButton
          onClick={() => setDraftRuleset(api.duplicateCurrent())}
        >
          Duplicate
        </CopySmallButton>
      </Tooltip>

      <EditSmallButton
        aria-label="Rename ruleset"
        onClick={() => {
          setDraftRuleset(ruleset);
        }}
      >
        Rename
      </EditSmallButton>

      {!api.currentDefault && (
        <>
          <RemoveSmallButton
            aria-label="Remove ruleset"
            disabled={api.currentDefault}
            onClick={removeCurrent}
          >
            Remove
          </RemoveSmallButton>
        </>
      )}

      {api.currentDefault && (
        <Tooltip
          openDelay={600}
          label="Restore this ruleset to its original default state"
        >
          <RestoreSmallButton
            aria-label="Reset to defaults"
            disabled={!api.currentDefaultDirty}
            onClick={restoreCurrent}
          >
            Reset
          </RestoreSmallButton>
        </Tooltip>
      )}
    </Group>
  );

  if (!ruleset?.id) {
    return <Redirect to="/rulesets" />;
  }

  return (
    <Box>
      <PageTitle
        section={titles.SETTINGS_CATEGORY}
        title={titles.TAG_RULES_TITLE}
        subtitle="Tag and attribute based rules that define your generated parties are composed"
        size="h1"
      >
        <ToggleGroupSizeTwenty />
      </PageTitle>

      <Text c="dark" size="sm"></Text>

      <PageTitle
        section={
          <Text color="dark" size="sm">
            Current Ruleset:
          </Text>
        }
        divider={false}
        title={ruleset.name}
        order={3}
        size="h2"
        mb={8}
        mt={8}
      >
        <ActiveToggle api={api} />
      </PageTitle>

      {buttons}

      <Aside>
        <Stack gap="sm">
          <Button
            size="sm"
            leftSection={<IconPlus size={18} />}
            onClick={() => setDraftRuleset({ type: "filters" })}
            fullWidth
          >
            Create New Ruleset
          </Button>
          <Title c="primary" order={4}>
            Quick Help
          </Title>
          <Text>
            Create sets of rules based on character attributes and tags which
            the party generator uses to build your parties.
          </Text>
          <Text>
            A typical standard ruleset is created as a default, as well as a
            more specific "Time-Flagged" ruleset to show how you might use rules
            to filter on less obvious data points.
          </Text>
          <Text>
            Ruleset are combinable in the generator, so it's up to you if you
            want to have one big ruleset, or smaller combinable rulesets for
            different purposes. For example you may have a "core" ruleset of
            your tank and healers, with "melee" vs "caster" rulesets kept
            separate for different group types.
          </Text>
          <TagRulesNav current={ruleset.id}></TagRulesNav>
        </Stack>
      </Aside>

      <Stack my="lg">
        <Group align="flex-end">
          <Box flex="1">
            <RuleSizeFilterButtons />
          </Box>
          <Tooltip
            openDelay={500}
            multiline
            w={220}
            label="Re-sort rules by ascending group size. This is for visual aid only and has no effect on behavior."
          >
            <ActionIcon
              aria-label="Resort rules by ascending size"
              size="md"
              disabled={api.currentSorted}
              onClick={() => {
                api.sortCurrent();
              }}
            >
              <IconSortAscendingNumbers />
            </ActionIcon>
          </Tooltip>
        </Group>

        <Divider />

        {!activeRules.length && (
          <Box p="2xl" ta="center">
            <Text size="lg" mb="md" c="primary">
              {activeSize === undefined ? (
                "You have no rules defined in this ruleset."
              ) : (
                <>
                  You have no rules defined for a group of size {activeSize}.
                  <br />
                  You can adjust your sliders to cover this size, or create a
                  new rule.
                </>
              )}
            </Text>
            <Button size="md" onClick={() => setDraftTagRuleProps({})}>
              Add a rule now?
            </Button>
          </Box>
        )}

        {activeRules.map((rule) => (
          <Paper shadow="md" px="md" py="sm" key={rule.id}>
            <Stack
              key={rule.id}
              className={newRule?.id === rule.id ? classes.highlightRow : ""}
              gap={8}
            >
              <Group gap={4} align="center">
                <TagRule
                  rule={rule}
                  flex="1"
                  onClick={(rule) => setDraftTagRuleProps({ rule })}
                />
                <EditButton onClick={() => setDraftTagRuleProps({ rule })} />
                <TrashButton
                  onClick={getConfirmation(() => api.removeCurrentRule(rule), {
                    title: "Are you sure you want to remove this rule?",
                  })}
                />
              </Group>
              <TagRuleSizeSlider
                flex="1"
                value={rule.size}
                mb={20}
                onChange={(size) => {
                  api.addCurrentRule({ ...rule, size });
                }}
              />
            </Stack>
          </Paper>
        ))}
      </Stack>

      <Divider my="lg" />

      {draftRuleset && (
        <TagRulesNameModal
          ruleset={draftRuleset}
          onClose={() => {
            setDraftRuleset(null);
          }}
          onCommit={(ruleset) => {
            setDraftRuleset(null);

            tagRulesApi.addSet(ruleset, (set) => {
              setLocation(`/rulesets/${set.id}`);
            });
          }}
        />
      )}

      {draftTagRuleProps && (
        <TagRuleModal
          {...draftTagRuleProps}
          opened
          onClose={() => {
            setDraftTagRuleProps(null);
          }}
          onSubmit={(rule) => {
            setDraftTagRuleProps(null);
            api.addCurrentRule(rule);
            api.sortCurrent();
            flashRuleRow(rule);
          }}
        />
      )}
    </Box>
  );
};

export const TagRules = () => (
  <TagRulesContextProvider>
    <TagRulesMain />
  </TagRulesContextProvider>
);
