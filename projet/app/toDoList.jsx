import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';
import axios from 'axios'
import Alert from 'react-native/Libraries/Alert/Alert';

const COLOR_1 = "#000000";
const COLOR_2 = "#282A3A";
const COLOR_3 = '#735F32';
const COLOR_4 = '#C69749';

const renderLeftActions = () => {
  return (
    <View style={styles.deleteBackground}>
      <Text style={styles.deleteText}>Supprimer</Text>
    </View>
  );
};

const Card = ({data, deleteTask, swipeableRef}) => {
  return (
    <Animated.View
      layout={LinearTransition}
      entering={FadeIn}
      exiting={FadeOut}
    >
        <ReanimatedSwipeable
            ref={swipeableRef}
            containerStyle={{flex:1}}
            renderLeftActions={renderLeftActions}
            onSwipeableWillOpen={(d) => {
                if(d === 'right') deleteTask(data.id, () => swipeableRef.current?.close())
              }
            }
        >
            <Animated.View style={styles.cardContainer}>
                <Text style={{color:COLOR_4}}>
                    {data.title}
                </Text>
            </Animated.View>
        </ReanimatedSwipeable>
    </Animated.View>
  );
};

const API_URL = `http://${process.env.EXPO_PUBLIC_BACKEND_IP}:3000/`

const ToDoList = () => {
  const [tasks, setTasks] = useState([])
  const [curInput, setCurInput] = useState("")
  const [loading, setLoading] = useState(false)
  const swipeableRef = useRef(null)

  const fetchAllTasks = async () => {
    try{
      setLoading(true)
      const resp = await axios.get(`${API_URL}tasks`)
      setTasks(resp.data)
    }catch(e){
      Alert.alert("Erreur", e.message || "Erreur lors du chargement des tasks.")
    }finally{
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAllTasks()
  }, [])

  const addTask = async () => {
    if(!curInput.trim()){
      Alert.alert("Attention", "Veuillez mettre un titre a la task!")
      return;
    }

    try{
      await axios.post(`${API_URL}task`, {
        title: curInput
      })

      setCurInput('')
      fetchAllTasks()
    }catch(e){
      Alert.alert("Erreur", e.response?.data?.erreur || "Erreur lors de l'ajout de la task!")
    }
  }

  const deleteTask = async (id, closeSwipeable) => {
    Alert.alert(
      "Confirmation",
      "Voulez-vous vraiment supprimer cette task",
      [
        {
          text:"Annuler",
          style: "cancel",
          onPress: () => {if(closeSwipeable) closeSwipeable()}
        },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            try{
              await axios.delete(`${API_URL}tasks/${id}`)
              setTasks(tasks.filter(t => t.id !== id))
            }catch(e){
              Alert.alert("Erreur", "Erreur lors de la suppression!")
              if(closeSwipeable) closeSwipeable()
            }
          }
        }
      ]
    )
  }
  

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputsContainer}>
        <TextInput 
          style={styles.input}
          placeholder='Entrez une tâche à accomplir'
          placeholderTextColor={COLOR_3}
          value={curInput}
          onChangeText={setCurInput}
        />
        <TouchableOpacity onPress={addTask} style={styles.addBtnContainer}>
          <Text style={styles.addBtnText}>+</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={tasks}
        renderItem={({item}) => <Card data={item} deleteTask={deleteTask} swipeableRef={swipeableRef}/>}
        keyExtractor={(item) => item.id.toString()}
        />
    </SafeAreaView>
  )
}

export default ToDoList

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: COLOR_1,
    padding: 20
  },
  inputsContainer: {
    flexDirection: "row",
    marginTop: 10
  },
  input: {
    backgroundColor: COLOR_2,
    flex: 1,
    textAlign: "center",
    color: COLOR_4,
    paddingHorizontal: 10
  },
  addBtnContainer:{
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLOR_4,
  },
  addBtnText:{
    fontSize: 30,
    fontWeight: "600",
    paddingVertical: 10,
    paddingHorizontal: 20
  },
  cardContainer: {
    backgroundColor: COLOR_2,
    marginVertical: 8,
    padding: 20,
  },

  deleteBackground: {
    backgroundColor: 'red',
    marginVertical: 8,
    justifyContent: 'center',
    paddingLeft: 20,
    flex: 1
  },
  deleteText: {
    color: 'white',
    fontWeight: 'bold',
  }
})