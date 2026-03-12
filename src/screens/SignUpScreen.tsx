import React, { useState, useCallback } from 'react'
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

// --- Validation helpers (matching employer-web/types.ts) ---

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validateEmail(email: string): string | null {
  if (!email) return 'Email is required'
  if (!EMAIL_REGEX.test(email)) return 'Enter a valid email address'
  return null
}

function validatePassword(password: string): string | null {
  if (!password) return 'Password is required'
  if (password.length < 8) return 'Password must be at least 8 characters'
  return null
}

type PasswordStrength = 'weak' | 'fair' | 'good' | 'strong'

interface PasswordStrengthInfo {
  score: PasswordStrength
  fraction: number
  label: string
  color: string
}

function getPasswordStrength(password: string): PasswordStrengthInfo {
  if (password.length < 8) {
    return { score: 'weak', fraction: 0.25, label: 'Weak', color: colors.error }
  }

  const hasUpper = /[A-Z]/.test(password)
  const hasLower = /[a-z]/.test(password)
  const hasNumber = /\d/.test(password)
  const hasSymbol = /[^A-Za-z0-9]/.test(password)
  const hasMixedCase = hasUpper && hasLower

  if (hasMixedCase && hasNumber && hasSymbol) {
    return { score: 'strong', fraction: 1, label: 'Strong', color: colors.primary }
  }
  if (hasMixedCase && hasNumber) {
    return { score: 'good', fraction: 0.75, label: 'Good', color: colors.primary }
  }
  return { score: 'fair', fraction: 0.5, label: 'Fair', color: colors.tertiary }
}

// --- Component ---

interface FormData {
  fullName: string
  email: string
  password: string
  confirmPassword: string
  termsAccepted: boolean
}

type TouchedFields = Record<keyof Omit<FormData, 'termsAccepted'>, boolean>

export default function SignUpScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>()

  const [data, setData] = useState<FormData>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [touched, setTouched] = useState<TouchedFields>({
    fullName: false,
    email: false,
    password: false,
    confirmPassword: false,
  })

  const patch = useCallback((updates: Partial<FormData>) => {
    setData(prev => ({ ...prev, ...updates }))
    setServerError(null)
  }, [])

  const handleBlur = useCallback((field: keyof TouchedFields) => {
    setTouched(prev => ({ ...prev, [field]: true }))
  }, [])

  // Validation
  const fullNameError = touched.fullName
    ? !data.fullName ? 'Full name is required'
    : data.fullName.length < 2 ? 'Name must be at least 2 characters'
    : null
    : null

  const emailError = touched.email ? validateEmail(data.email) : null
  const passwordError = touched.password ? validatePassword(data.password) : null

  const confirmPasswordError = touched.confirmPassword
    ? !data.confirmPassword ? 'Please confirm your password'
    : data.confirmPassword !== data.password ? 'Passwords do not match'
    : null
    : null

  const strength = data.password ? getPasswordStrength(data.password) : null

  const isValid =
    data.fullName.length >= 2 &&
    !validateEmail(data.email) &&
    !validatePassword(data.password) &&
    data.confirmPassword === data.password &&
    data.confirmPassword.length > 0 &&
    data.termsAccepted

  const handleSubmit = async () => {
    setTouched({ fullName: true, email: true, password: true, confirmPassword: true })
    if (!isValid) return

    setIsLoading(true)
    setServerError(null)

    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      setSuccess(true)
    } catch {
      setServerError('An account with this email already exists.')
    } finally {
      setIsLoading(false)
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
          <Text style={styles.heading}>Create Account</Text>

          <View style={[styles.card, styles.successCard]}>
            <View style={styles.successIcon}>
              <Ionicons name="checkmark" size={28} color={colors.onPrimaryContainer} />
            </View>
            <Text style={styles.successTitle}>Account Created</Text>
            <Text style={styles.successBody}>
              Your account has been created successfully. You can now log in.
            </Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('Login')}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>Go to Login</Text>
            </TouchableOpacity>
          </View>
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
          <Text style={styles.heading}>Create Account</Text>
          <Text style={styles.subheading}>Join Alumable today</Text>

          {/* Error Banner */}
          {serverError && (
            <View style={styles.errorBanner}>
              <Ionicons name="alert-circle" size={20} color={colors.onErrorContainer} />
              <Text style={styles.errorBannerText}>{serverError}</Text>
            </View>
          )}

          {/* Form Card */}
          <View style={styles.card}>
            {/* Full Name */}
            <TextField
              variant="outlined"
              label="Full Name"
              value={data.fullName}
              onChangeText={v => patch({ fullName: v })}
              onBlur={() => handleBlur('fullName')}
              placeholder="Your full name"
              autoComplete="name"
              disabled={isLoading}
              error={!!fullNameError}
              errorText={fullNameError ?? undefined}
            />

            {/* Email */}
            <TextField
              variant="outlined"
              label="Email"
              value={data.email}
              onChangeText={v => patch({ email: v })}
              onBlur={() => handleBlur('email')}
              placeholder="you@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              disabled={isLoading}
              error={!!emailError}
              errorText={emailError ?? undefined}
            />

            {/* Password + strength indicator */}
            <View style={{ gap: 6 }}>
              <TextField
                variant="outlined"
                label="Password"
                value={data.password}
                onChangeText={v => patch({ password: v })}
                onBlur={() => handleBlur('password')}
                placeholder="Create a password"
                secureTextEntry={!showPassword}
                autoComplete="password-new"
                disabled={isLoading}
                error={!!passwordError}
                errorText={passwordError ?? undefined}
                trailingIcon={
                  <TouchableOpacity
                    onPress={() => setShowPassword(v => !v)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Ionicons
                      name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                      size={22}
                      color={colors.onSurfaceVariant}
                    />
                  </TouchableOpacity>
                }
              />

              {/* Strength indicator */}
              {strength && (
                <View style={styles.strengthRow}>
                  <View style={styles.strengthTrack}>
                    <View
                      style={[
                        styles.strengthFill,
                        { width: `${strength.fraction * 100}%` as any, backgroundColor: strength.color },
                      ]}
                    />
                  </View>
                  <Text style={styles.strengthLabel}>{strength.label}</Text>
                </View>
              )}
            </View>

            {/* Confirm Password */}
            <TextField
              variant="outlined"
              label="Confirm Password"
              value={data.confirmPassword}
              onChangeText={v => patch({ confirmPassword: v })}
              onBlur={() => handleBlur('confirmPassword')}
              placeholder="Re-enter password"
              secureTextEntry={!showConfirmPassword}
              autoComplete="password-new"
              disabled={isLoading}
              error={!!confirmPasswordError}
              errorText={confirmPasswordError ?? undefined}
              trailingIcon={
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(v => !v)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons
                    name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={22}
                    color={colors.onSurfaceVariant}
                  />
                </TouchableOpacity>
              }
            />

            {/* Terms checkbox */}
            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() => patch({ termsAccepted: !data.termsAccepted })}
              activeOpacity={0.7}
              disabled={isLoading}
            >
              <View style={[styles.checkbox, data.termsAccepted && styles.checkboxChecked]}>
                {data.termsAccepted && (
                  <Ionicons name="checkmark" size={16} color={colors.onPrimary} />
                )}
              </View>
              <Text style={styles.checkboxLabel}>
                I agree to the{' '}
                <Text style={styles.linkText}>Terms & Conditions</Text>
              </Text>
            </TouchableOpacity>

            {/* Submit */}
            <TouchableOpacity
              style={[styles.button, (!isValid || isLoading) && styles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={!isValid || isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator color={colors.onPrimary} />
              ) : (
                <Text style={styles.buttonText}>Create Account</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.linkText}>Log In</Text>
            </TouchableOpacity>
          </View>
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
  successTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.onSurface,
    marginBottom: 8,
  },
  successBody: {
    fontSize: fontSize.body,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    marginBottom: 16,
  },
  strengthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 8,
  },
  strengthTrack: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.surfaceContainerHighest,
    overflow: 'hidden',
  },
  strengthFill: {
    height: 4,
    borderRadius: 2,
  },
  strengthLabel: {
    fontSize: fontSize.caption,
    color: colors.onSurfaceVariant,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.outline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkboxLabel: {
    fontSize: fontSize.body,
    color: colors.onSurface,
    flex: 1,
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    fontSize: fontSize.body,
    color: colors.onSurfaceVariant,
  },
})
