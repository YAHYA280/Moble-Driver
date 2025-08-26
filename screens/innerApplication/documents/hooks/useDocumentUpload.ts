import { DocumentType, MAX_FILE_SIZE } from "@/shared/types/document";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";

interface SelectedFile {
  uri: string;
  name: string;
  type: string;
  size: number;
}

interface UseDocumentUploadReturn {
  selectFromCamera: () => Promise<SelectedFile | null>;
  selectFromGallery: () => Promise<SelectedFile | null>;
  selectFromFiles: () => Promise<SelectedFile | null>;
  showFileSelectOptions: () => void;
  autoDetectDocumentType: (fileName: string) => DocumentType;
  validateFile: (file: SelectedFile) => string | null;
  createFileObject: (selectedFile: SelectedFile) => File;
}

export const useDocumentUpload = (): UseDocumentUploadReturn => {
  const selectFromCamera = async (): Promise<SelectedFile | null> => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Erreur", "Permission d'accès à la caméra requise");
        return null;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        return {
          uri: asset.uri,
          name: `photo_${Date.now()}.jpg`,
          type: "image/jpeg",
          size: asset.fileSize || 0,
        };
      }
      return null;
    } catch (error) {
      Alert.alert("Erreur", "Erreur lors de la prise de photo");
      return null;
    }
  };

  const selectFromGallery = async (): Promise<SelectedFile | null> => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Erreur", "Permission d'accès à la galerie requise");
        return null;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        return {
          uri: asset.uri,
          name: asset.fileName || `image_${Date.now()}.jpg`,
          type: asset.type || "image/jpeg",
          size: asset.fileSize || 0,
        };
      }
      return null;
    } catch (error) {
      Alert.alert("Erreur", "Erreur lors de la sélection d'image");
      return null;
    }
  };

  const selectFromFiles = async (): Promise<SelectedFile | null> => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        const file = result.assets[0];
        return {
          uri: file.uri,
          name: file.name,
          type: file.mimeType || "application/octet-stream",
          size: file.size || 0,
        };
      }
      return null;
    } catch (error) {
      Alert.alert("Erreur", "Erreur lors de la sélection de fichier");
      return null;
    }
  };

  const showFileSelectOptions = () => {
    Alert.alert(
      "Sélectionner un fichier",
      "Choisissez la source de votre document",
      [
        { text: "Caméra", onPress: () => selectFromCamera() },
        { text: "Galerie", onPress: () => selectFromGallery() },
        { text: "Fichiers", onPress: () => selectFromFiles() },
        { text: "Annuler", style: "cancel" },
      ]
    );
  };

  const autoDetectDocumentType = (fileName: string): DocumentType => {
    const extension = fileName.split(".").pop()?.toLowerCase();

    switch (extension) {
      case "pdf":
        return "PDF";
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
      case "webp":
        return "Image";
      case "doc":
      case "docx":
        return "Contrat";
      default:
        return "Autre";
    }
  };

  const validateFile = (file: SelectedFile): string | null => {
    if (!file.name.trim()) {
      return "Le nom du fichier est requis";
    }

    if (file.size > MAX_FILE_SIZE) {
      return `Le fichier est trop volumineux (max ${Math.round(
        MAX_FILE_SIZE / (1024 * 1024)
      )}MB)`;
    }

    if (file.size === 0) {
      return "Le fichier semble être corrompu";
    }

    return null;
  };

  const createFileObject = (selectedFile: SelectedFile): File => {
    // Note: This is a simplified implementation
    // In a real app, you'd need to handle file conversion properly
    return new File([selectedFile.uri], selectedFile.name, {
      type: selectedFile.type || "application/octet-stream",
    });
  };

  return {
    selectFromCamera,
    selectFromGallery,
    selectFromFiles,
    showFileSelectOptions,
    autoDetectDocumentType,
    validateFile,
    createFileObject,
  };
};
