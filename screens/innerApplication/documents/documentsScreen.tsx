// screens/innerApplication/documents/documentsScreen.tsx

import ConditionalComponent from "@/shared/components/conditionalComponent/conditionalComponent";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
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
import { Sidebar } from "../../../shared/components/ui/Sidebar";
import { useDocumentStore } from "../../../store/documentStore";
import { DocumentCard } from "./components/DocumentCard";
import { DocumentFilterModal } from "./components/DocumentFilterModal";
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
    toggleFolderFavorite,
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

  const handleFolderLongPress = (folder: any) => {
    Alert.alert("Actions sur le dossier", folder.name, [
      {
        text: folder.isFavorite ? "Retirer des favoris" : "Ajouter aux favoris",
        onPress: () => toggleFolderFavorite(folder.id),
      },
      {
        text: "Supprimer",
        style: "destructive",
        onPress: () => handleDeleteFolder(folder),
      },
      { text: "Annuler", style: "cancel" },
    ]);
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

  const handleFolderFavoritePress = (folder: any) => {
    toggleFolderFavorite(folder.id);
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
      id: "documents",
      label: "Document",
      icon: "file-text" as const,
      onPress: () => {
        clearFilters();
        setShowSidebar(false);
      },
      isActive: true,
    },
    {
      id: "requests",
      label: "Mes demandes",
      icon: "clipboard" as const,
      onPress: () => {
        setShowSidebar(false);
        Alert.alert("Info", "Section Mes demandes à implémenter");
      },
      isActive: false,
    },
    {
      id: "favorites",
      label: "Gestion des favoris",
      icon: "star" as const,
      onPress: () => {
        setShowSidebar(false);
        router.push("/documents/favorites");
      },
      isActive: false,
    },
    {
      id: "upload",
      label: "Upload",
      icon: "cloud-upload" as const,
      onPress: () => {
        setShowSidebar(false);
        router.push("/documents/upload");
      },
      isActive: false,
    },
  ];

  // Get folders to display (only root folders if not in a folder)
  const foldersToDisplay = folders.filter((folder) => {
    if (currentFolderId) {
      return folder.parentId === currentFolderId;
    }
    return !folder.parentId;
  });

  const totalItems = foldersToDisplay.length + filteredDocuments.length;

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
      paddingTop: 20,
      paddingBottom: 16,
    },
    actionsContainer: {
      flexDirection: "row",
      paddingHorizontal: 16,
      paddingVertical: 12,
      gap: 12,
    },
    actionButton: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 12,
      backgroundColor: colors.primary + "15",
      borderWidth: 1,
      borderColor: colors.primary + "30",
    },
    actionText: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.primary,
      marginLeft: 8,
    },
    sectionContainer: {
      paddingHorizontal: 16,
      paddingVertical: 16,
    },
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
    },
    sectionHeaderSimple: {
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
    },
    viewAllButton: {
      paddingHorizontal: 8,
      paddingVertical: 4,
    },
    viewAllText: {
      fontSize: 14,
      color: colors.primary,
      fontWeight: "500",
    },
    sortContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
    },
    sortButton: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.card,
    },
    sortText: {
      fontSize: 14,
      color: colors.textSecondary,
      marginRight: 8,
    },
    filterButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
    },
    foldersGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 12,
    },
    documentsContainer: {
      marginTop: 0,
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
          title="Documents"
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

          {/* Action Buttons */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleAddFolder}
            >
              <FontAwesome name="folder-o" size={16} color={colors.primary} />
              <Text style={styles.actionText}>Nouveau dossier</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleUploadDocument}
            >
              <FontAwesome name="plus" size={16} color={colors.primary} />
              <Text style={styles.actionText}>Ajouter document</Text>
            </TouchableOpacity>
          </View>

          {/* Mes dossiers Section */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeaderSimple}>
              <Text style={styles.sectionTitle}>Mes dossiers</Text>
            </View>

            <ConditionalComponent isValid={foldersToDisplay.length > 0}>
              <View style={styles.foldersGrid}>
                {foldersToDisplay.map((folder) => (
                  <FolderCard
                    key={folder.id}
                    folder={folder}
                    onPress={() => handleFolderPress(folder)}
                    onLongPress={() => handleFolderLongPress(folder)}
                    onFavoritePress={() => handleFolderFavoritePress(folder)}
                  />
                ))}
              </View>
            </ConditionalComponent>
          </View>

          {/* Mes Fichiers Section */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Mes Fichiers</Text>
              <TouchableOpacity
                style={styles.viewAllButton}
                onPress={() => router.push("/documents/all")}
              >
                <Text style={styles.viewAllText}>Voir tout</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.sortContainer}>
              <TouchableOpacity style={styles.sortButton}>
                <Text style={styles.sortText}>Vu pour la dernière fois</Text>
                <FontAwesome
                  name="chevron-down"
                  size={12}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.filterButton}
                onPress={() => setShowFilterModal(true)}
              >
                <FontAwesome
                  name="filter"
                  size={16}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            </View>

            <ConditionalComponent isValid={filteredDocuments.length > 0}>
              <View style={styles.documentsContainer}>
                {filteredDocuments.slice(0, 5).map((document, index) => (
                  <DocumentCard
                    key={document.id}
                    document={document}
                    onPress={() => handleDocumentPress(document)}
                    onLongPress={() => handleDocumentLongPress(document)}
                    style={{
                      marginBottom:
                        index === filteredDocuments.slice(0, 5).length - 1
                          ? 0
                          : 12,
                    }}
                  />
                ))}
              </View>
            </ConditionalComponent>
          </View>

          {/* Empty State */}
          <ConditionalComponent
            isValid={
              foldersToDisplay.length === 0 && filteredDocuments.length === 0
            }
          >
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>Aucun élément trouvé</Text>
              <Text style={styles.emptySubtitle}>
                <ConditionalComponent
                  isValid={Object.keys(filters).length > 0}
                  defaultComponent="Vos documents et dossiers apparaîtront ici."
                >
                  Aucun élément ne correspond à vos critères de recherche.
                </ConditionalComponent>
              </Text>
            </View>
          </ConditionalComponent>
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
        onClearFilters={clearFilters}
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
