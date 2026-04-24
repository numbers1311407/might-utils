import {
  IconCopy,
  IconRestore,
  IconSortAscendingNumbers,
  IconPlus,
  IconDeviceFloppy,
  IconEdit,
  IconTrash,
  IconReload,
} from "@tabler/icons-react";
import { ActionIcon, Tooltip } from "@mantine/core";

const ICONS = {
  copy: IconCopy,
  restore: IconRestore,
  sort: IconSortAscendingNumbers,
  plus: IconPlus,
  save: IconDeviceFloppy,
  edit: IconEdit,
  trash: IconTrash,
  reload: IconReload,
};

export const SmallButton = ({ icon, children, ...buttonProps }) => {
  const Icon = ICONS[icon];

  return (
    <Tooltip label={children} withArrow>
      <ActionIcon {...buttonProps}>
        <Icon size={20} />
      </ActionIcon>
    </Tooltip>
  );
};

export const AddSmallButton = (props) => <SmallButton icon="plus" {...props} />;

export const AddSortButton = (props) => <SmallButton icon="sort" {...props} />;

export const CopySmallButton = (props) => (
  <SmallButton icon="copy" {...props} />
);

export const EditSmallButton = (props) => (
  <SmallButton icon="edit" {...props} />
);

export const ReloadSmallButton = (props) => (
  <SmallButton icon="reload" {...props} />
);

export const RemoveSmallButton = (props) => (
  <SmallButton variant="outline" icon="trash" {...props} />
);

export const RestoreSmallButton = (props) => (
  <SmallButton variant="outline" icon="restore" {...props} />
);

export const SaveSmallButton = (props) => (
  <SmallButton icon="save" {...props} />
);
