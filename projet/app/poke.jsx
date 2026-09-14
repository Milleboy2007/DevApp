import { StyleSheet, Text, View,TouchableOpacity, Dimensions, H1, ScrollView} from 'react-native'
import BoutonPoke from "../components/boutonPoke";
import { SafeAreaView } from 'react-native-safe-area-context';
import { getSingularId } from 'expo-router/build/useScreens';
import { useState } from 'react';

export default function Poke(){
    // Définition des types en français et correspondance des indices
    const TYPES = [
    "Normal", "Combat", "Vol", "Poison", "Sol", 
    "Roche", "Insecte", "Spectre", "Acier", "Feu", 
    "Eau", "Plante", "Électrik", "Psy", "Glace", 
    "Dragon", "Ténèbres"
    ];

    // Matrice des types FireRed (17x17) (Lignes : Attaquant, Colonnes : Défenseur)
    const TYPE_MATRIX = [
    /* Nor */ [1, 1, 1, 1, 1, 0.5, 1, 0, 0.5, 1, 1, 1, 1, 1, 1, 1, 1],
    /* Com */ [2, 1, 0.5, 0.5, 1, 2, 0.5, 0, 2, 1, 1, 1, 1, 0.5, 2, 1, 2],
    /* Vol */ [1, 2, 1, 1, 1, 0.5, 2, 1, 0.5, 1, 1, 2, 0.5, 1, 1, 1, 1],
    /* Poi */ [1, 1, 1, 0.5, 0.5, 0.5, 1, 0.5, 0, 1, 1, 2, 1, 1, 1, 1, 1],
    /* Sol */ [1, 1, 0, 2, 1, 2, 0.5, 1, 2, 2, 1, 0.5, 2, 1, 1, 1, 1],
    /* Roc */ [1, 0.5, 2, 1, 0.5, 1, 2, 1, 0.5, 2, 1, 1, 1, 1, 2, 1, 1],
    /* Ins */ [1, 0.5, 0.5, 0.5, 1, 1, 1, 0.5, 0.5, 0.5, 1, 2, 1, 2, 1, 1, 2],
    /* Spe */ [0, 1, 1, 1, 1, 1, 1, 2, 0.5, 1, 1, 1, 1, 2, 1, 1, 0.5],
    /* Aci */ [1, 1, 1, 1, 1, 2, 1, 1, 0.5, 0.5, 0.5, 1, 0.5, 1, 2, 1, 1],
    /* Feu */ [1, 1, 1, 1, 1, 0.5, 2, 1, 2, 0.5, 0.5, 2, 1, 1, 2, 0.5, 1],
    /* Eau */ [1, 1, 1, 1, 2, 2, 1, 1, 1, 2, 0.5, 0.5, 1, 1, 1, 0.5, 1],
    /* Pla */ [1, 1, 0.5, 0.5, 2, 2, 0.5, 1, 0.5, 0.5, 2, 0.5, 1, 1, 1, 0.5, 1],
    /* Ele */ [1, 1, 2, 1, 0, 1, 1, 1, 1, 1, 2, 0.5, 0.5, 1, 1, 0.5, 1],
    /* Psy */ [1, 2, 1, 2, 1, 1, 1, 1, 0.5, 1, 1, 1, 1, 0.5, 1, 1, 0],
    /* Gla */ [1, 1, 2, 1, 2, 1, 1, 1, 0.5, 0.5, 0.5, 2, 1, 1, 0.5, 2, 1],
    /* Dra */ [1, 1, 1, 1, 1, 1, 1, 1, 0.5, 1, 1, 1, 1, 1, 1, 2, 1],
    /* Tén */ [1, 0.5, 1, 1, 1, 1, 1, 2, 0.5, 1, 1, 1, 1, 2, 1, 1, 0.5]
    ];

    const [selectedType, setSelectedType] = useState({"att": [], "def": []})
    const [isAttFull, setIsAttFull] = useState(false);
    const [isDefFull, setIsDefFull] = useState(false);

    function handleTypeChange(method, class_, type){
        if(method == "add"){
            switch (class_){
                case "att":
                    if(selectedType["att"].length < 2){
                        let tempAtt = selectedType;
                        tempAtt["att"].push(type);
                        setSelectedType(tempAtt);
                        console.log(selectedType, " | ", selectedType["att"].length);
                    }else {
                        console.log("Deja 2 type de selectionner");
                    }

                    break;
                case "def":
                    if(selectedType["def"] < 2){
                        let tempDef = selectedType;
                        tempDef["def"].push(type);
                        setSelectedType(tempDef);
                        console.log(selectedType);
                    }else {
                        console.log("Deja 2 type de selectionner");
                    }

                    break;
                default:
                    console.log("Probleme avec add: ", class_);
                    break;
            }
        }else if(method == "supp"){
            switch (class_){
                case "att":
                    let tempAtt = selectedType;
                    tempAtt["att"] = tempAtt["att"].filter(elem => elem != type);
                    setSelectedType(tempAtt);
                    break;
                case "def":
                    let tempDef = selectedType;
                    tempDef["def"] = tempDef["def"].filter(elem => elem != type);
                    setSelectedType(tempDef)
                    break;
                default:
                    console.log("Probleme avec supp: ", class_);
                    break;
            }
        }

        console.log(selectedType["att"].length)
        if(selectedType["att"].length = 2) {
            setIsAttFull(true);
        }else setIsAttFull(false);

        if(selectedType["def"].length = 2) {
            setIsDefFull(true);
        }else setIsDefFull(false);
        
    }

    return(
        <ScrollView>
            <SafeAreaView style={styles.container}>
                <Text style={styles.title}>🔥Table des types Pokemon </Text>

                <Text>1. Type(s) Attaquant(s) [Max 2]</Text>
                <View style={styles.btnContainer}>
                {
                    TYPES.map((type) => (
                        <View style={styles.btn}>
                            <BoutonPoke class_="att" type={type} handleTypeChange={handleTypeChange} isFull={isAttFull}/>
                        </View>
                    ))
                }
                </View>
                <Text>2. Type(s) Defenseur(s) [Max 2]</Text>
                <View style={styles.btnContainer}>
                {
                    TYPES.map((type) => (
                        <View style={styles.btn}>
                            <BoutonPoke class_="def" type={type} handleTypeChange={handleTypeChange} isFull={isDefFull}/>
                        </View>
                    ))
                }
                </View>

                <TouchableOpacity onPress={() => {}} style={styles.btnCombat}>
                    <Text style={{textAlign: "center"}}>
                        COMBAT!⚔️
                    </Text>
                </TouchableOpacity>
            </SafeAreaView>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:"grey",
        padding: 10,
    },
    title:{
        fontSize: 20,
        textAlign: "center"
    },
    btnContainer:{
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: 8,
        marginBottom: "30%"
    },
    btn:{

    },
    btnCombat: {
        backgroundColor: "green",
        width: "250",
    }
})