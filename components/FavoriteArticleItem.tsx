import { Colors } from '@/constants/Colors';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { CustomGradient } from './CustomGradient';
import { ThemedText } from './ThemedText';

const AnimatedView = Animated.createAnimatedComponent(View);

interface FavoriteArticleItemProps {
  item: any;
  onDelete: (id: string) => void;
  onPress: (id: string) => void;
}

export function FavoriteArticleItem({ item, onDelete, onPress }: FavoriteArticleItemProps) {
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    opacity: opacity.value,
  }));

  const onGestureEvent = (event: any) => {
    translateX.value = event.nativeEvent.translationX;
  };

  const onHandlerStateChange = (event: any) => {
    if (event.nativeEvent.state === State.END) {
      if (Math.abs(translateX.value) > 100) {
        // Swipe to delete
        opacity.value = withTiming(0, { duration: 200 }, () => {
          runOnJS(onDelete)(item.id);
        });
      } else {
        // Reset position
        translateX.value = withTiming(0, { duration: 200 });
      }
    }
  };

  return (
    <PanGestureHandler
      onGestureEvent={onGestureEvent}
      onHandlerStateChange={onHandlerStateChange}
    >
      <AnimatedView style={[styles.articleCard, animatedStyle]}>
        <TouchableOpacity
          style={styles.articleContent}
          onPress={() => onPress(item.id)}
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
        <View style={styles.deleteIndicator}>
          <ThemedText style={[styles.deleteText, { fontFamily: 'MontiBold' }]}>← Swipe to delete</ThemedText>
        </View>
      </AnimatedView>
    </PanGestureHandler>
  );
}

const styles = StyleSheet.create({
  articleCard: {
    marginBottom: 15,
    borderRadius: 5,
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
    fontSize: 16,
    color: Colors.background,
    marginBottom: 10,
    right:10
  },
  articleExcerpt: {
    fontSize: 14,
    color: Colors.background,
    lineHeight: 20,
    marginBottom: 10,
    right:10
  },
  articleTimestamp: {
    fontSize: 12,
    color: Colors.background,
    opacity: 0.8,
    right:10
  },
  deleteIndicator: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 40,
    backgroundColor: Colors.error,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteText: {
    color: Colors.background,
    fontSize: 10,
    transform: [{ rotate: '90deg' }],
    textAlign: 'center',
    width: 100,
    position: 'absolute',
  },
});
