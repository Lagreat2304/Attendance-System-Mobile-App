import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Animated } from 'react-native';

const AlertBox = ({ visible, message, onClose, type }) => {
  const fadeAnim = new Animated.Value(0); // Initial opacity

  // Fade in effect when the notification is visible
  React.useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    } else {
      fadeAnim.setValue(0);
    }
  }, [visible]);

  const getBackgroundColor = () => {
    switch (type) {
      case 'error':
        return '#FF6347';
      case 'success':
        return '#4CAF50';
      case 'info':
        return '#17A2B8';
      default:
        return '#FFD700'; // Default color for general notifications
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'error':
        return '❌';
      case 'success':
        return '✅';
      case 'info':
        return 'ℹ️';
      default:
        return '⚡';
    }
  };

  return (
    <Modal transparent={true} animationType="fade" visible={visible}>
      <Animated.View style={[styles.modalContainer, { opacity: fadeAnim }]}>
        <View style={[styles.alertBox, { backgroundColor: getBackgroundColor() }]}>
          <Text style={styles.icon}>{getIcon()}</Text>
          <Text style={styles.alertText}>{message}</Text>
          <TouchableOpacity style={styles.dismissButton} onPress={onClose}>
            <Text style={styles.buttonText}>Dismiss</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end', // Slide-up notification
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  alertBox: {
    width: '90%',
    maxWidth: 350,
    padding: 20,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 5,
  },
  icon: {
    fontSize: 28,
    marginRight: 15,
  },
  alertText: {
    fontSize: 16,
    color: '#fff',
    flex: 1,
    textAlign: 'left',
  },
  dismissButton: {
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: '#333',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default AlertBox;
