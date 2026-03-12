/**
 * TextField — local copy of @alumable/ui-mobile TextField
 * Label is always displayed above the input field.
 * Supports: outlined/filled variants, leadingIcon, trailingIcon, multiline, error, disabled.
 * Disabled state only affects the input container, NOT the label.
 */
import * as React from 'react'
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  type TextInputProps,
  type ViewStyle,
} from 'react-native'
import { colors, borderRadius as m3Radius } from '../theme/colors'

const m3Spacing: Record<number, number> = { 1: 4, 2: 8, 3: 12, 4: 16, 5: 20, 6: 24 }

export interface TextFieldProps extends Omit<TextInputProps, 'style'> {
  label?: string
  supportingText?: string
  error?: boolean
  errorText?: string
  leadingIcon?: React.ReactNode
  trailingIcon?: React.ReactNode
  multiline?: boolean
  numberOfLines?: number
  variant?: 'filled' | 'outlined'
  disabled?: boolean
  style?: ViewStyle
}

export function TextField({
  label,
  supportingText,
  error = false,
  errorText,
  leadingIcon,
  trailingIcon,
  multiline = false,
  numberOfLines = 4,
  variant = 'filled',
  disabled = false,
  style,
  value,
  defaultValue,
  onFocus,
  onBlur,
  placeholder,
  ...props
}: TextFieldProps) {
  const [isFocused, setIsFocused] = React.useState(false)

  const handleFocus = (e: any) => {
    setIsFocused(true)
    onFocus?.(e)
  }

  const handleBlur = (e: any) => {
    setIsFocused(false)
    onBlur?.(e)
  }

  const borderColor = error
    ? colors.error
    : isFocused
      ? colors.primary
      : disabled
        ? `${colors.onSurface}1F`
        : colors.outline

  const helperText = error ? errorText : supportingText

  return (
    <View style={[styles.root, style]}>
      {label && (
        <Text style={[styles.label, { color: error ? colors.error : colors.onSurfaceVariant }]}>
          {label}
        </Text>
      )}
      <View
        style={[
          styles.container,
          variant === 'filled' && styles.containerFilled,
          variant === 'outlined' && styles.containerOutlined,
          variant === 'outlined' && { borderColor, borderWidth: isFocused ? 2 : 1 },
          variant === 'filled' && { borderBottomColor: borderColor, borderBottomWidth: isFocused ? 2 : 1 },
          disabled && styles.containerDisabled,
        ]}
      >
        {leadingIcon && (
          <View style={[styles.leadingIcon, multiline && { paddingTop: m3Spacing[3] }]}>
            {leadingIcon}
          </View>
        )}
        <TextInput
          value={value}
          defaultValue={defaultValue}
          editable={!disabled}
          multiline={multiline}
          numberOfLines={multiline ? numberOfLines : 1}
          placeholder={placeholder}
          placeholderTextColor={`${colors.onSurfaceVariant}99`}
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={[
            styles.input,
            multiline && styles.inputMultiline,
            disabled && styles.inputDisabled,
            leadingIcon ? { paddingLeft: 0 } : undefined,
            trailingIcon ? { paddingRight: 0 } : undefined,
          ]}
          accessibilityLabel={label}
          accessibilityState={{ disabled }}
          {...props}
        />
        {!multiline && trailingIcon && (
          <View style={styles.trailingIcon}>{trailingIcon}</View>
        )}
      </View>
      {helperText ? (
        <Text style={[styles.helperText, error && styles.helperTextError]}>
          {helperText}
        </Text>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    width: '100%',
  },
  label: {
    fontSize: 14,
    color: colors.onSurfaceVariant,
    marginBottom: 6,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 40,
  },
  containerFilled: {
    backgroundColor: colors.surfaceContainerHighest,
    borderTopLeftRadius: m3Radius.sm,
    borderTopRightRadius: m3Radius.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.onSurfaceVariant,
  },
  containerOutlined: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.outline,
    borderRadius: m3Radius.sm,
  },
  containerDisabled: {
    opacity: 0.38,
  },
  leadingIcon: {
    paddingLeft: m3Spacing[3],
    justifyContent: 'center',
  },
  trailingIcon: {
    paddingRight: m3Spacing[3],
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.onSurface,
    paddingHorizontal: m3Spacing[3],
    minHeight: 40,
    outlineStyle: 'none',
  } as any,
  inputMultiline: {
    minHeight: 100,
    textAlignVertical: 'top',
    paddingTop: m3Spacing[3],
    paddingBottom: m3Spacing[3],
  },
  inputDisabled: {
    color: `${colors.onSurface}61`,
  },
  helperText: {
    fontSize: 12,
    color: colors.onSurfaceVariant,
    paddingHorizontal: m3Spacing[4],
    marginTop: m3Spacing[1],
  },
  helperTextError: {
    color: colors.error,
  },
})
