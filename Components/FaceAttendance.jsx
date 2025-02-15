import React, { useState } from 'react';
import { TouchableOpacity, View, Text, StyleSheet, Alert, ActivityIndicator, TextInput } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { useAuth } from '../Context/AuthContext';
import { useNavigation } from '@react-navigation/native';

const FaceAttendance = ({ onAttendanceMarked }) => {
  const { user } = useAuth();
  const [processing, setProcessing] = useState(false);
  const [currentFaceBase64, setCurrentFaceBase64] = useState('');
  const navigation = useNavigation();
  const BACKEND_URL = process.env.EXPO_PUBLIC_API_URL;
  const takePicture = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant camera permissions to take a photo.');
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
        base64: true,
        exif: false,
        imageWidth: 640,
        imageHeight: 640,
        cameraType : ImagePicker.CameraType.front,
      });

      if (!result.canceled) {
        const base64Data = result.assets[0].base64;
        console.log('Image captured successfully. Base64 length:', base64Data.length);
        
        if (base64Data.length > 5000000) {
          Alert.alert('Image too large', 'Please try taking the photo again with less background detail.');
          return;
        }
        
        setCurrentFaceBase64(base64Data);
      }
    } catch (error) {
      console.error('Camera error:', error);
      Alert.alert('Error', 'Failed to take picture. Please try again.');
    }
  };

  const processAttendance = async () => {
    if (!currentFaceBase64) {
      Alert.alert('Error', 'Please provide a valid face image.');
      return;
    }

    try {
      setProcessing(true);
      const axiosConfig = {
        timeout: 30000,
        headers: {
          'Content-Type': 'application/json',
        }
      };

      const response = await axios.post(
        `${BACKEND_URL}/attendance/verify`,
        {
          studentId : user._id,
          currentFaceImage: currentFaceBase64,
          timestamp: new Date().toISOString(),
        },
        axiosConfig
      );
      console.log(response.data);
      if (response.data.isMatch) {
        const attendanceResponse = await axios.post(
          `${BACKEND_URL}/attendance/mark`,
          {
            studentId: user._id,
            timestamp: new Date().toISOString(),
          },
          axiosConfig
        );

        if (attendanceResponse.data.success) {
          Alert.alert('Success', 'Attendance marked successfully!');
          onAttendanceMarked && onAttendanceMarked(true);
          navigation.navigate('Home');
        }
      } else {
        Alert.alert('Error', 'Face verification failed. Please try again.');
        onAttendanceMarked && onAttendanceMarked(false);
      }
    } catch (error) {
      console.error('Network error details:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        message: error.message
      });
      
      Alert.alert(
        'Error',
        error.response.data.message || 'Failed to verify face. Please check your connection and try again.'
      );
      onAttendanceMarked && onAttendanceMarked(false);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.header}>
          Mark Attendance
        </Text>
        <Text style={styles.instructions}>
          Take a clear photo of your face to mark attendance
        </Text>

        <TouchableOpacity 
          style={styles.captureButton} 
          onPress={takePicture}
          disabled={processing}
        >
          <Text style={styles.captureButtonText}>Take Photo</Text>
        </TouchableOpacity>

        {currentFaceBase64 ? (
          <TouchableOpacity 
            style={[styles.submitButton, processing && styles.disabledButton]} 
            onPress={processAttendance}
            disabled={processing}
          >
            <Text style={styles.submitButtonText}>
              {processing ? 'Processing...' : 'Submit Attendance'}
            </Text>
          </TouchableOpacity>
        ) : null}

        {processing && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#ffffff" />
            <Text style={styles.loadingText}>Verifying...</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  instructions: {
    color: '#ffffff',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  header: {
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 30,
    fontWeight: 'bold'
  },
  input: {
    height: 50,
    borderColor: '#fff',
    borderWidth: 1,
    color: '#fff',
    paddingLeft: 10,
    width: '80%',
    marginBottom: 20,
    borderRadius: 10,
  },
  captureButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
    width: 200,
  },
  captureButtonText: {
    fontSize: 18,
    color: '#000',
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: 'center',
    width: 200,
  },
  submitButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
  },
  loadingContainer: {
    alignItems: 'center',
  },
  loadingText: {
    color: '#ffffff',
    fontSize: 16,
    marginTop: 10,
  },
});

export default FaceAttendance;
