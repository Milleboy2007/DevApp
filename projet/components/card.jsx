import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'

const card = (props) => {
  return (
    <View style={styles.container}>
        <Image source={props.img} style={styles.img}/>
        <Text style={{fontSize:50}}>{props.name}</Text>
    </View>
  )
}

export default card

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingLeft: 20,
    justifyContent: "center"
  },
  img:{
    height: 400,
    width: 300,
    resizeMode: 'contain'
  }
})