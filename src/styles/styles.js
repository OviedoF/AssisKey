import { StyleSheet } from 'react-native';

export const colors = {
    white: '#EFFFFB',
    gray: '#F7F7F7',
    green: '#50D890',
    blue: '#64CCC5',
    black: '#272727',
}

export default StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: colors.gray,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
        paddingHorizontal: 40,
        position: 'relative',
        color: colors.black,
    },
    camera: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    title: {
        fontSize: 25,
        marginBottom: 60,
        color: colors.black,
    },
    text: {
        fontSize: 16,
        marginBottom: 20,
        color: colors.black,
    },
    textBold: {
        fontSize: 16,
        marginBottom: 20,
        fontWeight: 'bold',
        color: colors.black,
    },
    mainWhite: {
        flex: 1,
        backgroundColor: colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
        paddingHorizontal: 40,
    },
    flexColumn: {
        width: '100%',
        flexDirection: 'column',
        alignItems: 'left',
        justifyContent: 'left',
    },
    flexRow: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    label: {
        color: colors.black,
        fontSize: 16,
        marginBottom: 5,
    },
    input: {
        width: '100%',
        height: 40,
        borderBottomColor: colors.black,
        borderBottomWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 20,
    },
    inputWhite: {
        width: '100%',
        height: 55,
        borderRadius: 20,
        paddingHorizontal: 10,
        marginBottom: 20,
        backgroundColor: colors.white,
    },
    button: {
        width: '100%',
        height: 50,
        backgroundColor: colors.green,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
    buttonAlt: {
        width: '100%',
        height: 50,
        backgroundColor: colors.blue,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: colors.white,
        fontSize: 16,
    },
});