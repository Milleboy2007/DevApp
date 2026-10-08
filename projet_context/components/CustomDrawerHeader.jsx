import React from 'react';
import { Text, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../contexts/themeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context'; // 1. On importe le hook
import { colorsPalette } from '../assets/colorsPalette';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useTabNameContext } from '../contexts/tabNameContext';

const CustomDrawerHeader = ({ navigation }) => {
  const { theme, toggleTheme } = useTheme();
  const { tabName } = useTabNameContext();
  const colors = colorsPalette[theme];
  const insets = useSafeAreaInsets();
  const borderColor = theme === 'light' ? '#e2e8f0' : '#2a2a2a';

  return (
    <View 
      style={[
        styles.header, 
        { 
            backgroundColor: colors.background, 
            borderBottomColor: borderColor,
            paddingTop: insets.top,
            paddingBottom: 15
        }
      ]}
    >
      <TouchableOpacity 
        style={styles.iconButton} 
        onPress={() => navigation.openDrawer()}
        activeOpacity={0.7}
      >
        <Icon name="bars" size={18} color={colors.text} />
      </TouchableOpacity>
      
      <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
        {tabName}
      </Text>
      
      <TouchableOpacity 
        style={styles.iconButton} 
        onPress={toggleTheme}
        activeOpacity={0.7}
      >
        <Icon name={theme === 'light' ? "moon-o" : "sun-o"} size={18} color={colors.text} />
      </TouchableOpacity>
    </View>
  );
};

export default CustomDrawerHeader;  

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 6, 
    borderBottomWidth: 1,
  },
  title: {
    flex: 1,
    fontSize: 16, // More compact text
    fontWeight: '600',
    textAlign: 'center',
    marginHorizontal: 8,
  },
  iconButton: {
    height: 32, // Smaller touch footprint
    width: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
