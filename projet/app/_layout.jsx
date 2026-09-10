import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { SafeAreaView } from "react-native-safe-area-context";
import "../global.css"

const RootLayout = () => {
  return (
    <>
        <SafeAreaView style={{flex:1, backgroundColor: "grey"}}>
            <Text>Hello from layout</Text>
            <Stack>
                {/* <Stack.Screen name='index' options={{headerShown: false}}/> */}
                {/* <Stack.Screen name='touchable' options={{headerShown: false}}/> */}
                {/* <Stack.Screen name='Calculatrice' options={{headerShown: false}}/> */}
                {/* <Stack.Screen name='app' options={{headerShown: false}}/> */}
                <Stack.Screen name='poke' options={{headerShown: false}}/>
            </Stack>
        </SafeAreaView>
    </>
  )
}

export default RootLayout

const styles = StyleSheet.create({})