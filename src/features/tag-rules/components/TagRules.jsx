import { useMemo, useState } from "react";
import {
  IconCopy,
  IconX,
  IconAlertCircle,
  IconRestore,
  IconSortAscendingNumbers,
  IconPlus,
  IconEdit,
  IconTrash,
} from "@tabler/icons-react";
import {
  ActionIcon,
  Alert,
  Button,
  Box,
  Divider,
  InputLabel,
  Paper,
  Group,
  Grid,
  Text,
  Title,
  Tooltip,
  Stack,
  SimpleGrid,
  Switch,
  SegmentedControl,
} from "@mantine/core";
import { useRoute, Redirect, useLocation } from "wouter";
import { Aside, HelpIconTooltip, PageTitle } from "@/core/components";
import {
  useTagRulesManager,
  useTagRulesStore,
  useTagRulesStoreApi as tagRulesApi,
  useConfirmationStore,
} from "@/core/store";
import { getNumberedArray } from "@/utils";
import { lintTagRuleset } from "@/core/schemas";

import { TagRulesNameModal } from "./TagRulesNameModal.jsx";
import { TagRuleModal } from "./TagRuleModal.jsx";
import { TagRule, getQueryDescription } from "./TagRule.jsx";
import { TagRulesNav } from "./TagRulesNav.jsx";
import { TagRuleSizeSlider } from "./TagRuleSizeSlider.jsx";
import { TagRulesetPreview } from "./TagRulesetPreview.jsx";
import classes from "./TagRules.module.css";

const SIZE_NUMBERS = getNumberedArray(1, 20);

const EditButton = (props) => (
  <ActionIcon aria-label="Edit" size="sm" {...props}>
    <IconEdit />
  </ActionIcon>
);

const DeleteButton = (props) => (
  <ActionIcon aria-label="Remove" size="sm" {...props}>
    <IconX />
  </ActionIcon>
);

const GridRow = ({ left, right, main, ...props }) => {
  return (
    <>
      <Grid.Col pb={0} span={{ base: 12 }} {...props}>
        {left}
      </Grid.Col>
      <Grid.Col span={{ base: 11, lg: 11 }} {...props}>
        {main}
      </Grid.Col>
      <Grid.Col span={{ base: 1, md: 1 }} {...props}>
        {right}
      </Grid.Col>
    </>
  );
};

const LintAlert = ({ count, ...props }) => {
  return (
    <Alert
      variant="light"
      title="Warning: Overlapping Rules"
      icon={<IconAlertCircle />}
      {...props}
    >
      You have {count} rule(s) which have conflicting sizes. Rules that apply to
      the same group size must have unique type, value, and warden requirement.
      When there is a conflict, the rule with the higher size range wins.
    </Alert>
  );
};

const ActiveToggle = ({ api }) => (
  <InputLabel
    display="flex"
    style={{ alignItems: "center", gap: 12, cursor: "pointer" }}
  >
    {api.currentActive && (
      <Text span c="bright" size="lg" flex="1">
        This is the active ruleset
      </Text>
    )}
    {!api.currentActive && (
      <Text span c="neutral" size="lg" flex="1">
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

export const TagRules = ({ type = "filters" }) => {
  const { getConfirmation } = useConfirmationStore();
  const [_match, { id }] = useRoute("/rulesets/:id?");
  const [ruleset = {}, _setRuleset, api] = useTagRulesManager(type, id);
  const [draftRuleset, setDraftRuleset] = useState(null);
  const [draftTagRuleProps, setDraftTagRuleProps] = useState(null);
  const [newRule, setNewRule] = useState(null);
  const [_location, setLocation] = useLocation();

  const lintResult = useMemo(() => {
    return lintTagRuleset(ruleset);
  }, [ruleset]);

  const flashRuleRow = (rule) => {
    setNewRule(rule);
    setTimeout(() => {
      setNewRule(null);
    }, 1200);
  };

  const restoreCurrent = getConfirmation(
    (ie) => tagRulesApi.restoreDefaultSet(ruleset.id),
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

  const buttonsSize = "sm";
  const buttons = (
    <Group gap="xs">
      <Button
        aria-label="Add a rule"
        size={buttonsSize}
        leftSection={<IconPlus size={12} />}
        onClick={() => {
          setDraftTagRuleProps({});
        }}
      >
        Add a Rule
      </Button>

      <Tooltip
        openDelay={600}
        label="Create a copy of this ruleset and edit it immediately."
      >
        <Button
          leftSection={<IconCopy size={12} />}
          size={buttonsSize}
          onClick={() => setDraftRuleset(api.duplicateCurrent())}
        >
          Duplicate
        </Button>
      </Tooltip>

      <Button
        aria-label="Rename ruleset"
        leftSection={<IconEdit size={12} />}
        size={buttonsSize}
        variant="light"
        onClick={() => {
          setDraftRuleset(ruleset);
        }}
      >
        Rename
      </Button>

      {!api.currentDefault && (
        <>
          <Button
            aria-label="Remove ruleset"
            size={buttonsSize}
            variant="outline"
            leftSection={<IconTrash size={12} />}
            disabled={api.currentDefault}
            onClick={removeCurrent}
          >
            Remove
          </Button>
        </>
      )}

      {api.currentDefault && (
        <Tooltip
          openDelay={600}
          label="Restore this ruleset to its original default state"
        >
          <Button
            aria-label="Reset to defaults"
            disabled={!api.currentDefaultDirty}
            leftSection={<IconRestore size={12} />}
            onClick={restoreCurrent}
            size={buttonsSize}
            variant="outline"
          >
            Reset
          </Button>
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
        section="Configuration"
        title="Generator Rules"
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
            onClick={() => setDraftRuleset({ type })}
            fullWidth
          >
            Create New Ruleset
          </Button>
          <TagRulesNav current={ruleset.id}></TagRulesNav>
        </Stack>
      </Aside>

      <Grid gutter="lg" align="stretch" my="lg">
        <GridRow
          display={{ base: "none", md: "block" }}
          right={
            <Box ta="right">
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
            </Box>
          }
          style={{
            borderBottom: "1px dashed var(--mantine-color-default-border)",
            marginTop: 12,
            marginBottom: 12,
          }}
        />
        {!ruleset.rules.length && (
          <Grid.Col span={12} ta="center" p="3xl">
            <Text size="lg" mb="md" c="gold">
              You have no rules defined in this ruleset.
            </Text>
            <Button size="md" onClick={() => setDraftTagRuleProps({})}>
              Add a rule now?
            </Button>
          </Grid.Col>
        )}
        {ruleset.rules.map((rule) => (
          <GridRow
            key={rule.id}
            className={newRule?.id === rule.id ? classes.highlightRow : ""}
            left={
              <TagRule
                rule={rule}
                conflicts={lintResult.errors[rule.id]}
                onClick={(rule) => setDraftTagRuleProps({ rule })}
              />
            }
            main={
              <TagRuleSizeSlider
                value={rule.size}
                mb={20}
                onChange={(size) => {
                  api.addCurrentRule({ ...rule, size });
                }}
              />
            }
            right={
              <Group gap={4} justify="flex-end">
                <EditButton
                  size="md"
                  onClick={() => setDraftTagRuleProps({ rule })}
                />
                <DeleteButton
                  size="md"
                  onClick={getConfirmation(() => api.removeCurrentRule(rule), {
                    title: "Are you sure you want to remove this rule?",
                  })}
                />
              </Group>
            }
          />
        ))}
        {!lintResult.ok && (
          <GridRow
            main={<LintAlert count={Object.keys(lintResult.errors).length} />}
          />
        )}
      </Grid>

      <Divider my="lg" />

      <Title order={4} size="h4" my="lg">
        Rule summaries by size
      </Title>

      <SimpleGrid cols={4} spacing="lg" mb={72}>
        {SIZE_NUMBERS.map((size) => (
          <Paper
            key={size}
            display="flex"
            py="xl"
            px="md"
            style={{ alignItems: "flex-start" }}
          >
            <Text size="4xl" pr="sm" c="gold" mt={6}>
              {size}
            </Text>
            <Box>
              <Text size="md">A party of {size} needs:</Text>
              <TagRulesetPreview.RulesList key={size} rules={[]} />
            </Box>
          </Paper>
        ))}
      </SimpleGrid>

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
