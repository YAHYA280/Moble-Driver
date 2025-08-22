// screens/innerApplication/documents/documentsScreen.tsx

import ConditionalComponent from "@/shared/components/conditionalComponent/conditionalComponent";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../../contexts/ThemeContext";
import { Header } from "../../../shared/components/ui/Header";
import { SearchModal } from "../../../shared/components/ui/SearchModal";
import { Sidebar } from "../../../shared/components/ui/Sidebar";
import { useDocumentStore } from "../../../store/documentStore";
import { DocumentCard } from "./components/DocumentCard";
import { DocumentFilterModal } from "./components/DocumentFilterModal";
import { DocumentsHeader } from "./components/DocumentsHeader";
import { FolderCard } from "./components/FolderCard";
import { StorageIndicator } from "./components/StorageIndicator";

export const DocumentsScreen: React.FC = () => {
  const { colors } = useTheme();
  const [showSidebar, setShowSidebar] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const headerAnim = useRef(new Animated.Value(0)).current;
  const contentAnim = useRef(new Animated.Value(0)).current;

  const {
    documents,
    folders,
    filteredDocuments,
    filters,
    currentFolderId,
    storageInfo,
    isLoading,
    error,
    fetchDocuments,
    fetchFolders,
    navigateToFolder,
    goBack,
    setFilters,
    clearFilters,
    selectDocument,
    selectFolder,
    toggleFavorite,
    deleteDocument,
    deleteFolder,
    downloadDocument,
    clearError,
  } = useDocumentStore();

  useEffect(() => {
    fetchDocuments();
    fetchFolders();

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
  }, []);

  const handleRefresh = () => {
    fetchDocuments(currentFolderId || undefined);
  };

  const handleSearch = (query: string) => {
    setFilters({ searchQuery: query });
  };

  const handleDocumentPress = (document: any) => {
    selectDocument(document);
    router.push(`/documents/preview/${document.id}`);
  };

  const handleFolderPress = (folder: any) => {
    selectFolder(folder);
    navigateToFolder(folder.id);
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

  const handleDeleteFolder = (folder: any) => {
    Alert.alert(
      "Supprimer le dossier",
      `Êtes-vous sûr de vouloir supprimer le dossier "${folder.name}" et tout son contenu ?`,
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: () => deleteFolder(folder.id),
        },
      ]
    );
  };

  const handleAddFolder = () => {
    Alert.prompt(
      "Nouveau dossier",
      "Entrez le nom du dossier",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Créer",
          onPress: (name) => {
            if (name && name.trim()) {
              // createFolder would be implemented in the store
              Alert.alert("Succès", `Dossier "${name}" créé avec succès`);
            }
          },
        },
      ],
      "plain-text"
    );
  };

  const handleUploadDocument = () => {
    router.push("/documents/upload");
  };

  const handleNotificationPress = () => {
    router.push("/notifications?returnTo=/documents");
  };

  const handleLogout = () => {
    Alert.alert("Déconnexion", "Êtes-vous sûr de vouloir vous déconnecter ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Déconnecter",
        style: "destructive",
        onPress: () => {
          setShowSidebar(false);
          router.replace("/auth/login");
        },
      },
    ]);
  };

  const sidebarItems = [
    {
      id: "all",
      label: "Tous les documents",
      icon: "file-o" as const,
      onPress: () => {
        clearFilters();
        setShowSidebar(false);
      },
      isActive: !filters.type && !filters.isFavorite,
    },
    {
      id: "favorites",
      label: "Favoris",
      icon: "star" as const,
      onPress: () => {
        setFilters({ isFavorite: true });
        setShowSidebar(false);
      },
      isActive: filters.isFavorite === true,
    },
    {
      id: "pdf",
      label: "Documents PDF",
      icon: "file-pdf-o" as const,
      onPress: () => {
        setFilters({ type: ["PDF"] });
        setShowSidebar(false);
      },
      isActive: filters.type?.includes("PDF"),
    },
    {
      id: "images",
      label: "Images",
      icon: "file-image-o" as const,
      onPress: () => {
        setFilters({ type: ["Image"] });
        setShowSidebar(false);
      },
      isActive: filters.type?.includes("Image"),
    },
    {
      id: "contracts",
      label: "Contrats",
      icon: "file-text" as const,
      onPress: () => {
        setFilters({ type: ["Contrat"] });
        setShowSidebar(false);
      },
      isActive: filters.type?.includes("Contrat"),
    },
  ];

  // Get folders to display (only root folders if not in a folder)
  const foldersToDisplay = folders.filter((folder) => {
    if (currentFolderId) {
      return folder.parentId === currentFolderId;
    }
    return !folder.parentId;
  });

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
    storageContainer: {
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    sectionContainer: {
      paddingHorizontal: 16,
      paddingVertical: 8,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 12,
    },
    foldersGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 12,
    },
    documentsContainer: {
      paddingHorizontal: 16,
    },
    emptyState: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 32,
      paddingTop: 100,
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
            icon: currentFolderId ? "chevron-left" : "bars",
            onPress: currentFolderId ? goBack : () => setShowSidebar(true),
          }}
          title="Mes documents"
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
          {/* Storage Indicator */}
          <View style={styles.storageContainer}>
            <StorageIndicator storageInfo={storageInfo} />
          </View>

          {/* Documents Header with actions */}
          <DocumentsHeader
            foldersCount={foldersToDisplay.length}
            documentsCount={filteredDocuments.length}
            onAddFolder={handleAddFolder}
            onUploadDocument={handleUploadDocument}
          />

          {/* Folders Section */}
          <ConditionalComponent isValid={foldersToDisplay.length > 0}>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Dossiers</Text>
              <View style={styles.foldersGrid}>
                {foldersToDisplay.map((folder) => (
                  <FolderCard
                    key={folder.id}
                    folder={folder}
                    onPress={() => handleFolderPress(folder)}
                    onLongPress={() => handleDeleteFolder(folder)}
                  />
                ))}
              </View>
            </View>
          </ConditionalComponent>

          {/* Documents Section */}
          <View style={styles.documentsContainer}>
            <ConditionalComponent
              isValid={filteredDocuments.length > 0}
              defaultComponent={
                <View style={styles.emptyState}>
                  <Text style={styles.emptyTitle}>Aucun document trouvé</Text>
                  <Text style={styles.emptySubtitle}>
                    <ConditionalComponent
                      isValid={Object.keys(filters).length > 0}
                      defaultComponent="Vos documents apparaîtront ici."
                    >
                      Aucun document ne correspond à vos critères de recherche.
                    </ConditionalComponent>
                  </Text>
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
        placeholder="Rechercher des documents..."
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

      {/* Sidebar */}
      <Sidebar
        title="Mes documents"
        items={sidebarItems}
        visible={showSidebar}
        onClose={() => setShowSidebar(false)}
        onLogout={handleLogout}
      />
    </SafeAreaView>
  );
};
