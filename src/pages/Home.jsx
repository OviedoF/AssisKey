import React, { useContext, useEffect, useMemo, useState } from 'react'
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import styles from '../styles/styles'
import { useNavigate } from 'react-router-native'
import routes from '../router/routes'
import RadioGroup from "react-native-radio-buttons-group";
import Navbar from '../components/Navbar'
import { dataContext } from '../context/dataContext'
import AsyncStorage from '@react-native-async-storage/async-storage';
import petitions from '../api/calls'
import * as Location from 'expo-location';
import ReplaceWithLoading from '../components/ReplaceWithLoading'
import { Buffer } from 'buffer'

export default function Home() {
  const [optionSelected, setOptionSelected] = useState(1)
  const [assistIndicator, setAssistIndicator] = useState(null)
  const [userInfo, setUserInfo] = useState({})
  const [userImage, setUserImage] = useState('')
  const navigate = useNavigate()
  const { user, setSnackbar, setLoading, qrForEntry, setQrForEntry } = useContext(dataContext)
  console.log(user)

  const getData = async () => {
    try {
      setLoading(true)
      const idTrabajador = await AsyncStorage.getItem('document')
      const indicador = "Z";
      const idDB = user.idEmpresa;
      const Authorization = user.token

      const response = await petitions.listaAsistencia({
        indicador,
        idDB,
        idTrabajador,
        Authorization
      }, user.token)

      if(!response.data[0]) return setLoading(false)

      if (response.data.length > 0) {
        setAssistIndicator(response.data[0].indicador)
      }
      return setLoading(false)
    } catch (error) {
      setLoading(false)
      console.log(error)
      return setSnackbar({ visible: true, text: 'Error al obtener los datos', type: 'error' })
    }
  }

  const saveEntryGeo = async () => {
    try {
      setLoading(true)
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return setSnackbar({ visible: true, text: 'Debe conceder permisos a la ubicación', type: 'error' });

      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });

      const document = await AsyncStorage.getItem('document')

      if(!document) {
        setLoading(false)
        return setSnackbar({ visible: true, text: 'Error al obtener el DNI', type: 'error' })
      }

      const form = {
        idTrabajador: document,
        latitud: location.coords.latitude,
        longitud: location.coords.longitude,
        idDB: user.idEmpresa,
        Authorization: user.token
      }

      const response = await petitions.entryGeo(form)

      const obj = response.data[0]

      if (!obj) {
        setLoading(false)
        return setSnackbar({ visible: true, text: 'Error al registrar la entrada', type: 'error' });
      }

      await getData()
      setSnackbar({ visible: true, text: obj.msg, type: 'success' })
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false) 
      navigate(routes.login)
      return setSnackbar({
        visible: true,
        text: 'Su sesión ha vencido, por favor vuelva a iniciar sesión',
        type: 'error'
      })
    }
  }

  const entryQR = async () => {
    try {
      setLoading(true)

      const document = await AsyncStorage.getItem('document')

      if(!document) {
        setLoading(false)
        return setSnackbar({ visible: true, text: 'Error al obtener el DNI', type: 'error' })
      }

      const form = {
        idTrabajador: document,
        latitud: 0,
        longitud: 0,
        idDB: user.idEmpresa,
        Authorization: user.token,
        QR: "X",
        tipTrabajador: "U"
      }

      const response = await petitions.entryQR(form)

      const obj = response.data[0]

      if (!obj) {
        setLoading(false)
        return setSnackbar({ visible: true, text: 'Error al registrar la entrada', type: 'error' })
      };

      await getData()
      setQrForEntry({
        text: obj.msg,
        qr: obj.qr
      })
      setSnackbar({ visible: true, text: obj.msg, type: 'success' })
      navigate(routes.qr)
      return setLoading(false)
    } catch (error) {
      setLoading(false)
      console.log(error)
      navigate(routes.login)
      return setSnackbar({
        visible: true,
        text: 'Su sesión ha vencido, por favor vuelva a iniciar sesión',
        type: 'error'
      })
    }
  }

  const optionsRadio = useMemo(
    () => [
      {
        id: 2,
        label: "QR",
        value: "qr",
      },
      {
        id: 1,
        label: "Geolocalización",
        value: "geo",
      },
    ],
    []
  );

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const document = await AsyncStorage.getItem('document')
        const name = user.nomCompleto

        setUserInfo({
          document,
          name
        })
      } catch (error) {
        console.log(error)
      }
    }

    const getUserImage = async () => {
      const buffer = Buffer.from(user.idFile, 'base64');
      setUserImage(`data:image/jpeg;base64,${buffer.toString('base64')}`)
    }

    getUserInfo()
    getData()
    getUserImage()
  }, [])

  return (
    <View style={[styles.mainWhite]}>
      <View style={[styles.flexColumn, {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20
      }]}>
        <Text style={[styles.title, {
          fontSize: 20,
          marginBottom: 20
        }]}>Datos del trabajador</Text>

        <Text style={[styles.text, { marginBottom: 10 }]}>
          <Text style={[styles.textBold, { textAlign: 'center' }]}>Nombre:</Text> {userInfo.name}
        </Text>

        <Text style={[styles.text, { marginBottom: 10 }]}>
          <Text style={[styles.textBold, { textAlign: 'center' }]}>DNI:</Text> {userInfo.document}
        </Text>

        {userImage && <Image src={userImage} style={{
          width: 150,
          height: 150,
          marginBottom: 20,
          objectFit: 'contain',
          borderRadius: 100,
        }} />}

        <RadioGroup
          radioButtons={optionsRadio}
          onPress={(value) => {
            setOptionSelected(value)
            if (value === 2) setQrForEntry(false)
          }}
          selectedId={optionSelected}
          layout='row'
        />
      </View>

      <ReplaceWithLoading>
        {(assistIndicator === null || assistIndicator === "S" || assistIndicator === 'X') && <TouchableOpacity style={[styles.button]} onPress={() => {
          if (optionSelected === 1) return saveEntryGeo()
          if (optionSelected === 2) return entryQR()
        }}>
          <Text style={[styles.buttonText, {
            fontSize: 18
          }]}>{assistIndicator === "X" ? "CONFIRMAR ENTRADA" : "REGISTRAR ENTRADA"}</Text>
        </TouchableOpacity>}

        {(assistIndicator === "E") && <TouchableOpacity style={[styles.buttonAlt]} onPress={() => {
          if (optionSelected === 1) return saveEntryGeo()
          if (optionSelected === 2) return entryQR()
        }}>
          <Text style={[styles.buttonText, {
            fontSize: 18
          }]}>REGISTRAR SALIDA</Text>
        </TouchableOpacity>}
      </ReplaceWithLoading>

      <Navbar />
    </View>
  )
}
