import { StyleSheet, Text, View, Platform } from 'react-native'
import { Stack } from "expo-router"
import "../global.css"
import { StatusBar } from 'expo-status-bar';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
 
const RootLayout = () => {
 
    return (
        <GestureHandlerRootView>
            <StatusBar style="dark"  />
            <Stack>
                <Stack.Screen name='index' options={{headerShown: false}}/>
            </Stack>
        </GestureHandlerRootView>
    )
}
 
export default RootLayout
 
const styles = StyleSheet.create({})