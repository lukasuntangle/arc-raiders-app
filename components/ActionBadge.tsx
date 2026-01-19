import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Colors from '@/constants/Colors';
import { useColorScheme } from './useColorScheme';

interface ActionBadgeProps {
  action: 'sell' | 'recycle' | 'keep';
  size?: 'small' | 'medium' | 'large';
}

export function ActionBadge({ action, size = 'medium' }: ActionBadgeProps) {
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];
  const actionColor = colors[action];

  const getActionLabel = () => {
    switch (action) {
      case 'sell':
        return 'SELL';
      case 'recycle':
        return 'RECYCLE';
      case 'keep':
        return 'KEEP';
    }
  };

  const getActionIcon = (): React.ComponentProps<typeof FontAwesome>['name'] => {
    switch (action) {
      case 'sell':
        return 'dollar';
      case 'recycle':
        return 'recycle';
      case 'keep':
        return 'lock';
    }
  };

  const getDescription = () => {
    switch (action) {
      case 'sell':
        return 'Safe to sell for credits';
      case 'recycle':
        return 'Recycle for useful components';
      case 'keep':
        return 'Keep for upgrades or quests';
    }
  };

  const sizeStyles = {
    small: {
      container: { paddingHorizontal: 8, paddingVertical: 4 },
      icon: 10,
      text: 10,
    },
    medium: {
      container: { paddingHorizontal: 12, paddingVertical: 6 },
      icon: 14,
      text: 14,
    },
    large: {
      container: { paddingHorizontal: 20, paddingVertical: 12 },
      icon: 18,
      text: 16,
    },
  };

  const currentSize = sizeStyles[size];

  return (
    <View style={styles.wrapper}>
      <View style={[styles.badge, currentSize.container, { backgroundColor: actionColor }]}>
        <FontAwesome name={getActionIcon()} size={currentSize.icon} color="#0D1117" />
        <Text style={[styles.label, { fontSize: currentSize.text }]}>{getActionLabel()}</Text>
      </View>
      {size === 'large' && (
        <Text style={[styles.description, { color: colors.textSecondary }]}>
          {getDescription()}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 6,
    gap: 8,
  },
  label: {
    color: '#0D1117',
    fontWeight: '700',
    letterSpacing: 1,
  },
  description: {
    marginTop: 8,
    fontSize: 13,
  },
});
