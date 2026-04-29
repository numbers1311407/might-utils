import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { createModal, useRulesStoreApi as rulesApi } from "@/model/store";
import { createRuleset } from "../helpers";
import { useStableCallback } from "@/core/hooks";
import { RulesetCreateForm } from "../components/RulesetCreateForm.jsx";

export const useRulesetCreator = () => {
  const [draft, setDraft] = useState();
  const [_location, setLocation] = useLocation();

  const startCreate = useStableCallback(({ name, party }) => {
    const ruleset = {
      name: name || "New Ruleset",
      party,
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
      size: "xl",
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
