import { useState } from 'react';
import { StyleSheet, Text, View,TouchableOpacity, Dimensions} from 'react-native'

export default function BoutonPoke({type}){
    const [isClick, setIsClick] = useState(false)

    // Couleurs officielles des types Pokémon
    const TYPE_COLORS = {
        Normal: "#A8A878",
        Combat: "#C03028",
        Vol: "#A890F0",
        Poison: "#A040A0",
        Sol: "#E0C068",
        Roche: "#B8A038",
        Insecte: "#A8B820",
        Spectre: "#705898",
        Acier: "#B8B8D0",
        Feu: "#F08030",
        Eau: "#6890F0",
        Plante: "#78C850",
        Électrik: "#F8D030",
        Psy: "#F85888",
        Glace: "#98D8D8",
        Dragon: "#7038F8",
        Ténèbres: "#705848"
    };

    return(
        <TouchableOpacity onPress={() => setIsClick(!isClick)} style={isClick? [styles.btn, {backgroundColor: TYPE_COLORS[type]}]: styles.btn}>
            <Text style={isClick? {color: "black"}: {color: "white"}}>
                {type}
            </Text>
        </TouchableOpacity>
    )
}
const styles = StyleSheet.create({
    btn:{
        backgroundColor: "black",
        borderRadius: 10,
        padding: 10,
    }
})