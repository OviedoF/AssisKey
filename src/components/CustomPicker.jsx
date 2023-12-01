import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet } from 'react-native';
import { colors } from '../styles/styles';

const CustomPicker = ({ options, selectedValue, onValueChange, placeHolder }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handlePress = (value) => {
    setModalVisible(false);
    onValueChange(value);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.pickerButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.pickerButtonText}>{placeHolder}</Text>
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
  pickerButton: {
    borderRadius: 5,
    padding: 10,
    alignItems: 'flex-start',
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
});

export default CustomPicker;