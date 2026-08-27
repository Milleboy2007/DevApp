import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { SafeAreaView } from "react-native-safe-area-context";

const RootLayout = () => {
  return (
    <>
        <SafeAreaView style={{flex:1}}>
            <Text>Hello from layout</Text>
            <Stack>
                <Stack.Screen name='index' options={{headerShown: false}}/>
            </Stack>
        </SafeAreaView>
    </>
  )
}

export default RootLayout

const styles = StyleSheet.create({})