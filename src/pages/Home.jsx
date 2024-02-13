import React, { useContext, useEffect, useMemo, useState } from 'react'
import { Alert, Image, Text, TouchableOpacity, View } from 'react-native'
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
import { Camera } from 'expo-camera';

export default function Home() {
  const [optionSelected, setOptionSelected] = useState(2)
  const [assistIndicator, setAssistIndicator] = useState(null)
  const [userInfo, setUserInfo] = useState({})
  const [userImage, setUserImage] = useState('')
  const [logoEmpresa, setLogoEmpresa] = useState('')
  const navigate = useNavigate()
  const { user, setSnackbar, setLoading, setQrForEntry } = useContext(dataContext)

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

      if (!response.data[0]) return setLoading(false)

      if (response.data.length > 0) {
        setAssistIndicator(response.data[0].indicador)
      }
      return setLoading(false)
    } catch (error) {
      setLoading(false)
      console.log(error)
      navigate(routes.login)
      return setSnackbar({ visible: true, text: 'Ha vencido la sesión', type: 'error' })
    }
  }

  const saveEntryGeo = async () => {
    try {
      setLoading(true)
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return setSnackbar({ visible: true, text: 'Debe conceder permisos a la ubicación', type: 'error' });

      let location = await Promise.race([
        Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest }),
        new Promise((resolve) => setTimeout(resolve, 5000, { coords: { latitude: 0, longitude: 0 } }))
      ]);

      const document = await AsyncStorage.getItem('document')

      if (!document) {
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

      if (!document) {
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

    const logoEmpresaSetter = async () => {
      const logo = user.empresas.filter(e => e.idEmpresa === user.idEmpresa)[0].logo
      const buffer = Buffer.from(logo, 'base64');

      setLogoEmpresa(`data:image/jpeg;base64,${buffer.toString('base64')}`)
    }

    getUserInfo()
    getData()
    getUserImage()
    logoEmpresaSetter()
  }, [])

  return (
    <View style={[styles.mainWhite]}>
      <View style={{
        position: 'absolute',
        top: 50,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 0,
        height: 50,
        backgroundColor: '#3F47CC',
        borderRadius: 0,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
      }}>
        <Image src={logoEmpresa} style={{
          width: 50,
          height: '100%',
          objectFit: 'contain',
          marginBottom: 20,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          top: '2.5%',
        }} />

        <Text style={{
          color: 'white',
          fontSize: 11,
          marginLeft: 10
        }}>
          {user.rSocial}
        </Text>
      </View>

      <View style={[styles.flexColumn, {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        position: 'relative',
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

        {userImage && <TouchableOpacity onPress={
          () => {
            Alert.alert('Foto de perfil', '¿Desea actualizar su foto de perfil sacándose una selfie?', [
              {
                text: 'Cancelar',
                onPress: () => { },
                style: 'cancel'
              },
              {
                text: 'Actualizar',
                onPress: () => navigate(routes.takeSelfie)
              }
            ])
          }
        }>
          <Image src={userImage} style={{
            width: 150,
            height: 150,
            marginBottom: 20,
            objectFit: 'cover',
            borderRadius: 100,
          }} />
        </TouchableOpacity>}

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
