import React, { useContext, useEffect, useRef, useState } from 'react'
import { Text, TextInput, TouchableOpacity, View, Linking, ScrollView } from 'react-native'
import styles from '../styles/styles'
import { useNavigate } from 'react-router-native'
import petitions from '../api/calls'
import { dataContext } from '../context/dataContext'
import AsyncStorage from '@react-native-async-storage/async-storage';
import routes from '../router/routes'
import ReplaceWithLoading from '../components/ReplaceWithLoading'
import { Checkbox } from 'react-native-paper'

export default function Terms() {
    const navigate = useNavigate()
    const [accept, setAccept] = useState({
        terms: false,
        privacy: false,
    })

    const saveTerms = async () => {
        try {
            await AsyncStorage.setItem('terms', 'true')
            navigate(routes.login)
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <View style={[styles.main]}>
            <ScrollView contentContainerStyle={{
                flexGrow: 1,
                justifyContent: 'center',
            }}>
                <View style={{
                    borderWidth: 1,
                    borderColor: 'blue',
                    padding: 20,
                }}>
                    <Text style={[{
                        fontSize: 18,
                        textAlign: 'center',
                        fontWeight: 'bold',
                        marginBottom: 20
                    }]}>Términos y condiciones de uso</Text>
                    <Text style={{
                        marginBottom: 20,
                        fontSize: 14,
                        lineHeight: 20,
                        textAlign: 'center'
                    }}>
                        Bienvenido a Connect Clock, te invitamos a leer detalladamente los términos y condiciones de uso. Si no estás de acuerdo con estos términos, por favor, no utilices la aplicación.
                    </Text>

                    <Text style={[{
                        fontSize: 18,
                        textAlign: 'center',
                        fontWeight: 'bold',
                        marginBottom: 20
                    }]}>Políticas de privacidad</Text>
                    <Text style={{
                        marginBottom: 20,
                        fontSize: 14,
                        lineHeight: 20,
                        textAlign: 'center'
                    }}>
                        Así mismo, debes leer las Política de Privacidad que describe cómo recopilamos, utilizamos y compartimos la información personal de los usuarios de la aplicación.
                    </Text>
                </View>

                <View style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 10
                }}>
                    <Checkbox status={
                        accept.terms ? 'checked' : 'unchecked'
                    } onPress={() => setAccept({
                        ...accept,
                        terms: !accept.terms
                    })} />
                    <Text style={{
                        fontSize: 13,
                        lineHeight: 20,
                        textAlign: 'center'
                    }}>
                        Acepto los <Text style={{
                            color: 'blue'
                        }} onPress={
                            () => Linking.openURL('https://keyperu.net/tc/tcAppConnectClock.html')
                        }>
                            términos y condiciones
                        </Text> de uso.
                    </Text>
                </View>

                <View style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                }}>
                    <Checkbox status={
                        accept.privacy ? 'checked' : 'unchecked'
                    } onPress={
                        () => setAccept({
                            ...accept,
                            privacy: !accept.privacy
                        })
                    } />
                    <Text style={{
                        fontSize: 13,
                        lineHeight: 20,
                        textAlign: 'center'
                    }}>
                        Acepto las <Text style={{
                            color: 'blue'
                        }} onPress={
                            () => Linking.openURL('https://keyperu.net/tc/ppAppconnectClock.html')
                        }>
                            políticas de privacidad.
                        </Text>
                    </Text>
                </View>

                <TouchableOpacity style={[styles.buttonAlt, {
                    marginTop: 10,
                    backgroundColor: accept.terms ? '#64CCC5' : '#ccc'
                }]} onPress={() => saveTerms()} disabled={!accept.terms}>
                    <Text style={styles.buttonText}>Continuar</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    )
}
