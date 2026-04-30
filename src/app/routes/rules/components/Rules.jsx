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
  useRulesStore,
  useRulesStoreApi as rulesApi,
  getConfirmation,
} from "@/model/store";
import { useRulesManager } from "@/core/hooks";
import { useRulesContext } from "../context.js";
import { RulesContextProvider } from "./RulesContextProvider.jsx";
import { RulesNameModal } from "./RulesNameModal.jsx";
import { RuleModal } from "./RuleModal.jsx";
import { Rule } from "./Rule.jsx";
import { RulesNav } from "./RulesNav.jsx";
import { RuleSizeSlider } from "./RuleSizeSlider.jsx";
import classes from "./Rules.module.css";

const ActiveToggle = ({ api }) => (
  <InputLabel
    display="flex"
    style={{ alignItems: "center", gap: 12, cursor: "pointer" }}
  >
    <Text span c={api.currentActive ? "bright" : "neutral"} size="md" flex="1">
      {api.currentActive ? "Active" : "Inactive"}
    </Text>
    <Switch
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
  const isTwenty = useRulesStore((store) => store.groupSizeTwenty);
  const { ruleSizeFilter: active, setRuleSizeFilter } = useRulesContext();

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
  const isTwenty = useRulesStore((store) => store.groupSizeTwenty);

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
          rulesApi.setGroupSizeTwenty(value === "20");
        }}
      />
    </InputLabel>
  );
};

const RulesMain = () => {
  const [_match, { id }] = useRoute("/rulesets/:id?");
  const [ruleset = {}, _setRuleset, api] = useRulesManager("filters", id);
  const [draftRuleset, setDraftRuleset] = useState(null);
  const [draftRuleProps, setDraftRuleProps] = useState(null);
  const [newRule, setNewRule] = useState(null);
  const [_location, setLocation] = useLocation();
  const { ruleSizeFilter: activeSize } = useRulesContext();

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
    () => rulesApi.restoreDefaultSet(ruleset.id),
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
    <>
      <AddSmallButton
        aria-label="Add a rule"
        onClick={() => {
          setDraftRuleProps({});
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
    </>
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
        <Group gap="xs">
          <ActiveToggle api={api} />
          {buttons}
        </Group>
      </PageTitle>

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
          <RulesNav current={ruleset.id}></RulesNav>
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
            <Button size="md" onClick={() => setDraftRuleProps({})}>
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
                <Rule
                  rule={rule}
                  flex="1"
                  onClick={(rule) => setDraftRuleProps({ rule })}
                />
                <EditButton onClick={() => setDraftRuleProps({ rule })} />
                <TrashButton
                  onClick={getConfirmation(() => api.removeCurrentRule(rule), {
                    title: "Are you sure you want to remove this rule?",
                  })}
                />
              </Group>
              <RuleSizeSlider
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
        <RulesNameModal
          ruleset={draftRuleset}
          onClose={() => {
            setDraftRuleset(null);
          }}
          onCommit={(ruleset) => {
            setDraftRuleset(null);

            rulesApi.addSet(ruleset, (set) => {
              setLocation(`/rulesets/${set.id}`);
            });
          }}
        />
      )}

      {draftRuleProps && (
        <RuleModal
          {...draftRuleProps}
          opened
          onClose={() => {
            setDraftRuleProps(null);
          }}
          onSubmit={(rule) => {
            setDraftRuleProps(null);
            api.addCurrentRule(rule);
            api.sortCurrent();
            flashRuleRow(rule);
          }}
        />
      )}
    </Box>
  );
};

export const Rules = () => (
  <RulesContextProvider>
    <RulesMain />
  </RulesContextProvider>
);
