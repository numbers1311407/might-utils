import {
  useConfirmationStore,
  useConfirmationStoreApi as api,
} from "@/core/store";
import { ConfirmationModal } from "@/core/components";

export const GlobalConfirmationModal = () => {
  const { props, isOpen } = useConfirmationStore();

  if (!isOpen) {
    return null;
  }

  return (
    <ConfirmationModal
      {...props}
      opened
      onConfirm={api.onConfirm}
      onCancel={api.onCancel}
    />
  );
};
