import { formatQuery } from "react-querybuilder";
import { capitalize } from "@/utils";

export const getQueryDescription = (query) => {
  const value = formatQuery(query, {
    format: "natural_language",
    translations: {
      groupSuffix: "",
      groupSuffix_not: "",
    },
    fields: [{ value: "warden", label: "warden rank" }],
    parseNumbers: true,
    valueProcessor: (rule) => {
      if (rule.field === "class") {
        return rule.value.toUpperCase();
      }
      if (rule.field === "tags") {
        return `"${rule.value}"`;
      }
      // if (rule.field === "warden" && rule.value == 0) {
      //   return "unwardened";
      // }
      return rule.value;
    },
    operatorMap: {
      ">=": "is at least",
      "<=": "is at most",
    },
  });

  return value === "1 is 1"
    ? "No rules are applied, check your query."
    : capitalize(value);
};
