import React, { useContext, useEffect, useState } from 'react'
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import styles from '../styles/styles'
import { useNavigate } from 'react-router-native'
import routes from '../router/routes'
import { Dimensions } from 'react-native'
import { colors } from '../styles/styles'
import Navbar from '../components/Navbar'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { dataContext } from '../context/dataContext'
import petitions from '../api/calls'
import ReplaceWithLoading from '../components/ReplaceWithLoading'

export default function PersonalData() {
  const navigate = useNavigate()
  const { user, setUser, setSnackbar, setLoading } = useContext(dataContext)
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

    getDocument()
  }, [])

  const handleSaveData = async () => {
    try {
      setLoading(true)
      const updateReq = await petitions.updateUser(form)

      if (!updateReq.data.length) return setSnackbar({
        visible: true,
        text: 'Error al actualizar los datos',
        type: 'error'
      })

      const updateRes = updateReq.data[0]

      const user = await petitions.getUserInfo({
        dni: form.idTrabajador,
        codigo: form.verifyCode,
        idDB: form.idDB,
        Authorization: form.Authorization
      })

      if (!user.data.length) return setSnackbar({
        visible: true,
        text: 'Error al actualizar los datos',
        type: 'error'
      })

      const userInfo = user.data[0]

      setUser({
        ...user,
        ...userInfo
      })

      setSnackbar({
        visible: true,
        text: updateRes.msg,
        type: 'success'
      })
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

  const logout = async () => {
    setUser({})
    navigate(routes.login)
  }

  return (
    <View style={[styles.mainWhite]}>

    <Text style={{
        width: '100%',
        borderBottomColor: '#E2EFF7',
        borderBottomWidth: 1,
        paddingBottom: 20,
        textAlign: 'center',
        marginBottom: 20,
        position: 'absolute',
        top: 70,
    }}>
        Datos personales
    </Text>

      <View style={styles.flexColumn}>
        <Text style={styles.label}>Número de identificación:</Text>
        <TextInput style={styles.input} value={form.idTrabajador} editable={false} placeholder='Número de identificación' />

        <Text style={styles.label}>Apellido y nombre:</Text>
        <TextInput style={styles.input} value={form.name} editable={false} placeholder='Apellido y nombre' />


        <Text style={styles.label}>Dirección:</Text>
        <TextInput style={styles.input} value={form.direccion} placeholder='Dirección' onChangeText={
          (e) => setForm({ ...form, direccion: e })
        } />


        <Text style={styles.label}>Número de celular:</Text>
        <TextInput style={styles.input} value={form.celular} keyboardType='numeric' placeholder='Número de celular' onChangeText={
          (e) => setForm({ ...form, celular: e })
        } />

        <ReplaceWithLoading>
          <TouchableOpacity style={[styles.buttonAlt, {
            marginTop: 20
          }]} onPress={() => handleSaveData()}>
            <Text style={styles.buttonText}>Guardar cambios</Text>
          </TouchableOpacity>
        </ReplaceWithLoading>
      </View>

      <Navbar />
    </View>
  )
}
