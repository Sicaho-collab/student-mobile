import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import { Ionicons } from '@expo/vector-icons'
import { NavigationBar } from '../components/NavigationBar'
import { colors as m3Colors } from '../theme/colors'
import EarnScreen from '../screens/EarnScreen'
import ApplicationsScreen from '../screens/ApplicationsScreen'
import ProfileScreen from '../screens/ProfileScreen'

export type TabParamList = {
  Earn: undefined
  Applications: undefined
  Profile: undefined
}

const Tab = createBottomTabNavigator<TabParamList>()

const tabConfig = [
  {
    label: 'Earn',
    icon: <Ionicons name="briefcase-outline" size={24} color={m3Colors.onSurfaceVariant} />,
    activeIcon: <Ionicons name="briefcase" size={24} color={m3Colors.onSurface} />,
  },
  {
    label: 'Applications',
    icon: <Ionicons name="document-text-outline" size={24} color={m3Colors.onSurfaceVariant} />,
    activeIcon: <Ionicons name="document-text" size={24} color={m3Colors.onSurface} />,
  },
  {
    label: 'Profile',
    icon: <Ionicons name="person-outline" size={24} color={m3Colors.onSurfaceVariant} />,
    activeIcon: <Ionicons name="person" size={24} color={m3Colors.onSurface} />,
  },
]

function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  return (
    <NavigationBar
      items={tabConfig}
      activeIndex={state.index}
      onSelect={(index) => {
        const route = state.routes[index]
        const isFocused = state.index === index
        if (!isFocused) {
          navigation.navigate(route.name)
        }
      }}
    />
  )
}

export default function TabNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Earn" component={EarnScreen} />
      <Tab.Screen name="Applications" component={ApplicationsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  )
}
