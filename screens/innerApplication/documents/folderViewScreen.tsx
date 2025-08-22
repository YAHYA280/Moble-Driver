// screens/innerApplication/documents/folderViewScreen.tsx

import ConditionalComponent from "@/shared/components/conditionalComponent/conditionalComponent";
import { FontAwesome } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../../contexts/ThemeContext";
import { Header } from "../../../shared/components/ui/Header";
import { SearchModal } from "../../../shared/components/ui/SearchModal";
import { useDocumentStore } from "../../../store/documentStore";
import { DocumentCard } from "./components/DocumentCard";
import { DocumentFilterModal } from "./components/DocumentFilterModal";
import { DocumentsHeader } from "./components/DocumentsHeader";

export const FolderViewScreen: React.FC = () => {
  const { colors } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const headerAnim = useRef(new Animated.Value(0)).current;
  const contentAnim = useRef(new Animated.Value(0)).current;

  const {
    folders,
    filteredDocuments,
    filters,
    currentFolderId,
    isLoading,
    error,
    navigateToFolder,
    goBack,
    fetchDocuments,
    selectDocument,
    setFilters,
    toggleFavorite,
    deleteDocument,
    downloadDocument,
    clearError,
  } = useDocumentStore();

  const currentFolder = folders.find((f) => f.id === id);

  useEffect(() => {
    if (id && id !== currentFolderId) {
      navigateToFolder(id);
    }

    // Animations
    Animated.timing(headerAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      Animated.timing(contentAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    }, 200);
  }, [id]);

  const handleRefresh = () => {
    fetchDocuments(id);
  };

  const handleSearch = (query: string) => {
    setFilters({ searchQuery: query });
  };

  const handleDocumentPress = (document: any) => {
    selectDocument(document);
    router.push(`/documents/preview/${document.id}`);
  };

  const handleDocumentLongPress = (document: any) => {
    Alert.alert("Actions sur le document", document.name, [
      {
        text: "Télécharger",
        onPress: () => downloadDocument(document.id),
      },
      {
        text: document.isFavorite
          ? "Retirer des favoris"
          : "Ajouter aux favoris",
        onPress: () => toggleFavorite(document.id),
      },
      {
        text: "Supprimer",
        style: "destructive",
        onPress: () => handleDeleteDocument(document),
      },
      { text: "Annuler", style: "cancel" },
    ]);
  };

  const handleDeleteDocument = (document: any) => {
    Alert.alert(
      "Supprimer le document",
      `Êtes-vous sûr de vouloir supprimer "${document.name}" ?`,
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: () => deleteDocument(document.id),
        },
      ]
    );
  };

  const handleAddSubFolder = () => {
    Alert.prompt(
      "Nouveau sous-dossier",
      "Entrez le nom du sous-dossier",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Créer",
          onPress: (name) => {
            if (name && name.trim()) {
              // createFolder would be implemented in the store
              Alert.alert("Succès", `Sous-dossier "${name}" créé avec succès`);
            }
          },
        },
      ],
      "plain-text"
    );
  };

  const handleUploadDocument = () => {
    router.push(`/documents/upload?folderId=${id}`);
  };

  const handleBackPress = () => {
    goBack();
    router.back();
  };

  const handleNotificationPress = () => {
    router.push("/notifications?returnTo=/documents");
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
      paddingBottom: 100,
    },
    folderInfo: {
      margin: 16,
      padding: 16,
      borderRadius: 12,
      backgroundColor: colors.card,
      flexDirection: "row",
      alignItems: "center",
    },
    folderIcon: {
      width: 48,
      height: 48,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 16,
      backgroundColor: (currentFolder?.color || colors.primary) + "15",
    },
    folderDetails: {
      flex: 1,
    },
    folderName: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 4,
    },
    folderMeta: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    documentsContainer: {
      paddingHorizontal: 16,
    },
    emptyState: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingTop: 100,
      paddingHorizontal: 32,
    },
    emptyIcon: {
      width: 80,
      height: 80,
      borderRadius: 20,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.backgroundTertiary,
      marginBottom: 20,
    },
    emptyTitle: {
      fontSize: 20,
      fontWeight: "600",
      color: colors.text,
      textAlign: "center",
      marginBottom: 8,
    },
    emptySubtitle: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: "center",
      lineHeight: 22,
      marginBottom: 24,
    },
    emptyActions: {
      flexDirection: "row",
      gap: 12,
    },
    emptyActionButton: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderRadius: 25,
      backgroundColor: colors.primary,
    },
    emptyActionText: {
      fontSize: 14,
      fontWeight: "600",
      color: "white",
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
            onPress: handleBackPress,
          }}
          title={currentFolder?.name || "Dossier"}
          rightIcons={[
            {
              icon: "filter",
              onPress: () => setShowFilterModal(true),
            },
            {
              icon: "search",
              onPress: () => setShowSearchModal(true),
            },
            {
              icon: "bell",
              onPress: handleNotificationPress,
              badge: 3,
            },
          ]}
        />
      </Animated.View>

      {/* Error Display */}
      <ConditionalComponent isValid={!!error}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </ConditionalComponent>

      {/* Content */}
      <Animated.View style={[styles.content, { opacity: contentAnim }]}>
        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={handleRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
        >
          {/* Folder Info */}
          <ConditionalComponent isValid={!!currentFolder}>
            <View style={styles.folderInfo}>
              <View style={styles.folderIcon}>
                <FontAwesome
                  name={(currentFolder?.icon as any) || "folder"}
                  size={24}
                  color={currentFolder?.color || colors.primary}
                />
              </View>
              <View style={styles.folderDetails}>
                <Text style={styles.folderName}>{currentFolder?.name}</Text>
                <Text style={styles.folderMeta}>
                  {currentFolder?.documentsCount} document
                  {currentFolder?.documentsCount !== 1 ? "s" : ""} • Créé le{" "}
                  {currentFolder?.createdDate &&
                    new Date(currentFolder.createdDate).toLocaleDateString(
                      "fr-FR"
                    )}
                </Text>
              </View>
            </View>
          </ConditionalComponent>

          {/* Documents Header with actions */}
          <DocumentsHeader
            foldersCount={0} // No subfolders in current implementation
            documentsCount={filteredDocuments.length}
            onAddFolder={handleAddSubFolder}
            onUploadDocument={handleUploadDocument}
          />

          {/* Documents Section */}
          <View style={styles.documentsContainer}>
            <ConditionalComponent
              isValid={filteredDocuments.length > 0}
              defaultComponent={
                <View style={styles.emptyState}>
                  <View style={styles.emptyIcon}>
                    <FontAwesome
                      name="folder-open"
                      size={32}
                      color={colors.textTertiary}
                    />
                  </View>
                  <Text style={styles.emptyTitle}>Dossier vide</Text>
                  <Text style={styles.emptySubtitle}>
                    <ConditionalComponent
                      isValid={Object.keys(filters).length > 0}
                      defaultComponent="Ce dossier ne contient aucun document. Commencez par en ajouter un."
                    >
                      Aucun document ne correspond à vos critères de recherche
                      dans ce dossier.
                    </ConditionalComponent>
                  </Text>
                  <ConditionalComponent
                    isValid={Object.keys(filters).length === 0}
                  >
                    <View style={styles.emptyActions}>
                      <TouchableOpacity
                        style={styles.emptyActionButton}
                        onPress={handleUploadDocument}
                      >
                        <FontAwesome name="plus" size={16} color="white" />
                        <Text style={styles.emptyActionText}>
                          Ajouter document
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </ConditionalComponent>
                </View>
              }
            >
              <>
                {filteredDocuments.map((document, index) => (
                  <DocumentCard
                    key={document.id}
                    document={document}
                    onPress={() => handleDocumentPress(document)}
                    onLongPress={() => handleDocumentLongPress(document)}
                    style={{
                      marginBottom:
                        index === filteredDocuments.length - 1 ? 0 : 12,
                    }}
                  />
                ))}
              </>
            </ConditionalComponent>
          </View>
        </ScrollView>
      </Animated.View>

      {/* Search Modal */}
      <SearchModal
        visible={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        onSearch={handleSearch}
        placeholder="Rechercher dans ce dossier..."
        initialQuery={filters.searchQuery || ""}
        title="Rechercher documents"
      />

      {/* Filter Modal */}
      <DocumentFilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApplyFilters={setFilters}
        currentFilters={filters}
      />
    </SafeAreaView>
  );
};
