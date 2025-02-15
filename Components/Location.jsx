import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import * as Network from 'expo-network';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../Context/AuthContext';

const TARGET_LOCATION = {
  latitude: 12.96914405470079,
  longitude: 80.19534555034916,
};

//12.96914405470079, 80.19534555034916
const ALLOWED_RADIUS_IN_METERS = 100;
const TARGET_IP = '192.168.1.10';
const TARGET_PORT = 80;
const TIMEOUT_MS = 5000;

export default function LocationCheck() {
  const navigation = useNavigation();
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const [isWithinRadius, setIsWithinRadius] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [currentIp, setCurrentIp] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState({
    isConnected: false,
    deviceDetails: null,
    error: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3;
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) *
      Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  const checkTargetIPConnection = async () => {
    try {
      const networkState = await Network.getNetworkStateAsync();
      if (!networkState.isConnected) {
        throw new Error('No network connection');
      }

      const results = await Promise.all([
        fetch(`http://${TARGET_IP}:${TARGET_PORT}/`, {
          method: 'HEAD',
          timeout: TIMEOUT_MS,
        }).then(() => true).catch(() => false),

        Promise.race([
          fetch(`http://${TARGET_IP}:${TARGET_PORT}/ping`, {
            method: 'HEAD',
            timeout: 2000,
          }).then(() => true).catch(() => false),
          new Promise((resolve) => setTimeout(() => resolve(false), 60000)),
        ]),

        Network.getIpAddressAsync()
          .then((deviceIP) => {
            const deviceSubnet = deviceIP.split('.').slice(0, 3).join('.');
            const targetSubnet = TARGET_IP.split('.').slice(0, 3).join('.');
            return deviceSubnet === targetSubnet;
          })
          .catch(() => false),
      ]);

      const isConnected = results.some((result) => result === true);

      return {
        isConnected,
        deviceDetails: {
          networkType: networkState.type,
          isInternetReachable: networkState.isInternetReachable,
          deviceIP: await Network.getIpAddressAsync(),
        },
      };
    } catch (error) {
      return {
        isConnected: false,
        error: error.message,
        deviceDetails: null,
      };
    }
  };

  const checkGPSLocation = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Location permission not granted');
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });

      const { latitude, longitude } = location.coords;

      setCurrentLocation({ latitude, longitude });

      const distance = calculateDistance(
        latitude,
        longitude,
        TARGET_LOCATION.latitude,
        TARGET_LOCATION.longitude
      );

      setIsWithinRadius(distance <= ALLOWED_RADIUS_IN_METERS);
    } catch (err) {
      setError('Error checking location: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = async () => {
    await checkGPSLocation();
    const status = await checkTargetIPConnection();
    setConnectionStatus(status);
  };

  const handleEnter = () => {
    if(user){
      navigation.navigate('Home');
    }else{
      navigation.navigate('Login');
    }
  };

  useEffect(() => {
    let previousLocationStatus = null;
    let previousConnectionStatus = null;
  
    const initializeChecks = async () => {
      await checkGPSLocation();
      const status = await checkTargetIPConnection();
      setConnectionStatus(status);
  
      previousLocationStatus = isWithinRadius;
      previousConnectionStatus = status.isConnected;
    };
  
    const monitorChanges = async () => {
      await checkGPSLocation();
      const status = await checkTargetIPConnection();
  
      setConnectionStatus(status);
      if (
        isWithinRadius !== previousLocationStatus ||
        status.isConnected !== previousConnectionStatus
      ) {
        navigation.navigate('Verification');
        previousLocationStatus = isWithinRadius;
        previousConnectionStatus = status.isConnected;
      }
    };
  
    initializeChecks();
  
    const interval = setInterval(monitorChanges, 5000);
  
    return () => clearInterval(interval);
  }, [isWithinRadius, connectionStatus]);
    
  return (
    <View style={styles.container}>
      {currentLocation ? (
        <View style={styles.locationInfo}>
          <Text style={styles.locationText}>Location Verification</Text>
          <View style={styles.statusContainer}>
            <Text
              style={[
                styles.statusText,
                isWithinRadius ? styles.statusSuccess : styles.statusFailure,
              ]}
            >
              Location Status: {isWithinRadius ? '✓ Verified' : '✗ Outside allowed area'}
            </Text>

            <Text
              style={[
                styles.statusText,
                connectionStatus.isConnected ? styles.statusSuccess : styles.statusFailure,
              ]}
            >
              IP Status: {connectionStatus.isConnected ? '✓ Connected to Target IP' : '✗ Not connected'}
            </Text>
          </View>

          {error && <Text style={styles.errorText}>{error}</Text>}

          <TouchableOpacity
            style={styles.retryButton}
            onPress={isWithinRadius && connectionStatus.isConnected ? handleEnter : handleRetry}
          >
            <Text style={styles.retryButtonText}>
              {isWithinRadius && connectionStatus.isConnected ? 'Enter' : 'Retry Verification'}
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Text>Loading Location...</Text>
      )}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  locationInfo: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  locationText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  statusContainer: {
    marginBottom: 20,
  },
  statusText: {
    fontSize: 16,
    marginBottom: 10,
  },
  statusSuccess: {
    color: 'green',
    fontWeight: 'bold',
  },
  statusFailure: {
    color: 'red',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

