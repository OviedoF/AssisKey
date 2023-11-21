import React, { useContext, useState } from 'react'
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import styles from '../styles/styles'
import { useNavigate } from 'react-router-native'
import routes from '../router/routes'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { dataContext } from '../context/dataContext'
import ReplaceWithLoading from '../components/ReplaceWithLoading'

export default function Init() {
    const { setSnackbar, setLoading } = useContext(dataContext)
    const navigate = useNavigate()
    const [form, setForm] = useState({
        document: '',
        password: ''
    })

    const handleSaveData = async () => {
        try {
            setLoading(true)
            await AsyncStorage.setItem('document', form.document)
            await AsyncStorage.setItem('password', form.password)

            setSnackbar({
                visible: true,
                type: 'success',
                text: '¡Datos guardados correctamente!'
            })

            setLoading(false)
            navigate(routes.login)
        } catch (error) {
            console.log(error)
            setSnackbar({
                visible: true,
                type: 'error',
                text: '¡Error al guardar los datos!'
            })
        }
    }

    useState(() => {
        const checkIfDocumentExists = async () => {
            const document = await AsyncStorage.getItem('document')
            if (document) return navigate(routes.login)
        }

        checkIfDocumentExists()
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
                        <Text style={styles.buttonText}>Ingresar</Text>
                    </TouchableOpacity>
                </View>
            </ReplaceWithLoading>
        </View>
    )
}
