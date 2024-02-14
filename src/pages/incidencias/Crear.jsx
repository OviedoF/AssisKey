import React, { useContext, useEffect, useState } from 'react'
import { ScrollView, Text, TextInput, TouchableOpacity, View, Dimensions, Alert } from 'react-native'
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
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faClipboard, faFile, faPaperclip } from '@fortawesome/free-solid-svg-icons'

export default function Crear() {
    const [openModal, setOpenModal] = useState({})
    const [initDate, setInitDate] = useState({
        date: new Date(),
        time: '',
    })
    const [endDate, setEndDate] = useState({
        date: new Date(),
        time: '',
    })
    const [motivo, setMotivo] = useState('')
    const [horarios, setHorarios] = useState([])
    const [horario, setHorario] = useState('')
    const [motivos, setMotivos] = useState([])
    const [observacion, setObservacion] = useState('')
    const [observacionAbierto, setObservacionAbierto] = useState(false)
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

    const handleFileUpload = async () => {
        try {
            const res = await DocumentPicker.getDocumentAsync({
                type: '*/*',
            });

            const fileInfo = await FileSystem.getInfoAsync(
                res.assets[0].uri,
                { size: true }
            )

            if (!fileInfo.exists) {
                return setSnackbar({
                    visible: true,
                    text: 'El archivo seleccionado no existe',
                    type: 'error'
                })
            }

            const base64Content = await FileSystem.readAsStringAsync(res.assets[0].uri, {
                encoding: FileSystem.EncodingType.Base64,
            });

            setForm({
                ...form,
                file: base64Content,
                fileName: res.assets[0].name,
            })
        } catch (err) {
            console.error(err);
        }
    };

    const handleSaveData = async () => {
        try {
            setLoading(true)
            const fInicio = `${initDate.date.toLocaleDateString().replaceAll('/', '-')} ${initDate.time.split(' ')[0]}`
            const fFin = `${endDate.date.toLocaleDateString().replaceAll('/', '-')} ${endDate.time.split(' ')[0]}`

            const formData = new FormData()

            formData.append('name', form.fileName ? form.fileName : '')
            formData.append('file', form.file ? form.file : '')

            Alert.alert('++ Datos', `Estado: 2\n`)
            Alert.alert('+ Datos', `IDTrabajador: ${user.id}\nIDDB: ${user.idEmpresa}\nAuthorization: ${user.token}`)
            Alert.alert('Datos', `Fecha de inicio: ${fInicio}\nFecha de fin: ${fFin}\nMotivo: ${motivo}\nIDHorario: ${horario}\nObservación: ${observacion}`)

            const create = await petitions.crearPermiso({
                idTrabajador: user.id,
                fInicio,
                fFin,
                estado: "2",
                idMotivo: motivo,
                idHorario: horario,
                idDB: user.idEmpresa,
                Authorization: user.token,
                observacion,
            }, formData)

            console.log(create.data)

            setLoading(false)

            setMotivo('')
            setHorario('')
            setObservacion('')
            setForm({
                ...form,
                file: '',
                fileName: '',
            })
            setInitDate({
                date: new Date(),
                time: '',
            })
            setEndDate({
                date: new Date(),
                time: '',
            })

            setLoading(false)

            return setSnackbar({
                visible: true,
                text: create.data[0].msg,
                type: 'success'
            })
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

    useEffect(() => {
        console.log(initDate, endDate)
    }, [initDate, endDate])

    return (
        <View style={[styles.mainWhite]} keyboardShouldPersistTaps="handled">
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

            <ScrollView>
                <View style={{
                    ...styles.flexColumn,
                    paddingHorizontal: 5,
                    paddingTop: 10,
                }}>

                    <CustomPicker options={horarios} onValueChange={(value) => {
                        setHorario(value)
                        const patron = /de (\d{2}:\d{2}:\d{2}) a (\d{2}:\d{2}:\d{2})/;
                        const horario = horarios.find((horarioL) => horarioL.value.toString() === value.toString())
                        const horarioMatch = horario.label.match(patron)

                        if (horarioMatch) {
                            const horarioEnd = horarioMatch[2]
                            const horarioStart = horarioMatch[1]
                            const date = new Date()

                            setInitDate({
                                date,
                                time: horarioStart
                            })

                            setEndDate({
                                date,
                                time: horarioEnd
                            })
                        } else {
                            setSnackbar({
                                visible: true,
                                text: 'No se encontró el horario seleccionado',
                                type: 'error'
                            })
                        }
                    }} selectedValue={horario} placeHolder={
                        horario ?
                            horarios.find((horarioL) => horarioL.value.toString() === horario.toString()).label :
                            `Seleccione un horario`
                    } title={'Horario:'} />

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
                            <Text style={{
                                fontSize: initDate.time ? 14 : 10,
                            }}>{
                                initDate.time || 'Seleccione una hora'
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
                                time: date.toLocaleTimeString('en-US', {
                                    hour12: false,
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    second: '2-digit'
                                })
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
                            <Text style={{
                                fontSize: endDate.time ? 14 : 10,
                            }}>{
                                    endDate.time || 'Seleccione una hora'
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
                                time: date.toLocaleTimeString('en-US', {
                                    hour12: false,
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    second: '2-digit'
                                })
                            })
                        }}
                        onTouchCancel={() => setOpenModal(false)}
                    />}
                    <CustomPicker options={motivos} onValueChange={(value) => setMotivo(value)} selectedValue={motivo} placeHolder={motivo ?
                        motivos.find((motivoL) => motivoL.value.toString() === motivo.toString()).label :
                        `Seleccione un motivo`
                    } title={'Motivo:'} />

                    <Text style={{
                        ...styles.label
                    }}>Observación:</Text>
                    <TextInput
                        style={{
                            ...styles.input,
                            height: 60,
                        }}
                        onChangeText={(text) => setObservacion(text)}
                        value={observacion}
                        placeholder='Observación'
                        placeholderTextColor={colors.gray}
                        multiline={true}
                    />

                    <Text style={{
                        ...styles.label,
                        marginTop: 20,
                        textAlign: 'center',
                    }}>Si tienes un sustento, adjúntalo:</Text>

                    <TouchableOpacity style={{
                        ...styles.buttonAlt,
                        marginTop: 20,
                        borderRadius: 5,
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#E7EAFD',
                        borderWidth: 1,
                        borderColor: colors.blue,
                    }} onPress={() => handleFileUpload()}>
                        <FontAwesomeIcon icon={faPaperclip} size={20} color={colors.blue} style={{
                            marginRight: 10
                        }} />

                        <Text style={{
                            ...styles.buttonText,
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: colors.blue
                        }}>
                            Adjunta AQUÍ
                        </Text>
                    </TouchableOpacity>

                    {form.fileName && <Text style={{
                        textAlign: 'center',
                        color: colors.blue,
                        marginBottom: 20,
                    }}>{form.fileName}</Text>}

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
            </ScrollView>

            <Navbar
                position={observacionAbierto ? 'relative' : 'absolute'}
            />
        </View>
    )
}
