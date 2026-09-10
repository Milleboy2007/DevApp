import { StyleSheet, Text, View, Dimensions, useWindowDimensions } from 'react-native'
import React, {useState} from 'react'
import BoutonCalculatrice from '../components/boutonCalculatrice'
import { SafeAreaView } from 'react-native-safe-area-context';

const Calculatrice = () => {
    const {width, height} = useWindowDimensions();
    const [resultat, setResultat] = useState("0");

    const isHorizontal = width > height;

    const touches = !isHorizontal ? [
        ["1", "2", "3", "+"],
        ["4", "5", "6", "-"],
        ["7", "8", "9", "x"],
        ["0", ".", "<-", "="]
    ]:
    [
        ["1", "2", "3", "4", "+", "("],
        ["5", "6", "7", "8", "-", ")"],
        [ "9", "0", ".", "x", "<-", "="]
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
            case ".":
                if(resultat == "0"){
                    setResultat("0.")
                }else{
                    setResultat(resultat + value)
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

        <View style={{flex: isHorizontal ? 2 : 1}}>
            {touches.map((row, indexRow) => (
                <View key={indexRow} style={styles.row}>
                    {row.map((value, indexCol) => (
                        <View key={indexCol} style={styles.column}>
                            <BoutonCalculatrice value={value} handlePress={handlePress}/>
                        </View>
                    ))}
                </View>
            ))}
        </View>

        </SafeAreaView>

    );
};



export default Calculatrice

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor:"grey",
    padding: 10,

  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 0,
    flex: 1
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
    flex: 1,
    flexDirection: 'row',
    marginBottom: 10,
    justifyContent:'flex-end',
    alignItems:"center"
  }
});