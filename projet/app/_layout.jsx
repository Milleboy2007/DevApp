import { StyleSheet, Text, View, Platform } from 'react-native'
import { Stack } from "expo-router"
import "../global.css"
import { StatusBar } from 'expo-status-bar';
 
const RootLayout = () => {
 
    return (
        <>
            <StatusBar style="light"  />
            <Stack>
                {/* <Stack.Screen name='index' options={{headerShown: false}}/> */}
                {/* <Stack.Screen name='touchable' options={{headerShown: false}}/> */}
                {/* <Stack.Screen name='Calculatrice' options={{headerShown: false}}/> */}
                {/* <Stack.Screen name='app' options={{headerShown: false}}/> */}
                <Stack.Screen name='poke' options={{headerShown: false}}/>
            </Stack>
        </>
    )
}
 
export default RootLayout
 
const styles = StyleSheet.create({})