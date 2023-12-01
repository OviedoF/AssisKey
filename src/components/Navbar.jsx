import React, { useContext } from 'react'
import { View, Text } from 'react-native'
import { Dimensions } from 'react-native';
import styles from '../styles/styles'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowRightArrowLeft, faHouse, faList, faLocationDot, faQrcode } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { TouchableOpacity } from 'react-native';
import { useNavigate } from 'react-router-native';
import routes from '../router/routes';
import { dataContext } from '../context/dataContext';

export default function Navbar({position = "absolute"}) {
  const navigate = useNavigate();
  const { user } = useContext(dataContext)

  return (
    <View style={{
      position: position,
      bottom: 0,
      left: 0,
      width: Dimensions.get('window').width,
      margin: 0,
      height: 70,
      display: 'flex',
      flexDirection: 'row',
    }}>
      <TouchableOpacity style={[styles.flexColumn, {
        width: '25%',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
      }]} onPress={() => navigate(routes.home)}>
        <FontAwesomeIcon icon={faHouse} size={30} color={'black'} />
        <Text>Inicio</Text>
      </TouchableOpacity>

      {user.nivel == 1 && <TouchableOpacity style={[styles.flexColumn, {
        width: '25%',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
      }]} onPress={() => navigate(routes.camera)}>
        <FontAwesomeIcon icon={faQrcode} size={30} color={'black'} />
        <Text>Leer QR</Text>
      </TouchableOpacity>
      }

      <TouchableOpacity style={[styles.flexColumn, {
        width: '25%',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
      }]} onPress={() => navigate(routes.historial)}>
        <FontAwesomeIcon icon={faList} size={30} color={'black'} />
        <Text>Historial</Text>
      </TouchableOpacity>

      {user.nivel == 0 && <TouchableOpacity style={[styles.flexColumn, {
        width: '25%',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
      }]} onPress={() => navigate(routes.operar)}>
        <FontAwesomeIcon icon={faArrowRightArrowLeft} size={30} color={'black'} />
        <Text>Operar</Text>
      </TouchableOpacity>
      }

      <TouchableOpacity style={[styles.flexColumn, {
        width: '25%',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
      }]} onPress={() => navigate(routes.account)}>
        <FontAwesomeIcon icon={faUser} size={30} color={'black'} />
        <Text>Mi cuenta</Text>
      </TouchableOpacity>
    </View>
  )
}
