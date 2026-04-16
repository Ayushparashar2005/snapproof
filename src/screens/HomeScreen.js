import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';

const HomeScreen = ({navigation}) => {
  const [selectedImage, setSelectedImage] = useState(null);

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'SnapProof needs access to your camera to analyze images',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const handleImagePicker = async (source) => {
    if (source === 'camera') {
      const hasPermission = await requestCameraPermission();
      if (!hasPermission) {
        Alert.alert('Permission Denied', 'Camera permission is required');
        return;
      }
    }

    const options = {
      mediaType: 'photo',
      quality: 0.8,
      includeBase64: false,
    };

    const callback = (response) => {
      if (response.didCancel || response.error) {
        return;
      }

      if (response.assets && response.assets[0]) {
        const image = response.assets[0];
        setSelectedImage(image);
        navigation.navigate('Analysis', {image});
      }
    };

    if (source === 'camera') {
      launchCamera(options, callback);
    } else {
      launchImageLibrary(options, callback);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Icon name="security" size={60} color="#2c3e50" />
        <Text style={styles.title}>SnapProof</Text>
        <Text style={styles.subtitle}>AI Fake Image Detector</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.infoBox}>
          <Icon name="info" size={24} color="#3498db" />
          <Text style={styles.infoText}>
            Upload any suspicious image for forensic analysis and legal reporting
          </Text>
        </View>

        {selectedImage && (
          <View style={styles.previewContainer}>
            <Image
              source={{uri: selectedImage.uri}}
              style={styles.previewImage}
            />
          </View>
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.cameraButton]}
            onPress={() => handleImagePicker('camera')}>
            <Icon name="camera-alt" size={24} color="white" />
            <Text style={styles.buttonText}>Take Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.galleryButton]}
            onPress={() => handleImagePicker('gallery')}>
            <Icon name="photo-library" size={24} color="white" />
            <Text style={styles.buttonText}>Choose from Gallery</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Analysis includes: Tampering detection, Metadata extraction, Legal assessment
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ecf0f1',
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 30,
    backgroundColor: '#34495e',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#bdc3c7',
    marginTop: 5,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#e8f4f8',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  infoText: {
    flex: 1,
    marginLeft: 10,
    color: '#2c3e50',
    fontSize: 14,
  },
  previewContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  previewImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#3498db',
  },
  buttonContainer: {
    gap: 15,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
    elevation: 3,
  },
  cameraButton: {
    backgroundColor: '#e74c3c',
  },
  galleryButton: {
    backgroundColor: '#3498db',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  footer: {
    padding: 20,
    backgroundColor: '#34495e',
  },
  footerText: {
    color: '#bdc3c7',
    textAlign: 'center',
    fontSize: 12,
  },
});

export default HomeScreen;
