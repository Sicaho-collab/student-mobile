import React from 'react'
import { View, ScrollView, StyleSheet } from 'react-native'
import ChipButton from './ChipButton'
import { CAPABILITY_OPTIONS, type LocationFilter, type SortOption } from '../types/gig'
import { colors } from '../theme/colors'

interface FilterBarProps {
  locationFilter: LocationFilter | null
  onLocationFilterChange: (filter: LocationFilter | null) => void
  capabilityFilters: string[]
  onCapabilityFiltersChange: (filters: string[]) => void
  sortOption: SortOption
  onSortChange: (sort: SortOption) => void
}

const LOCATION_OPTIONS: { value: LocationFilter; label: string }[] = [
  { value: 'remote', label: 'Remote' },
  { value: 'on-site', label: 'On-Site' },
  { value: 'hybrid', label: 'Hybrid' },
]

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Newest' },
  { value: 'highest-pay', label: 'Highest Pay' },
  { value: 'deadline', label: 'Deadline' },
]

export default function FilterBar({
  locationFilter,
  onLocationFilterChange,
  capabilityFilters,
  onCapabilityFiltersChange,
  sortOption,
  onSortChange,
}: FilterBarProps) {
  function toggleLocation(value: LocationFilter) {
    onLocationFilterChange(locationFilter === value ? null : value)
  }

  function toggleCapability(cap: string) {
    if (capabilityFilters.includes(cap)) {
      onCapabilityFiltersChange(capabilityFilters.filter(c => c !== cap))
    } else {
      onCapabilityFiltersChange([...capabilityFilters, cap])
    }
  }

  return (
    <View style={styles.container}>
      {/* Sort chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipRow}
      >
        {SORT_OPTIONS.map(({ value, label }) => (
          <ChipButton
            key={value}
            label={label}
            selected={sortOption === value}
            onPress={() => onSortChange(value)}
          />
        ))}
      </ScrollView>

      {/* Location filter chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipRow}
      >
        {LOCATION_OPTIONS.map(({ value, label }) => (
          <ChipButton
            key={value}
            label={label}
            selected={locationFilter === value}
            onPress={() => toggleLocation(value)}
          />
        ))}
      </ScrollView>

      {/* Capability filter chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipRow}
      >
        {CAPABILITY_OPTIONS.map(cap => (
          <ChipButton
            key={cap}
            label={cap}
            selected={capabilityFilters.includes(cap)}
            onPress={() => toggleCapability(cap)}
          />
        ))}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  chipRow: {
    flexDirection: 'row',
    gap: 8,
    paddingBottom: 2,
  },
})
