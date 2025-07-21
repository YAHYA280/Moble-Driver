import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { Platform, StyleSheet, Text, View, ViewStyle } from "react-native";
import { useThemeColors } from "../../../../hooks/useTheme";
import ConditionalComponent from "../../../../shared/components/conditionalComponent/conditionalComponent";
import { Incident } from "../../../../shared/types/incident";

interface Comment {
  id: string;
  author: string;
  role: "reporter" | "support" | "agent";
  content: string;
  timestamp: string;
  isResponse?: boolean;
}

interface IncidentCommentsSectionProps {
  incident: Incident;
  style?: ViewStyle;
}

export const IncidentCommentsSection: React.FC<
  IncidentCommentsSectionProps
> = ({ incident, style }) => {
  const colors = useThemeColors();

  // Mock comments data based on incident status - Filter out reporter comments
  const getCommentsForIncident = (incident: Incident): Comment[] => {
    const baseComments: Comment[] = [];

    // Add support/agent responses based on status
    if (incident.status === "En Cours") {
      baseComments.push({
        id: "2",
        author: "Support VSN",
        role: "support",
        content:
          "Votre signalement a été reçu et transmis à notre équipe technique. Un technicien va examiner le véhicule dans les plus brefs délais.",
        timestamp: incident.reportDate,
        isResponse: true,
      });
    } else if (incident.status === "Résolu") {
      baseComments.push(
        {
          id: "2",
          author: "Support VSN",
          role: "support",
          content:
            "Votre signalement a été reçu et transmis à notre équipe technique. Un technicien va examiner le véhicule dans les plus brefs délais.",
          timestamp: incident.reportDate,
          isResponse: true,
        },
        {
          id: "3",
          author: "Technicien Ahmed M.",
          role: "agent",
          content:
            "J'ai inspecté le véhicule. Le problème venait d'un dysfonctionnement du moteur du tapis roulant. J'ai procédé au remplacement de la pièce défectueuse et effectué les tests nécessaires. Le système fonctionne maintenant correctement.",
          timestamp: incident.resolvedDate || incident.reportDate,
          isResponse: true,
        },
        {
          id: "4",
          author: "Support VSN",
          role: "support",
          content:
            "L'intervention a été effectuée avec succès. Le véhicule est de nouveau opérationnel. Merci pour votre signalement qui nous aide à maintenir la qualité de notre service.",
          timestamp: incident.resolvedDate || incident.reportDate,
          isResponse: true,
        }
      );
    }

    return baseComments;
  };

  const getRoleConfig = (role: Comment["role"]) => {
    switch (role) {
      case "support":
        return {
          color: colors.info,
          backgroundColor: colors.info + "15",
          icon: "headphones" as const,
          label: "Support VSN",
        };
      case "agent":
        return {
          color: colors.success,
          backgroundColor: colors.success + "15",
          icon: "wrench" as const,
          label: "Technicien",
        };
      default:
        return {
          color: colors.primary,
          backgroundColor: colors.primary + "15",
          icon: "user" as const,
          label: "Signalement initial",
        };
    }
  };

  const comments = getCommentsForIncident(incident);

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 20,
      marginHorizontal: 16,
      marginBottom: 12,
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
    header: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 20,
    },
    headerIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: colors.primary + "15",
      alignItems: "center",
      justifyContent: "center",
      marginRight: 16,
    },
    headerContent: {
      flex: 1,
    },
    title: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 4,
    },
    subtitle: {
      fontSize: 14,
      color: colors.textSecondary,
      fontWeight: "500",
    },
    commentsContainer: {
      gap: 16,
    },
    commentCard: {
      backgroundColor: colors.backgroundSecondary,
      borderRadius: 12,
      padding: 16,
      borderLeftWidth: 4,
    },
    commentHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
    },
    commentAvatar: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 12,
    },
    commentMeta: {
      flex: 1,
    },
    commentAuthor: {
      fontSize: 15,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 2,
    },
    commentRole: {
      fontSize: 12,
      fontWeight: "500",
    },
    commentTimestamp: {
      fontSize: 12,
      color: colors.textTertiary,
      fontWeight: "400",
    },
    commentContent: {
      fontSize: 15,
      lineHeight: 22,
      color: colors.textSecondary,
    },
    noResponseCard: {
      backgroundColor: colors.warning + "10",
      borderRadius: 12,
      padding: 16,
      borderLeftWidth: 4,
      borderLeftColor: colors.warning,
      alignItems: "center",
    },
    noResponseIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: colors.warning + "20",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 12,
    },
    noResponseTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 8,
      textAlign: "center",
    },
    noResponseText: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: "center",
      lineHeight: 20,
    },
  });

  const hasAgentResponse = comments.some((comment) => comment.role === "agent");

  return (
    <View style={[styles.container, style]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <FontAwesome name="comments" size={20} color={colors.primary} />
        </View>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Commentaires et suivi</Text>
          <Text style={styles.subtitle}>
            {comments.length}{" "}
            {comments.length === 1 ? "commentaire" : "commentaires"}
          </Text>
        </View>
      </View>

      {/* Comments */}
      <View style={styles.commentsContainer}>
        {comments.map((comment) => {
          const roleConfig = getRoleConfig(comment.role);
          return (
            <View
              key={comment.id}
              style={[
                styles.commentCard,
                { borderLeftColor: roleConfig.color },
              ]}
            >
              <View style={styles.commentHeader}>
                <View
                  style={[
                    styles.commentAvatar,
                    { backgroundColor: roleConfig.backgroundColor },
                  ]}
                >
                  <FontAwesome
                    name={roleConfig.icon}
                    size={14}
                    color={roleConfig.color}
                  />
                </View>
                <View style={styles.commentMeta}>
                  <Text style={styles.commentAuthor}>{comment.author}</Text>
                  <Text
                    style={[styles.commentRole, { color: roleConfig.color }]}
                  >
                    {roleConfig.label}
                  </Text>
                </View>
                <Text style={styles.commentTimestamp}>{comment.timestamp}</Text>
              </View>
              <Text style={styles.commentContent}>{comment.content}</Text>
            </View>
          );
        })}

        {/* No agent response message for pending incidents */}
        <ConditionalComponent
          isValid={incident.status === "En attente" && !hasAgentResponse}
        >
          <View style={styles.noResponseCard}>
            <View style={styles.noResponseIcon}>
              <FontAwesome name="clock-o" size={20} color={colors.warning} />
            </View>
            <Text style={styles.noResponseTitle}>En attente de traitement</Text>
            <Text style={styles.noResponseText}>
              Votre incident n&apos;a pas encore été traité par notre équipe
              technique. Nous vous tiendrons informé dès qu&apos;une action sera
              entreprise.
            </Text>
          </View>
        </ConditionalComponent>
      </View>
    </View>
  );
};
