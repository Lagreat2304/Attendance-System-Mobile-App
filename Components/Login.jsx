import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../Context/AuthContext';
import AlertBox from '../Components/AlertBox';

const Login = () => {
  const [form, setForm] = useState({ email: "" , password: "" });
  const navigation = useNavigation();
  const { login } = useAuth();
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('');
  const showAlert = (message, type) => {
    setAlertMessage(message);
    setAlertType(type);
    setAlertVisible(true);
  };


  const handleChanges = (name, value) => {
    setForm({ ...form, [name]: value });
  };

  const handleLogin = async () => {
    if(form.email === "" || form.password === "") {
      showAlert('Please fill all the fields','error');
      return;
    }

    if(!form.email.includes('@citchennai.net')) {
      showAlert('Invalid email','error');
      return;
    }
    const { success, error } = await login(form);
    if (!success) {
       showAlert('Login Failed: Invalid email or password','error');
    }else{
      setTimeout(() => navigation.navigate('Home'), 1000);
    }
  };
  const handleRegister = () => {
    navigation.navigate('Register');
  };

  const handleForgotPassword = () => {
    navigation.navigate('PasswordReset');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={form.email}
        onChangeText={(text) => handleChanges('email', text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={form.password}
        onChangeText={(text) => handleChanges('password', text)}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.registerButton} onPress={handleForgotPassword}>
        <Text style={styles.RedirectText}>Forgot Password? Click here</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        <Text style={styles.RedirectText}>New Student? Register Here</Text>
      </TouchableOpacity>

      <AlertBox
        visible={alertVisible}
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
        type={alertType}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#007BFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  RedirectText: {
    textAlign: 'center',
    color: '#007BFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
});

export default Login;
