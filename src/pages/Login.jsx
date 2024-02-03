import React, { useContext, useEffect, useRef, useState } from 'react'
import { Text, TextInput, TouchableOpacity, View } from 'react-native'
import styles from '../styles/styles'
import { useNavigate } from 'react-router-native'
import petitions from '../api/calls'
import { dataContext } from '../context/dataContext'
import AsyncStorage from '@react-native-async-storage/async-storage';
import routes from '../router/routes'
import ReplaceWithLoading from '../components/ReplaceWithLoading'

export default function Login() {
  const navigate = useNavigate()
  const { setSnackbar, setUser, setLoading } = useContext(dataContext)
  const [form, setForm] = useState({
    usuario: '',
    clave: '',
  })
  const passwordRef = useRef(null)

  const handleLogin = async () => {
    try {
      if (!form.usuario || !form.clave) return setSnackbar({
        visible: true,
        text: 'Debes llenar todos los campos',
        type: 'error'
      })

      setLoading(true)

      const response = await petitions.login(form)

      if (!response.data.empresas) {
        setLoading(false)
        return setSnackbar({
          visible: true,
          text: 'Este usuario no tiene empresas asignadas',
          type: 'error'
        })
      }

      if (!response.data.usuario || !response.data.usuario.idUsuario) {
        setLoading(false)
        return setSnackbar({
          visible: true,
          text: 'Usuario o contraseña incorrectos',
          type: 'error'
        })
      }

      if (response.data.empresas.length > 1) {
        setUser({
          clave: form.clave,
          empresas: response.data.empresas,
          ...response.data.usuario,
          username: form.usuario,
        })

        setLoading(false)
        return navigate(routes.chooseEnterprise)
      }

      setUser({
        ...response.data.usuario,
        ...response.data.empresas[0],
        clave: form.clave,
      })

      await AsyncStorage.setItem('username', form.usuario)

      setSnackbar({
        visible: true,
        text: `Ingreso éxitoso, ¡Bienvenido ${form.usuario}!`,
        type: 'success'
      })

      return navigate(routes.init)
    } catch (error) {
      console.log(error)
      setLoading(false)
      setSnackbar({
        visible: true,
        text: 'Ha ocurrido un error, intenta de nuevo',
        type: 'error'
      })
    }
  }

  const acceptTerms = async () => {
    const accept = await AsyncStorage.getItem('terms')
    console.log(accept)
    if (accept) return

    navigate(routes.terms)
  }

  useEffect(() => {
    acceptTerms()

    AsyncStorage.getItem('username').then((value) => {
      if (value) {
        setForm({
          ...form,
          usuario: value
        })
        passwordRef.current.focus()
      }
    })
  }, [])

  return (
    <View style={[styles.main]}>
      <Text style={[styles.title, {
        position: 'absolute',
        top: 100,
      }]}>¡Bienvenido! Inicia sesión</Text>


      <ReplaceWithLoading>
        <View style={styles.flexColumn}>
          <TextInput style={styles.inputWhite} value={form.usuario} placeholder='Nombre de usuario' onChangeText={(value) => {
            setForm({
              ...form,
              usuario: value
            })
          }} autoFocus onSubmitEditing={() => passwordRef.current.focus()} />

          <TextInput style={[styles.inputWhite]} secureTextEntry={true} placeholder='Contraseña' onChangeText={(value) => {
            setForm({
              ...form,
              clave: value
            })
          }} ref={passwordRef} onSubmitEditing={() => handleLogin()} />

          <Text style={[styles.text, {
            textAlign: 'right',
            marginBottom: 20,
            opacity: 0.5
          }]} onPress={
            () => navigate(routes.recovery)
          }>¿Olvidaste tu contraseña?</Text>
          <TouchableOpacity style={[styles.buttonAlt, {
            marginTop: 10
          }]} onPress={() => handleLogin()}>
            <Text style={styles.buttonText}>Ingresar</Text>
          </TouchableOpacity>
        </View>
      </ReplaceWithLoading>
    </View>
  )
}
