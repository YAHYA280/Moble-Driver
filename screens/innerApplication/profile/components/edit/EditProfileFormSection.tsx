import { EditProfileFormSectionProps } from "@/shared/types";
import React from "react";
import { StyleSheet, View } from "react-native";
import { useThemeColors } from "../../../../../hooks/useTheme";
import { Input } from "../../../../../shared/components/ui/Input";

export const EditProfileFormSection: React.FC<EditProfileFormSectionProps> = ({
  fields,
  onFieldChange,
}) => {
  const colors = useThemeColors();

  const styles = StyleSheet.create({
    container: {},
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
