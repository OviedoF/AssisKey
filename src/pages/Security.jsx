import React, { useContext, useEffect, useRef, useState } from 'react'
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import styles from '../styles/styles'
import { useNavigate } from 'react-router-native'
import routes from '../router/routes'
import { Dimensions } from 'react-native'
import { colors } from '../styles/styles'
import Navbar from '../components/Navbar'
import { dataContext } from '../context/dataContext'
import petitions from '../api/calls'
import ReplaceWithLoading from '../components/ReplaceWithLoading'

export default function Account() {
  const navigate = useNavigate()
  const { setUser, user, setSnackbar, setLoading } = useContext(dataContext)
  const [form, setForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const refs = {
    newPassword: useRef(null),
    confirmPassword: useRef(null)
  }

  const handleSaveData = async () => {
    try {
      setLoading(true)
    const { oldPassword, newPassword, confirmPassword } = form

    if (oldPassword !== user.clave) {
      setLoading(false)
      return setSnackbar({
        visible: true,
        text: 'La contraseña actual no es correcta',
        type: 'error'
      })
    }

    if (newPassword !== confirmPassword) {
      setLoading(false)
      return setSnackbar({
        visible: true,
        text: 'Las contraseñas no coinciden',
        type: 'error'
      })
    }

    const dataToSend = {
      idUsuario: user.idUsuario,
      passwordCurrent: oldPassword,
      passwordNew: confirmPassword,
      Authorization: user.token
    }

    const response = await petitions.updatePassword(dataToSend);
    const obj = response.data[0]

    if(obj.codigo === "Error") {
      setLoading(false)
      return setSnackbar({
        visible: true,
        text: obj.rspta,
        type: 'error'
      })
    }

    setLoading(false)
    setSnackbar({
      visible: true,
      text: obj.rspta,
      type: 'success'
    })

    setUser({})
    navigate(routes.login)
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

  return (
    <View style={[styles.mainWhite]}>
      <View style={styles.flexColumn}>
        <Text style={styles.label}>Contraseña actual:</Text>
        <TextInput style={styles.input} placeholder='Contraseña actual' secureTextEntry value={form.oldPassword} onChangeText={
          (value) => setForm({
            ...form,
            oldPassword: value
          })
        } onEndEditing={
          () => refs.newPassword.current.focus()
        }/>

        <Text style={styles.label}>Nueva contraseña:</Text>
        <TextInput style={styles.input} ref={refs.newPassword} maxLength={6} placeholder='Nueva contraseña' secureTextEntry value={form.newPassword} onChangeText={
          (value) => setForm({
            ...form,
            newPassword: value
          })
        } onEndEditing={
          () => refs.confirmPassword.current.focus()
        } />

        <Text style={styles.label}>Confirmar contraseña:</Text>
        <TextInput style={styles.input} maxLength={6} ref={refs.confirmPassword} placeholder='Confirmar contraseña' secureTextEntry value={form.confirmPassword} onChangeText={
          (value) => setForm({
            ...form,
            confirmPassword: value
          })
        } onEndEditing={
          () => handleSaveData()
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
