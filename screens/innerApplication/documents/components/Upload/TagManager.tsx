import ConditionalComponent from "@/shared/components/conditionalComponent/conditionalComponent";
import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { useThemeColors } from "../../../../../hooks/useTheme";
import { Input } from "../../../../../shared/components/ui/Input";

interface TagManagerProps {
  tags: string[];
  newTag: string;
  onNewTagChange: (tag: string) => void;
  onAddTag: () => void;
  onRemoveTag: (tag: string) => void;
  style?: ViewStyle;
}

export const TagManager: React.FC<TagManagerProps> = ({
  tags,
  newTag,
  onNewTagChange,
  onAddTag,
  onRemoveTag,
  style,
}) => {
  const colors = useThemeColors();

  const handleSubmit = () => {
    onAddTag();
  };

  const styles = StyleSheet.create({
    container: {
      gap: 12,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 8,
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
      borderRadius: 8,
    },
  });

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.sectionTitle}>Tags</Text>

      {/* Tag Input */}
      <Input
        value={newTag}
        onChangeText={onNewTagChange}
        placeholder="Ajouter un tag"
        rightIcon="plus"
        onRightIconPress={onAddTag}
        onSubmitEditing={handleSubmit}
        returnKeyType="done"
      />

      {/* Tags Display */}
      <ConditionalComponent isValid={tags.length > 0}>
        <View style={styles.tagsDisplay}>
          {tags.map((tag) => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
              <TouchableOpacity
                style={styles.tagRemoveButton}
                onPress={() => onRemoveTag(tag)}
                hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
              >
                <FontAwesome name="times" size={12} color={colors.primary} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ConditionalComponent>
    </View>
  );
};
