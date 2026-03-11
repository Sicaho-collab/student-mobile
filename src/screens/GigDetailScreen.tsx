import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import { Ionicons } from '@expo/vector-icons'
import { colors, fontSize, borderRadius } from '../theme/colors'
import { MOCK_GIGS, type StudentGig } from '../types/gig'
import type { RootStackParamList } from '../../App'

type Props = NativeStackScreenProps<RootStackParamList, 'GigDetail'>

function formatDate(iso: string): string {
  const d = new Date(iso)
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  return `${day}/${month}/${year}`
}

function postedAgo(iso: string): string {
  const now = new Date()
  const posted = new Date(iso)
  const diffMs = now.getTime() - posted.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  if (diffDays === 0) return 'Posted today'
  if (diffDays === 1) return 'Posted 1 day ago'
  return `Posted ${diffDays} days ago`
}

function businessDaysBetween(start: string, end: string): number {
  const s = new Date(start)
  const e = new Date(end)
  let count = 0
  const current = new Date(s)
  while (current <= e) {
    const day = current.getDay()
    if (day !== 0 && day !== 6) count++
    current.setDate(current.getDate() + 1)
  }
  return count
}

const LOCATION_LABELS: Record<string, string> = {
  remote: 'Remote',
  'on-site': 'On-Site',
  hybrid: 'Hybrid',
}

function KeyValueRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.kvRow}>
      <Text style={styles.kvLabel}>{label}</Text>
      <Text style={styles.kvValue}>{value}</Text>
    </View>
  )
}

function SectionDivider() {
  return <View style={styles.divider} />
}

export default function GigDetailScreen({ route, navigation }: Props) {
  const { gigId } = route.params
  const [loading, setLoading] = useState(true)
  const [gig, setGig] = useState<StudentGig | null>(null)

  useEffect(() => {
    setLoading(true)
    const timer = setTimeout(() => {
      const found = MOCK_GIGS.find(g => g.id === gigId) ?? null
      setGig(found)
      setLoading(false)
    }, 400)
    return () => clearTimeout(timer)
  }, [gigId])

  const deadlinePassed = gig
    ? new Date(gig.applicationDeadline) < new Date()
    : false

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <View style={styles.skeletonHeader}>
            <View style={[styles.skeletonBlock, { width: 40, height: 40, borderRadius: 20 }]} />
            <View style={[styles.skeletonBlock, { width: 96, height: 20 }]} />
          </View>
          <View style={[styles.skeletonBlock, { width: '75%', height: 28, marginTop: 16 }]} />
          <View style={[styles.skeletonBlock, { width: '33%', height: 14, marginTop: 8 }]} />
          <View style={[styles.skeletonBlock, { width: '25%', height: 14, marginTop: 4 }]} />
          <View style={[styles.divider, { marginVertical: 16 }]} />
          <View style={[styles.skeletonBlock, { width: 96, height: 20 }]} />
          <View style={[styles.skeletonBlock, { width: '100%', height: 80, marginTop: 8 }]} />
          <ActivityIndicator
            size="large"
            color={colors.primary}
            style={{ marginTop: 48 }}
          />
        </View>
      </SafeAreaView>
    )
  }

  if (!gig) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.notFoundContainer}>
          <Text style={styles.notFoundText}>
            This gig is no longer available.
          </Text>
          <Pressable
            style={styles.outlinedButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.outlinedButtonText}>Back to Gigs</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    )
  }

  const duration = businessDaysBetween(gig.startDate, gig.endDate)

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title block */}
        <View style={styles.section}>
          <Text style={styles.gigTitle}>{gig.title}</Text>
          <Text style={styles.employerName}>{gig.employerName}</Text>
          <Text style={styles.postedAgo}>{postedAgo(gig.postedAt)}</Text>
        </View>

        <SectionDivider />

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.bodyText}>{gig.description}</Text>
        </View>

        <SectionDivider />

        {/* Capabilities */}
        {gig.capabilities.length > 0 && (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Capabilities</Text>
              <View style={styles.capsRow}>
                {gig.capabilities.map(cap => (
                  <View key={cap} style={styles.capChip}>
                    <Text style={styles.capChipText}>{cap}</Text>
                  </View>
                ))}
              </View>
            </View>
            <SectionDivider />
          </>
        )}

        {/* Timeline */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Timeline</Text>
          <KeyValueRow
            label="Start Date"
            value={`${formatDate(gig.startDate)}${gig.flexibleStart ? ' (flexible)' : ''}`}
          />
          <KeyValueRow
            label="End Date"
            value={`${formatDate(gig.endDate)}${gig.flexibleEnd ? ' (flexible)' : ''}`}
          />
          <KeyValueRow label="Duration" value={`${duration} business days`} />
          {gig.scheduleNotes !== '' && (
            <View style={styles.scheduleNotesContainer}>
              <Text style={styles.scheduleNotesLabel}>Schedule Notes</Text>
              <Text style={styles.scheduleNotesValue}>{gig.scheduleNotes}</Text>
            </View>
          )}
        </View>

        <SectionDivider />

        {/* Pay & Hours */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pay & Hours</Text>
          <KeyValueRow
            label="Student Payment"
            value={`$${gig.studentPayment.toFixed(2)}`}
          />
          <KeyValueRow label="Estimated Hours" value={`${gig.estimatedHours} hours`} />
          <KeyValueRow label="Max Hours" value={`Up to ${gig.maxHours} hours`} />
        </View>

        <SectionDivider />

        {/* Location */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location</Text>
          <KeyValueRow
            label="Type"
            value={LOCATION_LABELS[gig.locationType] || 'Not specified'}
          />
          {(gig.locationType === 'on-site' || gig.locationType === 'hybrid') &&
            gig.locationDetails !== '' && (
              <KeyValueRow label="Details" value={gig.locationDetails} />
            )}
        </View>

        <SectionDivider />

        {/* Application Deadline */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Application Deadline</Text>
          <Text
            style={[
              styles.deadlineValue,
              { color: deadlinePassed ? colors.error : colors.primary },
            ]}
          >
            {deadlinePassed
              ? 'Applications closed'
              : `Apply by ${formatDate(gig.applicationDeadline)}`}
          </Text>
        </View>

        {/* Additional Notes */}
        {gig.additionalNotes !== '' && (
          <>
            <SectionDivider />
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Additional Notes</Text>
              <Text style={styles.bodyText}>{gig.additionalNotes}</Text>
            </View>
          </>
        )}

        {/* Spacer for fixed button */}
        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Fixed Apply Now button */}
      <View style={styles.fixedButtonContainer}>
        <Pressable
          style={[
            styles.applyButton,
            deadlinePassed && styles.applyButtonDisabled,
          ]}
          onPress={() => {
            if (!deadlinePassed) {
              navigation.navigate('Apply', { gigId: gig.id })
            }
          }}
          disabled={deadlinePassed}
        >
          <Text
            style={[
              styles.applyButtonText,
              deadlinePassed && styles.applyButtonTextDisabled,
            ]}
          >
            {deadlinePassed ? 'Applications Closed' : 'Apply Now'}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  loadingContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  skeletonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  skeletonBlock: {
    backgroundColor: colors.surfaceContainerHighest,
    borderRadius: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: fontSize.subtitle,
    fontWeight: '600',
    color: colors.onSurface,
    marginBottom: 8,
  },
  gigTitle: {
    fontSize: fontSize.title,
    fontWeight: '700',
    color: colors.onSurface,
  },
  employerName: {
    fontSize: fontSize.body,
    color: colors.onSurfaceVariant,
    marginTop: 4,
  },
  postedAgo: {
    fontSize: fontSize.caption,
    color: colors.onSurfaceVariant,
    marginTop: 2,
  },
  bodyText: {
    fontSize: fontSize.body,
    color: colors.onSurfaceVariant,
    lineHeight: 20,
  },
  capsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  capChip: {
    backgroundColor: colors.secondaryContainer,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: borderRadius.full,
  },
  capChipText: {
    fontSize: fontSize.caption,
    color: colors.onSecondaryContainer,
  },
  kvRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  kvLabel: {
    fontSize: fontSize.body,
    color: colors.onSurfaceVariant,
    flex: 1,
  },
  kvValue: {
    fontSize: fontSize.body,
    fontWeight: '500',
    color: colors.onSurface,
    flex: 1,
    textAlign: 'right',
  },
  scheduleNotesContainer: {
    paddingTop: 8,
  },
  scheduleNotesLabel: {
    fontSize: fontSize.body,
    color: colors.onSurfaceVariant,
  },
  scheduleNotesValue: {
    fontSize: fontSize.body,
    fontWeight: '500',
    color: colors.onSurface,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.outlineVariant,
    marginBottom: 16,
  },
  deadlineValue: {
    fontSize: fontSize.body,
    fontWeight: '500',
  },
  fixedButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.outlineVariant,
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 24,
  },
  applyButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: 14,
    alignItems: 'center',
    minHeight: 44,
  },
  applyButtonDisabled: {
    backgroundColor: colors.surfaceContainerHigh,
  },
  applyButtonText: {
    fontSize: fontSize.subtitle,
    fontWeight: '600',
    color: colors.onPrimary,
  },
  applyButtonTextDisabled: {
    color: colors.onSurfaceVariant,
  },
  notFoundContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  notFoundText: {
    fontSize: fontSize.subtitle,
    color: colors.onSurfaceVariant,
  },
  outlinedButton: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: colors.outline,
    borderRadius: borderRadius.md,
    paddingHorizontal: 24,
    paddingVertical: 10,
    minHeight: 44,
    justifyContent: 'center',
  },
  outlinedButtonText: {
    fontSize: fontSize.body,
    color: colors.primary,
    fontWeight: '500',
  },
})
