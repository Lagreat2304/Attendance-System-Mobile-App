import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
const PasswordReset = () => {
  const [step, setStep] = useState(1);
  const [register, setRegister] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordErrors, setPasswordErrors] = useState([]);
  const [passwordStrength, setPasswordStrength] = useState("");
  const navigator = useNavigation();
  const BACKEND_URL = process.env.EXPO_PUBLIC_API_URL;

  const passwordConstraints = [
    { regex: /.{8,20}/, message: "Must be 8-20 characters long" },
    { regex: /[A-Z]/, message: "Must include at least one uppercase letter" },
    { regex: /[a-z]/, message: "Must include at least one lowercase letter" },
    { regex: /[0-9]/, message: "Must include at least one number" },
    { regex: /[!@#$%^&*]/, message: "Must include at least one special character" },
    { regex: /^\S*$/, message: "Cannot contain spaces" },
  ];

  const validatePassword = (password) => {
    const errors = [];
    let satisfiedConstraints = 0;
    passwordConstraints.forEach(({ regex, message }) => {
      if (!regex.test(password)) {
        errors.push(message);
      } else {
        satisfiedConstraints++;
      }
    });
  
    setPasswordErrors(errors);
    const strengthLevels = ["Weak", "Medium", "Strong"];
    setPasswordStrength(strengthLevels[Math.min(satisfiedConstraints - 1, 2)]);
  };

  const sendOtpToRegister = async () => {
    try {
      console.log(register);
      const response = await fetch(`${BACKEND_URL}/student/sendOTP`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ registerNumber: register }),
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert('OTP Sent', `OTP sent to ur email`);
        setStep(2);
      } else {
        Alert.alert('Error', data.message || 'Failed to send OTP.');
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to connect to the server.');
    }
  };

  const verifyOtp = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/student/verifyotp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ registerNumber: register, otp }),
      });

      const data = await response.json();
      if (response.ok) {
        setStep(3);
      } else {
        Alert.alert('Invalid OTP', data.message || 'Please enter the correct OTP.');
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to connect to the server.');
    }
  };

  const resetPassword = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/student/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ registerNumber: register, password }),
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert('Success', 'Your password has been reset.');
        navigator.navigate('Login');
        setRegister('');
        setOtp('');
        setPassword('');
        setConfirmPassword('');
      } else {
        Alert.alert('Error', data.message || 'Failed to reset password.');
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to connect to the server.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>

      {step === 1 && (
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Register Number</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="Enter your register number"
            value={register}
            onChangeText={setRegister}
          />
          <Button title="Send OTP" onPress={sendOtpToRegister} />
        </View>
      )}

      {step === 2 && (
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Enter OTP</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="Enter the OTP"
            value={otp}
            onChangeText={setOtp}
            secureTextEntry
          />
          <Button title="Verify OTP" onPress={verifyOtp} />
        </View>
      )}

      {step === 3 && (
        <View style={styles.inputContainer}>
          <Text style={styles.label}>New Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your new password"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              validatePassword(text);
            }}
            secureTextEntry
          />
          <Text style={{ color: passwordStrength === "Weak" ? "red" : passwordStrength === "Medium" ? "orange" : "green" }}>
            Password Strength: {passwordStrength}
          </Text>
          {passwordErrors.map((error, index) => (
            <Text key={index} style={{ color: 'red' }}>{error}</Text>
          ))}
          <Text style={styles.label}>Confirm Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Re-enter your new password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
          <Button title="Reset Password" onPress={resetPassword} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
});

export default PasswordReset;
