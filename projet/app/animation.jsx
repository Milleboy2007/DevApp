import { View, StyleSheet } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated,{ interpolateColor, useAnimatedStyle, useSharedValue, withTiming, Easing } from 'react-native-reanimated';

const COLORS = ["#002aff", "#fefeff"];

export default function Animation() {
  const progress = useSharedValue(0);
  const currentIndex = useSharedValue(0);
  const nextIndex = useSharedValue(0);

  const press = Gesture.Tap().onEnd(() => {
    currentIndex.value = nextIndex.value;
    nextIndex.value = (currentIndex.value + 1) % COLORS.length;
    
    progress.value = 0;
    progress.value = withTiming(1, {
      duration: 500,
    });
  });

  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      [COLORS[currentIndex.value], COLORS[nextIndex.value]],
    ),
  }));

  return (
    <GestureDetector gesture={press}>
      <Animated.View style={[styles.box, animatedStyle]} />
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  box: {
    alignSelf: "center",
    marginTop: "100%",
    height: 120,
    width: 120,
    backgroundColor: '#b58df1',
    borderRadius: 20,
    marginBottom: 30,
  },
});