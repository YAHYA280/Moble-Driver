// screens/innerApplication/fuelCards/components/PhotoPicker.tsx
import { FontAwesome } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useThemeColors } from "../../../../hooks/useTheme";
import ConditionalComponent from "../../../../shared/components/conditionalComponent/conditionalComponent";

interface PhotoPickerProps {
  photoUri?: string;
  onPhotoChange: (uri?: string) => void;
  disabled?: boolean;
}

export const PhotoPicker: React.FC<PhotoPickerProps> = ({
  photoUri,
  onPhotoChange,
  disabled = false,
}) => {
  const colors = useThemeColors();

  const handleTakePhoto = async () => {
    if (disabled) return;

    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission requise",
          "Nous avons besoin d'accéder à votre appareil photo."
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        onPhotoChange(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Erreur", "Impossible d'accéder à l'appareil photo");
    }
  };

  const handlePickImage = async () => {
    if (disabled) return;

    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission requise",
          "Nous avons besoin d'accéder à votre galerie."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        onPhotoChange(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Erreur", "Impossible d'accéder à la galerie");
    }
  };

  const handleRemovePhoto = () => {
    if (disabled) return;
    onPhotoChange(undefined);
  };

  const styles = StyleSheet.create({
    container: {
      marginBottom: 24,
    },
    title: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 12,
    },
    photoButtons: {
      flexDirection: "row",
      gap: 12,
      marginBottom: 16,
    },
    photoButton: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
      backgroundColor: colors.primary + "15",
      borderWidth: 2,
      borderColor: colors.primary + "30",
      borderStyle: "dashed",
      opacity: disabled ? 0.5 : 1,
    },
    photoButtonIcon: {
      marginRight: 8,
    },
    photoButtonText: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.primary,
    },
    photoPreview: {
      position: "relative",
      borderRadius: 12,
      overflow: "hidden",
    },
    photoImage: {
      width: "100%",
      height: 200,
      borderRadius: 12,
    },
    removePhotoButton: {
      position: "absolute",
      top: 8,
      right: 8,
      backgroundColor: colors.error,
      borderRadius: 16,
      width: 32,
      height: 32,
      alignItems: "center",
      justifyContent: "center",
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Photo du reçu</Text>

      <ConditionalComponent
        isValid={!photoUri}
        defaultComponent={
          <View style={styles.photoPreview}>
            <Image source={{ uri: photoUri }} style={styles.photoImage} />
            <ConditionalComponent isValid={!disabled}>
              <TouchableOpacity
                style={styles.removePhotoButton}
                onPress={handleRemovePhoto}
              >
                <FontAwesome name="times" size={16} color="white" />
              </TouchableOpacity>
            </ConditionalComponent>
          </View>
        }
      >
        <ConditionalComponent isValid={!disabled}>
          <View style={styles.photoButtons}>
            <TouchableOpacity
              style={styles.photoButton}
              onPress={handleTakePhoto}
              activeOpacity={0.7}
            >
              <FontAwesome
                name="camera"
                size={16}
                color={colors.primary}
                style={styles.photoButtonIcon}
              />
              <Text style={styles.photoButtonText}>Prendre photo</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.photoButton}
              onPress={handlePickImage}
              activeOpacity={0.7}
            >
              <FontAwesome
                name="image"
                size={16}
                color={colors.primary}
                style={styles.photoButtonIcon}
              />
              <Text style={styles.photoButtonText}>Galerie</Text>
            </TouchableOpacity>
          </View>
        </ConditionalComponent>
      </ConditionalComponent>
    </View>
  );
};
