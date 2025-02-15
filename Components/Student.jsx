import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Linking } from 'react-native';
import { useAuth } from '../Context/AuthContext';

const Student = () => {
  const { user } = useAuth();
  const handleCall = () => {
    Linking.openURL(`tel:${user.contact}`);
  };

  return (
    <View style={styles.card}>
       <Image source={{ uri: user.image }} style={{ width: 200, height: 200 }} />
      <View style={styles.cardBody}>
        <TouchableOpacity onPress={() => {/* navigate to user details screen */}}>
          <Text style={styles.title}>{user.name}</Text>
        </TouchableOpacity>
        <Text style={styles.infoText}>
          <Text style={styles.label}>Register No: </Text>
          {user.registerNo}
        </Text>
        <Text style={styles.infoText}>
          <Text style={styles.label}>Date of Birth: </Text>
          {user.dob}
        </Text>
        <Text style={styles.infoText}>
          <Text style={styles.label}>Department: </Text>
          {user.department}
        </Text>
        <Text style={styles.infoText}>
          <Text style={styles.label}>Year: </Text>
          {user.year}
        </Text>
        <Text style={styles.infoText}>
          <Text style={styles.label}>Email: </Text>
          {user.email}
        </Text>
        <Text style={styles.infoText}>
          <Text style={styles.label}>Address: </Text>
          {user.address}
        </Text>
        <Text style={styles.infoText}>
          <Text style={styles.label}>City: </Text>
          {user.city}
        </Text>
        <TouchableOpacity onPress={handleCall}>
          <Text style={styles.contactText}>Contact: {user.contact}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 140,
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    alignItems: 'center',
    width: '90%',
    alignSelf: 'center',
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 2,
    borderColor: '#ddd',
    marginBottom: 15,
  },
  cardBody: {
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
    textAlign: 'justify'
  },
  label: {
    fontWeight: 'bold',
    color: '#333',
  },
  contactText: {
    color: '#007bff',
    fontSize: 16,
    marginTop: 10,
    textDecorationLine: 'underline',
  },
});

export default Student;
