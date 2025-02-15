import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useAuth } from "../Context/AuthContext";
import Login from "../Components/Login";
import Register from "../Components/Register";
import Home from "../Components/Home";
import { createStackNavigator } from "@react-navigation/stack";
import Location from "../Components/Location";
import Verification from "../Components/Verification";
import FaceAttendance from "../Components/FaceAttendance";
import Student from "../Components/Student";
import AttendanceTableComponent from "../Components/AttendanceTableComponent";
import PasswordReset from "../Components/PasswordReset";
import Footer from "../Components/Footer";

const Stack = createStackNavigator();

const AppNavigator = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return <Text>Loading...</Text>;
    }

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Stack.Navigator initialRouteName="Location" screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="Location" component={Location} />
                    <Stack.Screen name="Verification" component={Verification} />
                    {user ? (
                        <>
                            <Stack.Screen name="Home" component={Home} />
                            <Stack.Screen name="FaceAttendance" component={FaceAttendance} />
                            <Stack.Screen name="Student" component={Student} />
                            <Stack.Screen name="AttendanceTable" component={AttendanceTableComponent} />
                        </>
                    ) : (
                        <>
                            <Stack.Screen name="Login" component={Login} />
                            <Stack.Screen name="Register" component={Register} />
                            <Stack.Screen name="PasswordReset" component={PasswordReset} />
                        </>
                    )}
                </Stack.Navigator>
            </View>
            <Footer />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
    },
});

export default AppNavigator;
