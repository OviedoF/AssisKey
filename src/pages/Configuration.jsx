import React, { useContext, useState } from 'react'
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import styles from '../styles/styles'
import { useNavigate } from 'react-router-native'
import routes from '../router/routes'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { dataContext } from '../context/dataContext'
import ReplaceWithLoading from '../components/ReplaceWithLoading'
import axios from 'axios'
import petitions from '../api/calls'
import Navbar from '../components/Navbar'

export default function Configuration() {
    const { setSnackbar, setLoading, user, setUser } = useContext(dataContext)
    const navigate = useNavigate()
    const [form, setForm] = useState({
        document: user.nroDocIde,
        password: user.password
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
            navigate(routes.account)
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
                    }} value={
                        form.document
                    } />

                    <Text style={[styles.label, {
                        marginTop: 20
                    }]}>Ingrese su código de verificación:</Text>

                    <TextInput style={styles.input} secureTextEntry={true} placeholder='Contraseña' onChangeText={(value) => {
                        setForm({
                            ...form,
                            password: value
                        })
                    }} value={form.password} />

                    <TouchableOpacity style={[styles.button, {
                        marginTop: 20
                    }]} onPress={() => handleSaveData()}>
                        <Text style={styles.buttonText}>Guardar</Text>
                    </TouchableOpacity>
                </View>
            </ReplaceWithLoading>

            <Navbar />
        </View>
    )
}
