import { Button, Flex, Modal, Stack, Text } from "@mantine/core";

export const ConfirmationModal = ({
  onConfirm,
  onCancel,
  opened = false,
  title = "Are you sure?",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  message,
}) => (
  <Modal opened={opened} onClose={onCancel} title={title}>
    <Stack>
      {typeof message === "string" ? <Text>{message}</Text> : message}
      <Flex gap="sm" justify="flex-end">
        <Button variant="outline" onClick={onCancel}>
          {cancelLabel}
        </Button>
        <Button onClick={onConfirm}>{confirmLabel}</Button>
      </Flex>
    </Stack>
  </Modal>
);
