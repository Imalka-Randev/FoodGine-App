import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableWithoutFeedback, Image, LayoutAnimation, Platform, UIManager } from 'react-native';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { width } = Dimensions.get('window');

const features = [
  { id: 1, title: 'AI Recipe Generator', desc: 'Create unique recipes instantly with our AI chef. Just input your ingredients!', image: require('../../../assets/images/carousel/ai_recipe.jpg') },
  { id: 2, title: 'Community Feed', desc: 'Discover, like, and save recipes from foodies all around the world.', image: require('../../../assets/images/carousel/community_feed.jpg') },
  { id: 3, title: 'Smart Pantry', desc: 'Keep track of your fridge items and get instant recipe suggestions.', image: require('../../../assets/images/carousel/smart_pantry.jpg') },
  { id: 4, title: 'Offline Access', desc: 'Save your favorite recipes and access them anytime, without internet.', image: require('../../../assets/images/carousel/offline_access.jpg') },
  { id: 5, title: 'Dietary Filters', desc: 'Easily find vegan, keto, or gluten-free options tailored to your needs.', image: require('../../../assets/images/carousel/dietary_filters.jpg') },
];

export default function FeatureCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto-rotate every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      handleIndexChange((current) => (current + 1) % features.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleIndexChange = (newIndexOrUpdater) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setActiveIndex(newIndexOrUpdater);
  };

  const getCardStyle = (index) => {
    const diff = (index - activeIndex + features.length) % features.length;
    
    // Active Center Card
    if (diff === 0) {
      return {
        transform: [{ translateX: 0 }, { translateY: 0 }], // Scale removed
        zIndex: 30,
        opacity: 1,
        borderRadius: 18, // 👈 CHANGE FRONT CARD CORNER RADIUS HERE
        width: '100%',    // 👈 CHANGE FRONT CARD WIDTH HERE (percentage or number)
        height: '100%',   // 👈 CHANGE FRONT CARD HEIGHT HERE
      };
    } 
    // Right/Top Card (Next in sequence)
    else if (diff === 1) {
      return {
        transform: [{ translateX: 50 }, { translateY: -35 }], 
        zIndex: 20,
        opacity: 1,
        backgroundColor: '#aca083ff',
        borderRadius: 26, // 👈 CHANGE BACK CARD CORNER RADIUS HERE
        width: '75%',     // 👈 CHANGE BACK CARD WIDTH HERE
        height: '75%',    // 👈 CHANGE BACK CARD HEIGHT HERE
      };
    } 
    // Left/Bottom Card (Previous in sequence)
    else if (diff === features.length - 1) {
      return {
        transform: [{ translateX: -50 }, { translateY: 35 }], 
        zIndex: 20,
        opacity: 1,
        backgroundColor: '#f9c668ff',
        borderRadius: 26, // 👈 CHANGE BACK CARD CORNER RADIUS HERE
        width: '75%',     // 👈 CHANGE BACK CARD WIDTH HERE
        height: '75%',    // 👈 CHANGE BACK CARD HEIGHT HERE
      };
    } 
    // Hidden Cards
    else {
      return {
        transform: [{ translateX: 0 }, { translateY: 0 }],
        zIndex: 10,
        opacity: 0,
        borderRadius: 26,
        width: '80%',
        height: '80%',
      };
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.carouselWrapper}>
        {features.map((item, index) => {
          const style = getCardStyle(index);
          const diff = (index - activeIndex + features.length) % features.length;
          const isActive = diff === 0;
          
          return (
            <TouchableWithoutFeedback key={item.id} onPress={() => handleIndexChange(index)}>
              <View
                style={[
                  styles.card,
                  {
                    zIndex: style.zIndex,
                    opacity: style.opacity,
                    transform: style.transform,
                    backgroundColor: style.backgroundColor || '#2b2b2b',
                    borderRadius: style.borderRadius, // Applies separate corner radius!
                    width: style.width,               // Applies separate width!
                    height: style.height,             // Applies separate height!
                  }
                ]}
              >
                {isActive ? (
                  <View style={styles.activeCardContent}>
                    <Image source={item.image} style={styles.cardImage} />
                    <View style={styles.textOverlay}>
                      <Text style={styles.title}>{item.title}</Text>
                      <Text style={styles.desc}>{item.desc}</Text>
                    </View>
                  </View>
                ) : (
                  <View style={styles.inactiveCardContent} />
                )}
              </View>
            </TouchableWithoutFeedback>
          );
        })}
      </View>

      {/* Pagination Dots */}
      <View style={styles.pagination}>
        {features.map((_, index) => {
          const isActive = index === activeIndex;
          return (
            <TouchableWithoutFeedback key={index} onPress={() => handleIndexChange(index)}>
              <View style={[styles.dot, isActive ? styles.dotActive : styles.dotInactive]} />
            </TouchableWithoutFeedback>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
    marginTop: 15,
    marginBottom: 0,
  },
  carouselWrapper: {
    width: width - 60,
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  card: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
    overflow: 'hidden',
  },
  activeCardContent: {
    flex: 1,
    overflow: 'hidden',
  },
  inactiveCardContent: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  cardImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  textOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 15,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  title: {
    color: '#fca311', // Golden color
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  desc: {
    color: '#ffffff',
    fontSize: 12,
    lineHeight: 16,
  },
  pagination: {
    flexDirection: 'row',
    marginTop: 15, // Reduced space to the dots
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: '#000',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  dotInactive: {
    backgroundColor: '#d1d5db', // Light grey
  }
});
