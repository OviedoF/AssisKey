import React, { useMemo, useState, useContext, useEffect } from 'react'
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import styles, { colors } from '../styles/styles'
import { useNavigate, useRoutes } from 'react-router-native'
import routes from '../router/routes'
import Navbar from '../components/Navbar'
import { Dimensions } from 'react-native'
import { dataContext } from '../context/dataContext'
import AsyncStorage from '@react-native-async-storage/async-storage';
import petitions from '../api/calls'
import ReplaceWithLoading from '../components/ReplaceWithLoading'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons'

export default function Home() {
  const navigate = useNavigate()
  const [allAssist, setAllAssist] = useState([])
  const [assist, setAssist] = useState([])
  const [filter, setFilter] = useState('')
  const { user, setLoading, setSnackbar, loading } = useContext(dataContext)
  const [page, setPage] = useState(1)

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

      response.data.map((item) => {
        const dateObj = new Date(item.fecha);
        const dayOfWeek = dateObj.toLocaleString("es-ES", { weekday: "long" }).split(',')[0]
        const parsedDate = item.fechaFormateada.split(' ')[0]
        const hourEntry = item.horaEntrada.split(':')[0] + ':' + item.horaEntrada.split(':')[1]
        const hourExit = item.horaSalida.split(':')[0] + ':' + item.horaSalida.split(':')[1]
        const status = item.estado

        aux.push({
          dayOfWeek,
          parsedDate,
          hourEntry,
          hourExit,
          status
        })
      })

      if (filter) {
        const aux2 = []
        aux.map((item) => {
          if (item.dayOfWeek.includes(filter) || item.parsedDate.includes(filter) || item.hourEntry.includes(filter) || item.hourExit.includes(filter) || item.status.includes(filter)) {
            aux2.push(item)
          }
        })
        setAssist(aux2.slice((page - 1) * 4, page * 4))
        return setAllAssist(aux2)
      }

      setLoading(false)
      setAllAssist(aux)
      return setAssist(aux.slice((page - 1) * 4, page * 4))
    } catch (error) {
      console.log(error)
      setLoading(false)
      navigate(routes.login)
      setSnackbar({ visible: true, text: 'Su sesión ha caducado, ingrese de nuevo.', type: 'error' })
    }
  }

  useEffect(() => {
    getData()
  }, [page])

  useEffect(() => {
    if (filter) {
      const aux = []
      allAssist.map((item) => {
        if (
          item && (
            item.dayOfWeek.includes(filter) ||
            item.parsedDate.includes(filter) ||
            item.hourEntry.includes(filter) ||
            item.hourExit.includes(filter) ||
            item.status.includes(filter))) {
          aux.push(item)
        }
      })
      setAssist(aux.slice((1 - 1) * 4, 1 * 4))
    } else {
      getData()
    }
  }, [filter])

  return (
    <ScrollView contentContainerStyle={[styles.mainWhite, {
      alignItems: 'center',
      justifyContent: 'flex-start',
      width: Dimensions.get('window').width,
      minHeight: Dimensions.get('window').height - 100,
    }]}>

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
        }]} onPress={() => navigate(routes.map)}>
          <Text style={{ fontSize: 12 }}>Vista en mapa</Text>
        </TouchableOpacity>
      </View>

      <TextInput style={[styles.input, { marginVertical: 50 }]} placeholder="Buscar" value={filter} onChangeText={(e) => setFilter(e)} />

      <View style={[styles.flexRow, {
        alignItems: 'center',
        justifyContent: 'center',
        width: Dimensions.get('window').width,
        height: 70,
        backgroundColor: colors.blue,
        marginBottom: loading ? 20 : 0
      }]}>
        <TouchableOpacity style={[styles.flexColumn, {
          width: '20%',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
        }]}>
          <Text style={{ fontSize: 12 }}>Día</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.flexColumn, {
          width: '20%',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
        }]}>
          <Text style={{ fontSize: 12 }}>Fecha</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.flexColumn, {
          width: '15%',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
        }]}>
          <Text style={{ fontSize: 12 }}>Hora E.</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.flexColumn, {
          width: '15%',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
        }]}>
          <Text style={{ fontSize: 12 }}>Hora S</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.flexColumn, {
          width: '30%',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
        }]}>
          <Text style={{ fontSize: 12 }}>Estado</Text>
        </TouchableOpacity>
      </View>

      <ReplaceWithLoading>
        {assist.map((item, index) => (
          <View key={index} style={[styles.flexRow, {
            alignItems: 'center',
            justifyContent: 'center',
            width: Dimensions.get('window').width,
            height: 70,
          }]}>
            <TouchableOpacity style={[styles.flexColumn, {
              width: '20%',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
            }]}>
              <Text style={{ fontSize: 12 }}>{item.dayOfWeek}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.flexColumn, {
              width: '20%',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
            }]}>
              <Text style={{ fontSize: 12 }}>{item.parsedDate}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.flexColumn, {
              width: '15%',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
            }]}>
              <Text style={{ fontSize: 12 }}>{item.hourEntry}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.flexColumn, {
              width: '15%',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
            }]}>
              <Text style={{ fontSize: 12 }}>{item.hourExit}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.flexColumn, {
              width: '30%',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
            }]}>
              <Text style={{ fontSize: 12 }}>{item.status}</Text>
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
          if (allAssist.length / 4 <= page) return
          setPage(page + 1)
        }} disabled={
          allAssist.length / 4 < page
        }>
          <FontAwesomeIcon color={
            allAssist.length / 4 <= page ? '#00000050' : colors.black
          } icon={faAngleRight} size={20} />
        </TouchableOpacity>
      </View>
      <Navbar />
    </ScrollView>
  )
}
