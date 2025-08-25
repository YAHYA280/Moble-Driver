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

export const FavoritesScreen: React.FC = () => {
  const { colors } = useTheme();
  const [showSidebar, setShowSidebar] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const headerAnim = useRef(new Animated.Value(0)).current;
  const contentAnim = useRef(new Animated.Value(0)).current;

  const {
    getFavoriteDocuments,
    getFavoriteFolders,
    toggleFavorite,
    toggleFolderFavorite,
    deleteDocument,
    deleteFolder,
    downloadDocument,
    selectDocument,
    isLoading,
    error,
    fetchDocuments,
    fetchFolders,
  } = useDocumentStore();

  const favoriteDocuments = getFavoriteDocuments();
  const favoriteFolders = getFavoriteFolders();

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
    fetchDocuments();
    fetchFolders();
  };

  const handleSearch = (query: string) => {
    setShowSearchModal(false);
  };

  const handleDocumentPress = (document: any) => {
    selectDocument(document);
    router.push(`/documents/preview/${document.id}`);
  };

  const handleFolderPress = (folder: any) => {
    router.push(`/documents/folder/${folder.id}`);
  };

  const handleDocumentLongPress = (document: any) => {
    Alert.alert("Actions sur le document", document.name, [
      {
        text: "Télécharger",
        onPress: () => downloadDocument(document.id),
      },
      {
        text: "Retirer des favoris",
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
        text: "Retirer des favoris",
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
        setShowSidebar(false);
        router.push("/documents");
      },
      isActive: false,
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
      },
      isActive: true,
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
    sectionContainer: {
      paddingHorizontal: 16,
      paddingVertical: 20,
    },
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
    },
    viewAllButton: {
      paddingHorizontal: 12,
      paddingVertical: 6,
    },
    viewAllText: {
      fontSize: 14,
      color: colors.primary,
      fontWeight: "500",
    },
    foldersGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 12,
    },
    folderCardContainer: {
      width: "30%",
      aspectRatio: 1,
      borderRadius: 16,
      backgroundColor: colors.primary + "10",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      padding: 12,
    },
    starIcon: {
      position: "absolute",
      top: 8,
      right: 8,
    },
    folderIcon: {
      marginBottom: 8,
    },
    folderName: {
      fontSize: 12,
      fontWeight: "600",
      color: colors.text,
      textAlign: "center",
    },
    folderCount: {
      fontSize: 10,
      color: colors.textSecondary,
      textAlign: "center",
      marginTop: 2,
    },
    documentsContainer: {
      paddingHorizontal: 16,
    },
    documentItem: {
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
      backgroundColor: colors.card,
      borderRadius: 12,
      marginBottom: 12,
    },
    documentIcon: {
      width: 40,
      height: 40,
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 12,
    },
    documentInfo: {
      flex: 1,
    },
    documentName: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.text,
    },
    documentMeta: {
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 2,
    },
    favoriteIconContainer: {
      padding: 8,
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

  const getDocumentTypeColor = (type: string) => {
    const typeColors: { [key: string]: string } = {
      PDF: "#ef4444",
      Image: "#22c55e",
      Contrat: "#3b82f6",
      Permis: "#f59e0b",
      Assurance: "#8b5cf6",
      Autre: "#6b7280",
    };
    return typeColors[type] || "#6b7280";
  };

  const getDocumentTypeIcon = (type: string) => {
    const typeIcons: { [key: string]: string } = {
      PDF: "file-pdf-o",
      Image: "file-image-o",
      Contrat: "file-text",
      Permis: "credit-card",
      Assurance: "shield",
      Autre: "file-o",
    };
    return typeIcons[type] || "file-o";
  };

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
            icon: "bars",
            onPress: () => setShowSidebar(true),
          }}
          title="Centre de favoris"
          rightIcons={[
            {
              icon: "search",
              onPress: () => setShowSearchModal(true),
            },
            {
              icon: "bell",
              onPress: () => router.push("/notifications"),
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
          {/* Favorite Folders Section */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Mes dossiers favoris</Text>
              <TouchableOpacity style={styles.viewAllButton}>
                <Text style={styles.viewAllText}>Voir tout</Text>
              </TouchableOpacity>
            </View>

            <ConditionalComponent isValid={favoriteFolders.length > 0}>
              <View style={styles.foldersGrid}>
                {favoriteFolders.slice(0, 3).map((folder) => (
                  <TouchableOpacity
                    key={folder.id}
                    style={styles.folderCardContainer}
                    onPress={() => handleFolderPress(folder)}
                    onLongPress={() => handleFolderLongPress(folder)}
                  >
                    <FontAwesome
                      name="star"
                      size={12}
                      color={colors.warning}
                      style={styles.starIcon}
                    />
                    <FontAwesome
                      name={(folder.icon as any) || "folder"}
                      size={32}
                      color={colors.primary}
                      style={styles.folderIcon}
                    />
                    <Text style={styles.folderName} numberOfLines={2}>
                      {folder.name}
                    </Text>
                    <Text style={styles.folderCount}>
                      {folder.documentsCount} Éléments
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ConditionalComponent>
          </View>

          {/* Favorite Documents Section */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Raccourcis favoris</Text>
              <TouchableOpacity style={styles.viewAllButton}>
                <Text style={styles.viewAllText}>Voir tout</Text>
              </TouchableOpacity>
            </View>

            <ConditionalComponent isValid={favoriteDocuments.length > 0}>
              <View style={styles.documentsContainer}>
                {favoriteDocuments.map((document) => (
                  <TouchableOpacity
                    key={document.id}
                    style={styles.documentItem}
                    onPress={() => handleDocumentPress(document)}
                    onLongPress={() => handleDocumentLongPress(document)}
                  >
                    <View
                      style={[
                        styles.documentIcon,
                        {
                          backgroundColor:
                            getDocumentTypeColor(document.type) + "15",
                        },
                      ]}
                    >
                      <FontAwesome
                        name={getDocumentTypeIcon(document.type) as any}
                        size={16}
                        color={getDocumentTypeColor(document.type)}
                      />
                    </View>
                    <View style={styles.documentInfo}>
                      <Text style={styles.documentName} numberOfLines={1}>
                        {document.name}
                      </Text>
                      <Text style={styles.documentMeta}>
                        {document.type} •{" "}
                        {(document.size / (1024 * 1024)).toFixed(1)} MB
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={styles.favoriteIconContainer}
                      onPress={() => toggleFavorite(document.id)}
                    >
                      <FontAwesome
                        name="star"
                        size={16}
                        color={colors.warning}
                      />
                    </TouchableOpacity>
                  </TouchableOpacity>
                ))}
              </View>
            </ConditionalComponent>
          </View>

          {/* Empty State */}
          <ConditionalComponent
            isValid={
              favoriteFolders.length === 0 && favoriteDocuments.length === 0
            }
          >
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>Aucun favori</Text>
              <Text style={styles.emptySubtitle}>
                Ajoutez des documents et dossiers à vos favoris pour les
                retrouver rapidement ici.
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
        placeholder="Rechercher dans les favoris..."
        initialQuery=""
        title="Rechercher favoris"
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
