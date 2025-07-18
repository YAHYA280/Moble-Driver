// screens/innerApplication/profile/components/edit/EditProfileFormSection.tsx
import React from "react";
import { StyleSheet, View } from "react-native";
import { useThemeColors } from "../../../../../hooks/useTheme";
import { Input } from "../../../../../shared/components/ui/Input";

interface FormField {
  key:
    | "fullName"
    | "email"
    | "phoneNumber"
    | "driverId"
    | "dateOfBirth"
    | "address"
    | "status";
  label: string;
  value: string;
  placeholder: string;
  keyboardType?: "default" | "email-address" | "phone-pad" | "numeric";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  editable?: boolean;
  error?: string;
}

interface EditProfileFormSectionProps {
  fields: FormField[];
  onFieldChange: (
    field:
      | "fullName"
      | "email"
      | "phoneNumber"
      | "driverId"
      | "dateOfBirth"
      | "address"
      | "status",
    value: string
  ) => void;
}

export const EditProfileFormSection: React.FC<EditProfileFormSectionProps> = ({
  fields,
  onFieldChange,
}) => {
  const colors = useThemeColors();

  const styles = StyleSheet.create({
    container: {
      // No padding needed as it's now inside a card
    },
    inputContainer: {
      marginBottom: 16,
    },
  });

  return (
    <View style={styles.container}>
      {fields.map((field) => (
        <View key={field.key} style={styles.inputContainer}>
          <Input
            label={field.label}
            value={field.value}
            onChangeText={(value) => onFieldChange(field.key, value)}
            placeholder={field.placeholder}
            keyboardType={field.keyboardType}
            autoCapitalize={field.autoCapitalize}
            error={field.error}
            editable={field.editable}
          />
        </View>
      ))}
    </View>
  );
};
