import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, useWindowDimensions, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import * as SQLite from 'expo-sqlite';
import NetInfo from '@react-native-community/netinfo';
import axios from 'axios'

const TARGET_CLICKS = 20;
const API_URL = `http://${process.env.EXPO_PUBLIC_BACKEND_IP}:3000/`; // Remplacez par l'IP de votre serveur Express

// Initialisation de la base de données SQLite locale unique
const db = SQLite.openDatabaseSync('grand_prix_v2.db');


export default function App() {
    const { width } = useWindowDimensions()
    const TRACK_DISTANCE = width * 0.75
    const [isOnline, setIsOnline] = useState(false)
    const [time, setTime] = useState(0)
    const timerRef = useRef(null)
    const carPosition = useSharedValue(0)
    const carAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: carPosition.value }]
        };
    })
    const [isFinished, setIsFinished] = useState(false)
    const [clicksCount, setClicksCount] = useState(0)
    const [topScores, setTopScores] = useState([])
    const [playerName, setPlayerName] = useState("")

    useEffect(() => {
        db.execSync(
            `
            CREATE TABLE IF NOT EXISTS scores (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name VARCHAR(100) NOT NULL,
                score FLOAT NOT NULL,
                updated_at DATETIME NOT NULL
            );
            `
        )
        loadScores()
    }, [])

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            setIsOnline(state.isConnected);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    useEffect(() => {
        loadScores()
    }, [isOnline])

    useEffect(() => {
        const syncInterval = setInterval(() => {
            if(isOnline){
                loadScores()
            }
        }, 60000)

        return () => clearInterval(syncInterval)
    }, [isOnline])

    const handlePress = () => {
        const newClicksCount = clicksCount + 1;
        setClicksCount(newClicksCount);

        // 1. FAIRE AVANCER LA VOITURE
        // On calcule la distance à parcourir pour un clic
        const stepDistance = TRACK_DISTANCE / TARGET_CLICKS;
        // On anime la position vers la nouvelle cible
        carPosition.value = withTiming(newClicksCount * stepDistance, { duration: 10, easing: Easing.linear });

        // 2. LE CHRONOMÈTRE
        if (newClicksCount === 1) {
            // Premier clic : on démarre l'intervalle toutes les 100ms
            timerRef.current = setInterval(() => {
                setTime(prevTime => prevTime + 0.1);
            }, 100);
        }

        // 3. LA FIN DE LA COURSE
        if (newClicksCount >= TARGET_CLICKS) {
            setIsFinished(true); // On affiche l'écran de victoire
            clearInterval(timerRef.current); // TRÈS IMPORTANT : On arrête le chronomètre !
        }
    };

    const saveScore = async (playerName, time) => {
        if(playerName.trim() === "") {
            Alert.alert("Erreur: entre un nom!");
            return;
        } 

        const currentDate = new Date().toISOString();

        await db.runAsync('INSERT INTO scores (name, score, updated_at) VALUES (?, ?, ?)',[playerName, time, currentDate])
        
        if(isOnline){
            try{
                await axios.post(`${API_URL}scores`,{
                    name: playerName,
                    score: time,
                    updated_at: currentDate
                })
            }catch(error){

            }
        }

        loadScores()

        setTime(0)
        setClicksCount(0)
        setIsFinished(false)
        carPosition.value = 0
        setPlayerName("")
    }

    const loadScores = async () => {
        if(isOnline){
            try{
                const resp = await axios.get(`${API_URL}scores`)
                const data = resp.data
                const sortedData = data.sort((a, b) => a.score - b.score).slice(0,5)
                setTopScores(sortedData)
            }catch(error){
                console.error("Cahrgement impossible: ", error)
                loadLocalScores()
            }
        }else loadLocalScores()
        
    }

    const loadLocalScores = async () => {
        const result = await db.getAllAsync('SELECT * FROM scores ORDER BY score ASC LIMIT 5')
        setTopScores(result)
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Grand Prix Expo</Text>
                <Text style={[styles.statusText, { color: isOnline ? '#00ffcc' : '#ff4757' }]}>
                    {isOnline ? '🟢 En ligne' : '🔴 Hors-ligne (Table unique SQLite)'}
                </Text>
            </View>

            <View style={styles.chronoContainer}>
                <Text style={styles.chronoText}>{time.toFixed(2)} s</Text>
            </View>

            <View style={styles.trackContainer}>
                <View style={styles.track}>
                    <View style={styles.startLine} />
                    <View style={styles.finishLine} />
                    <Animated.View style={[styles.car, carAnimatedStyle]}>
                        <View style={styles.windshield} />
                        <View style={styles.wheelFront} />
                        <View style={styles.wheelBack} />
                    </Animated.View>
                </View>
            </View>

            <View style={styles.controls}>
                {!isFinished ? (
                    <>
                        <TouchableOpacity style={styles.button} onPress={handlePress} activeOpacity={0.7}>
                            <Text style={styles.buttonText}>ACCÉLÉRER !</Text>
                        </TouchableOpacity>
                        <Text style={styles.counter}>
                            Clics : <Text style={styles.highlight}>{clicksCount} / {TARGET_CLICKS}</Text>
                        </Text>
                    </>
                ) : (
                    <View style={styles.winContainer}>
                        <Text style={styles.winText}>🏁 Temps : {time.toFixed(2)}s !</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Votre nom / pseudo"
                            placeholderTextColor="#888"
                            value={playerName}
                            onChangeText={setPlayerName}
                        />
                        <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={() => saveScore(playerName, time)} activeOpacity={0.8}>
                            <Text style={styles.buttonText}>Enregistrer le score</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            <View style={styles.leaderboard}>
                <Text style={styles.leaderboardTitle}>🏆 Top 5 des Meilleurs Scores</Text>
                {topScores.map((item, index) => (
                    <View key={index} style={styles.scoreRow}>
                        <Text style={styles.scoreText}>{index + 1}. {item.name}</Text>
                        <Text style={styles.scoreTime}>{item.score} s</Text>
                    </View>
                ))}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0f1020', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 20 },
    header: { alignItems: 'center' },
    title: { fontSize: 26, fontWeight: '900', color: '#ff2e63', textTransform: 'uppercase', letterSpacing: 2 },
    statusText: { fontSize: 12, marginTop: 4, fontWeight: 'bold' },
    chronoContainer: { backgroundColor: '#1b1c31', paddingVertical: 8, paddingHorizontal: 25, borderRadius: 15, borderWidth: 2, borderColor: '#3d3d5c' },
    chronoText: { fontSize: 32, fontWeight: 'bold', color: '#00ffcc', fontVariant: ['tabular-nums'] },
    trackContainer: { width: '92%', backgroundColor: '#1b1c31', borderRadius: 20, padding: 15, borderWidth: 2, borderColor: '#e94560' },
    track: { position: 'relative', height: 90, backgroundColor: '#12121e', borderRadius: 12, justifyContent: 'center', overflow: 'hidden' },
    startLine: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 8, backgroundColor: '#e74c3c' },
    finishLine: { position: 'absolute', right: 0, top: 0, bottom: 0, width: 16, backgroundColor: '#ffffff' },
    car: { position: 'absolute', left: 10, width: 70, height: 38, backgroundColor: '#ff2e63', borderRadius: 8, justifyContent: 'center' },
    windshield: { position: 'absolute', right: 12, top: 6, width: 20, height: 14, backgroundColor: '#0ff', borderTopRightRadius: 6 },
    wheelFront: { position: 'absolute', bottom: -6, left: 12, width: 14, height: 14, backgroundColor: '#111', borderRadius: 7, borderWidth: 2, borderColor: '#fff' },
    wheelBack: { position: 'absolute', bottom: -6, right: 12, width: 14, height: 14, backgroundColor: '#111', borderRadius: 7, borderWidth: 2, borderColor: '#fff' },
    controls: { alignItems: 'center', width: '100%' },
    button: { backgroundColor: '#ff2e63', paddingVertical: 15, paddingHorizontal: 35, borderRadius: 40, alignItems: 'center' },
    saveButton: { backgroundColor: '#00b894', marginTop: 10 },
    buttonText: { color: '#ffffff', fontSize: 18, fontWeight: '900', letterSpacing: 1 },
    counter: { fontSize: 16, color: '#ffffff', marginTop: 15 },
    highlight: { color: '#ff2e63', fontWeight: 'bold', fontSize: 18 },
    winContainer: { alignItems: 'center', width: '100%' },
    winText: { fontSize: 22, fontWeight: '900', color: '#00b894', marginBottom: 10 },
    input: { width: '80%', backgroundColor: '#1b1c31', color: '#fff', padding: 12, borderRadius: 10, textAlign: 'center', fontSize: 16, borderWidth: 1, borderColor: '#3d3d5c', marginBottom: 10 },
    leaderboard: { width: '85%', backgroundColor: '#1b1c31', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#3d3d5c' },
    leaderboardTitle: { color: '#ff2e63', fontSize: 16, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 },
    scoreRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4, borderBottomWidth: 1, borderBottomColor: '#252642' },
    scoreText: { color: '#fff', fontSize: 14 },
    scoreTime: { color: '#00ffcc', fontSize: 14, fontWeight: 'bold' }
});