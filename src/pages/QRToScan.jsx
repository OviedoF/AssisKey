import React, { useContext, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { dataContext } from "../context/dataContext";
import QRCode from "react-native-qrcode-svg";
import styles from "../styles/styles";
import { useNavigate } from "react-router-native";
import routes from "../router/routes";
import Navbar from "../components/Navbar";

const QRToScan = () => {
    const navigate = useNavigate();
    const { qrForEntry, setSnackbar } = useContext(dataContext)

    useEffect(() => {
        if (!qrForEntry) {
            setSnackbar({ visible: true, text: 'No hay código QR para escanear', type: 'error' })
            navigate(routes.home)
        }
    }, [])

    return (
        <View style={[styles.mainWhite]}>
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