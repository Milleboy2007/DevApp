//(pokemon)/pokemon-end.jsx
import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import { useTabNameContext } from '../../contexts/tabNameContext';

// Définition des types en français et correspondance des indices
const TYPES = [
  "Normal", "Combat", "Vol", "Poison", "Sol", 
  "Roche", "Insecte", "Spectre", "Acier", "Feu", 
  "Eau", "Plante", "Électrik", "Psy", "Glace", 
  "Dragon", "Ténèbres"
];

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

const TypeCalculator = () => {
  const { setTabName } = useTabNameContext();
  useFocusEffect(() => {
    setTabName("pokemon End")
  })

  const [typeAttaquant, setTypeAttaquant] = useState([])
  const [typeDefenseur, setTypeDefenseur] = useState([])
  const [isResAffiche, setIsResAffiche] = useState(false)
  const [battleResult, setBattleResult] = useState(null)

  const handlePress = (type, liste, setListe) => {
    if (liste.includes(type)) {
      setListe(liste.filter((t) => t != type))
      setIsResAffiche(false)
    }
    else if (liste.length < 2){
      setListe([...liste, type])
      setIsResAffiche(false)
    }
    
  }
  const handleCombat = () => {
    if (typeAttaquant.length < 1 || typeDefenseur.length < 1) {
      setBattleResult({"error" : "Veuillez choisir au moins 1 type attaquant et 1 défenseur !"})
      setIsResAffiche(true)
      return;
    }
    if(isResAffiche) {
      return;
    }
    let multiplicateurTotal = 1
    let msgCombat = []
    let result = ""

    typeAttaquant.forEach((typeAtt) => {
      const indexAtt = TYPES.indexOf(typeAtt)
      typeDefenseur.forEach((typeDef) => {
        const indexDef = TYPES.indexOf(typeDef)
        multiplicateurTotal = multiplicateurTotal * TYPE_MATRIX[indexAtt][indexDef]
        msgCombat.push(`• ${typeAtt} contre ${typeDef} = ${TYPE_MATRIX[indexAtt][indexDef]}x`)
      });
    });

    if (multiplicateurTotal > 1) {
      result = "Victoire de l'attaquant"
    }
    else if (multiplicateurTotal == 1) {
      result = "Égalité / Neutre"
    }
    else {
      result = "Victoire du défenseur"
    }
    setBattleResult({
      multiplicateurTotal,
      result,
      msgCombat
    })
    setIsResAffiche(true)

  }
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scroll}>
        <Text style={styles.titre}>🔥 Table des Types Pokémon 🍃</Text>
        <Text style={styles.titreType}>1. Type(s) Attaquant(s)[Max 2]</Text>
        <View style={styles.containerType}>
          {TYPES.map((type, index) => {
            const isSelected = typeAttaquant.includes(type);
            return (
              <TouchableOpacity key={`att-${index}`} onPress={() => handlePress(type, typeAttaquant, setTypeAttaquant)} style={[styles.btnType, isSelected && {backgroundColor : TYPE_COLORS[type]}]}>
                <Text style={styles.textBtnType}>{type}</Text>
              </TouchableOpacity>
            )
          })}
        </View>
        <Text style={styles.titreType}>2. Type(s) Defenseur(s)[Max 2]</Text>
        <View style={styles.containerType}>
          {TYPES.map((type, index) => {
            const isSelected = typeDefenseur.includes(type)
            return (
              <TouchableOpacity key={`def-${index}`} onPress={() => handlePress(type, typeDefenseur, setTypeDefenseur)} style={[styles.btnType, isSelected && {backgroundColor : TYPE_COLORS[type]}]}>
                <Text style={styles.textBtnType}>{type}</Text>
              </TouchableOpacity>
            )
          })}
        </View>
        <TouchableOpacity onPress={handleCombat} style={styles.btnCombat}>
          <Text style={styles.textCombat}>
            COMBAT ! ⚔️
          </Text>
        </TouchableOpacity>
        {isResAffiche && (
            battleResult["error"] ? (
                <View style={styles.sectionResultats}>
                  <Text style={styles.errorMsg}> {battleResult["error"]}</Text>
                </View>
              )
              :
              (

                <View style={styles.sectionResultats}>
                  <Text style={styles.couronne}>👑</Text>
                  <Text style={styles.result}>{battleResult["result"]}</Text>
                  <Text style={styles.multi}>Multiplicateur total : {battleResult["multiplicateurTotal"]}x</Text>
                  <View style={styles.containerExplication}>
                    <Text style={styles.pourquoi}>Pourquoi ?</Text>
                    {battleResult["msgCombat"].map((msg, index) => (
                      <Text style={styles.explications} key={`msgCombat-${index}`}>{msg}</Text>
                    ))}
                  </View>
                </View>
              )

             
          )
        }
      </ScrollView>
    </SafeAreaView>
  );
}

export default TypeCalculator



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#161616',
    padding: 25,
  },
  titre: {
    color: "#ffffff",
    textAlign: "center",
    fontSize: 20,
    fontWeight: "700",
    paddingVertical: 30,
  },
  btnCombat: {
    backgroundColor: "#15ff00c7",
    paddingVertical: 15,
    borderRadius: 10
  },
  scroll: {

  },
  sectionResultats: {
    backgroundColor: "#49494981",
    borderColor: "#494949",
    borderRadius:10,
    borderWidth:1,
    marginVertical: 20,
    padding: 20
  },
  textCombat: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "500",
    color: "#ffffff",
    

  },
  couronne: {
    textAlign: "center",
    fontSize: 40
  },
  titreType: {
    color: "#918d8d",
    fontWeight: "600",

  },
  textBtnType: {
    color: "#ffffff"
  },
  containerType: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingBottom: 20,
    
  },
  btnType: {
    padding: 5,
    backgroundColor: "#49494981",
    borderColor: "#494949",
    borderRadius:10,
    borderWidth:1,
    margin: 5
  },
  errorMsg: {
    color: "#c56a6a",
    fontSize: 18
  },
  result: {
    color: "#ffe600",
    textAlign: "center",
    fontSize: 20,
    fontWeight:"700"
  },
  containerExplication: {
    backgroundColor: '#161616',
    borderRadius: 10,
    padding: 10
  },
  explications: {
    color: "#ffffff"
  },
  multi: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "500",
    textAlign: "center",
    padding: 10
  },
  pourquoi: {
    color: "#ffffff",
    fontWeight: "600",
    padding:5,
    fontSize: 15
  }
})