import articlesData from '@/assets/articles.json';
import { CustomGradient } from '@/components/CustomGradient';
import { FavoriteArticleItem } from '@/components/FavoriteArticleItem';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useFinanceStore } from '@/store/financeStore';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, FlatList, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

export default function FavoritesScreen() {
  const router = useRouter();
  const { favorites, toggleFavorite } = useFinanceStore();

  const favoritedArticles = articlesData.filter((article) => favorites.includes(article.id));

  const handleDelete = (articleId: string) => {
    Alert.alert(
      'Remove Favorite',
      'Are you sure you want to remove this article from favorites?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', onPress: () => toggleFavorite(articleId) },
      ]
    );
  };

  const renderArticle = ({ item }: { item: any; index: number }) => {
    return (
      <FavoriteArticleItem
        item={item}
        onDelete={handleDelete}
        onPress={(id) => router.push(`/article/${id}`)}
      />
    );
  };

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.content}>
        {favoritedArticles.length === 0 ? (
          <ThemedView style={styles.emptyState}>
            <ThemedText style={[styles.emptyTitle, { fontFamily: 'InterBold' }]}>No Favorites Yet</ThemedText>
            <ThemedText style={[styles.emptyText, { fontFamily: 'InterRegular' }]}>
              Start reading articles and tap the heart icon to add them to your favorites.
            </ThemedText>
            <TouchableOpacity style={styles.exploreButton} onPress={() => router.push('/')}>
              <CustomGradient
                colors={[Colors.primary, Colors.accent]}
                style={styles.buttonGradient}
              >
                <ThemedText style={[styles.buttonText, { fontFamily: 'InterBold' }]}>Explore Articles</ThemedText>
              </CustomGradient>
            </TouchableOpacity>
          </ThemedView>
        ) : (
          <FlatList
            data={favoritedArticles}
            renderItem={renderArticle}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
          />
        )}
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 10,
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyTitle: {
    fontSize: 24,
    color: Colors.text,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textLight,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  exploreButton: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  buttonGradient: {
    padding: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.background,
    fontSize: 18,
  },
  listContainer: {
    paddingBottom: 20,
  },
  articleCard: {
    marginBottom: 15,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    backgroundColor: Colors.background,
  },
  articleContent: {
    flex: 1,
  },
  articleGradient: {
    padding: 20,
  },
  articleTitle: {
    fontSize: 18,
    color: Colors.background,
    marginBottom: 10,
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
  deleteIndicator: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 100,
    backgroundColor: Colors.error,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteText: {
    color: Colors.background,
    fontSize: 12,
    transform: [{ rotate: '90deg' }],
  },
});