import React, { useContext, useEffect, useState } from 'react'
import { ScrollView, Text, TextInput, TouchableOpacity, View, Image } from 'react-native'
import styles, { colors } from '../styles/styles'
import { useNavigate } from 'react-router-native'
import routes from '../router/routes'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { dataContext } from '../context/dataContext'
import ReplaceWithLoading from '../components/ReplaceWithLoading'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faAngleLeft, faAngleRight, faArrowLeft, faArrowRight, faBuilding } from '@fortawesome/free-solid-svg-icons'
import logo from '../../assets/chooseEnterprise.png'

export default function ChoseEnterprise() {
    const [page, setPage] = useState(1)
    const { setSnackbar, setLoading, user, setUser } = useContext(dataContext)
    const navigate = useNavigate()

    const handleChooseEnterprise = async (empresa) => {
        try {
            setLoading(true)

            setUser({
                ...user,
                ...empresa,
            })

            await AsyncStorage.setItem('username', user.username)

            setSnackbar({
                visible: true,
                text: `Ingreso éxitoso, ¡Bienvenido ${user.username}!`,
                type: 'success'
            })

            setLoading(false)

            return navigate(routes.init)
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
            <TouchableOpacity onPress={() => navigate(routes.login)} >
                <FontAwesomeIcon icon={faAngleLeft} size={30} style={{
                    position: 'absolute',
                    top: 50,
                    left: 10,
                    color: colors.green,
                }} />
            </TouchableOpacity>

            <Image source={logo} style={{
                width: 150,
                height: 150,
                marginBottom: 20,
            }} />

            <Text style={[styles.title, {
                marginBottom: 20,
                color: colors.black,
                opacity: .9,
            }]}>¡Hola, {user.username}! </Text>

            <Text style={[styles.subtitle, {
                marginBottom: 20,
                color: colors.black,
                opacity: .6,
                textAlign: 'center'
            }]}>Nos alegra que tengas varias empresas, Selecciona con la que deseas ingresar.</Text>

            <ReplaceWithLoading>
                {user.empresas.slice((page - 1) * 4, page * 4).map((empresa, index) => (
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

            <View style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
                marginTop: 20,
            }}>
                <TouchableOpacity onPress={() => page > 1 && setPage(page - 1)}>
                    <FontAwesomeIcon icon={faArrowLeft} size={30} style={{
                        color: page === 1 ? '#00000050' : '#000000',
                    }} />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => {
                    console.log(page, user.empresas.length)
                    if (page * 4 >= user.empresas.length) return
                    setPage(page + 1)
                }}>
                    <FontAwesomeIcon icon={faArrowRight} size={30} style={{
                        color: (page * 4 >= user.empresas.length) ? '#00000050' : '#000000',
                    }} />
                </TouchableOpacity>
            </View>
        </View>
    )
}
