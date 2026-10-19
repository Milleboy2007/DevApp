import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, Image, FlatList } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { File, Paths } from 'expo-file-system';
import * as SQLite from 'expo-sqlite';
import { Modal } from 'react-native';
import { Pressable } from 'react-native';
import { TextInput } from 'react-native';


export default function TakePicture() {
    const [db, setDb] = useState(null);
    const [images, setImages] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [pictureName, setPictureName] = useState('');
    const [tempUri, setTempUri] = useState('');

    // 1. Initialisation de la base de données au chargement
    useEffect(() => {
        async function setupDatabase() {
            const database = await SQLite.openDatabaseAsync('gallery.db');
            setDb(database);

            await database.execAsync(`
                CREATE TABLE IF NOT EXISTS photos (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    uri TEXT NOT NULL,
                    title TEXT
                );
            `);
            loadPhotos(database);
        }
        setupDatabase();
    }, []);

    // Charger les photos depuis SQLite
    const loadPhotos = async (database) => {
        const result = await database.getAllAsync('SELECT * FROM photos;');
        setImages(result);
    };

    // Retirer les photos de la mémoire puis de la bd
    const deletePhoto = async (id) => {
        if (!db) return;

        const row = await db.getFirstAsync('SELECT uri FROM photos WHERE id = ?;', [id]);

        if (row && row.uri) {
            try {
                // 2. Retirer la photo
                const file = new File(row.uri);
                if (file.exists) {
                    file.delete();
                }
            } catch (error) {
                console.log("Error deleting file:", error);
            }
        }

        // 3. Retirer l'entrée de la bd
        await db.runAsync('DELETE FROM photos WHERE id = ?;', [id]);

        // 4. Rafraichir les données
        loadPhotos(db);
    };
    // 2. Prendre une photo et la stocker avec l'API FileSystem
    const takeAndSavePhoto = async () => {

        // Ne pas oublier de demander les permissions
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
        if (!permissionResult.granted) {
            alert("Permission d'accès à la caméra requise !");
            return;
        }

        // Prendre la photo
        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ['images'],
            quality: 0.7,
        });


        // Enregistrement
        if (!result.canceled) {
            setTempUri(result.assets[0].uri);
            setPictureName('');
            setModalVisible(true);
        }
    };

    const validatePicture = async () => {
        const fileName = tempUri.split('/').pop();

        // Créer une instance de fichier source et une instance de destination
        const sourceFile = new File(tempUri);
        const destinationFile = new File(Paths.document, fileName);

        // Déplacer le fichier en utilisant la nouvelle méthode orientée objet
        sourceFile.move(destinationFile);
        const permanentUri = destinationFile.uri;

        // Enregistrer l'URI dans SQLite
        if (db) {
            await db.runAsync(
                'INSERT INTO photos (uri, title) VALUES (?, ?);',
                [permanentUri, pictureName]
            );
            loadPhotos(db);
        }

        closeModal();
    }

    const closeModal = async () => {
        setPictureName('');
        setTempUri('');
        setModalVisible(false);
    }

    return (
        <View style={styles.container}>
            <Button onPress={takeAndSavePhoto} title="Prendre une photo" />

            <Text style={styles.title}>Galerie locale ({images.length})</Text>

            <FlatList
                data={images}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Image source={{ uri: item.uri }} style={styles.image} />
                        <Text>{item.title}</Text>
                        <Button title="Supprimer" color="red" onPress={() => deletePhoto(item.id)} />
                    </View>
                )}
            />

            <Modal
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(!modalVisible)}
            >
                 <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                    <Text style={styles.modalText}>Ajouter un titre a la photo</Text>
                    {tempUri &&
                        <Image source={{uri: tempUri}} style={styles.modalImage}/>
                    }
                    <TextInput
                        style={styles.modalInput}
                        onChangeText={e => setPictureName(e)}
                        placeholder='Ma super photo'
                    />
                        <View style={styles.modalButtonView}>
                            <Pressable
                                style={styles.modalCancelButton}
                                onPress={closeModal}
                            >
                                <Text>ANNULER</Text>
                            </Pressable>
                            <Pressable
                                style={styles.modalValidateButton}
                                onPress={validatePicture}
                            >
                                <Text>VALIDER</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 40,
        backgroundColor: '#fff',
        marginTop: 30
    },

    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 15
    },

    item: {
        marginBottom: 20,
        alignItems: 'center'
    },

    image: {
        width: 200,
        height: 200,
        borderRadius: 10,
        marginBottom: 5
    },


    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: '80%'
    },
    modalImage: {
        width: 150,
        height: 150,
        borderRadius: 12
    },
    modalButtonView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: "100%",
        marginTop: 10
    },
    modalValidateButton: {
        backgroundColor: "rgb(0, 133, 229)",
        padding: 5
    },
    modalCancelButton: {
        backgroundColor: "gray",
        padding: 5
    },
    modalInput: {
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 15,
        width: "100%"
    }
});