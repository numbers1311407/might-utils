import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useStableCallback } from "@/core/hooks";
import { identity } from "@/utils";
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
    setDraftParty(prepareDraft(party || {}));
  });

  const [openModal, modalApi] = createModal(PartyForm, {
    onClose: () => setDraftParty(null),
    onDone: (record) => {
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
      completed: false,
      onSubmit: (record) => {
        partiesApi.add(record);

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
      },
    }),
  });

  useEffect(() => {
    if (draftParty) openModal();
  }, [draftParty, openModal]);

  return beginPartyEdit;
};
