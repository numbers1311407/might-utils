import { useMemo } from "react";
import { Box, Stack, List, Text, Title } from "@mantine/core";
import { FindPartiesError, getQueryDescription } from "@/core/party-finder";

const UnexpectedHandler = () => {
  return (
    <Text>
      An unexpected error occurred. Please be sure you've selected all options
      and corrected any form input errors if they exist and try to refresh the
      page.
    </Text>
  );
};

const SimpleHandler = ({ error }) => {
  return <Text>{error.message}</Text>;
};

const humanizeList = (list) => {
  if (list.length === 1) {
    return list[0];
  }
  if (list.length === 2) {
    return `${list[0]} and ${list[1]}`;
  }
  const last = list.length - 1;
  return `${list.slice(0, last).join(", ")} and ${list[last]}`;
};

const humanizeRange = (range) => {
  if (!Array.isArray(range)) {
    return "all";
  }
  if (range.length === 1) {
    return `at least ${range[0]}`;
  }
  if (!range[0]) {
    return `at most ${range[1]}`;
  }
  if (range[0] === range[1]) {
    return `exactly ${range[0]}`;
  }
  return `${range[0]}-${range[1]}`;
};

const REPORT_HANDLERS = {
  EXCLUSION_IMPOSSIBLE: [
    "Not enough free slots to fulfill max count rules at some sizes",
    <Text span>
      Your rules include upper bounds limiting the number of members that can
      pass, but benching enough characters would mean your party couldn't meet
      the minimum size.
    </Text>,
    (report) => {
      const { mustExclude, passing } = report.details;
      const ruleDesc = getQueryDescription(report.rule.query);
      return (
        <Text span>
          Rule{" "}
          <Text span c="primary.5">
            {ruleDesc}
          </Text>{" "}
          requires {humanizeRange(report.rule.value)} passing member(s) but your
          eligible roster has {passing}. If you bench {mustExclude} more you
          couldn't make {report.size} members.
        </Text>
      );
    },
  ],
  INSUFFICIENT_CANDIDATES: [
    "Too few passing characters to fulfill min count rules at some sizes",
    "",
    (report) => {
      const ruleDesc = getQueryDescription(report.rule.query);
      const { passing } = report.details;

      return (
        <Text span>
          Rule{" "}
          <Text span c="primary.5">
            {ruleDesc}
          </Text>{" "}
          requires {humanizeRange(report.rule.value)} passing member(s) but your
          eligible roster has {passing}.
        </Text>
      );
    },
  ],
  INSUFFICIENT_ROSTER: [
    "Your roster can't fulfill all sizes in range",
    (_error, reports) => {
      const min = reports[0].size;
      const plus = reports.length > 1 ? "+" : "";
      const { rosterSize } = reports[0].details;
      return (
        <Text span>
          Your eligible roster and max group size was resolved to{" "}
          <Text span c="primary">
            {rosterSize}
          </Text>{" "}
          but your settings are looking for groups of{" "}
          <Text span c="primary">
            {min}
            {plus}
          </Text>{" "}
          members. Groups larger than{" "}
          <Text span c="primary">
            {rosterSize}
          </Text>{" "}
          have been automatically disqualified.
        </Text>
      );
    },
  ],
  SHARED_RESOURCE_CONFLICT: [
    "Rules are canceling eachother out at some sizes",
    "Some rules when applied together are making it impossible to assemble enough members at certain sizes.",
    (report) => {
      const { rules } = report;
      const { mins, intersection, maxAvailable, combinedMinRequired } =
        report.details;

      return (
        <Text span>
          <Text span c="primary">
            {getQueryDescription(rules[0].query)}
          </Text>{" "}
          requires{" "}
          <Text span c="primary">
            {mins[0]}
          </Text>{" "}
          to pass and{" "}
          <Text span c="primary">
            {getQueryDescription(rules[1].query)}
          </Text>{" "}
          requires{" "}
          <Text span c="primary">
            {mins[1]}
          </Text>
          . A total of{" "}
          <Text span c="primary">
            {intersection}
          </Text>{" "}
          pass both, meaning{" "}
          <Text span c="primary">
            {combinedMinRequired}
          </Text>{" "}
          need to pass one or the other in total, but only{" "}
          <Text span c="primary">
            {maxAvailable}
          </Text>{" "}
          exist or can fit in the party.
        </Text>
      );
    },
  ],
  SIZE_RULES_GAP: [
    "Missing rules at some party sizes",
    (_error, reports) => {
      const sizes = reports.map((r) => r.size);
      return (
        <Text span>
          You're have no rules defined for partes of size(s):{" "}
          <Text span c="primary">
            {humanizeList(sizes)}
          </Text>
          . If anything, this will result in more parties being found, but those
          parties would be assembled on might score alone.
        </Text>
      );
    },
  ],
  DEFAULT: [
    "Generic Error",
    (error) => error.message,
    (report) => {
      const { rule, rules: _rules } = report;
      const rules = _rules ?? (rule ? [rule] : []);

      return rules.map((rule) => (
        <Text span key={rule.id}>
          Rule{" "}
          <Text span c="primary.5">
            {getQueryDescription(rule.query)}
          </Text>{" "}
          could not be satisified.
        </Text>
      ));
    },
  ],
};

const ReportsList = ({ reports, message, name, renderItem }) => {
  return (
    <Stack gap="xs">
      <Text c="primary">{name || "General error"}</Text>
      {message && <Box>{message}</Box>}
      {renderItem && (
        <List>
          {reports.map((report, i) => (
            <List.Item key={i}>
              <Text span fw="bold" c="primary">
                Size {report.size}:
              </Text>{" "}
              {renderItem(report)}
            </List.Item>
          ))}
        </List>
      )}
    </Stack>
  );
};

const ReportsErrorHandler = ({ error, includeWarnings = false }) => {
  const reports = error.meta;
  const groupedReports = useMemo(
    () =>
      Array.from(
        reports
          .filter((r) => includeWarnings || r.level === "ERROR")
          .reduce((map, report) => {
            if (!map.has(report.type)) map.set(report.type, []);
            map.get(report.type).push(report);
            return map;
          }, new Map()),
      ),
    [includeWarnings, reports],
  );
  return groupedReports.map(([code, reports]) => {
    const [name, message, renderItem] =
      REPORT_HANDLERS[code] || REPORT_HANDLERS.DEFAULT;
    return (
      <ReportsList
        key={code}
        reports={reports}
        name={typeof name === "function" ? name(error, reports) : name}
        message={
          typeof message === "function" ? message(error, reports) : message
        }
        renderItem={renderItem}
      />
    );
  });
};

const PoolSizeHandler = ({ error }) => {
  const { eligible, available } = error.meta;

  return (
    <Stack gap="sm">
      <Text>
        The search configuration applied to roster didn't result in enough
        eligible characters to satisfy the requirements. There were{" "}
        <Text span c="primary">
          {eligible}
        </Text>{" "}
        eligible characters found, but the min party size is{" "}
        <Text span c="primary">
          {available}
        </Text>
        .
      </Text>
      <Text>Things to check:</Text>
      <List>
        <List.Item>
          Make sure your{" "}
          <Text span c="primary">
            Min Char Level
          </Text>
          ,{" "}
          <Text span c="primary">
            Max Char Level
          </Text>
          , and{" "}
          <Text span c="primary">
            Party Size Range
          </Text>{" "}
          are correct.
        </List.Item>
        <List.Item>
          Make sure all your characters you want to consider are{" "}
          <Text span c="primary">
            active
          </Text>
          .
        </List.Item>
      </List>
    </Stack>
  );
};

const HANDLERS = {
  MARGIN_TOO_SMALL: SimpleHandler,
  MAX_RECURSIONS: SimpleHandler,
  POOL_SIZE: PoolSizeHandler,
  RESULTS_IMPOSSIBLE: ReportsErrorHandler,
  RESULTS_PREVENTED: ReportsErrorHandler,
};

export const PartyFinderError = ({ error }) => {
  const Handler =
    error instanceof FindPartiesError
      ? HANDLERS[error.code] || SimpleHandler
      : UnexpectedHandler;

  return (
    <Stack>
      <Title order={3} c="warning.7">
        No Results Found
      </Title>
      <Text c="warning.2">
        Either your rules are too restrictive/impossible, there's an error in
        the search process, or both. If your search is impossible maybe the
        specific issues can help.
      </Text>
      <Title order={4} c="warning.7">
        Issue(s) encountered:
      </Title>
      <Handler error={error} />
    </Stack>
  );
};
