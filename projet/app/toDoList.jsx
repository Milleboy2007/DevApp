import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';

const COLOR_1 = "#000000";
const COLOR_2 = "#282A3A";
const COLOR_3 = '#735F32';
const COLOR_4 = '#C69749';

const RightAction = (data, setTasks) => {
    setTasks((prev) => prev.filter(t => t != data));
}

const Card = ({data}) => {
  return (
    <Animated.View>
        <ReanimatedSwipeable
            containerStyle={{flex:1}}
            onSwipeableWillOpen={() => RightAction(data, setTasks)}
        >
            <Animated.View style={styles.cardContainer}>
                <Text style={{color:COLOR_4}}>
                    {data}
                </Text>
            </Animated.View>
        </ReanimatedSwipeable>
    </Animated.View>
  );
};

const ToDoList = () => {
  const [tasks, setTasks] = useState(["Pratiquer mon lancer de frisbee", "Me questionner sur la vie", "Corriger les examens"])
  const [curInput, setCurInput] = useState("")
  
  const addEvent = () => {
    if (curInput.trim() !== "") {
      setTasks(prev => [...prev, curInput])
      setCurInput("")
    }
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
        <TouchableOpacity onPress={addEvent} style={styles.addBtnContainer}>
          <Text style={styles.addBtnText}>+</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={tasks}
        renderItem={({item}) => <Card data={item} setTasks={setTasks}/>}
        keyExtractor={(item) => item}
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
  }
})