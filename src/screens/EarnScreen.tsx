import React, { useState, useEffect, useMemo } from 'react'
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Pressable,
  StyleSheet,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useNavigation } from '@react-navigation/native'
import { colors, fontSize, borderRadius } from '../theme/colors'
import {
  MOCK_GIGS,
  type StudentGig,
  type SortOption,
  type LocationFilter,
} from '../types/gig'
import GigCard from '../components/GigCard'
import FilterBar from '../components/FilterBar'
import type { RootStackParamList } from '../../App'

export default function EarnScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
  const [loading, setLoading] = useState(true)
  const [gigs, setGigs] = useState<StudentGig[]>([])

  // Filters
  const [locationFilter, setLocationFilter] = useState<LocationFilter | null>(null)
  const [capabilityFilters, setCapabilityFilters] = useState<string[]>([])
  const [sortOption, setSortOption] = useState<SortOption>('newest')

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setGigs(MOCK_GIGS)
      setLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  function clearAllFilters() {
    setLocationFilter(null)
    setCapabilityFilters([])
  }

  // Filter and sort gigs
  const filteredGigs = useMemo(() => {
    let result = [...gigs]

    if (locationFilter) {
      result = result.filter(g => g.locationType === locationFilter)
    }

    if (capabilityFilters.length > 0) {
      result = result.filter(g =>
        capabilityFilters.every(cap => g.capabilities.includes(cap))
      )
    }

    switch (sortOption) {
      case 'newest':
        result.sort(
          (a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime()
        )
        break
      case 'highest-pay':
        result.sort((a, b) => b.studentPayment - a.studentPayment)
        break
      case 'deadline':
        result.sort(
          (a, b) =>
            new Date(a.applicationDeadline).getTime() -
            new Date(b.applicationDeadline).getTime()
        )
        break
    }

    return result
  }, [gigs, locationFilter, capabilityFilters, sortOption])

  function renderSkeletons() {
    return (
      <View style={styles.skeletonContainer}>
        {[1, 2, 3].map(i => (
          <View key={i} style={styles.skeletonCard}>
            <View style={[styles.skeletonLine, { width: '66%', height: 20 }]} />
            <View
              style={[styles.skeletonLine, { width: '33%', height: 12, marginTop: 8 }]}
            />
            <View
              style={[styles.skeletonLine, { width: '100%', height: 12, marginTop: 12 }]}
            />
            <View
              style={[styles.skeletonLine, { width: '75%', height: 12, marginTop: 6 }]}
            />
            <View style={styles.skeletonChipRow}>
              <View style={[styles.skeletonLine, { width: 96, height: 28 }]} />
              <View style={[styles.skeletonLine, { width: 96, height: 28 }]} />
            </View>
            <View
              style={[styles.skeletonLine, { width: '50%', height: 12, marginTop: 8 }]}
            />
          </View>
        ))}
        <ActivityIndicator
          size="large"
          color={colors.primary}
          style={styles.loadingIndicator}
        />
      </View>
    )
  }

  function renderEmpty() {
    if (gigs.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIcon}>
            <Text style={styles.emptyEmoji}>{'📋'}</Text>
          </View>
          <Text style={styles.emptyText}>
            No gigs available right now. Check back soon!
          </Text>
        </View>
      )
    }

    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No gigs match your filters.</Text>
        <Pressable style={styles.clearButton} onPress={clearAllFilters}>
          <Text style={styles.clearButtonText}>Clear all filters</Text>
        </Pressable>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Alumable</Text>
          <Text style={styles.headerSubtitle}>Find your next gig</Text>
        </View>

        {loading ? (
          renderSkeletons()
        ) : (
          <>
            {/* Filters */}
            <View style={styles.filterSection}>
              <FilterBar
                locationFilter={locationFilter}
                onLocationFilterChange={setLocationFilter}
                capabilityFilters={capabilityFilters}
                onCapabilityFiltersChange={setCapabilityFilters}
                sortOption={sortOption}
                onSortChange={setSortOption}
              />
            </View>

            {/* Gig count */}
            {filteredGigs.length > 0 && (
              <Text style={styles.gigCount}>
                {filteredGigs.length} gig{filteredGigs.length !== 1 ? 's' : ''} available
              </Text>
            )}

            {/* Gig list or empty state */}
            {filteredGigs.length === 0 ? (
              renderEmpty()
            ) : (
              <FlatList
                data={filteredGigs}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                  <GigCard
                    gig={item}
                    onPress={() =>
                      navigation.navigate('GigDetail', { gigId: item.id })
                    }
                  />
                )}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
              />
            )}
          </>
        )}
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
    paddingHorizontal: 16,
  },
  header: {
    marginBottom: 12,
    paddingTop: 8,
  },
  headerTitle: {
    fontSize: fontSize.title,
    fontWeight: '700',
    color: colors.onSurface,
  },
  headerSubtitle: {
    fontSize: fontSize.body,
    color: colors.onSurfaceVariant,
    marginTop: 2,
  },
  filterSection: {
    marginBottom: 12,
  },
  gigCount: {
    fontSize: fontSize.caption,
    color: colors.onSurfaceVariant,
    marginBottom: 8,
  },
  listContent: {
    paddingBottom: 24,
  },
  // Skeleton styles
  skeletonContainer: {
    gap: 12,
  },
  skeletonCard: {
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    padding: 16,
  },
  skeletonLine: {
    backgroundColor: colors.surfaceContainerHighest,
    borderRadius: 4,
  },
  skeletonChipRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  loadingIndicator: {
    marginTop: 24,
  },
  // Empty state styles
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.surfaceContainerHighest,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyEmoji: {
    fontSize: 28,
  },
  emptyText: {
    fontSize: fontSize.subtitle,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
  },
  clearButton: {
    marginTop: 12,
    minHeight: 44,
    justifyContent: 'center',
  },
  clearButtonText: {
    fontSize: fontSize.body,
    color: colors.primary,
    fontWeight: '500',
  },
})
