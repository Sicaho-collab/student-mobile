import React from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors, fontSize, borderRadius } from '../theme/colors'
import type { StudentGig } from '../types/gig'

interface GigCardProps {
  gig: StudentGig
  onPress: () => void
}

const CAPABILITY_COLORS: Record<string, { bg: string; text: string }> = {
  'Analytical & Data Thinking': { bg: '#DBEAFE', text: '#1E40AF' },
  'Communication':              { bg: '#FEF3C7', text: '#92400E' },
  'Digital & Technical':        { bg: '#EDE9FE', text: '#5B21B6' },
  'Project & Execution':        { bg: '#D1FAE5', text: '#065F46' },
  'Collaboration':              { bg: '#FCE7F3', text: '#9D174D' },
  'Creative Thinking':          { bg: '#FFEDD5', text: '#9A3412' },
  'Business Insight':           { bg: '#CFFAFE', text: '#155E75' },
  'Leadership':                 { bg: '#FFE4E6', text: '#9F1239' },
}

const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]

function formatDisplayDate(iso: string): string {
  const d = new Date(iso)
  const day = d.getDate()
  const month = MONTH_NAMES[d.getMonth()]
  const year = d.getFullYear()
  return `${day} ${month} ${year}`
}

export default function GigCard({ gig, onPress }: GigCardProps) {
  const [showDisclaimer, setShowDisclaimer] = React.useState(false)

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={gig.title}
    >
      {/* Title */}
      <Text style={styles.title}>{gig.title}</Text>

      {/* Capability tags */}
      {gig.capabilities.length > 0 && (
        <View style={styles.capsRow}>
          {gig.capabilities.map(cap => {
            const capColor = CAPABILITY_COLORS[cap] || { bg: '#E5E7EB', text: '#374151' }
            return (
              <View key={cap} style={[styles.capChip, { backgroundColor: capColor.bg }]}>
                <Text style={[styles.capChipText, { color: capColor.text }]}>{cap}</Text>
              </View>
            )
          })}
        </View>
      )}

      {/* Date range */}
      <Text style={styles.dateRange}>
        {formatDisplayDate(gig.startDate)} {'\u2013'} {formatDisplayDate(gig.endDate)}
      </Text>

      {/* Earnings with info icon */}
      <View style={styles.earningsRow}>
        <Text style={styles.earnings}>
          You will earn: ${gig.studentPayment.toFixed(2)} (incl. super)
        </Text>
        <Pressable
          onPress={() => setShowDisclaimer(prev => !prev)}
          hitSlop={8}
          accessibilityLabel="Earnings disclaimer"
          accessibilityRole="button"
        >
          <Ionicons name="information-circle-outline" size={16} color={colors.onSurfaceVariant} />
        </Pressable>
      </View>

      {showDisclaimer && (
        <Text style={styles.disclaimer}>
          Estimated gross earnings subject to fees and taxes
        </Text>
      )}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: `${colors.outlineVariant}99`,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  cardPressed: {
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  title: {
    fontSize: fontSize.subtitle,
    fontWeight: '600',
    color: colors.onSurface,
  },
  capsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 10,
    alignItems: 'center',
  },
  capChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
  },
  capChipText: {
    fontSize: fontSize.small,
    fontWeight: '500',
  },
  dateRange: {
    fontSize: fontSize.body,
    color: colors.onSurfaceVariant,
    marginTop: 10,
  },
  earnings: {
    fontSize: fontSize.body,
    fontWeight: '700',
    color: colors.onSurface,
  },
  earningsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  disclaimer: {
    fontSize: fontSize.small,
    color: colors.onSurfaceVariant,
    marginTop: 4,
  },
})
