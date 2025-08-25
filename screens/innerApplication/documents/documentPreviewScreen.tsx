import ConditionalComponent from "@/shared/components/conditionalComponent/conditionalComponent";
import { FontAwesome } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  Image,
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
import { DOCUMENT_TYPES } from "../../../shared/types/document";
import { useDocumentStore } from "../../../store/documentStore";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export const DocumentPreviewScreen: React.FC = () => {
  const { colors } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const headerAnim = useRef(new Animated.Value(0)).current;
  const contentAnim = useRef(new Animated.Value(0)).current;

  const {
    documents,
    selectedDocument,
    selectDocument,
    toggleFavorite,
    deleteDocument,
    downloadDocument,
  } = useDocumentStore();

  useEffect(() => {
    if (id) {
      const document = documents.find((doc) => doc.id === id);
      if (document) {
        selectDocument(document);
      } else {
        router.back();
        return;
      }
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

  if (!selectedDocument) {
    return null;
  }

  const handleBackPress = () => {
    router.back();
  };

  const handleFavoriteToggle = () => {
    toggleFavorite(selectedDocument.id);
  };

  const handleDownload = () => {
    downloadDocument(selectedDocument.id);
  };

  const handleDelete = () => {
    Alert.alert(
      "Supprimer le document",
      `Êtes-vous sûr de vouloir supprimer "${selectedDocument.name}" ?`,
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: () => {
            deleteDocument(selectedDocument.id);
            router.back();
          },
        },
      ]
    );
  };

  const handleShare = () => {
    Alert.alert("Partager", "Fonctionnalité de partage à implémenter");
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const documentTypeConfig = DOCUMENT_TYPES[selectedDocument.type];
  const canPreview =
    selectedDocument.mimeType.startsWith("image/") ||
    selectedDocument.mimeType === "application/pdf";

  const renderPreviewContent = () => {
    if (selectedDocument.mimeType.startsWith("image/")) {
      return (
        <TouchableOpacity
          style={styles.imagePreviewContainer}
          onPress={() => setIsFullscreen(!isFullscreen)}
          activeOpacity={0.9}
        >
          <Image
            source={{ uri: selectedDocument.url }}
            style={[
              styles.imagePreview,
              isFullscreen && styles.fullscreenImage,
            ]}
            resizeMode={isFullscreen ? "contain" : "cover"}
          />
        </TouchableOpacity>
      );
    }

    if (selectedDocument.mimeType === "application/pdf") {
      return (
        <View style={styles.pdfPreviewContainer}>
          <View style={styles.pdfIcon}>
            <FontAwesome
              name="file-pdf-o"
              size={64}
              color={documentTypeConfig.color}
            />
          </View>
          <Text style={styles.pdfText}>Aperçu PDF</Text>
          <Text style={styles.pdfSubtext}>
            Appuyez sur télécharger pour ouvrir le fichier
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.genericPreviewContainer}>
        <View style={styles.genericIcon}>
          <FontAwesome
            name={documentTypeConfig.icon as any}
            size={64}
            color={documentTypeConfig.color}
          />
        </View>
        <Text style={styles.genericText}>
          Aperçu non disponible pour ce type de fichier
        </Text>
      </View>
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
    previewSection: {
      margin: 16,
      borderRadius: 16,
      backgroundColor: colors.card,
      overflow: "hidden",
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: colors.isDark ? 0.3 : 0.12,
          shadowRadius: 16,
        },
        android: {
          elevation: 8,
        },
        web: {
          boxShadow: colors.isDark
            ? "0 4px 16px rgba(0, 0, 0, 0.3)"
            : "0 4px 16px rgba(0, 0, 0, 0.12)",
        },
      }),
    },
    imagePreviewContainer: {
      height: isFullscreen ? screenHeight * 0.7 : 250,
      alignItems: "center",
      justifyContent: "center",
    },
    imagePreview: {
      width: "100%",
      height: "100%",
      borderRadius: isFullscreen ? 0 : 16,
    },
    fullscreenImage: {
      borderRadius: 0,
    },
    pdfPreviewContainer: {
      height: 250,
      alignItems: "center",
      justifyContent: "center",
      padding: 20,
    },
    pdfIcon: {
      marginBottom: 16,
    },
    pdfText: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 8,
    },
    pdfSubtext: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: "center",
    },
    genericPreviewContainer: {
      height: 200,
      alignItems: "center",
      justifyContent: "center",
      padding: 20,
    },
    genericIcon: {
      marginBottom: 16,
    },
    genericText: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: "center",
    },
    detailsSection: {
      margin: 16,
      marginTop: 0,
    },
    detailsCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 20,
      marginBottom: 16,
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: colors.isDark ? 0.3 : 0.08,
          shadowRadius: 8,
        },
        android: {
          elevation: 4,
        },
        web: {
          boxShadow: colors.isDark
            ? "0 2px 8px rgba(0, 0, 0, 0.3)"
            : "0 2px 8px rgba(0, 0, 0, 0.08)",
        },
      }),
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 16,
    },
    detailRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    lastDetailRow: {
      borderBottomWidth: 0,
    },
    detailLabel: {
      fontSize: 14,
      color: colors.textSecondary,
      fontWeight: "500",
    },
    detailValue: {
      fontSize: 14,
      color: colors.text,
      fontWeight: "600",
      flex: 1,
      textAlign: "right",
    },
    typeValue: {
      color: documentTypeConfig.color,
    },
    actionsSection: {
      margin: 16,
      marginTop: 0,
    },
    actionsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 12,
    },
    actionButton: {
      flex: 1,
      minWidth: "48%",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 12,
      backgroundColor: colors.primary + "15",
    },
    favoriteButton: {
      backgroundColor: selectedDocument.isFavorite
        ? colors.warning + "15"
        : colors.primary + "15",
    },
    deleteButton: {
      backgroundColor: colors.error + "15",
    },
    shareButton: {
      backgroundColor: colors.info + "15",
    },
    actionIcon: {
      marginRight: 8,
    },
    actionText: {
      fontSize: 14,
      fontWeight: "600",
    },
    primaryActionText: {
      color: colors.primary,
    },
    favoriteActionText: {
      color: selectedDocument.isFavorite ? colors.warning : colors.primary,
    },
    deleteActionText: {
      color: colors.error,
    },
    shareActionText: {
      color: colors.info,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <ConditionalComponent isValid={!isFullscreen}>
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
            title={selectedDocument.name}
            rightIcons={[
              {
                icon: selectedDocument.isFavorite ? "star" : "star-o",
                onPress: handleFavoriteToggle,
                color: selectedDocument.isFavorite ? colors.warning : undefined,
              },
              {
                icon: "download",
                onPress: handleDownload,
              },
            ]}
          />
        </Animated.View>
      </ConditionalComponent>

      {/* Content */}
      <Animated.View style={[styles.content, { opacity: contentAnim }]}>
        <ConditionalComponent
          isValid={isFullscreen}
          defaultComponent={
            <ScrollView
              style={styles.content}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >
              {/* Preview Section */}
              <View style={styles.previewSection}>
                {renderPreviewContent()}
              </View>

              {/* Details Section */}
              <View style={styles.detailsSection}>
                <View style={styles.detailsCard}>
                  <Text style={styles.sectionTitle}>Informations</Text>

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Type</Text>
                    <Text style={[styles.detailValue, styles.typeValue]}>
                      {documentTypeConfig.label}
                    </Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Taille</Text>
                    <Text style={styles.detailValue}>
                      {formatFileSize(selectedDocument.size)}
                    </Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Ajouté le</Text>
                    <Text style={styles.detailValue}>
                      {formatDate(selectedDocument.uploadDate)}
                    </Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Modifié le</Text>
                    <Text style={styles.detailValue}>
                      {formatDate(selectedDocument.modifiedDate)}
                    </Text>
                  </View>

                  <ConditionalComponent isValid={!!selectedDocument.expiryDate}>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Expire le</Text>
                      <Text style={styles.detailValue}>
                        {selectedDocument.expiryDate &&
                          formatDate(selectedDocument.expiryDate)}
                      </Text>
                    </View>
                  </ConditionalComponent>

                  <View style={[styles.detailRow, styles.lastDetailRow]}>
                    <Text style={styles.detailLabel}>Statut</Text>
                    <Text style={styles.detailValue}>
                      {selectedDocument.status === "active"
                        ? "Actif"
                        : selectedDocument.status === "expired"
                        ? "Expiré"
                        : "En attente"}
                    </Text>
                  </View>
                </View>

                {/* Actions Section */}
                <View style={styles.actionsSection}>
                  <View style={styles.actionsGrid}>
                    <TouchableOpacity
                      style={[styles.actionButton, styles.favoriteButton]}
                      onPress={handleFavoriteToggle}
                    >
                      <FontAwesome
                        name={selectedDocument.isFavorite ? "star" : "star-o"}
                        size={16}
                        color={
                          selectedDocument.isFavorite
                            ? colors.warning
                            : colors.primary
                        }
                        style={styles.actionIcon}
                      />
                      <Text
                        style={[styles.actionText, styles.favoriteActionText]}
                      >
                        {selectedDocument.isFavorite ? "Favoris" : "Ajouter"}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.actionButton, styles.shareButton]}
                      onPress={handleShare}
                    >
                      <FontAwesome
                        name="share"
                        size={16}
                        color={colors.info}
                        style={styles.actionIcon}
                      />
                      <Text style={[styles.actionText, styles.shareActionText]}>
                        Partager
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={handleDownload}
                    >
                      <FontAwesome
                        name="download"
                        size={16}
                        color={colors.primary}
                        style={styles.actionIcon}
                      />
                      <Text
                        style={[styles.actionText, styles.primaryActionText]}
                      >
                        Télécharger
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.actionButton, styles.deleteButton]}
                      onPress={handleDelete}
                    >
                      <FontAwesome
                        name="trash"
                        size={16}
                        color={colors.error}
                        style={styles.actionIcon}
                      />
                      <Text
                        style={[styles.actionText, styles.deleteActionText]}
                      >
                        Supprimer
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </ScrollView>
          }
        >
          <View style={{ flex: 1, backgroundColor: colors.background }}>
            {renderPreviewContent()}
            <TouchableOpacity
              style={{
                position: "absolute",
                top: 50,
                right: 20,
                backgroundColor: colors.card,
                borderRadius: 20,
                padding: 10,
              }}
              onPress={() => setIsFullscreen(false)}
            >
              <FontAwesome name="times" size={20} color={colors.text} />
            </TouchableOpacity>
          </View>
        </ConditionalComponent>
      </Animated.View>
    </SafeAreaView>
  );
};
