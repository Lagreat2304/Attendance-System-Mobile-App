import React from 'react';
import { View, StyleSheet } from 'react-native';

const FormContainer = ({ children }) => {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.col}>
          {children}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  row: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  col: {
    width: '100%',
    maxWidth: 400,
  },
});

export default FormContainer;
