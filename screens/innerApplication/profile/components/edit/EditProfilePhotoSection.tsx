import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import {
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useThemeColors } from "../../../../../hooks/useTheme";
import ConditionalComponent from "../../../../../shared/components/conditionalComponent/conditionalComponent";

interface EditProfilePhotoSectionProps {
  profilePhoto?: string;
  isVerified: boolean;
  onPhotoPress: () => void;
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      alignItems: "center",
      paddingVertical: 24,
      paddingHorizontal: 20,
    },
    photoContainer: {
      position: "relative",
      marginBottom: 16,
    },
    profilePhoto: {
      width: 100,
      height: 100,
      borderRadius: 50,
    },
    photoPlaceholder: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: colors.primary + "20",
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 2,
      borderColor: colors.primary + "40",
    },
    editPhotoButton: {
      position: "absolute",
      bottom: 0,
      right: 0,
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.primary,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 3,
      borderColor: colors.backgroundSecondary,
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 4,
        },
        android: {
          elevation: 4,
        },
      }),
    },
    verifiedBadge: {
      position: "absolute",
      top: -5,
      right: -5,
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: colors.primary,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 2,
      borderColor: colors.backgroundSecondary,
    },
  });

export const EditProfilePhotoSection: React.FC<
  EditProfilePhotoSectionProps
> = ({ profilePhoto, isVerified, onPhotoPress }) => {
  const colors = useThemeColors();

  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <View style={styles.photoContainer}>
        <TouchableOpacity onPress={onPhotoPress} activeOpacity={0.8}>
          <ConditionalComponent
            isValid={!!profilePhoto}
            defaultComponent={
              <View style={styles.photoPlaceholder}>
                <FontAwesome name="user" size={40} color={colors.primary} />
              </View>
            }
          >
            <Image
              source={{ uri: profilePhoto }}
              style={styles.profilePhoto}
              resizeMode="cover"
            />
          </ConditionalComponent>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.editPhotoButton}
          onPress={onPhotoPress}
          activeOpacity={0.8}
        >
          <FontAwesome name="edit" size={14} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};
