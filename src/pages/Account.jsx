import React, { useContext } from 'react'
import {Text, TouchableOpacity, View, StyleSheet } from 'react-native'
import styles, { colors } from '../styles/styles'
import { useNavigate } from 'react-router-native'
import routes from '../router/routes'
import { dataContext } from '../context/dataContext'
import ReplaceWithLoading from '../components/ReplaceWithLoading'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faAngleRight, faHeadset, faMobileScreen, faRightFromBracket} from '@fortawesome/free-solid-svg-icons'
import {faUser} from '@fortawesome/free-regular-svg-icons'
import Navbar from '../components/Navbar'

export default function ChoseEnterprise() {
  const { user, setUser } = useContext(dataContext)
  const navigate = useNavigate()

  return (
    <View style={[styles.mainWhite, {
      position: 'relative',
      justifyContent: 'flex-start',
    }]}>
      <Text style={{
        width: '100%',
        borderBottomColor: '#E2EFF7',
        borderBottomWidth: 1,
        paddingBottom: 20,
        textAlign: 'center',
      }}>
        Cuenta
      </Text>

      <View style={{
        width: 100,
        height: 100,
        borderRadius: 100,
        backgroundColor: '#E2EFF7',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginTop: 20,
        marginBottom: 20,
      }}>
        <Text style={{
          fontSize: 50,
          fontWeight: 'bold',
          color: '#86C0DC',
        }}>{
            user.nomCompleto.split('')[0]
          }</Text>
      </View>

      <Text style={[styles.title, {
        marginBottom: 20,
        color: colors.black,
        opacity: .9,
        textAlign: 'center',
        fontSize: 20,
      }]}>{user.nomCompleto}</Text>

      <ReplaceWithLoading>
        <TouchableOpacity style={styleSheet.section} onPress={() => navigate(routes.personalData)}>
          <FontAwesomeIcon
          icon={faUser}
          size={22}
          color={colors.green}
           />

          <Text style={{
            color: colors.black,
            marginLeft: 10,
          }}>Datos Personales</Text>

          <FontAwesomeIcon icon={faAngleRight} style={{
            position: 'absolute',
            right: 20,
            top: 20,
          }} size={20} color={colors.green} />
        </TouchableOpacity>

        <TouchableOpacity style={styleSheet.section} onPress={() => navigate(routes.security)}>
          <FontAwesomeIcon
          icon={faHeadset}
          size={22}
          color={colors.green}
           />

          <Text style={{
            color: colors.black,
            marginLeft: 10,
          }}>Seguridad</Text>

          <FontAwesomeIcon icon={faAngleRight} style={{
            position: 'absolute',
            right: 20,
            top: 20,
          }} size={20} color={colors.green} />
        </TouchableOpacity>

        <TouchableOpacity style={styleSheet.section} onPress={() => navigate(routes.configuration)}>
          <FontAwesomeIcon
          icon={faMobileScreen}
          size={22}
          color={colors.green}
           />

          <Text style={{
            color: colors.black,
            marginLeft: 10,
          }}>Configuración</Text>

          <FontAwesomeIcon icon={faAngleRight} style={{
            position: 'absolute',
            right: 20,
            top: 20,
          }} size={20} color={colors.green} />
        </TouchableOpacity>

        <TouchableOpacity style={styleSheet.section} onPress={() => {
          setUser({})
          navigate(routes.login)
        }}>
          <FontAwesomeIcon
          icon={faRightFromBracket}
          size={22}
          color={colors.green}
           />

          <Text style={{
            color: colors.black,
            marginLeft: 10,
          }}>Cerrar sesión</Text>

          <FontAwesomeIcon icon={faAngleRight} style={{
            position: 'absolute',
            right: 20,
            top: 20,
          }} size={20} color={colors.green} />
        </TouchableOpacity>
      </ReplaceWithLoading>
      <Navbar />
    </View>
  )
}

const styleSheet = StyleSheet.create({
  section: {
    width: '100%',
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors.white,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.00,
    
    elevation: 1,
  }
})