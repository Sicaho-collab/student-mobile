import React from 'react'
import { StatusBar } from 'expo-status-bar'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { StyleSheet } from 'react-native'
import { colors } from './src/theme/colors'
import { AuthProvider, useAuth } from './src/context/AuthContext'
import TabNavigator from './src/navigation/TabNavigator'
import GigDetailScreen from './src/screens/GigDetailScreen'
import ApplyScreen from './src/screens/ApplyScreen'
import LoginScreen from './src/screens/LoginScreen'
import SignUpScreen from './src/screens/SignUpScreen'
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen'

export type AuthStackParamList = {
  Login: undefined
  SignUp: undefined
  ForgotPassword: undefined
}

export type RootStackParamList = {
  Main: undefined
  GigDetail: { gigId: string }
  Apply: { gigId: string }
}

const AuthStack = createNativeStackNavigator<AuthStackParamList>()
const RootStack = createNativeStackNavigator<RootStackParamList>()

function AuthNavigator() {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.surface },
      }}
    >
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="SignUp" component={SignUpScreen} />
      <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </AuthStack.Navigator>
  )
}

function AppNavigator() {
  return (
    <RootStack.Navigator
      screenOptions={{
        headerTintColor: colors.primary,
        headerStyle: { backgroundColor: colors.surface },
        headerTitleStyle: {
          color: colors.onSurface,
          fontWeight: '600',
        },
      }}
    >
      <RootStack.Screen
        name="Main"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="GigDetail"
        component={GigDetailScreen}
        options={{
          title: 'Gig Details',
          headerBackTitle: 'Back',
        }}
      />
      <RootStack.Screen
        name="Apply"
        component={ApplyScreen}
        options={{
          title: 'Apply',
          headerBackTitle: 'Back',
        }}
      />
    </RootStack.Navigator>
  )
}

function RootNavigator() {
  const { isAuthenticated } = useAuth()

  return isAuthenticated ? <AppNavigator /> : <AuthNavigator />
}

export default function App() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <AuthProvider>
        <NavigationContainer>
          <StatusBar style="dark" />
          <RootNavigator />
        </NavigationContainer>
      </AuthProvider>
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
})
