//(pokemon)/pokemon-start.jsx
import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useTabNameContext } from '../../contexts/tabNameContext';
import { useFocusEffect } from 'expo-router';

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
    setTabName("pokemon Start")
  })

  return (
    <>
      <Text>🔥 Table des Types Pokémon 🍃</Text>
      <Text>COMBAT ! ⚔️</Text>
      <Text>👑</Text>
    </>
  );
}

export default TypeCalculator