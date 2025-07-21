import { FormField } from "@/shared/types/profile";
import React from "react";
import { StyleSheet, View } from "react-native";
import { useThemeColors } from "../../../../../hooks/useTheme";
import { Input } from "../../../../../shared/components/ui/Input";

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

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {},
    inputContainer: {
      marginBottom: 16,
    },
  });

export const EditProfileFormSection: React.FC<EditProfileFormSectionProps> = ({
  fields,
  onFieldChange,
}) => {
  const colors = useThemeColors();

  const styles = createStyles(colors);

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
