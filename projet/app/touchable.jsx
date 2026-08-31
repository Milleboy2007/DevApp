import { StyleSheet, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';

const Touchable = () => {
    const [nbClic, setNbClick] = useState(0);
    
    return(
        <SafeAreaView style={styles.container}>
            <Text>Vous avez appuyer {nbClic} fois</Text>

            <TouchableOpacity style={[styles.btn, {backgroundColor: nbClic % 2 == 0 ? "blue": "green"}]} onPress={() => setNbClick(nbClic + 1)}>
                <Text style={{textAlign:"center", color: "white"}}>ButtonAddOne</Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}

export default Touchable;

const styles = StyleSheet.create({
    container:{
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },

    btn:{
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 15,
        marginTop: 50
    },
})