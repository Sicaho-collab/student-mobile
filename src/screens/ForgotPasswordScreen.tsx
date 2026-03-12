import React, { useState, useCallback, useEffect, useRef } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  StyleSheet,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useNavigation } from '@react-navigation/native'
import { colors, fontSize, borderRadius } from '../theme/colors'
import { TextField } from '../components/TextField'
import type { AuthStackParamList } from '../../App'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validateEmail(email: string): string | null {
  if (!email) return 'Email is required'
  if (!EMAIL_REGEX.test(email)) return 'Enter a valid email address'
  return null
}

export default function ForgotPasswordScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>()

  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [touched, setTouched] = useState(false)
  const [success, setSuccess] = useState(false)
  const [submittedEmail, setSubmittedEmail] = useState('')

  // Resend cooldown
  const [cooldown, setCooldown] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  const startCooldown = useCallback(() => {
    setCooldown(60)
    timerRef.current = setInterval(() => {
      setCooldown(prev => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }, [])

  const emailError = touched ? validateEmail(email) : null
  const isValid = !validateEmail(email)

  const handleSubmit = async () => {
    setTouched(true)
    if (!isValid) return

    setIsLoading(true)
    setServerError(null)

    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      setSubmittedEmail(email.toLowerCase())
      setSuccess(true)
    } catch {
      setServerError('No account found with that email.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    if (cooldown > 0) return

    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      startCooldown()
    } catch {
      // Silently handle resend errors
    }
  }

  // --- Success state ---
  if (success) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.logoContainer}>
            <Image
              source={require('../../assets/alumable-horizontal.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.heading}>Check Your Email</Text>

          <View style={[styles.card, styles.successCard]}>
            <View style={styles.successIcon}>
              <Ionicons name="mail-outline" size={28} color={colors.onPrimaryContainer} />
            </View>
            <Text style={styles.successBody}>
              We've sent a password reset link to
            </Text>
            <Text style={styles.submittedEmail}>{submittedEmail}</Text>
            <Text style={styles.successBody}>Didn't receive it?</Text>
            <TouchableOpacity
              style={[styles.outlinedButton, cooldown > 0 && styles.buttonDisabled]}
              onPress={handleResend}
              disabled={cooldown > 0}
              activeOpacity={0.8}
            >
              <Text style={[styles.outlinedButtonText, cooldown > 0 && styles.outlinedButtonTextDisabled]}>
                {cooldown > 0 ? `Resend Email (${cooldown}s)` : 'Resend Email'}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.backRow}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.linkText}>Back to Login</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    )
  }

  // --- Form ---
  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo */}
          <View style={styles.logoContainer}>
            <Image
              source={require('../../assets/alumable-horizontal.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          {/* Heading */}
          <Text style={styles.heading}>Forgot Password</Text>
          <Text style={styles.subheading}>Enter your email to receive a reset link</Text>

          {/* Error Banner */}
          {serverError && (
            <View style={styles.errorBanner}>
              <Ionicons name="alert-circle" size={20} color={colors.onErrorContainer} />
              <Text style={styles.errorBannerText}>{serverError}</Text>
            </View>
          )}

          {/* Form Card */}
          <View style={styles.card}>
            <TextField
              variant="outlined"
              label="Email"
              value={email}
              onChangeText={v => { setEmail(v); setServerError(null) }}
              onBlur={() => setTouched(true)}
              placeholder="you@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              disabled={isLoading}
              error={!!emailError}
              errorText={emailError ?? undefined}
            />

            <TouchableOpacity
              style={[styles.button, (!isValid || isLoading) && styles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={!isValid || isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator color={colors.onPrimary} />
              ) : (
                <Text style={styles.buttonText}>Send Reset Link</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Back link */}
          <TouchableOpacity
            style={styles.backRow}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.linkText}>Back to Login</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    height: 40,
    width: 180,
  },
  heading: {
    fontSize: fontSize.title,
    fontWeight: '600',
    color: colors.onSurface,
    textAlign: 'center',
  },
  subheading: {
    fontSize: fontSize.body,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 24,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.errorContainer,
    borderRadius: borderRadius.sm,
    padding: 12,
    marginBottom: 12,
    gap: 10,
  },
  errorBannerText: {
    fontSize: fontSize.body,
    color: colors.onErrorContainer,
    flex: 1,
  },
  card: {
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: borderRadius.md,
    padding: 20,
    gap: 16,
  },
  successCard: {
    alignItems: 'center',
    marginTop: 24,
    paddingVertical: 32,
  },
  successIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  successBody: {
    fontSize: fontSize.body,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
  },
  submittedEmail: {
    fontSize: fontSize.body,
    fontWeight: '600',
    color: colors.onSurface,
    marginVertical: 4,
  },
  outlinedButton: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: borderRadius.sm,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 8,
  },
  outlinedButtonText: {
    fontSize: fontSize.body,
    fontWeight: '500',
    color: colors.primary,
    textAlign: 'center',
  },
  outlinedButtonTextDisabled: {
    color: colors.onSurfaceVariant,
  },
  linkText: {
    fontSize: fontSize.body,
    color: colors.primary,
    fontWeight: '500',
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.sm,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: fontSize.subtitle,
    fontWeight: '600',
    color: colors.onPrimary,
  },
  backRow: {
    alignItems: 'center',
    marginTop: 24,
  },
})
