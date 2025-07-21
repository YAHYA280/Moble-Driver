import ConditionalComponent from "@/shared/components/conditionalComponent/conditionalComponent";
import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { useThemeColors } from "../../../../hooks/useTheme";
import { UserProfile } from "../../../../shared/types/profile";

interface ProfileHeaderProps {
  profile: UserProfile;
  onEditPress?: () => void;
  onPhotoPress?: () => void;
  isEditMode?: boolean;
  style?: ViewStyle;
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.primary,
      paddingTop: 60,
      paddingBottom: 80,
      paddingHorizontal: 20,
      position: "relative",
      overflow: "hidden",
    },
    backgroundPattern: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      opacity: 0.1,
    },
    headerContent: {
      alignItems: "center",
      zIndex: 1,
    },
    photoContainer: {
      position: "relative",
      marginBottom: 16,
    },
    photoWrapper: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: colors.backgroundSecondary,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 4,
      borderColor: "rgba(255, 255, 255, 0.3)",
      ...Platform.select({
        ios: {
          shadowColor: "rgba(0, 0, 0, 0.3)",
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 1,
          shadowRadius: 16,
        },
        android: {
          elevation: 8,
        },
      }),
    },
    profilePhoto: {
      width: 112,
      height: 112,
      borderRadius: 56,
    },
    photoPlaceholder: {
      width: 112,
      height: 112,
      borderRadius: 56,
      backgroundColor: colors.backgroundTertiary,
      alignItems: "center",
      justifyContent: "center",
    },
    editPhotoButton: {
      position: "absolute",
      bottom: 0,
      right: 0,
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.surface,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 2,
      borderColor: colors.primary,
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 4,
        },
        android: {
          elevation: 4,
        },
      }),
    },
    nameContainer: {
      alignItems: "center",
      marginBottom: 8,
    },
    fullName: {
      fontSize: 24,
      fontWeight: "700",
      color: "white",
      textAlign: "center",
      marginBottom: 4,
      letterSpacing: 0.5,
    },
    position: {
      fontSize: 16,
      color: "rgba(255, 255, 255, 0.9)",
      textAlign: "center",
      fontWeight: "500",
    },
    statusContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      marginTop: 12,
    },
    statusDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginRight: 8,
    },
    statusText: {
      fontSize: 14,
      color: "white",
      fontWeight: "600",
    },
    editButton: {
      position: "absolute",
      top: 20,
      right: 20,
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      alignItems: "center",
      justifyContent: "center",
    },
  });

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  profile,
  onEditPress,
  onPhotoPress,
  isEditMode = false,
  style,
}) => {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  const getStatusColor = () => {
    switch (profile.professionalInfo.status) {
      case "Actif":
        return colors.success;
      case "En congé":
        return colors.warning;
      case "Inactif":
        return colors.error;
      default:
        return colors.textSecondary;
    }
  };

  return (
    <View style={[styles.container, style]}>
      <ConditionalComponent isValid={!!onEditPress}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={onEditPress}
          activeOpacity={0.7}
        >
          <FontAwesome
            name={isEditMode ? "check" : "edit"}
            size={20}
            color="white"
          />
        </TouchableOpacity>
      </ConditionalComponent>

      <View style={styles.headerContent}>
        <View style={styles.photoContainer}>
          <TouchableOpacity
            style={styles.photoWrapper}
            onPress={onPhotoPress}
            activeOpacity={0.8}
            disabled={!onPhotoPress}
          >
            <ConditionalComponent
              isValid={!!profile.personalInfo.profilePhoto}
              defaultComponent={
                <View style={styles.photoPlaceholder}>
                  <FontAwesome
                    name="user"
                    size={48}
                    color={colors.textTertiary}
                  />
                </View>
              }
            >
              <Image
                source={{ uri: profile.personalInfo.profilePhoto }}
                style={styles.profilePhoto}
                resizeMode="cover"
              />
            </ConditionalComponent>
          </TouchableOpacity>

          <ConditionalComponent isValid={!!onPhotoPress}>
            <TouchableOpacity
              style={styles.editPhotoButton}
              onPress={onPhotoPress}
              activeOpacity={0.7}
            >
              <FontAwesome name="camera" size={16} color={colors.primary} />
            </TouchableOpacity>
          </ConditionalComponent>
        </View>

        <View style={styles.nameContainer}>
          <Text style={styles.fullName}>{profile.personalInfo.fullName}</Text>
          <Text style={styles.position}>
            {profile.professionalInfo.position}
          </Text>
        </View>

        <View style={styles.statusContainer}>
          <View
            style={[styles.statusDot, { backgroundColor: getStatusColor() }]}
          />
          <Text style={styles.statusText}>
            {profile.professionalInfo.status}
          </Text>
        </View>
      </View>
    </View>
  );
};
