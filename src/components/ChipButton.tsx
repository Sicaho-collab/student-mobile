import React from 'react'
import { Pressable, Text, StyleSheet } from 'react-native'
import { colors, fontSize, borderRadius } from '../theme/colors'

interface ChipButtonProps {
  label: string
  selected: boolean
  onPress: () => void
}

export default function ChipButton({ label, selected, onPress }: ChipButtonProps) {
  return (
    <Pressable
      style={[styles.chip, selected ? styles.chipSelected : styles.chipUnselected]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
    >
      <Text style={[styles.label, selected ? styles.labelSelected : styles.labelUnselected]}>
        {label}
      </Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  chip: {
    minHeight: 36,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chipSelected: {
    backgroundColor: colors.primaryContainer,
  },
  chipUnselected: {
    backgroundColor: colors.surfaceContainerHigh,
  },
  label: {
    fontSize: fontSize.caption,
  },
  labelSelected: {
    color: colors.onPrimaryContainer,
    fontWeight: '600',
  },
  labelUnselected: {
    color: colors.onSurfaceVariant,
  },
})
