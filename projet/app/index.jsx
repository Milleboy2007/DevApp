import { StyleSheet, Text, View, ScrollView } from 'react-native'
import React from 'react'
import Card from '../components/card'
import { SafeAreaView } from 'react-native-safe-area-context'

const Index = () => {
  const dogoList = [["Corgie", require("../assets/images/corgie.png")], ["Golden", require("../assets/images/golden.png")], ["Jack", require("../assets/images/chiot3.png")], ["Golden", require("../assets/images/golden2.png")]]
  return (
    <ScrollView
        horizontal
        // contentContainerStyle={{flex:1}}
        // style={styles.Scroll}
    >
        {/* <Card name="Corgie" img={require("../assets/images/corgie.png")}/>
        <Card name="golden" img={require("../assets/images/golden.png")}/>
        <Card name="chiot3" img={require("../assets/images/chiot3.png")}/>
        <Card name="Golden" img={require("../assets/images/golden2.png")}/> */}

        {dogoList.map((dogo, index) => {
          return <Card key={index} name={dogo[0]} img={dogo[1]}/>
        })}
    </ScrollView>
  )
}

export default Index

const styles = StyleSheet.create({})