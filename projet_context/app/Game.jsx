import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import * as SQLite from 'expo-sqlite';
import * as ScreenOrientation from 'expo-screen-orientation';

const { width } = Dimensions.get('window');
const CONTAINER_SIZE = width * 0.75;
const BUBBLE_SIZE = 36;
const MAX_OFFSET = (CONTAINER_SIZE - BUBBLE_SIZE) / 2;

// getRandomTarget est une fonction qui retourne un objet contenant deux coordonnées,
// x et y, générées aléatoirement dans l'intervalle ]-0.6, 0.6[ multiplié par MAX_OFFSET.
const getRandomTarget = () =>  ({x: (Math.random() * 1.2 - 0.6) * MAX_OFFSET, y: (Math.random() * 1.2 - 0.6) * MAX_OFFSET})

export default function Game() {
  const [data, setData] = useState({ x: 0, y: 0, z: 0 });
  const [isAvailable, setIsAvailable] = useState(false);

  const [gameState, setGameState] = useState('IDLE'); // Options: IDLE, PLAYING, WON
  const [score, setScore] = useState(0);
  const [target, setTarget] = useState({ x: 0, y: 0 });
  const [startTime, setStartTime] = useState(0);
  const [elapsedTime, setElapsedTime] = useState('0.0');

  const [highScores, setHighScores] = useState([]);

  const [db, setDb] = useState(null);
  useEffect(() => {
    async function setDatabase() {
        const database = await SQLite.openDatabaseAsync('gameScores.db');
        setDb(database);

        await database.execAsync(`
                CREATE TABLE IF NOT EXISTS scores(
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    time REAL
                );
            `)
    }
    // setDatabase();
  }, [])

  const loadScores = async (databse) => {
    const result = await database.getAllAsync('SELECT time FROM scores');
    setHighScores(result);
  }


    const startGame = () => {
    // Mettez à jour les états nécessaires au démarrage d'une nouvelle partie.
    setGameState('PLAYING');
    setScore(0);
    setTarget(getRandomTarget);
    setStartTime(Date.now);
    setElapsedTime('0.0')
    };

  useEffect(() => {
    // Lock orientation to landscape when the screen loads
    async function lockOrientation() {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT
      );
    }
    lockOrientation();
  
    // Unlock or reset orientation when leaving the screen
    return () => {
      ScreenOrientation.unlockAsync();
    };
  }, []);

  useEffect(() => {
    // Créez un écouteur qui récupère les données de l'accéléromètre
    // et met à jour l'état data en conséquence.
    Accelerometer.isAvailableAsync().then(setIsAvailable);
    Accelerometer.setUpdateInterval(16);
    const listenerAccelerometer = Accelerometer.addListener((accelerometerData) => setData(accelerometerData));
    return () => listenerAccelerometer.remove();
  }, []);

  // Créez les variables xOffset et yOffset à partir des données de data.
  // Leurs valeurs doivent être comprises entre -MAX_OFFSET et MAX_OFFSET.
  const xOffset = -Math.max(Math.min(1, data.x)) * MAX_OFFSET;
  const yOffset = Math.max(Math.min(1, data.y)) * MAX_OFFSET;

  const compareTime = (a, b) => {
      if(a.time = b.time) return 0;
      if(a.time > b.time) return 1;
      if(a.time < b.time) return -1;
  }

  useEffect(() => {
    if (gameState !== 'PLAYING') return;


    // Calculez la distance euclidienne entre la bulle et la cible.
    const distance = Math.sqrt(Math.pow(target.x - xOffset, 2) + Math.pow(target.y - yOffset, 2));

    if (distance < 25) {
      // Ajoutez 1 au score.
      const nextScore = score + 1;
      // Vérifiez si la partie est terminée. Si oui, terminez-la et enregistrez
      // le temps final avec deux chiffres après la virgule.
      if (nextScore >= 10) {
          setGameState('WON');
          setElapsedTime(((Date.now() - startTime) / 1000).toFixed(2));
          let nextHighScrores = highScores;
          nextHighScrores.push({time: elapsedTime});
          nextHighScrores.sort(compareTime);
          if(nextHighScrores.length > 3){
            setHighScores(() => nextHighScrores.slice(0, 3));
          }
          return;
        }
        // Sinon, mettez à jour le score et faites apparaître la prochaine cible.
        setScore(nextScore);
        setTarget(getRandomTarget);

    }
  }, [xOffset, yOffset, gameState]);
  
  useEffect(() => {
    let timer;
    if (gameState === 'PLAYING') {
      timer = setInterval(() => {
        setElapsedTime(((Date.now() - startTime) / 1000).toFixed(1));
      }, 100);
    }
    return () => clearInterval(timer);
  }, [gameState, startTime]);

  if (!isAvailable) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Accelerometer not available.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎯 Tilt Balance Challenge</Text>

      {/* Top Showcase / Leaderboard */}
      <View style={styles.leaderboardCard}>
        <Text style={styles.leaderboardTitle}>🏆 Top 3 Best Times</Text>
        {highScores.length === 0 ? (
          <Text style={styles.noScoresText}>No scores saved yet. Play a game!</Text>
        ) : (
          highScores.map((item, index) => (
            <View key={index} style={styles.scoreRow}>
              <Text style={styles.rankText}>#{index + 1}</Text>
              <Text style={styles.scoreText}>{item.time}s</Text>
            </View>
          ))
        )}
      </View>

      {/* Game Arena */}
      <View style={styles.levelContainer}>
        <View style={styles.crosshairVertical} />
        <View style={styles.crosshairHorizontal} />

        {gameState === 'PLAYING' && (
          <View
            style={[
              styles.targetNode,
              { transform: [{ translateX: target.x }, { translateY: target.y }] },
            ]}
          >
            <Text style={styles.targetNumber}>{score + 1}</Text>
          </View>
        )}

        <View
          style={[
            styles.bubble,
            { transform: [{ translateX: xOffset }, { translateY: yOffset }] },
          ]}
        />
      </View>

      {/* HUD / Controls Card */}
      <View style={styles.statsCard}>
        {gameState === 'IDLE' && (
          <TouchableOpacity style={styles.button} onPress={startGame}>
            <Text style={styles.buttonText}>START GAME</Text>
          </TouchableOpacity>
        )}

        {gameState === 'PLAYING' && (
          <View style={styles.hudRow}>
            <View style={styles.hudItem}>
              <Text style={styles.label}>Target:</Text>
              <Text style={styles.hudValue}>{score + 1} / 10</Text>
            </View>
            <View style={styles.hudItem}>
              <Text style={styles.label}>Time:</Text>
              <Text style={styles.hudValue}>{elapsedTime}s</Text>
            </View>
          </View>
        )}

        {gameState === 'WON' && (
          <View style={styles.winContainer}>
            <Text style={styles.winTitle}>🎉 Score: {elapsedTime}s! 🎉</Text>
            <TouchableOpacity style={[styles.button, { marginTop: 10 }]} onPress={startGame}>
              <Text style={styles.buttonText}>PLAY AGAIN</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#f8fafc',
    marginBottom: 10,
    textAlign: 'center',
  },
  leaderboardCard: {
    width: '100%',
    maxWidth: 300,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#334155',
  },
  leaderboardTitle: {
    color: '#fbbf24',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 6,
    textAlign: 'center',
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 2,
    paddingHorizontal: 15,
  },
  rankText: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: '600',
  },
  scoreText: {
    color: '#f8fafc',
    fontSize: 14,
    fontWeight: 'bold',
  },
  noScoresText: {
    color: '#64748b',
    fontSize: 12,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  levelContainer: {
    width: CONTAINER_SIZE,
    height: CONTAINER_SIZE,
    borderRadius: CONTAINER_SIZE / 2,
    borderWidth: 4,
    borderColor: '#334155',
    backgroundColor: '#1e293b',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  crosshairVertical: {
    position: 'absolute',
    width: 1,
    height: '100%',
    backgroundColor: '#334155',
  },
  crosshairHorizontal: {
    position: 'absolute',
    width: '100%',
    height: 1,
    backgroundColor: '#334155',
  },
  bubble: {
    width: BUBBLE_SIZE,
    height: BUBBLE_SIZE,
    borderRadius: BUBBLE_SIZE / 2,
    backgroundColor: '#3b82f6',
    position: 'absolute',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5,
  },
  targetNode: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderWidth: 2,
    borderColor: '#ef4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  targetNumber: {
    color: '#f8fafc',
    fontSize: 14,
    fontWeight: 'bold',
  },
  statsCard: {
    marginTop: 15,
    width: '100%',
    maxWidth: 300,
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 15,
    borderWidth: 1,
    borderColor: '#334155',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#22c55e',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  hudRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  hudItem: {
    alignItems: 'center',
  },
  label: {
    color: '#94a3b8',
    fontSize: 13,
    marginBottom: 2,
  },
  hudValue: {
    color: '#f8fafc',
    fontSize: 18,
    fontWeight: 'bold',
  },
  winContainer: {
    alignItems: 'center',
    width: '100%',
  },
  winTitle: {
    color: '#4ade80',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 16,
  },
});