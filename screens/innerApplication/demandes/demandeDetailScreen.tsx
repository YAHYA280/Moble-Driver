import ConditionalComponent from "@/shared/components/conditionalComponent/conditionalComponent";
import { FontAwesome } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef } from "react";
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
import { DEMANDE_STATUS, DEMANDE_TYPES } from "../../../shared/types/demande";
import { useDemandeStore } from "../../../store/demandeStore";

export const DemandeDetailScreen: React.FC = () => {
  const { colors } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const headerAnim = useRef(new Animated.Value(0)).current;
  const contentAnim = useRef(new Animated.Value(0)).current;

  const { demandes, selectedDemande, selectDemande, deleteDemande } =
    useDemandeStore();

  useEffect(() => {
    if (id) {
      const demande = demandes.find((d) => d.id === id);
      if (demande) {
        selectDemande(demande);
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

  if (!selectedDemande) {
    return null;
  }

  const typeConfig = DEMANDE_TYPES[selectedDemande.type];
  const statusConfig = DEMANDE_STATUS[selectedDemande.status];

  const handleBackPress = () => {
    router.back();
  };

  const handleDelete = () => {
    Alert.alert(
      "Supprimer la demande",
      "Êtes-vous sûr de vouloir supprimer cette demande ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: () => {
            deleteDemande(selectedDemande.id);
            router.back();
          },
        },
      ]
    );
  };

  const handleDownloadAttachment = (attachment: any) => {
    // In a real app, you would download the attachment
    Alert.alert("Téléchargement", `Téléchargement de ${attachment.name}`);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatDateTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const calculateDuration = (): number => {
    const startDate = new Date(selectedDemande.startDate);
    const endDate = new Date(selectedDemande.endDate);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const getFileIcon = (mimeType: string): string => {
    if (mimeType.startsWith("image/")) return "file-image-o";
    if (mimeType === "application/pdf") return "file-pdf-o";
    if (mimeType.includes("document")) return "file-text";
    return "file-o";
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
      margin: 16,
      padding: 20,
      borderRadius: 16,
      backgroundColor: colors.card,
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 4 },
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
    headerTop: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 16,
    },
    typeIcon: {
      width: 56,
      height: 56,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 16,
      backgroundColor: typeConfig.color + "15",
    },
    headerInfo: {
      flex: 1,
    },
    title: {
      fontSize: 20,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 4,
    },
    typeLabel: {
      fontSize: 14,
      color: typeConfig.color,
      fontWeight: "600",
      marginBottom: 2,
    },
    dates: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    statusBadge: {
      alignSelf: "flex-start",
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
      backgroundColor: statusConfig.color + "15",
    },
    statusRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    statusText: {
      fontSize: 14,
      fontWeight: "600",
      color: statusConfig.color,
      marginLeft: 6,
    },
    urgentBadge: {
      flexDirection: "row",
      alignItems: "center",
      alignSelf: "flex-start",
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
      backgroundColor: colors.error + "15",
      marginTop: 8,
    },
    urgentText: {
      fontSize: 12,
      fontWeight: "600",
      color: colors.error,
      marginLeft: 4,
      textTransform: "uppercase",
    },
    durationCard: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 12,
      backgroundColor: colors.primary + "15",
      marginTop: 16,
    },
    durationText: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.primary,
      marginLeft: 8,
    },
    section: {
      margin: 16,
      marginTop: 0,
    },
    sectionCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 20,
      marginBottom: 16,
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
    commentText: {
      fontSize: 14,
      color: colors.text,
      lineHeight: 20,
    },
    attachmentsList: {
      gap: 12,
    },
    attachmentItem: {
      flexDirection: "row",
      alignItems: "center",
      padding: 12,
      borderRadius: 8,
      backgroundColor: colors.backgroundSecondary,
      borderWidth: 1,
      borderColor: colors.border,
    },
    attachmentIcon: {
      width: 40,
      height: 40,
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 12,
      backgroundColor: colors.primary + "15",
    },
    attachmentInfo: {
      flex: 1,
    },
    attachmentName: {
      fontSize: 14,
      fontWeight: "500",
      color: colors.text,
      marginBottom: 2,
    },
    attachmentSize: {
      fontSize: 12,
      color: colors.textSecondary,
    },
    downloadButton: {
      padding: 8,
      borderRadius: 6,
      backgroundColor: colors.primary + "15",
    },
    actionsSection: {
      margin: 16,
      marginTop: 0,
    },
    actionsGrid: {
      flexDirection: "row",
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
    },
    deleteButton: {
      backgroundColor: colors.error + "15",
    },
    actionIcon: {
      marginRight: 8,
    },
    actionText: {
      fontSize: 14,
      fontWeight: "600",
    },
    deleteActionText: {
      color: colors.error,
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
          title="Détails demande"
        />
      </Animated.View>

      {/* Content */}
      <Animated.View style={[styles.content, { opacity: contentAnim }]}>
        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header Section */}
          <View style={styles.headerSection}>
            <View style={styles.headerTop}>
              <View style={styles.typeIcon}>
                <FontAwesome
                  name={typeConfig.icon as any}
                  size={24}
                  color={typeConfig.color}
                />
              </View>

              <View style={styles.headerInfo}>
                <Text style={styles.title}>{selectedDemande.title}</Text>
                <Text style={styles.typeLabel}>{typeConfig.label}</Text>
                <Text style={styles.dates}>
                  Du {formatDate(selectedDemande.startDate)} au{" "}
                  {formatDate(selectedDemande.endDate)}
                </Text>
              </View>

              <View style={styles.statusBadge}>
                <View style={styles.statusRow}>
                  <FontAwesome
                    name={statusConfig.icon as any}
                    size={14}
                    color={statusConfig.color}
                  />
                  <Text style={styles.statusText}>{statusConfig.label}</Text>
                </View>
              </View>
            </View>

            <ConditionalComponent isValid={!!selectedDemande.isUrgent}>
              <View style={styles.urgentBadge}>
                <FontAwesome
                  name="exclamation-triangle"
                  size={12}
                  color={colors.error}
                />
                <Text style={styles.urgentText}>Demande urgente</Text>
              </View>
            </ConditionalComponent>

            <View style={styles.durationCard}>
              <FontAwesome name="clock-o" size={16} color={colors.primary} />
              <Text style={styles.durationText}>
                {calculateDuration()} jour{calculateDuration() > 1 ? "s" : ""}{" "}
                demandé{calculateDuration() > 1 ? "s" : ""}
              </Text>
            </View>
          </View>

          {/* Details Section */}
          <View style={styles.section}>
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Informations</Text>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Demandé le</Text>
                <Text style={styles.detailValue}>
                  {formatDateTime(selectedDemande.requestDate)}
                </Text>
              </View>

              <ConditionalComponent isValid={!!selectedDemande.processedDate}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Traité le</Text>
                  <Text style={styles.detailValue}>
                    {selectedDemande.processedDate &&
                      formatDateTime(selectedDemande.processedDate)}
                  </Text>
                </View>
              </ConditionalComponent>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Durée</Text>
                <Text style={styles.detailValue}>
                  {calculateDuration()} jour{calculateDuration() > 1 ? "s" : ""}
                </Text>
              </View>

              <View style={[styles.detailRow, styles.lastDetailRow]}>
                <Text style={styles.detailLabel}>Statut</Text>
                <Text
                  style={[styles.detailValue, { color: statusConfig.color }]}
                >
                  {statusConfig.label}
                </Text>
              </View>
            </View>

            {/* Description */}
            <ConditionalComponent isValid={!!selectedDemande.description}>
              <View style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>Description</Text>
                <Text style={styles.commentText}>
                  {selectedDemande.description}
                </Text>
              </View>
            </ConditionalComponent>

            {/* Employee Comment */}
            <ConditionalComponent isValid={!!selectedDemande.employeeComment}>
              <View style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>Motif / Commentaire</Text>
                <Text style={styles.commentText}>
                  {selectedDemande.employeeComment}
                </Text>
              </View>
            </ConditionalComponent>

            {/* Manager Comment */}
            <ConditionalComponent isValid={!!selectedDemande.managerComment}>
              <View style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>
                  Commentaire{" "}
                  {selectedDemande.status === "accepted"
                    ? "d'approbation"
                    : "de refus"}
                </Text>
                <Text style={styles.commentText}>
                  {selectedDemande.managerComment}
                </Text>
              </View>
            </ConditionalComponent>

            {/* Attachments */}
            <ConditionalComponent
              isValid={selectedDemande.attachments.length > 0}
            >
              <View style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>
                  Pièces jointes ({selectedDemande.attachments.length})
                </Text>

                <View style={styles.attachmentsList}>
                  {selectedDemande.attachments.map((attachment, index) => (
                    <View key={attachment.id} style={styles.attachmentItem}>
                      <View style={styles.attachmentIcon}>
                        <FontAwesome
                          name={getFileIcon(attachment.mimeType) as any}
                          size={16}
                          color={colors.primary}
                        />
                      </View>

                      <View style={styles.attachmentInfo}>
                        <Text style={styles.attachmentName} numberOfLines={1}>
                          {attachment.name}
                        </Text>
                        <Text style={styles.attachmentSize}>
                          {formatFileSize(attachment.size)}
                        </Text>
                      </View>

                      <TouchableOpacity
                        style={styles.downloadButton}
                        onPress={() => handleDownloadAttachment(attachment)}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      >
                        <FontAwesome
                          name="download"
                          size={14}
                          color={colors.primary}
                        />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </View>
            </ConditionalComponent>
          </View>

          {/* Actions */}
          <ConditionalComponent isValid={selectedDemande.status === "pending"}>
            <View style={styles.actionsSection}>
              <View style={styles.actionsGrid}>
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
                  <Text style={[styles.actionText, styles.deleteActionText]}>
                    Supprimer
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ConditionalComponent>
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
};
