import { add_operation, apply as jsonLogicApply } from "json-logic-js";
import { formatQuery } from "react-querybuilder";
import { jsonLogicAdditionalOperators } from "react-querybuilder";

for (const [op, func] of Object.entries(jsonLogicAdditionalOperators)) {
  add_operation(op, func);
}

export const applyRule = (rule, char) => {
  const query = formatQuery(rule.query, "jsonlogic");
  return jsonLogicApply(query, char);
};
