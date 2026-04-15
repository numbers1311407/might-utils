import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useStableCallback } from "@/core/hooks";
import { createModal, usePartiesStoreApi as partiesApi } from "@/model/store";
import { PartyForm } from "./PartyForm.jsx";

export const usePartyEditor = () => {
  const [draftParty, setDraftParty] = useState(null);
  const [_location, setLocation] = useLocation();

  const beginPartyEdit = useStableCallback((party) => {
    setDraftParty(party || {});
  });

  const openModal = createModal(PartyForm, {
    onClose: () => setDraftParty(null),
    modalProps: {
      title: draftParty?.id ? "Edit Party" : "Creat a Party",
    },
    componentProps: (props) => ({
      record: draftParty,
      onSubmit: (record) => {
        partiesApi.add(record);
        setDraftParty(null);
        props.done();

        if (draftParty.id !== record.id) {
          setLocation(`/parties/${record.id}`);
        }
      },
    }),
  });

  useEffect(() => {
    if (draftParty) openModal();
  }, [draftParty, openModal]);

  return beginPartyEdit;
};
