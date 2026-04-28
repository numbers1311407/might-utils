import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { createModal, useRulesStoreApi as rulesApi } from "@/model/store";
import { createRuleset } from "../helpers";
import { useStableCallback } from "@/core/hooks";
import { RulesetCreateForm } from "../components/RulesetCreateForm.jsx";

export const useRulesetCreator = () => {
  const [draft, setDraft] = useState();
  const [_location, setLocation] = useLocation();

  const startCreate = useStableCallback((newRuleset) => {
    const { name, party, comp, ...rest } = newRuleset;

    const ruleset = {
      name: name || (party ? "Party Ruleset" : "Comp Ruleset"),
      ...rest,
      ...createRuleset({ name, party, comp }),
    };

    ruleset.name = rulesApi.getCopyName(ruleset.name);

    setDraft(ruleset);
  });

  const [openModal, modalApi] = createModal(RulesetCreateForm, {
    onClose: () => setDraft(null),
    onDone: (record) => {
      if (record) {
        setLocation(`/rulesets/${record.id}`);
      }
    },
    modalProps: {
      title: "New Ruleset",
    },
    componentProps: (props) => ({
      ...props,
      record: draft,
      onSubmit: (values) => {
        console.log({ values });

        console.log("submitted");
      },
    }),
  });

  useEffect(() => {
    if (draft && !modalApi.isOpen) openModal();
  }, [draft, modalApi.isOpen, openModal]);

  return startCreate;
};
