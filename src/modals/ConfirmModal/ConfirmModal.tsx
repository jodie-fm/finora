import React, { ComponentProps } from "react";
import Modal from "../../components/Modal/Modal";
import Label from "../../components/Label/Label";
import RowView from "../../components/RowView/RowView";
import Button from "../../components/Button/Button";
import { View } from "react-native";

type ConfirmModalProps = {
  heading: string;
  subtext?: string;
  buttons: ComponentProps<typeof Button>[];
  isVisible: boolean;
  setIsVisible: React.Dispatch<
    React.SetStateAction<ConfirmModalProps["isVisible"]>
  >;
};

const ConfirmModal = ({
  heading,
  subtext,
  buttons,
  isVisible,
  setIsVisible,
}: ConfirmModalProps) => {
  const onRequestClose = () => {
    setIsVisible(false);
  };

  return (
    <Modal visible={isVisible} onRequestClose={onRequestClose}>
      <View>
        <Label align="center">{heading}</Label>
        {subtext && (
          <Label align="center" size="s" color="textSecondary">
            {subtext}
          </Label>
        )}
      </View>
      <RowView>
        {buttons.map((button, i) => (
          <Button key={i} {...button} padding="s" isFullWidth />
        ))}
      </RowView>
    </Modal>
  );
};

export default ConfirmModal;
