import articlesData from '@/assets/articles.json';
import { CustomGradient } from '@/components/CustomGradient';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { FlatList, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';

const AnimatedView = Animated.createAnimatedComponent(View);

export default function HomeScreen() {
  const router = useRouter();
  const headerOpacity = useSharedValue(0);
  const cardsTranslateY = useSharedValue(50);

  useEffect(() => {
    headerOpacity.value = withTiming(1, { duration: 1000 });
    cardsTranslateY.value = withDelay(500, withTiming(0, { duration: 800 }));
  }, []);

  const cardsAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: cardsTranslateY.value }],
  }));

  const renderArticle = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.articleCard}
      onPress={() => router.push(`/article/${item.id}`)}
    >
      <CustomGradient
        colors={[Colors.primary, Colors.accent]}
        style={styles.articleGradient}
      >
        <ThemedText style={[styles.articleTitle, { fontFamily: 'MontiBold' }]}>{item.title}</ThemedText>
        <ThemedText style={[styles.articleExcerpt, { fontFamily: 'MontiLight' }]}>{item.excerpt}</ThemedText>
        <ThemedText style={[styles.articleTimestamp, { fontFamily: 'MontiLight' }]}>
          {new Date(item.timestamp).toLocaleDateString()}
        </ThemedText>
      </CustomGradient>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <AnimatedView>
          <ThemedText style={[styles.welcomeSubtitle, { fontFamily: 'MontiLight' }]}>Your Personal Finance Companion</ThemedText>
        </AnimatedView>

        <AnimatedView style={[styles.quickActions, cardsAnimatedStyle]}>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push('/loan-calculator')}
          >
            <CustomGradient
              colors={[Colors.accent, Colors.primary]}
              style={styles.cardGradient}
            >
              <ThemedText style={[styles.cardTitle, { fontFamily: 'MontiBold' }]}>Loan Calculator</ThemedText>
              <ThemedText style={[styles.cardSubtitle, { fontFamily: 'MontiLight' }]}>Calculate repayments</ThemedText>
              <Ionicons name='calculator' color={Colors.background} size={36} />
            </CustomGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push('/vat-calculator')}
          >
            <CustomGradient
              colors={[Colors.accent, Colors.primary]}
              style={styles.cardGradient}
            >
              <ThemedText style={[styles.cardTitle, { fontFamily: 'MontiBold' }]}>Tax & Vat Calculator</ThemedText>
              <ThemedText style={[styles.cardSubtitle, { fontFamily: 'MontiLight' }]}>South African rates</ThemedText>
              <Ionicons name='calculator-outline' color={Colors.background} size={36} />
            </CustomGradient>
          </TouchableOpacity>
        </AnimatedView>

        <ThemedView style={styles.articlesSection}>
          <ThemedText style={styles.sectionTitle}>Latest Articles</ThemedText>
          <FlatList
            data={articlesData}
            renderItem={renderArticle}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
          />
        </ThemedView>
      </ScrollView>

      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => router.push('/favorites')}
      >
        <CustomGradient
          colors={[Colors.accent, Colors.primary]}
          style={styles.floatingGradient}
        >
          <ThemedText style={styles.floatingIcon}>❤️</ThemedText>
        </CustomGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContainer: {
    flex: 1,
    padding:16
  },
  welcomeSection: {
    marginBottom: 20,
    backgroundColor: Colors.secondary,
    borderRadius: 15,
  },
  welcomeContent: {
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: 24,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 10,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: Colors.textLight,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    marginTop:15
  },
  actionCard: {
    width: '49%',
    height: 150,
    borderRadius: 5,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
  },
  cardTitle: {
    fontSize: 14,
    color: Colors.background,
    textAlign: 'center',
    fontFamily:'MontiBold'
  },
  cardSubtitle: {
    fontSize: 14,
    color: Colors.background,
    textAlign: 'center',
    marginTop: 5,
  },
  articlesSection: {
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 15,
    color: Colors.text,
    fontFamily: 'MontiBold',
  },
  articleCard: {
    marginBottom: 15,
    borderRadius: 5,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  articleGradient: {
    padding: 20,
  },
  articleTitle: {
    fontSize: 14,
    color: Colors.background,
    marginBottom: 10,
    borderBottomWidth:0.7,
    borderBottomColor:Colors.background,
    paddingBottom:6
  },
  articleExcerpt: {
    fontSize: 14,
    color: Colors.background,
    lineHeight: 20,
    marginBottom: 10,
  },
  articleTimestamp: {
    fontSize: 12,
    color: Colors.background,
    opacity: 0.8,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  floatingGradient: {
    flex: 1,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  floatingIcon: {
    fontSize: 24,
  },
});