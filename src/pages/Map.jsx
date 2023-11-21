import React, { useState, useContext, useEffect } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import styles, { colors } from '../styles/styles'
import { useNavigate } from 'react-router-native'
import routes from '../router/routes'
import Navbar from '../components/Navbar'
import { Dimensions } from 'react-native'
import { dataContext } from '../context/dataContext'
import AsyncStorage from '@react-native-async-storage/async-storage';
import petitions from '../api/calls'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import ReplaceWithLoading from '../components/ReplaceWithLoading'

export default function Home() {
  const navigate = useNavigate()
  const [initialRegion, setInitialRegion] = useState({
    available: false,
  })
  const [assist, setAssist] = useState([])
  const { user, setLoading, setSnackbar, loading } = useContext(dataContext)

  const getData = async () => {
    try {
      setLoading(true)
      const idTrabajador = await AsyncStorage.getItem('document')
      const indicador = "T";
      const idDB = user.idEmpresa;
      const Authorization = user.token
      const aux = []

      const response = await petitions.listaAsistencia({
        indicador,
        idDB,
        idTrabajador,
        Authorization
      }, user.token)

      if (!response.data.length) {
        setLoading(false)
        setInitialRegion({
          available: true,
          latitude: 0,
          longitude: 0,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        })
        return setSnackbar({ visible: true, text: 'No hay datos para mostrar.', type: 'error' })
      }

      setInitialRegion({
        available: true,
        latitude: response.data[0].latitudUser,
        longitude: response.data[0].longitudUser,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      })

      response.data.map((item) => {
        const dateObj = new Date(item.fecha);
        const dayOfWeek = dateObj.toLocaleString("es-ES", { weekday: "long" }).split(',')[0]
        const parsedDate = item.fechaFormateada.split(' ')[0]
        const hourEntry = item.horaEntrada.split(':')[0] + ':' + item.horaEntrada.split(':')[1]
        const hourExit = item.horaSalida.split(':')[0] + ':' + item.horaSalida.split(':')[1]
        const status = item.resultado === 1 ? 'Completado' : 'Pendiente'

        aux.push({
          latitudUser: item.latitudUser,
          longitudUser: item.longitudUser,
          dayOfWeek,
          parsedDate,
          hourEntry,
          hourExit,
          status
        })
      })
      
      setLoading(false)
      return setAssist(aux)
    } catch (error) {
      console.log(error)
      setLoading(false)
      navigate(routes.login)
      setSnackbar({ visible: true, text: 'Su sesión ha caducado, ingrese de nuevo.', type: 'error' })
    }
  }

  useEffect(() => {
    getData()
  }, [])

  return (
    <View style={[styles.mainWhite]}>

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
        }]} onPress={() => navigate(routes.historial)}>
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
        }]} onPress={() => navigate(routes.map)}>
          <Text style={{ fontSize: 12 }}>Vista en mapa</Text>
        </TouchableOpacity>
      </View>

      <ReplaceWithLoading>
        {initialRegion.available && <>
          <MapView
            provider={PROVIDER_GOOGLE}
            style={{
              width: 300,
              marginTop: 50,
              height: 300,
            }}
            initialRegion={{
              latitude: initialRegion.latitude,
              longitude: initialRegion.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            {assist.map((item, index) => (
              <Marker
                key={index}
                coordinate={
                  {
                    latitude: item.latitudUser, longitude: item.longitudUser
                  }
                }
                title={item.parsedDate}
                description={`${item.dayOfWeek} (${item.hourEntry} a ${item.hourExit}) - ${item.status}`}
              />
            ))}
          </MapView>
        </>}
      </ReplaceWithLoading>
      <Navbar />
    </View>
  )
}
