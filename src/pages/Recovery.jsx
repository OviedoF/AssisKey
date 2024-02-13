import React, { useContext, useEffect, useRef, useState } from 'react'
import { Text, TextInput, TouchableOpacity, View, Linking, ScrollView } from 'react-native'
import styles from '../styles/styles'
import { useNavigate } from 'react-router-native'
import petitions from '../api/calls'
import { dataContext } from '../context/dataContext'
import routes from '../router/routes'
import ReplaceWithLoading from '../components/ReplaceWithLoading'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons'

export default function Recovery() {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const { setLoading, setSnackbar } = useContext(dataContext)

    const sendEmail = async () => {
        try {
            setLoading(true)
            const res = await petitions.recoverPassword({
                CorreoDestino: email,
                Observacion: ''
            })

            if (res.data === "Correo no encontrado") {
                setSnackbar({
                    visible: true,
                    text: 'El correo ingresado no existe',
                    type: 'error'
                })
                return
            }

            setSnackbar({
                visible: true,
                text: res.data,
                type: 'success'
            })
            navigate(routes.login)
        } catch (e) {
            setSnackbar({
                visible: true,
                text: 'Ha ocurrido un error al enviar el correo',
                type: 'error'
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <View style={[styles.main]}>
            <TouchableOpacity onPress={() => navigate(routes.login)} style={{
                position: 'absolute',
                top: 70,
                left: 20,
            }}>
                <FontAwesomeIcon icon={faAngleLeft} size={30} />
            </TouchableOpacity>

            <ScrollView contentContainerStyle={{
                flexGrow: 1,
                justifyContent: 'center',
            }}>
                <View>
                    <Text style={[{
                        fontSize: 18,
                        textAlign: 'center',
                        fontWeight: 'bold',
                        marginBottom: 20
                    }]}>Recupera tu clave de acceso</Text>
                    <Text style={{
                        marginBottom: 20,
                        fontSize: 14,
                        lineHeight: 20,
                        textAlign: 'center'
                    }}>
                        Ingresa tu correo para enviarte tu clave de acceso al sistema.
                    </Text>
                </View>

                <View style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                }}>
                    <TextInput style={[styles.input, {
                        flex: 1,
                        marginRight: 10,
                    }]} placeholder="Correo electrónico" value={email} onChangeText={text => setEmail(text)} />
                </View>

                <ReplaceWithLoading>
                    <TouchableOpacity style={[styles.buttonAlt, {
                        marginTop: 10,
                        backgroundColor: email ? '#64CCC5' : '#ccc'
                    }]} onPress={() => sendEmail()} disabled={!email}>
                        <Text style={styles.buttonText}>Enviar correo</Text>
                    </TouchableOpacity>
                </ReplaceWithLoading>
            </ScrollView>
        </View>
    )
}
