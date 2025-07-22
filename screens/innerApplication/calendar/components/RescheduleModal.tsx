import React from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useThemeColors } from "../../../../hooks/useTheme";
import { Button } from "../../../../shared/components/ui/Button";

interface RescheduleModalProps {
  visible: boolean;
  reason: string;
  isLoading: boolean;
  onReasonChange: (reason: string) => void;
  onCancel: () => void;
  onConfirm: () => void;
}

const styles = StyleSheet.create({
  modal: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    borderRadius: 16,
    padding: 24,
    width: "100%",
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
    textAlign: "center",
  },
  modalText: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: "center",
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
    minHeight: 100,
    textAlignVertical: "top",
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
  },
});

export const RescheduleModal: React.FC<RescheduleModalProps> = ({
  visible,
  reason,
  isLoading,
  onReasonChange,
  onCancel,
  onConfirm,
}) => {
  const colors = useThemeColors();

  const dynamicStyles = {
    modalContent: {
      ...styles.modalContent,
      backgroundColor: colors.surface,
    },
    modalTitle: {
      ...styles.modalTitle,
      color: colors.text,
    },
    modalText: {
      ...styles.modalText,
      color: colors.textSecondary,
    },
    textInput: {
      ...styles.textInput,
      borderColor: colors.border,
      color: colors.text,
      backgroundColor: colors.input,
    },
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableWithoutFeedback onPress={onCancel}>
        <View style={styles.modal}>
          <TouchableWithoutFeedback>
            <View style={dynamicStyles.modalContent}>
              <Text style={dynamicStyles.modalTitle}>Demander un report</Text>
              <Text style={dynamicStyles.modalText}>
                Veuillez indiquer la raison de votre demande de report :
              </Text>
              <TextInput
                style={dynamicStyles.textInput}
                placeholder="Raison du report..."
                placeholderTextColor={colors.textTertiary}
                value={reason}
                onChangeText={onReasonChange}
                multiline
                numberOfLines={4}
              />
              <View style={styles.modalButtons}>
                <Button
                  title="Annuler"
                  variant="outline"
                  onPress={onCancel}
                  style={{ flex: 1 }}
                />
                <Button
                  title="Envoyer"
                  onPress={onConfirm}
                  style={{ flex: 1 }}
                  loading={isLoading}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
