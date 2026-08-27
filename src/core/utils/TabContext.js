import React, { createContext, useContext, useRef } from 'react';
import { Animated, Platform } from 'react-native';

export const TabContext = createContext();

export const TabProvider = ({ children }) => {
  // 0 = fully visible, 100 (or height of tab bar) = hidden
  const tabBarOffset = useRef(new Animated.Value(0)).current;

  const showTabBar = () => {
    Animated.timing(tabBarOffset, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const hideTabBar = () => {
    // 100 pixels down is usually enough to hide the standard bottom tab bar
    Animated.timing(tabBarOffset, {
      toValue: 100, 
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  return (
    <TabContext.Provider value={{ tabBarOffset, showTabBar, hideTabBar }}>
      {children}
    </TabContext.Provider>
  );
};

// Custom hook to easily attach to FlatList/ScrollView
export const useHideOnScroll = () => {
  const { showTabBar, hideTabBar, tabBarOffset } = useContext(TabContext) || {};
  const lastOffsetY = useRef(0);
  const isHidden = useRef(false);

  const handleScroll = (event) => {
    if (!showTabBar || !hideTabBar) return; // Fail gracefully if not wrapped in provider

    const currentOffsetY = event.nativeEvent.contentOffset.y;
    const contentHeight = event.nativeEvent.contentSize.height;
    const layoutHeight = event.nativeEvent.layoutMeasurement.height;

    // Ignore bounce effects at top and bottom (especially on iOS)
    if (currentOffsetY < 0 || currentOffsetY > contentHeight - layoutHeight) return;

    // Determine direction
    const difference = currentOffsetY - lastOffsetY.current;

    // Add a threshold so slight movements don't trigger it immediately
    if (Math.abs(difference) > 5) { 
      if (difference > 0 && !isHidden.current) {
        // Scrolling down -> hide
        hideTabBar();
        isHidden.current = true;
      } else if (difference < 0 && isHidden.current) {
        // Scrolling up -> show
        showTabBar();
        isHidden.current = false;
      }
    }

    lastOffsetY.current = currentOffsetY;
  };

  // If tabBarOffset is undefined (e.g. provider missing), return a fallback Animated.Value so it doesn't crash screens that expect it.
  const fallbackOffset = useRef(new Animated.Value(0)).current;

  return { handleScroll, tabBarOffset: tabBarOffset || fallbackOffset };
};
