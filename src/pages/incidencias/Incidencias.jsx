import React, { useMemo, useState, useContext, useEffect } from 'react'
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import styles, { colors } from '../../styles/styles'
import { useNavigate, useRoutes } from 'react-router-native'
import routes from '../../router/routes'
import Navbar from '../../components/Navbar'
import { Dimensions } from 'react-native'
import { dataContext } from '../../context/dataContext'
import AsyncStorage from '@react-native-async-storage/async-storage';
import petitions from '../../api/calls'
import ReplaceWithLoading from '../../components/ReplaceWithLoading'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons'

export default function Home() {
    const navigate = useNavigate()
    const [allData, setAllData] = useState([])
    const [motivos, setMotivos] = useState([])
    const [estados, setEstados] = useState([])
    const [data, setData] = useState([])
    const { user, setLoading, setSnackbar, loading } = useContext(dataContext)
    const [page, setPage] = useState(1)

    const getData = async () => {
        try {
            setLoading(true)
            const idTrabajador = user.id;
            const idDB = user.idEmpresa;
            const Authorization = user.token
            const aux = []

            const response = await petitions.permisoListado({
                idDB,
                idTrabajador,
                Authorization
            }, user.token)

            response.data.map((item) => {
                aux.push({
                    fInicio: item.fInicio.split(' ')[0],
                    fFin: item.fFin.split(' ')[0],
                    motivo: item.idMotivo,
                    estado: item.estado,
                })
            })

            setLoading(false)
            setAllData(aux)
            return setData(aux.slice((page - 1) * 5, page * 5))
        } catch (error) {
            console.log(error)
            setLoading(false)
            navigate(routes.login)
            setSnackbar({ visible: true, text: 'Su sesión ha caducado, ingrese de nuevo.', type: 'error' })
        }
    }

    useEffect(() => {

        const getMotivos = async () => {
            try {
                const response = await petitions.getMotivos({
                    idDB: user.idEmpresa,
                    idTrabajador: user.id,
                    Authorization: user.token
                })

                if (!response.data.length) return setSnackbar({
                    visible: true,
                    text: 'No se encontraron motivos para este trabajador',
                    type: 'error'
                })
                setMotivos(response.data)
            } catch (error) {
                console.log(error)
                navigate(routes.login)
                return setSnackbar({
                    visible: true,
                    text: 'Su sesión ha vencido, por favor vuelva a iniciar sesión',
                    type: 'error'
                })
            }
        }

        const getEstados = async () => {
            try {
                const response = await petitions.getEstados({
                    idDB: user.idEmpresa,
                    idTrabajador: user.id,
                    Authorization: user.token
                })

                if (!response.data.length) return setSnackbar({
                    visible: true,
                    text: 'No se encontraron estados para este trabajador',
                    type: 'error'
                })

                setEstados(response.data)
            } catch (error) {
                console.log(error)
                navigate(routes.login)
                return setSnackbar({
                    visible: true,
                    text: 'Su sesión ha vencido, por favor vuelva a iniciar sesión',
                    type: 'error'
                })
            }
        }
     
        getMotivos()
        getEstados()
        getData()
    }, [page])

    return (
        <ScrollView contentContainerStyle={[styles.mainWhite, {
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: Dimensions.get('window').width,
            minHeight: Dimensions.get('window').height - 100,
        }]}>
                        <Text style={{
                width: '100%',
                borderBottomColor: '#E2EFF7',
                borderBottomWidth: 1,
                paddingBottom: 20,
                textAlign: 'center',
                marginBottom: 20,
            }}>
                Permisos e incidentes
            </Text>

            <View style={[styles.flexRow, {
                alignItems: 'center',
                justifyContent: 'center',
                width: Dimensions.get('window').width,
                height: 70,
            }]}>
                <TouchableOpacity style={[styles.flexColumn, {
                    width: '50%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    borderBottomColor: colors.black,
                    borderBottomWidth: 1,
                    backgroundColor: colors.gray
                }]} onPress={() => navigate(routes.incidencias)}>
                    <Text style={{ fontSize: 12 }}>Historial</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.flexColumn, {
                    width: '50%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    borderBottomColor: colors.black,
                    borderBottomWidth: 1,
                }]} onPress={() => navigate(routes.crearIncidencia)}>
                    <Text style={{ fontSize: 12 }}>Crear solicitud</Text>
                </TouchableOpacity>
            </View>

            <View style={[styles.flexRow, {
                alignItems: 'center',
                justifyContent: 'center',
                width: Dimensions.get('window').width,
                height: 70,
                backgroundColor: colors.blue,
                marginBottom: loading ? 20 : 0
            }]}>
                <TouchableOpacity style={[styles.flexColumn, {
                    width: '25%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                }]}>
                    <Text style={{ fontSize: 12 }}>Fecha Inicio</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.flexColumn, {
                    width: '25%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                }]}>
                    <Text style={{ fontSize: 12 }}>Fecha Fin</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.flexColumn, {
                    width: '25%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                }]}>
                    <Text style={{ fontSize: 12 }}>Motivo</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.flexColumn, {
                    width: '25%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                }]}>
                    <Text style={{ fontSize: 12 }}>Estado</Text>
                </TouchableOpacity>
            </View>

            <ReplaceWithLoading>
                {data.map((item, index) => (
                    <View key={index} style={[styles.flexRow, {
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: Dimensions.get('window').width,
                        height: 70,
                    }]}>
                        <TouchableOpacity style={[styles.flexColumn, {
                            width: '25%',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '100%',
                        }]}>
                            <Text style={{ fontSize: 12 }}>{item.fInicio}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.flexColumn, {
                            width: '25%',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '100%',
                        }]}>
                            <Text style={{ fontSize: 12 }}>{item.fFin}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.flexColumn, {
                            width: '25%',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '100%',
                        }]}>
                            <Text style={{ fontSize: 12, textAlign: 'center' }}>{
                                motivos.length ? motivos.find((motivo) => motivo.id === item.motivo).descripcion : ''
                            }</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.flexColumn, {
                            width: '25%',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '100%',
                        }]}>
                            <Text style={{ fontSize: 12, textAlign: 'center' }}>{
                                estados.length ? estados.find((estado) => estado.id.toString() === item.estado.toString()).descripcion : ''
                            }</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </ReplaceWithLoading>

            <View style={[styles.flexRow, {
                alignItems: 'center',
                justifyContent: 'flex-end',
                width: Dimensions.get('window').width,
                marginTop: 20
            }]}>
                <TouchableOpacity style={[styles.flexColumn, {
                    width: '15%',
                    alignItems: 'center',
                    justifyContent: 'center',
                }]} onPress={() => {
                    if (page === 1) return
                    setPage(page - 1)
                }} disabled={
                    page === 1
                }>
                    <FontAwesomeIcon color={
                        page === 1 ? '#00000050' : colors.black
                    } icon={faAngleLeft} size={20} />
                </TouchableOpacity>

                <TouchableOpacity style={[styles.flexColumn, {
                    width: '15%',
                    alignItems: 'center',
                    justifyContent: 'center',
                }]} onPress={() => {
                    if (allData.length / 5 <= page) return
                    setPage(page + 1)
                }} disabled={
                    allData.length / 5 < page
                }>
                    <FontAwesomeIcon color={
                        allData.length / 5 <= page ? '#00000050' : colors.black
                    } icon={faAngleRight} size={20} />
                </TouchableOpacity>
            </View>
            <Navbar />
        </ScrollView>
    )
}
