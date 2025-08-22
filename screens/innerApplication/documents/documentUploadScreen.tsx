// screens/innerApplication/documents/documentUploadScreen.tsx - Improved

import ConditionalComponent from "@/shared/components/conditionalComponent/conditionalComponent";
import { FontAwesome } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Alert,
  Animated,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../../contexts/ThemeContext";
import { Header } from "../../../shared/components/ui/Header";
import { Input } from "../../../shared/components/ui/Input";
import {
  DOCUMENT_TYPES,
  DocumentType,
  MAX_FILE_SIZE,
} from "../../../shared/types/document";
import { useDocumentStore } from "../../../store/documentStore";

export const DocumentUploadScreen: React.FC = () => {
  const { colors } = useTheme();
  const [selectedFile, setSelectedFile] = useState<any | null>(null);
  const [documentName, setDocumentName] = useState("");
  const [documentType, setDocumentType] = useState<DocumentType>("Autre");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const headerAnim = useRef(new Animated.Value(0)).current;

  const { uploadDocument, isUploading, uploadProgress, error, clearError } =
    useDocumentStore();

  React.useEffect(() => {
    Animated.timing(headerAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleFileSelect = () => {
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

  const selectFromCamera = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Erreur", "Permission d'accès à la caméra requise");
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        setSelectedFile({
          uri: asset.uri,
          name: `photo_${Date.now()}.jpg`,
          type: "image/jpeg",
          size: asset.fileSize || 0,
        });
        setDocumentName(`Photo ${new Date().toLocaleDateString()}`);
        setDocumentType("Image");
      }
    } catch (error) {
      Alert.alert("Erreur", "Erreur lors de la prise de photo");
    }
  };

  const selectFromGallery = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Erreur", "Permission d'accès à la galerie requise");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        setSelectedFile({
          uri: asset.uri,
          name: asset.fileName || `image_${Date.now()}.jpg`,
          type: asset.type || "image/jpeg",
          size: asset.fileSize || 0,
        });
        setDocumentName(
          asset.fileName?.replace(/\.[^/.]+$/, "") ||
            `Image ${new Date().toLocaleDateString()}`
        );
        setDocumentType("Image");
      }
    } catch (error) {
      Alert.alert("Erreur", "Erreur lors de la sélection d'image");
    }
  };

  const selectFromFiles = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        const file = result.assets[0];
        setSelectedFile(file);
        setDocumentName(file.name.replace(/\.[^/.]+$/, ""));

        // Auto-detect document type based on file extension
        const extension = file.name.split(".").pop()?.toLowerCase();
        if (extension === "pdf") setDocumentType("PDF");
        else if (["jpg", "jpeg", "png", "gif"].includes(extension || ""))
          setDocumentType("Image");
        else setDocumentType("Autre");
      }
    } catch (error) {
      Alert.alert("Erreur", "Erreur lors de la sélection de fichier");
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      Alert.alert("Erreur", "Veuillez sélectionner un fichier");
      return;
    }

    if (!documentName.trim()) {
      Alert.alert("Erreur", "Veuillez saisir un nom pour le document");
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      Alert.alert("Erreur", "Le fichier est trop volumineux (max 50MB)");
      return;
    }

    try {
      // Create a File object for the upload function
      const file = new File([selectedFile.uri], selectedFile.name, {
        type: selectedFile.type || "application/octet-stream",
      });

      await uploadDocument(file, undefined, {
        name: documentName.trim(),
        type: documentType,
        description: description.trim() || undefined,
        tags,
      });

      Alert.alert("Succès", "Le document a été uploadé avec succès", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error) {
      Alert.alert("Erreur", "Erreur lors de l'upload du document");
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.backgroundSecondary,
    },
    content: {
      flex: 1,
    },
    scrollContent: {
      padding: 16,
      paddingBottom: 120, // Extra space for upload button
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 12,
    },
    fileSelectButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      padding: 20,
      borderRadius: 12,
      borderWidth: 2,
      borderStyle: "dashed",
      borderColor: colors.primary,
      backgroundColor: colors.primary + "10",
    },
    fileSelectIcon: {
      marginRight: 12,
    },
    fileSelectText: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.primary,
    },
    selectedFileCard: {
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
      borderRadius: 12,
      backgroundColor: colors.card,
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: colors.isDark ? 0.3 : 0.08,
          shadowRadius: 8,
        },
        android: {
          elevation: 4,
        },
      }),
    },
    fileIcon: {
      width: 48,
      height: 48,
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 12,
      backgroundColor: colors.primary + "15",
    },
    fileInfo: {
      flex: 1,
    },
    fileName: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 4,
    },
    fileSize: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    removeFileButton: {
      padding: 8,
    },
    typeSelector: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
      marginTop: 8,
    },
    typeButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.card,
    },
    selectedTypeButton: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    typeButtonText: {
      fontSize: 14,
      color: colors.text,
      fontWeight: "500",
    },
    selectedTypeButtonText: {
      color: "white",
    },
    tagsContainer: {
      marginTop: 8,
    },
    tagInput: {
      marginBottom: 12,
    },
    tagsDisplay: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
    },
    tag: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      backgroundColor: colors.primary + "15",
    },
    tagText: {
      fontSize: 14,
      color: colors.primary,
      marginRight: 6,
    },
    tagRemoveButton: {
      padding: 2,
    },
    progressContainer: {
      marginTop: 16,
      padding: 16,
      borderRadius: 12,
      backgroundColor: colors.card,
    },
    progressText: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 8,
    },
    progressBar: {
      height: 8,
      backgroundColor: colors.backgroundSecondary,
      borderRadius: 4,
      overflow: "hidden",
    },
    progressFill: {
      height: "100%",
      backgroundColor: colors.primary,
      borderRadius: 4,
    },
    uploadButtonContainer: {
      position: "absolute",
      bottom: Platform.select({
        ios: 90, // Au-dessus de la tab bar iOS (49px) + safe area (34px) + margin (7px)
        android: 70, // Au-dessus de la tab bar Android (56px) + margin (14px)
      }),
      left: 0,
      right: 0,
      backgroundColor: colors.background,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      paddingTop: 16,
      paddingBottom: 16,
      paddingHorizontal: 16,
    },
    uploadButton: {
      backgroundColor: colors.primary,
      paddingVertical: 16,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      ...Platform.select({
        ios: {
          shadowColor: colors.primary,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
        },
        android: {
          elevation: 8,
        },
      }),
    },
    uploadButtonDisabled: {
      backgroundColor: colors.textTertiary,
      opacity: 0.6,
    },
    uploadButtonText: {
      color: "white",
      fontSize: 16,
      fontWeight: "600",
      marginLeft: 8,
    },
    errorContainer: {
      backgroundColor: colors.error + "15",
      margin: 16,
      padding: 16,
      borderRadius: 8,
      borderLeftWidth: 4,
      borderLeftColor: colors.error,
    },
    errorText: {
      color: colors.error,
      fontSize: 14,
      fontWeight: "500",
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Animated.View
        style={{
          opacity: headerAnim,
          transform: [
            {
              translateY: headerAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [-50, 0],
              }),
            },
          ],
        }}
      >
        <Header
          leftIcon={{
            icon: "chevron-left",
            onPress: () => router.back(),
          }}
          title="Ajouter un document"
        />
      </Animated.View>

      {/* Error Display */}
      <ConditionalComponent isValid={!!error}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </ConditionalComponent>

      {/* Content */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* File Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fichier</Text>
          <ConditionalComponent
            isValid={!selectedFile}
            defaultComponent={
              <View style={styles.selectedFileCard}>
                <View style={styles.fileIcon}>
                  <FontAwesome
                    name={DOCUMENT_TYPES[documentType].icon as any}
                    size={20}
                    color={colors.primary}
                  />
                </View>
                <View style={styles.fileInfo}>
                  <Text style={styles.fileName}>{selectedFile?.name}</Text>
                  <Text style={styles.fileSize}>
                    {selectedFile && formatFileSize(selectedFile.size)}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.removeFileButton}
                  onPress={() => setSelectedFile(null)}
                >
                  <FontAwesome name="times" size={20} color={colors.error} />
                </TouchableOpacity>
              </View>
            }
          >
            <TouchableOpacity
              style={styles.fileSelectButton}
              onPress={handleFileSelect}
            >
              <FontAwesome
                name="cloud-upload"
                size={24}
                color={colors.primary}
                style={styles.fileSelectIcon}
              />
              <Text style={styles.fileSelectText}>Sélectionner un fichier</Text>
            </TouchableOpacity>
          </ConditionalComponent>
        </View>

        {/* Document Details */}
        <ConditionalComponent isValid={!!selectedFile}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Informations</Text>

            <Input
              label="Nom du document *"
              value={documentName}
              onChangeText={setDocumentName}
              placeholder="Saisissez le nom du document"
            />

            <Input
              label="Description"
              value={description}
              onChangeText={setDescription}
              placeholder="Description optionnelle"
              multiline
              numberOfLines={3}
            />

            {/* Type Selection */}
            <Text
              style={[styles.sectionTitle, { marginTop: 16, marginBottom: 8 }]}
            >
              Type de document
            </Text>
            <View style={styles.typeSelector}>
              {Object.entries(DOCUMENT_TYPES).map(([type, config]) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.typeButton,
                    documentType === type && styles.selectedTypeButton,
                  ]}
                  onPress={() => setDocumentType(type as DocumentType)}
                >
                  <Text
                    style={[
                      styles.typeButtonText,
                      documentType === type && styles.selectedTypeButtonText,
                    ]}
                  >
                    {config.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Tags */}
            <View style={styles.tagsContainer}>
              <Text style={[styles.sectionTitle, { marginBottom: 8 }]}>
                Tags
              </Text>
              <View style={styles.tagInput}>
                <Input
                  value={newTag}
                  onChangeText={setNewTag}
                  placeholder="Ajouter un tag"
                  rightIcon="plus"
                  onRightIconPress={handleAddTag}
                  onSubmitEditing={handleAddTag}
                />
              </View>
              <ConditionalComponent isValid={tags.length > 0}>
                <View style={styles.tagsDisplay}>
                  {tags.map((tag) => (
                    <View key={tag} style={styles.tag}>
                      <Text style={styles.tagText}>{tag}</Text>
                      <TouchableOpacity
                        style={styles.tagRemoveButton}
                        onPress={() => handleRemoveTag(tag)}
                      >
                        <FontAwesome
                          name="times"
                          size={12}
                          color={colors.primary}
                        />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </ConditionalComponent>
            </View>
          </View>
        </ConditionalComponent>

        {/* Upload Progress */}
        <ConditionalComponent isValid={isUploading}>
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>
              Upload en cours... {uploadProgress}%
            </Text>
            <View style={styles.progressBar}>
              <View
                style={[styles.progressFill, { width: `${uploadProgress}%` }]}
              />
            </View>
          </View>
        </ConditionalComponent>
      </ScrollView>

      {/* Upload Button - Fixed at bottom */}
      <ConditionalComponent isValid={!!selectedFile && !isUploading}>
        <View style={styles.uploadButtonContainer}>
          <TouchableOpacity
            style={[
              styles.uploadButton,
              !documentName.trim() && styles.uploadButtonDisabled,
            ]}
            onPress={handleUpload}
            disabled={!documentName.trim()}
            activeOpacity={0.8}
          >
            <FontAwesome name="upload" size={16} color="white" />
            <Text style={styles.uploadButtonText}>Uploader le document</Text>
          </TouchableOpacity>
        </View>
      </ConditionalComponent>
    </SafeAreaView>
  );
};
