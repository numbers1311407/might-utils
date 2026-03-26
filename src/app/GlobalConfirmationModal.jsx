import { useConfirmationStore } from "@/core/store";
import { ConfirmationModal } from "@/core/components";

export const GlobalConfirmationModal = () => {
  const { onConfirm, onCancel, props, isOpen } = useConfirmationStore();

  if (!isOpen) {
    return null;
  }

  return (
    <ConfirmationModal
      {...props}
      opened
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  );
};
