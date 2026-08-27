import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'

const card = (props) => {
  return (
    <View style={{alignItems: "center", paddingLeft: 20, justifyContent: "center"}}>
        <Image source={props.img} style={{height: 400, width: 300, resizeMode: 'contain'/*, margin:10*/}}/>
        <Text style={{/*textAlign: "center", */fontSize:50}}>{props.name}</Text>
    </View>
  )
}

export default card

const styles = StyleSheet.create({})