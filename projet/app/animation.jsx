import { View, StyleSheet } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated,{ interpolateColor, useAnimatedStyle, useSharedValue, withTiming, Easing } from 'react-native-reanimated';

export default function Animation() {
  const progress = useSharedValue(0);
  const easing = Easing.bezier(0.31, 0.04, 0.03, 1.04);

  const longPress = Gesture.LongPress().onStart(() => {
    progress.value = 0;
    progress.value = withTiming(1, {
      duration: 500,
      easing: easing
    });
  });

  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      ["#002aff", "#fefeff"],
    ),
  }));

  return (
    <GestureDetector gesture={longPress}>
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