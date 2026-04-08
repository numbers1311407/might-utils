import { Button, Flex, Modal, Stack, Text } from "@mantine/core";
import { useModalStore } from "@/core/store";

export const ModalStore = () => {
  const { Component, modalProps, componentProps, isOpen } = useModalStore();

  if (!isOpen) {
    return null;
  }

  return (
    <Modal {...modalProps} opened>
      <Component {...componentProps} />
    </Modal>
  );
};
