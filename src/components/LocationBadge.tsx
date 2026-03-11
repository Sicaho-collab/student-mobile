import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { fontSize, borderRadius } from '../theme/colors'

type LocationType = 'remote' | 'on-site' | 'hybrid'

interface LocationBadgeProps {
  locationType: LocationType
}

const BADGE_CONFIG: Record<LocationType, { bg: string; text: string; label: string }> = {
  remote: { bg: '#DCFCE7', text: '#166534', label: 'Remote' },
  'on-site': { bg: '#DBEAFE', text: '#1E40AF', label: 'On-Site' },
  hybrid: { bg: '#F3E8FF', text: '#6B21A8', label: 'Hybrid' },
}

export default function LocationBadge({ locationType }: LocationBadgeProps) {
  const config = BADGE_CONFIG[locationType]

  return (
    <View style={[styles.badge, { backgroundColor: config.bg }]}>
      <Ionicons name="location-outline" size={12} color={config.text} />
      <Text style={[styles.label, { color: config.text }]}>{config.label}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
    alignSelf: 'flex-start',
  },
  label: {
    fontSize: fontSize.small,
    fontWeight: '600',
  },
})
