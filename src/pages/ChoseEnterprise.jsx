import React, { useContext, useEffect, useState } from 'react'
import { ScrollView, Text, TextInput, TouchableOpacity, View, Image } from 'react-native'
import styles, { colors } from '../styles/styles'
import { useNavigate } from 'react-router-native'
import routes from '../router/routes'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { dataContext } from '../context/dataContext'
import ReplaceWithLoading from '../components/ReplaceWithLoading'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faAngleLeft, faAngleRight, faArrowLeft, faBuilding } from '@fortawesome/free-solid-svg-icons'
import logo from '../../assets/chooseEnterprise.png'
import petitions from '../api/calls'

export default function ChoseEnterprise() {
    const { setSnackbar, setLoading, user, setUser } = useContext(dataContext)
    const navigate = useNavigate()

    const handleChooseEnterprise = async (empresa) => {
        try {
            setLoading(true)
            const document = await AsyncStorage.getItem('document');
            const verifyCode = await AsyncStorage.getItem('password');

            const userReq = await petitions.getUserInfo({
                dni: document,
                codigo: verifyCode,
                idDB: empresa.idEmpresa,
                Authorization: empresa.token
            });

            setUser({
                ...user,
                ...empresa,
                ...userReq.data[0],
            })

            await AsyncStorage.setItem('username', user.auxUser)

            setSnackbar({
                visible: true,
                text: `Ingreso éxitoso, ¡Bienvenido ${user.auxUser}!`,
                type: 'success'
            })

            setLoading(false)

            return navigate(routes.home)
        } catch (error) {
            console.log(error)
            setLoading(false)
            setSnackbar({
                visible: true,
                text: 'Ocurrió un error, intente nuevamente',
                type: 'error'
            })
        }
    }

    return (
        <View style={[styles.mainWhite, {
            position: 'relative',
        }]}>
            <FontAwesomeIcon icon={faAngleLeft} size={30} style={{
                position: 'absolute',
                top: 50,
                left: 10,
                color: colors.green,
            }} onPress={() => navigate(routes.login)} />

            <Image source={logo} style={{
                width: 150,
                height: 150,
                marginBottom: 20,
            }} />

            <Text style={[styles.title, {
                marginBottom: 20,
                color: colors.black,
                opacity: .9,
            }]}>¡Hola, {user.auxUser}! </Text>

            <Text style={[styles.subtitle, {
                marginBottom: 20,
                color: colors.black,
                opacity: .6,
                textAlign: 'center'
            }]}>Nos alegra que tengas varias empresas, Selecciona con la que deseas ingresar.</Text>

            <ReplaceWithLoading>
                {user.empresas.map((empresa, index) => (
                    <TouchableOpacity key={index} style={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        padding: 20,
                        position: 'relative',
                        shadowColor: "#000",
                        shadowOffset: {
                            width: 0,
                            height: 1,
                        },
                        shadowOpacity: 0.18,
                        shadowRadius: 1.00,
                        elevation: 1,
                    }} onPress={() => handleChooseEnterprise(empresa)}>
                        <FontAwesomeIcon icon={faBuilding} size={20} onPress={() => navigate(routes.login)} />
                        <Text style={{
                            marginLeft: 10,
                            width: '70%',
                        }}>{empresa.rSocial}</Text>
                        <FontAwesomeIcon icon={faAngleRight} size={30} style={{
                            position: 'absolute',
                            alignSelf: 'center',
                            right: 10,
                            color: '#00000050',
                        }} onPress={() => navigate(routes.home)} />
                    </TouchableOpacity>
                ))}
            </ReplaceWithLoading>
        </View>
    )
}
