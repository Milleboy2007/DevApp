import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    TextInput,
    TouchableOpacity,
} from 'react-native';
import Animated, { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import * as SQLite from 'expo-sqlite';
import axios from 'axios';

const COLOR_1 = "#000000";
const COLOR_2 = "#282A3A";
const COLOR_3 = '#735F32';
const COLOR_4 = '#C69749';

//const API_URL = `http://${process.env.EXPO_PUBLIC_BACKEND_IP}:3000/tasks`;

const Card = ({ data, supprimerTask }) => {
    const renderRightActions = (progress, dragX) => {
        return (
            <View>
                <Text>Supprimer</Text>
            </View>
        );
    };
    return (
        <Animated.View
            entering={FadeIn.duration(300)}
            exiting={FadeOut.duration(300)}
            layout={LinearTransition.duration(200)}
        >
                <ReanimatedSwipeable
                    friction={2}
                    leftThreshold={40}
                    renderRightActions={renderRightActions}
                    onSwipeableWillOpen={(direction) => {
                        if (direction === "left") {
                            supprimerTask(data.id);
                        }
                    }}
                >
                    <View style={styles.cardContainer}>
                        <Text style={{ color: COLOR_4 }}>
                            {data.title} {data.synced === 0 && " (En attente...)"} {data.is_deleted}
                        </Text>
                    </View>
                </ReanimatedSwipeable>
        </Animated.View>
    );
};
export default function Offline_first() {
    const [tasks, setTasks] = useState([]);
    const [curInput, setCurInput] = useState("");
    const [db, setDb] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function setupDatabase() {
            const database = await SQLite.openDatabaseAsync('tasks.db');
            setDb(database);

            await database.execAsync(`
                CREATE TABLE IF NOT EXISTS local_tasks (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    server_id INTEGER,
                    title TEXT NOT NULL,
                    completed INTEGER DEFAULT 0,
                    synced INTEGER DEFAULT 0,
                    is_deleted INTEGER DEFAULT 0
                );
            `);

            const allTasks = await database.getAllAsync('SELECT * FROM local_tasks WHERE is_deleted = 0');
            setTasks(allTasks);
            setLoading(false);
        }
        setupDatabase();
    }, []);

    // useEffect(() => {
    //     if(!db) return;

        
    // }, [db])

    // const syncWithServer = async (db) => {

    // }

    const loadDB = async (db) => {
        const result = await db.getAllAsync('SELECT * FROM local_tasks;');
        setTasks(result);
    }

    const ajouterTask = async () => {
        if (curInput.trim() === "") return;
        const newTask = { 
            id: Date.now().toString(), 
            title: curInput, 
            completed: 0 
        };

        if(db){
            await db.runAsync(
                'INSERT INTO local_tasks (server_id, title, synced) VALUES(?, ?, 0);',
                [newTask.server_id, newTask.title]
            )

            await loadDB(db);
        }

        setCurInput("");
    };

    const supprimerTask = async (id) => {
        if(!db) return;
        
        const task = await db.getFirstAsync('SELECT * FROM local_tasks WHERE id = ?;', [id]);
        if(task){
            await db.runAsync('DELETE FROM local_tasks WHERE id = ?;', [task.id]);
            await loadDB(db);
        }else console.error("404 - Task not found!");

    };

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
                <TouchableOpacity onPress={ajouterTask} style={styles.addBtnContainer}>
                    <Text style={styles.addBtnText}>+</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={tasks}
                renderItem={({ item }) => <Card data={item} supprimerTask={supprimerTask} />}
                keyExtractor={(item) => item.id.toString()}
                style={{ flex: 1, marginVertical: 20 }}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLOR_1, padding: 20 },
    inputsContainer: { flexDirection: "row", marginTop: 10 },
    input: { backgroundColor: COLOR_2, flex: 1, textAlign: "center", color: COLOR_4, paddingHorizontal: 10, height: 50 },
    addBtnContainer: { justifyContent: "center", alignItems: "center", backgroundColor: COLOR_4 },
    addBtnText: { fontSize: 30, fontWeight: "600", paddingVertical: 5, paddingHorizontal: 20 },
    cardContainer: { backgroundColor: COLOR_2, marginVertical: 8, padding: 20 }
});