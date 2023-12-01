import React, { useContext, useEffect, useState } from 'react'
import { ScrollView, Text, TextInput, TouchableOpacity, View, Dimensions } from 'react-native'
import styles, { colors } from '../../styles/styles'
import { useNavigate } from 'react-router-native'
import routes from '../../router/routes'
import Navbar from '../../components/Navbar'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { dataContext } from '../../context/dataContext'
import petitions from '../../api/calls'
import ReplaceWithLoading from '../../components/ReplaceWithLoading'
import DateTimePicker from '@react-native-community/datetimepicker';
import CustomPicker from '../../components/CustomPicker'

export default function Crear() {
    const [openModal, setOpenModal] = useState({})
    const [initDate, setInitDate] = useState({
        date: new Date(),
        time: new Date().toLocaleTimeString(),
    })
    const [endDate, setEndDate] = useState({
        date: new Date(),
        time: new Date().toLocaleTimeString(),
    })
    const [motivo, setMotivo] = useState('')
    const [horarios, setHorarios] = useState([])
    const [horario, setHorario] = useState('')
    const [motivos, setMotivos] = useState([])
    const [observacion, setObservacion] = useState('')
    const navigate = useNavigate()
    const { user, setUser, setSnackbar, setLoading, setDangerModal } = useContext(dataContext)
    const [form, setForm] = useState({
        idTrabajador: '',
        verifyCode: '',
        direccion: user.direccion,
        celular: user.celular,
        idDB: user.idEmpresa,
        Authorization: user.token,
        name: user.nomCompleto,
    })

    useEffect(() => {
        const getDocument = async () => {
            const document = await AsyncStorage.getItem('document')
            const verifyCode = await AsyncStorage.getItem('password')
            setForm({ ...form, idTrabajador: document, verifyCode })
        }

        const getHorarios = async () => {
            try {
                const response = await petitions.getHorarios({
                    idDB: user.idEmpresa,
                    idTrabajador: user.id,
                    Authorization: user.token
                })

                if (!response.data.length) return setSnackbar({
                    visible: true,
                    text: 'No se encontraron horarios para este trabajador',
                    type: 'error'
                })

                const horarios = response.data.map((horario) => ({
                    ...horario,
                    label: horario.descripcion,
                    value: horario.idHorario
                }))

                console.log(horarios)

                setHorarios(horarios)
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

                const motivos = response.data.map((motivo) => ({
                    ...motivo,
                    label: motivo.descripcion,
                    value: motivo.id
                }))

                console.log(motivos)
                setMotivos(motivos)
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

        getHorarios()
        getMotivos()
        getDocument()
    }, [])

    useEffect(() => {
        console.log(initDate)
    }, [initDate])

    const handleSaveData = async () => {
        try {
            setLoading(true)
            const fInicio = `${initDate.date.toLocaleDateString().replaceAll('/', '-')} ${initDate.time.split(' ')[0]}`
            const fFin = `${endDate.date.toLocaleDateString().replaceAll('/', '-')} ${endDate.time.split(' ')[0]}`

            console.log({
                idTrabajador: user.id,
                fInicio,
                fFin,
                estado: "1",
                idMotivo: motivo,
                idHorario: horario,
                idDB: user.idEmpresa,
                Authorization: user.token,
                observacion,
            })
            setLoading(false)

            const create = await petitions.crearPermiso({
                idTrabajador: user.id,
                fInicio,
                fFin,
                estado: "1",
                idMotivo: motivo,
                idHorario: horario,
                idDB: user.idEmpresa,
                Authorization: user.token,
                observacion,
            })

            if(create.data[0].cod === 'Okey') {
                setLoading(false)
                return setSnackbar({
                    visible: true,
                    text: create.data[0].msg,
                    type: 'success'
                })
            }
        } catch (error) {
            setLoading(false)
            navigate(routes.login)
            return setSnackbar({
                visible: true,
                text: 'Su sesión ha vencido, por favor vuelva a iniciar sesión',
                type: 'error'
            })
        }
    }

    return (
        <View style={[styles.mainWhite]}>

            <View style={[styles.flexRow, {
                alignItems: 'center',
                justifyContent: 'center',
                width: Dimensions.get('window').width,
                marginBottom: 20,
                height: 70,
            }]}>
                <TouchableOpacity style={[styles.flexColumn, {
                    width: '50%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    borderBottomColor: colors.black,
                    borderBottomWidth: 1,
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
                    backgroundColor: colors.gray
                }]} onPress={() => navigate(routes.historial)}>
                    <Text style={{ fontSize: 12 }}>Crear solicitud</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.flexColumn}>
                <Text style={styles.label}>Fecha y Hora de inicio:</Text>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
                    marginBottom: 20,
                }}>
                    <TouchableOpacity style={{
                        ...styles.input,
                        width: '49%',
                        justifyContent: 'center',
                    }} onPress={() => setOpenModal({
                        init: true,
                    })}>
                        <Text>{
                            initDate.date.toLocaleDateString()
                        }</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={{
                        ...styles.input,
                        width: '49%',
                        justifyContent: 'center',
                    }} onPress={() => setOpenModal({
                        initTime: true,
                    })}>
                        <Text>{
                            initDate.time
                        }</Text>
                    </TouchableOpacity>
                </View>

                {openModal.init && <DateTimePicker
                    value={initDate.date}
                    display='default'
                    onChange={(e, date) => {
                        setOpenModal(false)
                        setInitDate({
                            ...initDate,
                            date
                        })
                    }}
                    onTouchCancel={() => setOpenModal(false)}
                />}

                {openModal.initTime && <DateTimePicker
                    value={initDate.date}
                    display='default'
                    mode='time'
                    onChange={(e, date) => {
                        setOpenModal(false)
                        setInitDate({
                            ...initDate,
                            time: date.toLocaleTimeString()
                        })
                    }}
                    onTouchCancel={() => setOpenModal(false)}
                />}

                <Text style={styles.label}>Fecha y Hora de fin:</Text>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
                    marginBottom: 20,
                }}>
                    <TouchableOpacity style={{
                        ...styles.input,
                        width: '49%',
                        justifyContent: 'center',
                    }} onPress={() => setOpenModal({
                        end: true,
                    })}>
                        <Text>{
                            endDate.date.toLocaleDateString()
                        }</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={{
                        ...styles.input,
                        width: '49%',
                        justifyContent: 'center',
                    }} onPress={() => setOpenModal({
                        endTime: true,
                    })}>
                        <Text>{
                            endDate.time
                        }</Text>
                    </TouchableOpacity>

                </View>

                {openModal.end && <DateTimePicker
                    value={endDate.date}
                    display='default'
                    onChange={(e, date) => {
                        setOpenModal(false)
                        setEndDate({
                            ...endDate,
                            date
                        })
                    }}
                    onTouchCancel={() => setOpenModal(false)}
                    minimumDate={initDate.date}
                />}

                {openModal.endTime && <DateTimePicker
                    value={endDate.date}
                    display='default'
                    mode='time'
                    onChange={(e, date) => {
                        setOpenModal(false)
                        setEndDate({
                            ...endDate,
                            time: date.toLocaleTimeString()
                        })
                    }}
                    onTouchCancel={() => setOpenModal(false)}
                />}

                <Text style={styles.label}>Motivo:</Text>
                <CustomPicker options={motivos} onValueChange={(value) => setMotivo(value)} selectedValue={motivo} placeHolder={motivo ?
                    motivos.find((motivoL) => motivoL.value.toString() === motivo.toString()).label :
                    `Seleccione un motivo`
                } />


                <Text style={styles.label}>Horario:</Text>
                <CustomPicker options={horarios} onValueChange={(value) => setHorario(value)} selectedValue={horario} placeHolder={
                    horario ?
                        horarios.find((horarioL) => horarioL.value.toString() === horario.toString()).label :
                        `Seleccione un horario`
                } />

                <Text style={styles.label}>Observación:</Text>
                <TextInput
                    style={{
                        ...styles.input,
                        height: 60,
                    }}
                    onChangeText={(text) => setObservacion(text)}
                    value={form.observacion}
                    placeholder='Observación'
                    placeholderTextColor={colors.gray}
                    multiline={true}
                />

                <ReplaceWithLoading>
                    <TouchableOpacity style={[styles.buttonAlt, {
                        marginVertical: 20,
                    }]} onPress={() => {
                        setDangerModal({
                            visible: true,
                            title: 'Guardar cambios',
                            text: '¿Está seguro que desea guardar estos cambios?',
                            bg: colors.white,
                            color: colors.black,
                            buttons: [
                                {
                                    text: 'Cancelar',
                                    onPress: () => setDangerModal({ visible: false })
                                },
                                {
                                    text: 'Aceptar',
                                    onPress: () => handleSaveData()
                                }
                            ]
                        })
                    }}>
                        <Text style={styles.buttonText}>Guardar cambios</Text>
                    </TouchableOpacity>
                </ReplaceWithLoading>
            </View>

            <Navbar />
        </View>
    )
}
