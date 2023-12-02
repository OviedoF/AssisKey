import React, { useContext, useEffect, useState } from 'react'
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import styles from '../styles/styles'
import { useNavigate } from 'react-router-native'
import routes from '../router/routes'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { dataContext } from '../context/dataContext'
import ReplaceWithLoading from '../components/ReplaceWithLoading'
import petitions from '../api/calls'

export default function Init() {
    const { setSnackbar, setLoading, user, setUser } = useContext(dataContext)
    const navigate = useNavigate()
    const [form, setForm] = useState({
        document: '',
        password: ''
    })

    const handleSaveData = async () => {
        try {
            setLoading(true)

            if (!form.document || !form.password) return setSnackbar({
                visible: true,
                type: 'error',
                text: '¡Debes llenar todos los campos!'
            })

            const verify = await petitions.getUserInfo({
                dni: form.document,
                codigo: form.password,
                idDB: user.idEmpresa,
                Authorization: user.token
            })

            if (verify.data[0] && verify.data[0] === "Empleado no encontrado") {
                setLoading(false)
                return setSnackbar({
                    visible: true,
                    type: 'error',
                    text: '¡Usuario no encontrado!'
                })
            }

            await AsyncStorage.setItem('document', form.document)
            await AsyncStorage.setItem('password', form.password)

            setSnackbar({
                visible: true,
                type: 'success',
                text: '¡Datos guardados correctamente!'
            })

            setUser({
                ...user,
                ...verify.data[0]
            })

            setLoading(false)
            navigate(routes.home)
        } catch (error) {
            console.log(error)
            setLoading(false)
            setSnackbar({
                visible: true,
                type: 'error',
                text: 'Sesion expirada, vuelve a iniciar sesion'
            })
        }
    }

    useState(() => {
        const checkIfDocumentExists = async () => {
            const document = await AsyncStorage.getItem('document')
            const password = await AsyncStorage.getItem('password') 

            if (!document || !password) return setLoading(false)

            const verify = await petitions.getUserInfo({
                dni: document,
                codigo: password,
                idDB: user.idEmpresa,
                Authorization: user.token
            })

            if (verify.data[0] && verify.data[0] === "Empleado no encontrado") {
                setLoading(false)
                setForm({
                    document: document,
                    password: password
                })

                return setSnackbar({
                    visible: true,
                    type: 'error',
                    text: '¡Tienes un documento no válido para esta empresa!'
                })
            }  

            setUser({
                ...user,
                ...verify.data[0]
            })

            setLoading(false)
            if (document) return navigate(routes.home)
        }

        checkIfDocumentExists()
    }, [])

    useEffect(() => {
    }, [])

    return (
        <View style={[styles.mainWhite]}>
            <ReplaceWithLoading>
                <View style={styles.flexColumn}>
                    <Text style={styles.label}>Ingresa el número de tu documento:</Text>
                    <TextInput style={styles.input} keyboardType="numeric" placeholder='Número de documento' onChangeText={(value) => {
                        setForm({
                            ...form,
                            document: value
                        })
                    }} />

                    <Text style={[styles.label, {
                        marginTop: 20
                    }]}>Ingrese su código de verificación:</Text>

                    <TextInput style={styles.input} secureTextEntry={true} placeholder='Contraseña' onChangeText={(value) => {
                        setForm({
                            ...form,
                            password: value
                        })
                    }} />

                    <TouchableOpacity style={[styles.button, {
                        marginTop: 20
                    }]} onPress={() => handleSaveData()}>
                        <Text style={styles.buttonText}>Guardar</Text>
                    </TouchableOpacity>
                </View>
            </ReplaceWithLoading>
        </View>
    )
}
