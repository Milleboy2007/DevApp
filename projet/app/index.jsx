import { StyleSheet, Text, View, ScrollView } from 'react-native'
import React from 'react'
import Card from '../components/card'

const Index = () => {
  const dogoList = [
    // ["Corgie", require("../assets/images/corgie.png")],
    // ["Golden", require("../assets/images/golden.png")],
    // ["Jack", require("../assets/images/chiot3.png")],
    // ["Golden", require("../assets/images/golden2.png")]
  ]

  return (
    <ScrollView
        horizontal
    >
      {dogoList.map((dogo, index) => {
        return <Card key={index} name={dogo[0]} img={dogo[1]}/>
      })}
    </ScrollView>
  )
}

export default Index

const styles = StyleSheet.create({})