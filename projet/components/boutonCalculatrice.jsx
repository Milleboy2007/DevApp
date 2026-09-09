// Composant boutonCalculatrice
// 
import { StyleSheet, Text, View,TouchableOpacity, Dimensions} from 'react-native'
import React, { useEffect, useState } from 'react'

const BoutonCalculatrice = ({value, handlePress, width}) => {
  let isSpecial = true
  if (value in ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "."]) isSpecial = false;

  return (
    
    <TouchableOpacity onPress={() => handlePress(value)} style={[styles.container, isSpecial ? styles.functionButton: styles.numberButton, {height:((width - 50) / 4)}]}>
      <Text style={styles.text}>
        {value}
      </Text>
    </TouchableOpacity>
    
  )
}

export default BoutonCalculatrice

const styles = StyleSheet.create({
  container: {
    margin: 10,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },
  numberButton: {
    backgroundColor: '#333333',  // Dark gray for numeric buttons
  },
  functionButton: {
    backgroundColor: '#00e676',  // Neon green for function buttons
    
  },
  text: {
    color: '#e0e0e0',  // Light gray 
    fontSize: 20,
    fontWeight: '500',
  },
  textFonction: {
    color: '#C60709',  // Dark orange
    fontSize: 20,
    fontWeight: '500',
  },
})