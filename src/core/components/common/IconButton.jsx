import { ActionIcon } from "@mantine/core";
import {
  IconPlus,
  IconMinus,
  IconEdit,
  IconTag,
  IconRestore,
  IconX,
  IconTrash,
} from "@tabler/icons-react";

/* eslint-disable no-unused-vars */
export const IconButton = ({ Icon, ...props }) => (
  <ActionIcon size="sm" {...props}>
    <Icon />
  </ActionIcon>
);

export const EditButton = (props) => <IconButton Icon={IconEdit} {...props} />;

export const MinusButton = (props) => (
  <IconButton Icon={IconMinus} {...props} />
);

export const PlusButton = (props) => <IconButton Icon={IconPlus} {...props} />;

export const TagButton = (props) => <IconButton Icon={IconTag} {...props} />;

export const TrashButton = (props) => (
  <IconButton Icon={IconTrash} {...props} />
);

export const XButton = (props) => <IconButton Icon={IconX} {...props} />;
export const RestoreButton = (props) => (
  <IconButton Icon={IconRestore} {...props} />
);
