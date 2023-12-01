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
        <TouchableOpacity style={styleSheet.section} onPress={() => navigate(routes.incidencias)}>

          <Text style={{
            color: colors.black,
            marginLeft: 10,
          }}>Permisos e incidencias</Text>

          <FontAwesomeIcon icon={faAngleRight} style={{
            position: 'absolute',
            right: 20,
            top: 20,
          }} size={20} color={colors.black} />
        </TouchableOpacity>
      <Navbar />
    </View>
  )
}

const styleSheet = StyleSheet.create({
  section: {
    width: '100%',
    marginVertical: 20,
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