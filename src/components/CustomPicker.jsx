import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet } from 'react-native';
import { colors } from '../styles/styles';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';

const CustomPicker = ({ options, title, onValueChange, placeHolder }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handlePress = (value) => {
    setModalVisible(false);
    onValueChange(value);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      <TouchableOpacity style={styles.pickerButton} onPress={() => setModalVisible(true)}>
        <Text style={{
          ...styles.pickerButtonText,
          color: placeHolder.includes('Seleccione') ? '#00000050' : '#000000'
        }}>{placeHolder}</Text>

        {placeHolder.includes('Seleccione') && (
          <FontAwesomeIcon icon={faAngleDown} size={20} color="#00000050" />
        )}
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <FlatList
            data={options}
            keyExtractor={(item) => item.value.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.optionItem}
                onPress={() => handlePress(item.value)}>
                <Text>{item.label}</Text>
              </TouchableOpacity>
            )}
          />

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => setModalVisible(false)}>
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    position: 'absolute',
    top: -10,
    left: 10,
    zIndex: 2,
    backgroundColor: colors.white,
    paddingHorizontal: 5,
    color: colors.black,
  },
  pickerButton: {
    borderRadius: 5,
    paddingVertical: 20,
    paddingHorizontal: 15,
    alignItems: 'flex-start',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
  },
  pickerButtonText: {
    fontSize: 16,
    textAlign: 'left',
  },
  modalContainer: {
    backgroundColor: colors.gray,
    padding: 20,
    marginTop: 'auto',
  },
  optionItem: {
    padding: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.00,

    elevation: 1,
    marginBottom: 10,
  },
  cancelButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: 'red',
    borderRadius: 5,
    alignItems: 'center',

  },
  cancelButtonText: {
    color: 'white',
  },
  container: {
    marginBottom: 20,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#00000050'
  }
});

export default CustomPicker;