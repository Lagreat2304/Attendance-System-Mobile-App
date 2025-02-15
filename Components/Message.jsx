import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Message = ({ variant = 'info', children }) => {
  return (
    <View style={[styles.alert, styles[variant]]}>
      <Text style={[styles.text, { color: styles[variant].color }]}>
        {children}
      </Text>
    </View>
  );
};


const styles = StyleSheet.create({
  alert: {
    padding: 15,
    borderRadius: 5,
    marginVertical: 10,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
  },
  info: {
    backgroundColor: '#d1ecf1',
    borderColor: '#bee5eb',
    color: '#0c5460',
  },
  danger: {
    backgroundColor: '#f8d7da',
    borderColor: '#f5c6cb',
    color: '#721c24',
  },
  success: {
    backgroundColor: '#d4edda',
    borderColor: '#c3e6cb',
    color: '#155724',
  },
  warning: {
    backgroundColor: '#fff3cd',
    borderColor: '#ffeeba',
    color: '#856404',
  },
});

export default Message;
