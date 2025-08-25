// screens/innerApplication/documents/documentUploadScreen.tsx - Refactored

import ConditionalComponent from "@/shared/components/conditionalComponent/conditionalComponent";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
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
import { DocumentType } from "../../../shared/types/document";
import { useDocumentStore } from "../../../store/documentStore";
import { DocumentForm } from "./components/Upload/DocumentForm";
import { FileSelector } from "./components/Upload/FileSelector";
import { SelectedFileCard } from "./components/Upload/SelectedFileCard";
import { TagManager } from "./components/Upload/TagManager";
import { UploadProgress } from "./components/Upload/UploadProgress";
import { useDocumentUpload } from "./hooks/useDocumentUpload";

interface SelectedFile {
  uri: string;
  name: string;
  type: string;
  size: number;
}

export const DocumentUploadScreen: React.FC = () => {
  const { colors } = useTheme();
  const headerAnim = useRef(new Animated.Value(0)).current;

  // File and form state
  const [selectedFile, setSelectedFile] = useState<SelectedFile | null>(null);
  const [documentName, setDocumentName] = useState("");
  const [documentType, setDocumentType] = useState<DocumentType>("Autre");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");

  // Store and upload logic
  const { uploadDocument, isUploading, uploadProgress, error } =
    useDocumentStore();
  const {
    selectFromCamera,
    selectFromGallery,
    selectFromFiles,
    autoDetectDocumentType,
    validateFile,
    createFileObject,
  } = useDocumentUpload();

  useEffect(() => {
    Animated.timing(headerAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleFileSelection = async () => {
    Alert.alert(
      "Sélectionner un fichier",
      "Choisissez la source de votre document",
      [
        {
          text: "Caméra",
          onPress: async () => {
            const file = await selectFromCamera();
            if (file) {
              setSelectedFile(file);
              setDocumentName(`Photo ${new Date().toLocaleDateString()}`);
              setDocumentType("Image");
            }
          },
        },
        {
          text: "Galerie",
          onPress: async () => {
            const file = await selectFromGallery();
            if (file) {
              setSelectedFile(file);
              setDocumentName(
                file.name?.replace(/\.[^/.]+$/, "") ||
                  `Image ${new Date().toLocaleDateString()}`
              );
              setDocumentType("Image");
            }
          },
        },
        {
          text: "Fichiers",
          onPress: async () => {
            const file = await selectFromFiles();
            if (file) {
              setSelectedFile(file);
              setDocumentName(file.name.replace(/\.[^/.]+$/, ""));
              setDocumentType(autoDetectDocumentType(file.name));
            }
          },
        },
        { text: "Annuler", style: "cancel" },
      ]
    );
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

    const validationError = validateFile(selectedFile);
    if (validationError) {
      Alert.alert("Erreur", validationError);
      return;
    }

    try {
      const file = createFileObject(selectedFile);

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

  const canUpload = selectedFile && documentName.trim() && !isUploading;

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
      paddingBottom: 120,
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
    uploadButtonContainer: {
      marginTop: 32,
      marginBottom: 60,
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
              <SelectedFileCard
                file={selectedFile!}
                documentType={documentType}
                onRemove={() => setSelectedFile(null)}
              />
            }
          >
            <FileSelector
              onFileSelect={handleFileSelection}
              disabled={isUploading}
            />
          </ConditionalComponent>
        </View>

        {/* Document Details Form */}
        <ConditionalComponent isValid={!!selectedFile}>
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Informations</Text>
              <DocumentForm
                documentName={documentName}
                onDocumentNameChange={setDocumentName}
                description={description}
                onDescriptionChange={setDescription}
                documentType={documentType}
                onDocumentTypeChange={setDocumentType}
              />
            </View>

            {/* Tags Management */}
            <View style={styles.section}>
              <TagManager
                tags={tags}
                newTag={newTag}
                onNewTagChange={setNewTag}
                onAddTag={handleAddTag}
                onRemoveTag={handleRemoveTag}
              />
            </View>
          </>
        </ConditionalComponent>

        {/* Upload Progress */}
        <UploadProgress
          progress={uploadProgress}
          fileName={selectedFile?.name}
          isUploading={isUploading}
        />

        {/* Upload Button */}
        <ConditionalComponent isValid={!!selectedFile && !isUploading}>
          <View style={styles.uploadButtonContainer}>
            <TouchableOpacity
              style={[
                styles.uploadButton,
                !canUpload && styles.uploadButtonDisabled,
              ]}
              onPress={handleUpload}
              disabled={!canUpload}
              activeOpacity={0.8}
            >
              <FontAwesome name="upload" size={16} color="white" />
              <Text style={styles.uploadButtonText}>Uploader le document</Text>
            </TouchableOpacity>
          </View>
        </ConditionalComponent>
      </ScrollView>
    </SafeAreaView>
  );
};
