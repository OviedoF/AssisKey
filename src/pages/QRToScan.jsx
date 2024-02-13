import React, { useContext, useEffect, useState } from "react";
import { View, Text, Image } from "react-native";
import { dataContext } from "../context/dataContext";
import QRCode from "react-native-qrcode-svg";
import styles from "../styles/styles";
import { useNavigate } from "react-router-native";
import routes from "../router/routes";
import Navbar from "../components/Navbar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Buffer } from 'buffer'

const QRToScan = () => {
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState({});
    const { qrForEntry, setSnackbar, user } = useContext(dataContext)
    const [logoEmpresa, setLogoEmpresa] = useState('')
    const [userImage, setUserImage] = useState('')

    useEffect(() => {
        if (!qrForEntry) {
            setSnackbar({ visible: true, text: 'No hay código QR para escanear', type: 'error' })
            navigate(routes.home)
        }

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

        const logoEmpresaSetter = async () => {
          const logo = user.empresas.filter(e => e.idEmpresa === user.idEmpresa)[0].logo
          const buffer = Buffer.from(logo, 'base64');
    
          setLogoEmpresa(`data:image/jpeg;base64,${buffer.toString('base64')}`)
        }

        const getUserImage = async () => {
          const buffer = Buffer.from(user.idFile, 'base64');
          setUserImage(`data:image/jpeg;base64,${buffer.toString('base64')}`)
        }

        getUserInfo()
        logoEmpresaSetter()
        getUserImage()
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

                {userImage && <Image src={userImage} style={{
                    width: 100,
                    height: 100,
                    marginBottom: 10,
                    objectFit: 'cover',
                    borderRadius: 100,
                }} />}

                <Text style={[styles.text, { marginBottom: 5 }]}>
                    <Text style={[styles.textBold, { textAlign: 'center' }]}>Nombre:</Text> {userInfo.name}
                </Text>

                <Text style={[styles.text, { marginBottom: 5 }]}>
                    <Text style={[styles.textBold, { textAlign: 'center' }]}>DNI:</Text> {userInfo.document}
                </Text>
            </View>

            {qrForEntry && <View style={[styles.flexColumn, {
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 20
            }]}>
                <Text style={[styles.title, {
                    fontSize: 20,
                    marginBottom: 20,
                    textAlign: 'center'
                }]}>{qrForEntry.text}</Text>

                <QRCode value={qrForEntry.qr} size={200} backgroundColor='transparent' />
            </View>}

            <Navbar />
        </View>
    );
}

export default QRToScan;