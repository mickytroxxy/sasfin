import { Colors } from '@/constants/Colors';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useColorScheme } from '@/hooks/useColorScheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    InterRegular: require('../assets/fonts/Inter-Regular.ttf'),
    InterBold: require('../assets/fonts/Inter-Bold.ttf'),
    MontiLight:require('../assets/fonts/MontserratAlternates-Light.otf'),
    MontiBold:require('../assets/fonts/MontserratAlternates-Bold.otf')
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack screenOptions={{
            headerShown: true,
            headerStyle: {
              backgroundColor: Colors.accent,
            },
            headerTintColor: Colors.background,
            headerTitleStyle: {
              fontFamily: 'MontiBold',
              fontSize: 16,
            },
            contentStyle: {
              backgroundColor: Colors.background,
            },
          }}>
            <Stack.Screen
              name="index"
              options={{
                title: 'Finance Hub SA',
              }}
            />
            <Stack.Screen
              name="loan-calculator"
              options={{
                title: 'Loan Calculator',
              }}
            />
            <Stack.Screen
              name="vat-calculator"
              options={{
                title: 'VAT Calculator',
              }}
            />
            <Stack.Screen
              name="article/[id]"
              options={{
                title: 'Article',
              }}
            />
            <Stack.Screen
              name="favorites"
              options={{
                title: 'Favorites'
              }}
            />
            <Stack.Screen
              name="about"
              options={{
                title: 'About'
              }}
            />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="light" backgroundColor={Colors.primary} />
        </ThemeProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
