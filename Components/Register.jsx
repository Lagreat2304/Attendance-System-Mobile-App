import React, { useState } from "react";
import { useNavigation } from '@react-navigation/native';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  StatusBar
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from '@react-native-community/datetimepicker';

const Register = () => {
    const navigation = useNavigation();
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordErrors, setPasswordErrors] = useState([]);
    const [passwordStrength, setPasswordStrength] = useState("");
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

    const handleLoginRedirect = () => {
        navigation.navigate('Login');
    };
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    registerNo: "",
    city: "",
    contact: "",
    fatherContact: "",
    department: "",
    year: "",
    status: "",
    email: "",
    password : "",
    dob: "",
    image: null,
  });

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleConfirmPasswordChange = (value) => {
    setConfirmPassword(value);
  };

  const handleImagePick = async (mode) => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission required", "You need to allow camera roll access.");
      return;
    }
  
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
  
    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      setFormData((prev) => ({ ...prev, image: imageUri }));
    }
};

  const showDatePickerModal = () => {
    setShowDatePicker(true);
};

const onChangeDate = (event, selectedDate) => {
  setShowDatePicker(false);
  if (selectedDate) {
      const day = String(selectedDate.getDate()).padStart(2, '0');
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const year = selectedDate.getFullYear();
      const formattedDate = `${day}-${month}-${year}`;
      setFormData(prev => ({ ...prev, dob: formattedDate }));
  }
};
  const handleSubmit = async () => {
    if (
      !formData.name ||
      !formData.address ||
      !formData.registerNo ||
      !formData.city ||
      !formData.contact ||
      !formData.fatherContact ||
      !formData.department ||
      !formData.year ||
      !formData.status ||
      !formData.image || 
      !formData.dob ||
      !formData.email ||
      !formData.password || !formData.image
    ) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    if(formData.password !== confirmPassword) {
        Alert.alert('Passwords do not match');
        return;
    }

    if(formData.contact.length !== 10) {
        Alert.alert('Please enter your valid contact number');
        return;
    }

    if(formData.fatherContact.length !== 10) {
        Alert.alert('Please enter your father\'s valid contact number');
        return;
    }

    if(!formData.email.includes('@citchennai.net')) {
        Alert.alert('Please enter college email');
        return;
    }
      if (!formData.image) {
        Alert.alert("Error", "Please pick an image.");
        return;
      }
      const data = new FormData();
      fetch(formData.image)
        .then((res) => res.blob())
        .then((blob) => {
          data.append("image", {
            uri: formData.image,
            name: "student_image.jpg",
            type: "image/jpeg",
            size: blob.size,
          });
    
          Object.keys(formData).forEach((key) => {
            if (key !== "image") {
              data.append(key, formData[key]);
            }
          });
          submitFormData(data);
        })
        .catch((error) => {
          console.error("Error converting image to blob:", error);
          Alert.alert("Error", "Failed to process image.");
        });
  };

const submitFormData = async (data) => {
  try {
    console.log(data);
    const response = await axios.post(`${BACKEND_URL}/student/addStudent`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    if (response.status === 201) {
      Alert.alert("Success", "Student registered successfully!");
      setFormData({
        name: "",
        address: "",
        registerNo: "",
        city: "",
        contact: "",
        fatherContact: "",
        department: "",
        year: "",
        status: "",
        email: "",
        password: "",
        dob: "",
        image: null,
      });
      setConfirmPassword("");
      navigation.navigate('Login');
    }
  } catch (error) {
    console.error("Submission error: ", error);
    Alert.alert("Error", error.message);
  }
};
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StatusBar backgroundColor="#f5f5f5" barStyle="dark-content" />
      <Text style={styles.title}>Register Student</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={formData.name}
        onChangeText={(text) => handleChange("name", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Address"
        value={formData.address}
        onChangeText={(text) => handleChange("address", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Register Number"
        value={formData.registerNo}
        onChangeText={(text) => handleChange("registerNo", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="City"
        value={formData.city}
        onChangeText={(text) => handleChange("city", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={formData.email}
        onChangeText={(text) => handleChange("email", text)}
      />
      <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry={true}
          value={formData.password}
          onChangeText={(text) => {
            handleChange("password", text);
            validatePassword(text);
          }}
        />
        <View>
          {passwordConstraints.map(({ message }, index) => (
            <Text key={index} style={{ color: passwordErrors.includes(message) ? "red" : "green" }}>
              {message}
            </Text>
          ))}
          {formData.password && <Text>Password Strength: <Text style={{ fontWeight: 'bold' }}>{passwordStrength}</Text>
          </Text>}
        </View>
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          secureTextEntry={true}
          value={confirmPassword}
          onChangeText={(text) => {
            handleConfirmPasswordChange(text);
          }}
        />
      <TextInput
        style={styles.input}
        placeholder="Contact Number"
        keyboardType="numeric"
        value={formData.contact}
        maxLength={10}
        onChangeText={(text) => handleChange("contact", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Father's Contact Number"
        keyboardType="numeric"
        value={formData.fatherContact}
        maxLength={10}
        onChangeText={(text) => handleChange("fatherContact", text)}
      />
      <TouchableOpacity style={styles.input} onPress={showDatePickerModal}>
    <Text style={styles.text}>
        {formData.dob || 'Select Date of Birth'}
    </Text>
    </TouchableOpacity>
    {showDatePicker && (
    <DateTimePicker
        value={formData.dob ? new Date(formData.dob) : new Date()}
        mode="date"
        display="default"
        onChange={onChangeDate}
        minimumDate={new Date(1990, 0, 1)}
        maximumDate={new Date()}
    />
    )}
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={formData.department}
          onValueChange={(value) => handleChange("department", value)}
          style={styles.picker}
        >
          <Picker.Item label="Select Your Department" value="" />
          <Picker.Item label="CSE" value="CSE" />
          <Picker.Item label="IT" value="IT" />
          <Picker.Item label="AIDS" value="AIDS" />
          <Picker.Item label="CSBS" value="CSBS" />
          <Picker.Item label="AIML" value="AIML" />
          <Picker.Item label="Cyber Security" value="Cyber Security" />
          <Picker.Item label="ECE" value="ECE" />
          <Picker.Item label="EEE" value="EEE" />
          <Picker.Item label="Bio Medical" value="Bio Medical" />
           <Picker.Item label="Mechanical" value="Mechanical" />
          <Picker.Item label="Mechatronics" value="Mechatronics" />
            <Picker.Item label="Civil" value="Civil" />
        </Picker>
      </View>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={formData.year}
          onValueChange={(value) => handleChange("year", value)}
          style={styles.picker}
        >
          <Picker.Item label="Select Year" value="" />
          <Picker.Item label="First Year" value="1" />
          <Picker.Item label="Second Year" value="2" />
          <Picker.Item label="Third Year" value="3" />
          <Picker.Item label="Fourth Year" value="4" />
        </Picker>
      </View>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={formData.status}
          onValueChange={(value) => handleChange("status", value)}
          style= {styles.picker}
        >
          <Picker.Item label="Select Your Goal" value="" />
          <Picker.Item label="Placement" value="Placement" />
          <Picker.Item label="Higher Studies" value="Higher Studies" />
          <Picker.Item label="Entrepreneur" value="Entrepreneur" />
        </Picker>
      </View>
      <TouchableOpacity style={styles.imageButton} onPress={handleImagePick}>
        <Text style={styles.imageButtonText}>
          {formData.image ? "Image Selected" : "Pick an Image"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Register</Text>
    </TouchableOpacity>
        <TouchableOpacity onPress={handleLoginRedirect}>
                <Text style={styles.loginRedirectText}>Already have an account? Login</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      padding: 20,
      backgroundColor: "#f5f5f5",
      justifyContent: "center",
      paddingTop: StatusBar.currentHeight
    },
    title: {
      fontSize: 26,
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: 30,
      color: "#333", // Subtle dark color for the title
    },
    input: {
      borderWidth: 1,
      borderColor: "#ccc",
      borderRadius: 10,
      padding: 15,
      marginBottom: 15,
      backgroundColor: "#fff",
      fontSize: 16,
      color: "#333", // Dark text for input
    },
    pickerContainer: {
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        marginBottom: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 2,
      },
      picker: {
        height: 50,
        width: "100%",
        borderRadius: 8,
        fontSize: 16,
        color: "#333",
        backgroundColor: "transparent",
      },
    imageButton: {
      backgroundColor: "#007BFF",
      paddingVertical: 15,
      borderRadius: 8,
      marginBottom: 20,
      alignItems: "center",
    },
    imageButtonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "bold",
    },
    submitButton: {
      backgroundColor: "#28a745",
      paddingVertical: 15,
      borderRadius: 8,
      alignItems: "center",
      marginBottom: 15, // Space between the submit and login redirect buttons
    },
    submitButtonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "bold",
    },
    loginRedirectText: {
      textAlign: "center",
      color: "#007BFF",
      fontSize: 16,
      fontWeight: "bold",
      marginTop: 10, // Adds space above the login redirect
    },
    pickerLabel: {
      fontSize: 16,
      color: "#333",
      marginBottom: 8,
    },
    formSection: {
      marginBottom: 15,
    },
    formSectionTitle: {
      fontSize: 18,
      fontWeight: "600",
      marginBottom: 10,
      color: "#555",
    },
  }); 
export default Register;
