import articlesData from '@/assets/articles.json';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useFinanceStore } from '@/store/financeStore';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';

export default function ArticleDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { favorites, toggleFavorite } = useFinanceStore();

  const [article, setArticle] = useState<any>(null);
  const heartScale = useSharedValue(1);
  const heartOpacity = useSharedValue(1);

  useEffect(() => {
    const foundArticle = articlesData.find((a) => a.id === id);
    setArticle(foundArticle);
  }, [id]);

  const handleFavorite = () => {
    if (article) {
      toggleFavorite(article.id);
      // Animate heart
      heartScale.value = withSequence(
        withTiming(1.5, { duration: 150 }),
        withTiming(1, { duration: 150 })
      );
      heartOpacity.value = withSequence(
        withTiming(0.5, { duration: 150 }),
        withTiming(1, { duration: 150 })
      );
    }
  };

  const heartAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heartScale.value }],
    opacity: heartOpacity.value,
  }));

  if (!article) {
    return (
      <ThemedView style={styles.loading}>
        <ThemedText style={{ fontFamily: 'InterRegular' }}>Loading...</ThemedText>
      </ThemedView>
    );
  }

  const isFavorited = favorites.includes(article.id);

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.content}>
        <View style={{flexDirection:'row',flex:1}}>
          
        {/* {article.image && (
          <Image source={{ uri: article.image }} style={styles.image} />
        )} */}

        <View style={{flex:1}}>
          <ThemedText style={styles.title}>{article.title}</ThemedText>
        </View>
       <View style={{right:0}}>
         <TouchableOpacity style={styles.favoriteButton} onPress={handleFavorite}>
          <Animated.View style={heartAnimatedStyle}>
            <ThemedText style={styles.favoriteIcon}>
              {isFavorited ? '❤️' : '🤍'}
            </ThemedText>
          </Animated.View>
        </TouchableOpacity>
       </View>
        </View>

        <ThemedView style={styles.meta}>
          <ThemedText style={styles.category}>{article.category.toUpperCase()}</ThemedText>
          <ThemedText style={styles.timestamp}>
            {new Date(article.timestamp).toLocaleDateString('en-ZA', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </ThemedText>
        </ThemedView>

        <ThemedText style={styles.excerpt}>{article.excerpt}</ThemedText>

        {/* Placeholder for full content */}
        <ThemedView style={styles.fullContent}>
          <ThemedText style={styles.contentText}>{article?.body}</ThemedText>
        </ThemedView>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteButton: {
    padding: 10,
    backgroundColor: Colors.secondary,
    borderRadius: 100,
    height:48,
    width:48,

  },
  favoriteIcon: {
    fontSize: 24,
  },
  content: {
    padding: 20,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    color: Colors.text,
    lineHeight: 34,
    fontFamily: 'MontiBold',
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  category: {
    fontSize: 12,
    color: Colors.accent,
    backgroundColor: Colors.secondary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
    fontFamily: 'MontiBold',
  },
  timestamp: {
    fontSize: 14,
    color: Colors.textLight,
    fontFamily: 'MontiLight',
  },
  excerpt: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 26,
    marginBottom: 20,
    fontFamily: 'MontiLight'
  },
  fullContent: {
    backgroundColor: '#f3f3f3ff',
    borderRadius: 5,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  contentText: {
    fontSize: 16,
    color: Colors.text,
    lineHeight: 24,
    marginBottom: 15,
    fontFamily: 'MontiLight',
  },
});