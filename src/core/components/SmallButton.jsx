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
import { Button } from "@mantine/core";

export const SmallButton = ({ Icon, ...props }) => (
  <Button
    leftSection={Icon && <Icon size={20} />}
    size="compact-sm"
    {...props}
  />
);

export const AddSmallButton = (props) => (
  <SmallButton Icon={IconPlus} {...props} />
);

export const AddSortButton = (props) => (
  <SmallButton Icon={IconSortAscendingNumbers} {...props} />
);

export const CopySmallButton = (props) => (
  <SmallButton Icon={IconCopy} {...props} />
);

export const EditSmallButton = (props) => (
  <SmallButton Icon={IconEdit} {...props} />
);

export const ReloadSmallButton = (props) => (
  <SmallButton Icon={IconReload} {...props} />
);

export const RemoveSmallButton = (props) => (
  <SmallButton variant="outline" Icon={IconTrash} {...props} />
);

export const RestoreSmallButton = (props) => (
  <SmallButton variant="outline" Icon={IconRestore} {...props} />
);

export const SaveSmallButton = (props) => (
  <SmallButton Icon={IconDeviceFloppy} {...props} />
);
