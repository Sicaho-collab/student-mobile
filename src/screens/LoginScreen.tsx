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
import { useAuth } from '../context/AuthContext'
import type { AuthStackParamList } from '../../App'

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

export default function LoginScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>()
  const { signIn } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [touched, setTouched] = useState({ email: false, password: false })

  const emailError = touched.email ? validateEmail(email) : null
  const passwordError = touched.password ? validatePassword(password) : null
  const isValid = !validateEmail(email) && !validatePassword(password)

  const handleBlur = useCallback((field: 'email' | 'password') => {
    setTouched(prev => ({ ...prev, [field]: true }))
  }, [])

  const handleSubmit = async () => {
    setTouched({ email: true, password: true })
    if (!isValid) return

    setIsLoading(true)
    setServerError(null)

    try {
      await signIn(email.toLowerCase(), password)
    } catch {
      setServerError('Invalid email or password.')
      setPassword('')
      setTouched(prev => ({ ...prev, password: false }))
    } finally {
      setIsLoading(false)
    }
  }

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
          <Text style={styles.heading}>Welcome Back</Text>
          <Text style={styles.subheading}>Log in to your account</Text>

          {/* Error Banner */}
          {serverError && (
            <View style={styles.errorBanner}>
              <Ionicons name="alert-circle" size={20} color={colors.onErrorContainer} />
              <Text style={styles.errorBannerText}>{serverError}</Text>
            </View>
          )}

          {/* Form Card */}
          <View style={styles.card}>
            {/* Email */}
            <TextField
              variant="outlined"
              label="Email"
              value={email}
              onChangeText={v => { setEmail(v); setServerError(null) }}
              onBlur={() => handleBlur('email')}
              placeholder="you@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              disabled={isLoading}
              error={!!emailError}
              errorText={emailError ?? undefined}
            />

            {/* Password */}
            <TextField
              variant="outlined"
              label="Password"
              value={password}
              onChangeText={v => { setPassword(v); setServerError(null) }}
              onBlur={() => handleBlur('password')}
              placeholder="Enter password"
              secureTextEntry={!showPassword}
              autoComplete="password"
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

            {/* Forgot Password */}
            <TouchableOpacity
              style={styles.forgotRow}
              onPress={() => navigation.navigate('ForgotPassword')}
            >
              <Text style={styles.linkText}>Forgot Password?</Text>
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
                <Text style={styles.buttonText}>Log In</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
              <Text style={styles.linkText}>Sign Up</Text>
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
    borderColor: `${colors.outlineVariant}99`,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    borderRadius: borderRadius.md,
    padding: 20,
    gap: 16,
  },
  forgotRow: {
    alignSelf: 'flex-end',
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
