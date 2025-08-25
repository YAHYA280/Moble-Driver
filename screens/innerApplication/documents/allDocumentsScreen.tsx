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
import { useDocumentStore } from "../../../store/documentStore";
import { DocumentCard } from "./components/DocumentCard";
import { DocumentFilterModal } from "./components/DocumentFilterModal";

export const AllDocumentsScreen: React.FC = () => {
  const { colors } = useTheme();
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const headerAnim = useRef(new Animated.Value(0)).current;
  const contentAnim = useRef(new Animated.Value(0)).current;

  const {
    documents,
    filteredDocuments,
    filters,
    isLoading,
    error,
    fetchDocuments,
    setFilters,
    selectDocument,
    toggleFavorite,
    deleteDocument,
    downloadDocument,
  } = useDocumentStore();

  useEffect(() => {
    fetchDocuments();

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
    headerSection: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 16,
    },
    headerLeft: {
      flex: 1,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 4,
    },
    itemCount: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    sortContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 16,
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
            icon: "chevron-left",
            onPress: () => router.back(),
          }}
          title="Tous les documents"
          rightIcons={[
            {
              icon: "search",
              onPress: () => setShowSearchModal(true),
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
          {/* Header Section */}
          <View style={styles.headerSection}>
            <View style={styles.headerLeft}>
              <Text style={styles.sectionTitle}>Mes Fichiers</Text>
              <Text style={styles.itemCount}>
                {documents.length} document{documents.length !== 1 ? "s" : ""}
              </Text>
            </View>
          </View>

          {/* Sort and Filter */}
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

          {/* Documents List */}
          <ConditionalComponent isValid={filteredDocuments.length > 0}>
            <View style={styles.documentsContainer}>
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
            </View>
          </ConditionalComponent>

          {/* Empty State */}
          <ConditionalComponent isValid={filteredDocuments.length === 0}>
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
        currentFilters={filters}
      />
    </SafeAreaView>
  );
};
