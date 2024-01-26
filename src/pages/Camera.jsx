import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBoltLightning, faXmark } from '@fortawesome/free-solid-svg-icons';
import routes from '../router/routes';
import { useNavigate } from 'react-router-native';
import { dataContext } from '../context/dataContext';
import ReplaceWithLoading from '../components/ReplaceWithLoading';
import AsyncStorage from '@react-native-async-storage/async-storage';
import petitions from '../api/calls';
import * as Location from 'expo-location';

export default function CameraPage() {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const { setSnackbar, setLoading, user, loading } = useContext(dataContext)
    const navigate = useNavigate();

    useEffect(() => {
        const getBarCodeScannerPermissions = async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();

            if (status === 'denied') {
                setSnackbar({ visible: true, text: 'No has dado acceso a la cámara', type: 'error' });
                return navigate(routes.home)
            }

            setHasPermission(status === 'granted');
        };

        getBarCodeScannerPermissions();
    }, []);

    const handleBarCodeScanned = async ({ type, data }) => {
        try {
            setScanned(true);
            setLoading(true);
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') return setSnackbar({ visible: true, text: 'Debe conceder permisos a la ubicación', type: 'error' });
      
            let location = await Promise.race([
                Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest }),
                new Promise((resolve) => setTimeout(resolve, 5000, { coords: { latitude: 0, longitude: 0 } }))
              ]);

            const document = await AsyncStorage.getItem('document')

            const form = {
                idTrabajador: document,
                latitud: location.coords.latitude,
                longitud: location.coords.longitude,
                idDB: user.idEmpresa,
                Authorization: user.token,
                QR: data,
                tipTrabajador: "A"
            }

            const response = await petitions.entryQR(form)

            const obj = response.data[0]

            if (!obj) {
                setSnackbar({ visible: true, text: 'Error al registrar la entrada', type: 'error' })
                return setLoading(false)
            };
            
            setSnackbar({ visible: true, text: obj.msg, type: 'success' })
            setScanned(null);
            return setLoading(false)
        } catch (error) {
            setLoading(false)
            console.log(error)
            navigate(routes.login)
            return setSnackbar({
                visible: true,
                text: 'Su sesión ha vencido, por favor vuelva a iniciar sesión',
                type: 'error'
            })
        }
    };

    if (hasPermission === null) {
        return <Text>Pidiendo acceso a la cámara</Text>;
    }

    return (
        <View style={styles.container}>
            {loading && <Text style={{
                marginVertical: 20,
                textAlign: 'center',
            }}>Espere mientras procesamos el QR...</Text>}

            <ReplaceWithLoading>
                <>
                    <BarCodeScanner
                        style={styles.camera}
                        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                    >
                        <Text style={{
                            color: 'white',
                            marginBottom: 10,
                        }}>Escanea el código QR</Text>

                        <View style={{
                            width: '80%',
                            height: '40%',
                            borderRadius: 20,
                            backgroundColor: 'transparent',
                            borderWidth: 4,
                            borderColor: 'white',
                        }} />

                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            marginTop: '10%',
                        }}>
                            <TouchableOpacity style={{
                                width: 70,
                                height: 70,
                                borderRadius: 50,
                                backgroundColor: 'black',
                                opacity: 0.7,
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginRight: '10%',
                            }}
                                onPress={() => alert('Flash')}
                            >
                                <FontAwesomeIcon icon={faBoltLightning} size={20} color="white" />
                            </TouchableOpacity>

                            <TouchableOpacity style={{
                                width: 70,
                                height: 70,
                                borderRadius: 50,
                                backgroundColor: 'black',
                                opacity: 0.7,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }} onPress={() => navigate(routes.home)}>
                                <FontAwesomeIcon icon={faXmark} size={20} color="white" />
                            </TouchableOpacity>
                        </View>
                    </BarCodeScanner>
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
    },
    text: {
        backgroundColor: 'black',
        color: 'white',
        fontSize: 16,
        padding: 15,
        opacity: 0.7,
        marginBottom: 20,
        borderRadius: 10,
    },
    camera: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
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
});