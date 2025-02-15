import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  StatusBar,
} from "react-native";
import { useAuth } from '../Context/AuthContext';
import { useNavigation } from '@react-navigation/core';

const Home = () => {
  const navigation = useNavigation();
  const { logout, user } = useAuth();

  if (!user) {
    return <Text>Loading...</Text>;
  }

  const handleAttendance = () => {
    navigation.navigate('FaceAttendance');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StatusBar backgroundColor="#f5f5f5" barStyle="dark-content" />
      <Image
        source={require('../assets/welcome.png')}
        style={styles.bannerImage}
      />
      <Text style={styles.title}>Welcome to CIT</Text>
      <Text style={styles.subtitle}>Hello, <Text style={{fontWeight: "bold"}}>{user.name}</Text>! We're glad to have you here.</Text>

      <View style={styles.cardContainer}>

        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Student')}>
          <Image
            source={require('../assets/student.png')}
            style={styles.cardImage}
          />
          <Text style={styles.cardText}>Student</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('AttendanceTable')}>
          <Image
            source={require('../assets/calendar.png')}
            style={styles.cardImage}
          />
          <Text style={styles.cardText}>View your Attendance</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.card} onPress={handleAttendance}>
          <Image
            source={require('../assets/attendance.png')}
            style={styles.cardImage}
          />
          <Text style={styles.cardText}>Mark Attendance</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.card} onPress={logout}>
          <Image
            source={require('../assets/logout.png')}
            style={styles.cardImage}
          />
          <Text style={styles.cardText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    paddingTop: StatusBar.currentHeight || 20,
    paddingBottom: 20,
  },
  bannerImage: {
    width: "90%",
    height: 200,
    borderRadius: 15,
    marginBottom: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
  cardContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    width: 150,
    height: 150,
    margin: 10,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  cardImage: {
    width: 60,
    height: 60,
    marginBottom: 10,
  },
  cardText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
});

export default Home;
