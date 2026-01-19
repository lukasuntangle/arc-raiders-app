import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { arcColors } from '@/constants/Colors';

interface GradientTextProps {
  children: string;
  style?: any;
}

export function GradientText({ children, style }: GradientTextProps) {
  return (
    <Text style={[styles.text, { color: arcColors.teal }, style]}>
      {children}
    </Text>
  );
}

// Simple accent bar - single teal color like the game UI
export function AccentBar({ height = 2, width, style }: { height?: number; width?: number | string; style?: any }) {
  return (
    <View
      style={[
        styles.accentBar,
        { height, backgroundColor: arcColors.teal },
        width ? { width } : {},
        style
      ]}
    />
  );
}

const styles = StyleSheet.create({
  text: {
    fontWeight: 'bold',
  },
  accentBar: {
    borderRadius: 1,
  },
});
