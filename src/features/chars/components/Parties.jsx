import { Button, Stack } from "@mantine/core";
import * as titles from "@/config/constants/titles";
import { IconPlus, IconArrowLeft } from "@tabler/icons-react";
import { useRoute } from "wouter";
import { AppLink, PageTitle } from "@/core/components";
import { usePartyEditor } from "./use-party-editor.js";
import { PartyIndex } from "./PartyIndex.jsx";
import { Party } from "./Party.jsx";

export const Parties = () => {
  const [_match, { id: partyId }] = useRoute("/parties/:id?");
  const editParty = usePartyEditor();

  return (
    <Stack gap={0}>
      <PageTitle
        section={titles.PARTY_CATEGORY}
        title={titles.PARTIES_TITLE}
        subtitle={
          "Assemble parties from your roster to track their might and target specific instance tiers"
        }
      >
        {partyId && (
          <Button
            component={AppLink}
            underline="never"
            leftSection={<IconArrowLeft />}
            size="compact-md"
            href="/parties"
          >
            Back to parties
          </Button>
        )}
        <Button
          leftSection={<IconPlus size={18} />}
          onClick={() => editParty({})}
          size="compact-md"
        >
          Create a New Party
        </Button>
      </PageTitle>
      {partyId ? <Party id={partyId} /> : <PartyIndex />}
    </Stack>
  );
};
