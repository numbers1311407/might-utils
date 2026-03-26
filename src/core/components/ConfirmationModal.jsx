import { useMemo, useState } from "react";
import { Button, Flex, Modal } from "@mantine/core";

export const ConfirmationModal = ({
  onConfirm,
  onCancel,
  title = "Are you sure?",
  yes = "Confirm",
  no = "Cancel",
  body,
}) => {
  return (
    <Modal opened onClose={onCancel} title={title}>
      {body}
      <Flex gap="sm" align="flex-end">
        <Button onClick={onCancel}>{no}</Button>
        <Button onClick={onConfirm}>{yes}</Button>
      </Flex>
    </Modal>
  );
};

export const withConfirmation = (
  Component,
  callbacks = {},
  modalProps = {},
) => {
  return (props) => {
    const [state, setState] = useState(null);
    const overrides = useMemo(() => {
      const o = {};
      for (const key of Object.keys(callbacks)) {
        o[key] = (...args) => {
          setState({ key, args });
        };
      }
      return o;
    }, [setState]);

    return (
      <>
        <Component {...props} {...overrides} />
        {!!state && (
          <ConfirmationModal
            {...modalProps}
            onConfirm={() => {
              callbacks[state.key](true, ...state.args);
            }}
            onCancel={() => {
              callbacks[state.key](false);
            }}
          />
        )}
      </>
    );
  };
};
