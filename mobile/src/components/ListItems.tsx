import React, { memo } from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';

interface CategoryCardProps {
  id: string;
  name: string;
  type: string;
  onPress: (category: { id: string; name: string; type: string }) => void;
}

function CategoryCardComponent({ id, name, type, onPress }: CategoryCardProps) {
  const icons: Record<string, string> = {
    MECHANIC: '🔧',
    TOWING: '🚜',
    EMERGENCY: '🚨',
    INSURANCE: '🛡️',
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress({ id, name, type })}
    >
      <View style={styles.icon}>
        <Text style={styles.emoji}>{icons[type] || '🔧'}</Text>
      </View>
      <Text style={styles.name}>{name}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  icon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  emoji: {
    fontSize: 28,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
  },
});

export const CategoryCard = memo(CategoryCardComponent, (prev, next) => {
  return prev.id === next.id && prev.name === next.name && prev.type === next.type;
});

interface ActionCardProps {
  icon: string;
  text: string;
  onPress: () => void;
}

function ActionCardComponent({ icon, text, onPress }: ActionCardProps) {
  return (
    <TouchableOpacity style={styles.action} onPress={onPress}>
      <Text style={styles.actionIcon}>{icon}</Text>
      <Text style={styles.actionText}>{text}</Text>
    </TouchableOpacity>
  );
}

const actionStyles = StyleSheet.create({
  action: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
  },
});

export const ActionCard = memo(ActionCardComponent, (prev, next) => {
  return prev.icon === next.icon && prev.text === next.text;
});

export default CategoryCard;
