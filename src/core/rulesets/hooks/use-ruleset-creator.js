import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { createModal, useRulesStoreApi as rulesApi } from "@/model/store";
import { useStableCallback } from "@/core/hooks";
import { RulesetCreateForm } from "../components/RulesetCreateForm.jsx";

export const useRulesetCreator = (options = {}) => {
  const [draft, setDraft] = useState();
  const [_location, setLocation] = useLocation();

  const { confirmNav = true, defaultName = "New Ruleset" } = options;

  const startCreate = useStableCallback(({ name, party }) => {
    const ruleset = {
      name: name || defaultName,
      // allow a virtual party to be passed or an array of chars alone
      party: party.chars || (Array.isArray(party) ? party : []),
    };

    ruleset.name = rulesApi.getCopyName(ruleset.name);

    setDraft(ruleset);
  });

  const [openModal, modalApi] = createModal(RulesetCreateForm, {
    onClose: () => setDraft(null),
    onDone: (record, where) => {
      if (where === "search") {
        rulesApi.activate(record.id, { exclusive: true });
        setLocation("/party-generator");
      } else {
        setLocation(`/rulesets/${record.id}`);
      }
    },
    modalProps: {
      size: "80vw",
      title: "Create a New Ruleset",
      closeOnClickOutside: false,
    },
    componentProps: (props) => ({
      ...props,
      record: draft,
      onSubmit: (formValues) => {
        rulesApi.addSet(formValues, (record) => {
          if (confirmNav) {
            modalApi.updateComponentProps({
              navigate: (where) => props.done(record, where),
            });
            modalApi.updateModalProps({
              title: "Success!",
            });
          } else {
            props.done(record);
          }
        });
      },
    }),
  });

  useEffect(() => {
    if (draft && !modalApi.isOpen) openModal();
  }, [draft, modalApi.isOpen, openModal]);

  return startCreate;
};
