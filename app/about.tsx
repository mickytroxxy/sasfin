import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

const AnimatedView = Animated.createAnimatedComponent(View);

export default function AboutScreen() {
  const router = useRouter();
  const contentOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(20);

  useEffect(() => {
    contentOpacity.value = withTiming(1, { duration: 800 });
    contentTranslateY.value = withTiming(0, { duration: 800 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ translateY: contentTranslateY.value }],
  }));

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.header}
      >
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ThemedText style={styles.backText}>← Back</ThemedText>
        </TouchableOpacity>
        <ThemedText style={styles.title}>About Finance Hub SA</ThemedText>
      </LinearGradient>

      <AnimatedView style={[styles.content, animatedStyle]}>
        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Our Mission</ThemedText>
          <ThemedText style={styles.sectionText}>
            Finance Hub SA is your comprehensive companion for personal finance management in South Africa.
            We provide easy-to-use tools and educational content to help you make informed financial decisions.
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Features</ThemedText>
          <ThemedText style={styles.bulletPoint}>• Loan Calculator - Calculate monthly repayments and total interest</ThemedText>
          <ThemedText style={styles.bulletPoint}>• VAT Calculator - Add or remove 15% VAT from amounts</ThemedText>
          <ThemedText style={styles.bulletPoint}>• Income Tax Calculator - Estimate tax using SARS 2024/2025 brackets</ThemedText>
          <ThemedText style={styles.bulletPoint}>• Financial Articles - Stay informed with latest news and tips</ThemedText>
          <ThemedText style={styles.bulletPoint}>• Favorites - Save and organize your favorite articles</ThemedText>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Data & Privacy</ThemedText>
          <ThemedText style={styles.sectionText}>
            Your calculations and favorites are stored locally on your device using secure storage.
            We do not collect or transmit any personal data. All information remains private on your device.
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.disclaimer}>
          <ThemedText style={styles.disclaimerTitle}>Important Disclaimer</ThemedText>
          <ThemedText style={styles.disclaimerText}>
            This app provides general finance information for educational purposes only.
            We do not provide loans or financial services. Always consult with qualified financial
            advisors for personalized advice. Tax calculations are estimates based on current
            SARS brackets and may not reflect your individual circumstances.
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.footer}>
          <ThemedText style={styles.footerText}>Version 1.0.0</ThemedText>
          <ThemedText style={styles.footerText}>© 2024 Finance Hub SA</ThemedText>
        </ThemedView>
      </AnimatedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: 50,
  },
  backText: {
    fontSize: 18,
    color: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  content: {
    padding: 20,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  sectionText: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
  },
  bulletPoint: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
    marginBottom: 8,
  },
  disclaimer: {
    backgroundColor: '#fff3cd',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ffeaa7',
  },
  disclaimerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#856404',
    marginBottom: 10,
  },
  disclaimerText: {
    fontSize: 16,
    color: '#856404',
    lineHeight: 24,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
});