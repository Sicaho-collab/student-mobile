import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import { Ionicons } from '@expo/vector-icons'
import { colors, fontSize, borderRadius } from '../theme/colors'
import { MOCK_GIGS } from '../types/gig'
import type { RootStackParamList } from '../../App'

type Props = NativeStackScreenProps<RootStackParamList, 'Apply'>

function formatDate(iso: string): string {
  const d = new Date(iso)
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  return `${day}/${month}/${year}`
}

export default function ApplyScreen({ route, navigation }: Props) {
  const { gigId } = route.params
  const gig = MOCK_GIGS.find(g => g.id === gigId)

  const [message, setMessage] = useState('')
  const [messageTouched, setMessageTouched] = useState(false)
  const [availabilityConfirmed, setAvailabilityConfirmed] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState(false)

  if (!gig) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centeredContainer}>
          <Text style={styles.notFoundText}>Gig not found.</Text>
          <Pressable
            style={styles.outlinedButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.outlinedButtonText}>Go Back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    )
  }

  const trimmedMessage = message.trim()
  const isValid =
    trimmedMessage.length > 0 &&
    trimmedMessage.length <= 500 &&
    availabilityConfirmed
  const messageError =
    messageTouched && trimmedMessage.length === 0
      ? 'Please enter a message'
      : undefined
  const isAtMax = message.length >= 500

  function handleMessageChange(val: string) {
    if (val.length <= 500) {
      setMessage(val)
    }
  }

  async function handleSubmit() {
    if (!isValid || isSubmitting) return
    setIsSubmitting(true)
    setError(false)

    try {
      await new Promise<void>(resolve => {
        setTimeout(resolve, 1200)
      })
      setSubmitted(true)
    } catch {
      setError(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.successContainer}>
          <Ionicons
            name="checkmark-circle"
            size={64}
            color={colors.primary}
          />
          <Text style={styles.successTitle}>Application submitted!</Text>
          <Text style={styles.successSubtitle}>
            The employer will review your application. You'll be notified when
            they respond.
          </Text>
          <Pressable
            style={styles.outlinedButton}
            onPress={() => navigation.popToTop()}
          >
            <Text style={styles.outlinedButtonText}>Back to Gigs</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.formTitle}>Apply to this Gig</Text>
        <Text style={styles.gigName}>{gig.title}</Text>

        {/* Cover letter */}
        <View style={styles.inputCard}>
          <Text style={styles.inputLabel}>Message to employer</Text>
          <TextInput
            style={[
              styles.textInput,
              messageError ? styles.textInputError : null,
            ]}
            multiline
            numberOfLines={6}
            placeholder="Tell the employer why you're a great fit for this gig..."
            placeholderTextColor={colors.outline}
            value={message}
            onChangeText={handleMessageChange}
            onBlur={() => setMessageTouched(true)}
            editable={!isSubmitting}
            textAlignVertical="top"
          />
          {messageError && (
            <Text style={styles.errorText}>{messageError}</Text>
          )}
          <Text
            style={[
              styles.charCounter,
              isAtMax && { color: colors.error },
            ]}
          >
            {message.length} / 500
          </Text>
        </View>

        {/* Availability checkbox */}
        <Pressable
          style={styles.checkboxRow}
          onPress={() => {
            if (!isSubmitting) {
              setAvailabilityConfirmed(!availabilityConfirmed)
            }
          }}
        >
          <Ionicons
            name={availabilityConfirmed ? 'checkbox' : 'square-outline'}
            size={24}
            color={
              availabilityConfirmed ? colors.primary : colors.onSurfaceVariant
            }
          />
          <Text style={styles.checkboxLabel}>
            I confirm I am available for the dates listed (
            {formatDate(gig.startDate)} {'\u2013'} {formatDate(gig.endDate)})
          </Text>
        </Pressable>

        {/* Submit button */}
        <Pressable
          style={[
            styles.submitButton,
            (!isValid || isSubmitting) && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={!isValid || isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color={colors.onPrimary} />
          ) : (
            <Text style={styles.submitButtonText}>Submit Application</Text>
          )}
        </Pressable>

        {/* Error state */}
        {error && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorBannerText}>
              Something went wrong. Please try again.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
  },
  formTitle: {
    fontSize: fontSize.subtitle,
    fontWeight: '600',
    color: colors.onSurface,
  },
  gigName: {
    fontSize: fontSize.body,
    color: colors.onSurfaceVariant,
    marginTop: 4,
    marginBottom: 20,
  },
  inputCard: {
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: borderRadius.md,
    padding: 16,
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: fontSize.caption,
    color: colors.onSurfaceVariant,
    marginBottom: 8,
    fontWeight: '500',
  },
  textInput: {
    borderWidth: 1,
    borderColor: colors.outline,
    borderRadius: borderRadius.sm,
    padding: 12,
    fontSize: fontSize.body,
    color: colors.onSurface,
    minHeight: 120,
  },
  textInputError: {
    borderColor: colors.error,
  },
  errorText: {
    fontSize: fontSize.caption,
    color: colors.error,
    marginTop: 4,
  },
  charCounter: {
    fontSize: fontSize.caption,
    color: colors.onSurfaceVariant,
    textAlign: 'right',
    marginTop: 4,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 20,
  },
  checkboxLabel: {
    flex: 1,
    fontSize: fontSize.body,
    color: colors.onSurface,
    lineHeight: 20,
  },
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: 14,
    alignItems: 'center',
    minHeight: 44,
  },
  submitButtonDisabled: {
    backgroundColor: colors.surfaceContainerHigh,
  },
  submitButtonText: {
    fontSize: fontSize.subtitle,
    fontWeight: '600',
    color: colors.onPrimary,
  },
  errorBanner: {
    backgroundColor: colors.errorContainer,
    borderRadius: borderRadius.sm,
    padding: 12,
    marginTop: 12,
  },
  errorBannerText: {
    fontSize: fontSize.body,
    color: colors.onErrorContainer,
  },
  // Success state
  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  successTitle: {
    fontSize: fontSize.title,
    fontWeight: '600',
    color: colors.onSurface,
    marginTop: 16,
  },
  successSubtitle: {
    fontSize: fontSize.body,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  // Shared
  centeredContainer: {
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
