import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { colors, fontSize } from '../theme/colors'

export default function ApplicationsScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <Ionicons
          name="document-text-outline"
          size={64}
          color={colors.outlineVariant}
        />
        <Text style={styles.title}>Applications</Text>
        <Text style={styles.subtitle}>Coming soon</Text>
        <Text style={styles.description}>
          Track your gig applications and their status here.
        </Text>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  title: {
    fontSize: fontSize.title,
    fontWeight: '700',
    color: colors.onSurface,
    marginTop: 16,
  },
  subtitle: {
    fontSize: fontSize.subtitle,
    color: colors.primary,
    fontWeight: '500',
    marginTop: 4,
  },
  description: {
    fontSize: fontSize.body,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
})
