import { Button, Flex, Modal, Stack, Text } from "@mantine/core";
import { useModalStore } from "@/model/store";

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
