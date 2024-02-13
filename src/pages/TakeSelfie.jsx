import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useNavigate } from 'react-router-native';
import { dataContext } from '../context/dataContext';
import ReplaceWithLoading from '../components/ReplaceWithLoading';
import { Camera } from 'expo-camera';
import routes from '../router/routes';
import { colors } from '../styles/styles';
import Navbar from '../components/Navbar';
import { Image } from 'react-native';
import * as FileSystem from 'expo-file-system';
import petitions from '../api/calls';
import { ActivityIndicator } from 'react-native-paper';


export default function Selfie() {
    const [hasPermission, setHasPermission] = useState(null);
    const [cameraRef, setCameraRef] = useState(null);
    const [image, setImage] = useState(null);
    const { setSnackbar, setLoading, user, loading, setUser } = useContext(dataContext)
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            setLoading(true);
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');

            if (status !== 'granted') {
                setSnackbar({
                    visible: true,
                    text: 'Se necesitan permisos para usar la cámara',
                    type: 'error',
                });
                navigate(routes.home);
            }

            setLoading(false);
        })();
    }, []);

    const takePicture = async () => {
        if (cameraRef) {
            try {
                const photo = await cameraRef.takePictureAsync();
                setImage(photo);
            } catch (error) {
                console.error('Error al tomar la foto y enviarla a la API:', error);
                setSnackbar({
                    visible: true,
                    text: 'Error al tomar la foto',
                    type: 'error',
                });
            }
        }
    };

    const sendPicture = async () => {
        if (image) {
            try {
                setLoading(true);
                const imageBase64 = await FileSystem.readAsStringAsync(image.uri, { encoding: FileSystem.EncodingType.Base64 });

                const body = new FormData();
                body.append('foto', imageBase64);

                const header = {
                    idTrabajador: user.id,
                    idDB: user.idEmpresa,
                    Authorization: user.token,
                }

                const res = await petitions.changeSelfie(header, body);

                setLoading(false);
                setUser({
                    ...user,
                    idFile: res.data
                });
                navigate(routes.home);
            } catch (error) {
                console.error('Error al enviar la foto a la API:', error);
                setSnackbar({
                    visible: true,
                    text: 'Error al enviar la foto',
                    type: 'error',
                });
            }
        } else {
            setLoading(false);
            setSnackbar({
                visible: true,
                text: 'No se ha tomado ninguna foto',
                type: 'error',
            });
            return;
        }
    };

    if (hasPermission === null) {
        return <Text style={{
            marginVertical: 60,
            flex: 1,
            textAlign: 'center',
        }}>
            <ActivityIndicator size="large" color="#64CCC5" />
        </Text>;
    }

    return (
        <View style={styles.container}>
            {loading && <Text style={{
                marginVertical: 20,
                textAlign: 'center',
            }}>
                Cargando...
            </Text>}

            <ReplaceWithLoading>
                <>
                    {image ? <View
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Image
                            source={{ uri: image.uri }}
                            style={{
                                width: 300,
                                height: 300,
                                borderRadius: 1000,
                            }}
                        />
                    </View>
                        : <Camera
                            style={styles.camera}
                            type={Camera.Constants.Type.front}
                            ref={ref => {
                                setCameraRef(ref);
                            }}
                            ratio='4:3'
                        >
                            <View
                                style={{
                                    flex: 1,
                                    backgroundColor: 'transparent',
                                    flexDirection: 'row',
                                }}
                            >

                                <TouchableOpacity
                                    style={{
                                        alignSelf: 'flex-end',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: '#ffffff80',
                                        borderRadius: 100,
                                        width: 70,
                                        height: 70,
                                        marginBottom: 20,
                                        marginRight: 20,
                                    }}
                                    onPress={() => navigate(routes.home)}
                                >
                                    <Text style={{
                                        fontSize: 20,
                                    }}>X</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={{
                                        alignSelf: 'flex-end',
                                        alignItems: 'center',
                                        backgroundColor: '#ffffff80',
                                        borderRadius: 100,
                                        width: 70,
                                        height: 70,
                                        marginBottom: 20,
                                    }}
                                    onPress={takePicture}
                                >
                                </TouchableOpacity>
                            </View>
                        </Camera>}

                    {image ? <TouchableOpacity
                        style={styles.button}
                        onPress={sendPicture}
                    >
                        <Text>Enviar</Text>
                    </TouchableOpacity>
                        : <TouchableOpacity
                            style={styles.button}
                            onPress={() => takePicture()}
                        >
                            <Text style={{

                            }}>Tomar foto</Text>
                        </TouchableOpacity>}

                    {image && <TouchableOpacity
                        style={styles.button}
                        onPress={() => setImage(null)}
                    >
                        <Text>Tomar otra</Text>
                    </TouchableOpacity>}

                    <Navbar />
                </>
            </ReplaceWithLoading>
        </View>
    );
}

const opacity = 'rgba(0, 0, 0, .6)';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: colors.white,
    },
    text: {
        backgroundColor: colors.green,
        color: 'black',
        fontSize: 16,
        padding: 15,
        opacity: 0.7,
        marginTop: 10,
        width: '90%',
        borderRadius: 10,
    },
    camera: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 400
    },
    layerTop: {
        flex: 1,
        backgroundColor: opacity,
    },
    layerCenter: {
        flex: 2,
        flexDirection: 'row',
    },
    layerLeft: {
        flex: 1,
        backgroundColor: opacity,
    },
    focused: {
        flex: 6,
    },
    layerRight: {
        flex: 1,
        backgroundColor: opacity,
    },
    layerBottom: {
        flex: 1,
        backgroundColor: opacity,
    },
    rescanButton: {
        backgroundColor: 'blue',
        padding: 15,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
    },
    button: {
        alignItems: 'center',
        backgroundColor: colors.green,
        padding: 20,
        borderRadius: 10,
        margin: 10,
    },
});