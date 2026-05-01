import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useStableCallback } from "@/core/hooks";
import { identity } from "@/utils";
import { createPartyComp } from "@/model/schemas/comp";
import { createModal, usePartiesStoreApi as partiesApi } from "@/model/store";
import { PartyForm } from "../components/PartyForm.jsx";

const defaultTitleFn = (party) =>
  party?.id ? "Edit Party" : "Create a New Party";

export const usePartyEditor = (options = {}) => {
  const {
    confirmNav = false,
    prepareDraft = identity,
    title = defaultTitleFn,
  } = options;

  const [draftParty, setDraftParty] = useState(null);
  const [_location, setLocation] = useLocation();

  const beginPartyEdit = useStableCallback((party) => {
    // pull off chars to generate a comp with if this is a
    // "virtual" party.
    const { chars, ...draft } = prepareDraft(party || {});

    if (!draft.id && draft.name) {
      draft.name = partiesApi.getCopyName(draft.name);
    }

    if (chars) {
      draft.comp = createPartyComp(chars);
    }

    setDraftParty(draft);
  });

  const [openModal, modalApi] = createModal(PartyForm, {
    onClose: () => setDraftParty(null),
    onDone: (record) => {
      setDraftParty(null);

      if (record && draftParty.id !== record.id) {
        setLocation(`/parties/${record.id}`);
      }
    },
    modalProps: {
      title: typeof title === "function" ? title(draftParty) : title,
    },
    componentProps: (props) => ({
      ...props,
      record: draftParty,
      onSubmit: (values) => {
        partiesApi.add(values, (record) => {
          if (confirmNav) {
            modalApi.updateComponentProps({
              navigate: () => props.done(record),
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
    if (draftParty) openModal();
  }, [draftParty, openModal]);

  return beginPartyEdit;
};
