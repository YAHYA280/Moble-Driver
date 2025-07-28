// screens/innerApplication/planning/components/tripDetails/ContactSection.tsx
import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "../../../../../contexts/ThemeContext";

interface ContactSectionProps {
  onContactPress: (phoneNumber: string) => void;
}

const styles = StyleSheet.create({
  contactSection: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  contactHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  contactNumbers: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  contactButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8f9ff",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e8eaff",
  },
  contactIcon: {
    marginRight: 8,
  },
  contactText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#746cd4",
  },
});

export const ContactSection: React.FC<ContactSectionProps> = ({
  onContactPress,
}) => {
  const { colors } = useTheme();

  const dynamicStyles = {
    contactSection: {
      ...styles.contactSection,
      backgroundColor: colors.card,
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: colors.isDark ? 0.3 : 0.08,
          shadowRadius: 8,
        },
        android: { elevation: 3 },
      }),
    },
    contactTitle: {
      ...styles.contactTitle,
      color: colors.text,
    },
    contactButton: {
      ...styles.contactButton,
      backgroundColor: colors.primary + "15",
      borderColor: colors.primary + "30",
    },
  };

  return (
    <View style={dynamicStyles.contactSection}>
      <View style={styles.contactHeader}>
        <FontAwesome name="phone" size={18} color={colors.textSecondary} />
        <Text style={dynamicStyles.contactTitle}>Contact usager</Text>
      </View>

      <View style={styles.contactNumbers}>
        <TouchableOpacity
          style={dynamicStyles.contactButton}
          onPress={() => onContactPress("+145324421224")}
          activeOpacity={0.7}
        >
          <FontAwesome
            name="phone"
            size={16}
            color="#746cd4"
            style={styles.contactIcon}
          />
          <Text style={styles.contactText}>+145324421224</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={dynamicStyles.contactButton}
          onPress={() => onContactPress("+145324421224")}
          activeOpacity={0.7}
        >
          <FontAwesome
            name="phone"
            size={16}
            color="#746cd4"
            style={styles.contactIcon}
          />
          <Text style={styles.contactText}>+145324421224</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
