import { StyleSheet, Text, View, Dimensions } from 'react-native'
import React, {useState} from 'react'
import BoutonCalculatrice from '../components/boutonCalculatrice'
import { SafeAreaView } from 'react-native-safe-area-context';

const Calculatrice = () => {

    const [resultat, setResultat] = useState("0");
    const touch = [
        ["1", "2", "3", "+"],
        ["4", "5", "6", "-"],
        ["7", "8", "9", "x"],
        ["0", ".", "<-", "="]
    ]

    const handlePress = (value) => {
        switch (value){
            case "<-":
                resultat.length == 1 || resultat === "Erreur"?
                    setResultat("0"):
                    setResultat(resultat.slice(0, -1));
                break;
            case "=":
                try{
                    setResultat(`${eval(resultat.replaceAll("x", "*"))}`);
                }catch (e){
                    setResultat("Erreur");
                }
                break;
            default:
                resultat === "0" || resultat === "Erreur"?
                    setResultat(value):
                    setResultat(resultat + value);
                break;
        }

    }
  
    return (

        <SafeAreaView style={styles.container}>
        <View style={styles.containerLabel}>
            <Text style={styles.label}>{resultat}</Text>
        </View>

        {touch.map((value, indexRow) => (
            <View key={indexRow} style={styles.row}>
                {value.map((value, indexCol) => (
                    <View key={indexCol} style={styles.column}>
                        <BoutonCalculatrice value={value} handlePress={handlePress}/>
                    </View>
                ))}
            </View>
        ))}

        </SafeAreaView>

    );
};



export default Calculatrice

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor:"grey",
    padding: 10,
    alignItems:"flex-end",
    justifyContent:"flex-end"

  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 0,
  },
  column: {
    flex: 1,
    marginHorizontal: 0,
  },
  label:{
    textAlign:"right",
    fontSize:30,
    paddingHorizontal:12,
    width:"90%"
  },
  containerLabel:{
    height:60,
    width:'100%',
    flexDirection: 'row',
    marginBottom: 10,
    justifyContent:'flex-end',
    alignItems:"center"
  }
});