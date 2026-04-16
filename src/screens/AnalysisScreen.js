import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {analyzeImage} from '../services/ImageAnalysisService';

const AnalysisScreen = ({route, navigation}) => {
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [error, setError] = useState(null);
  const {image} = route.params;

  useEffect(() => {
    performAnalysis();
  }, []);

  const performAnalysis = async () => {
    try {
      setIsAnalyzing(true);
      const result = await analyzeImage(image);
      setAnalysisResult(result);
      
      // Navigate to report screen after analysis
      setTimeout(() => {
        navigation.navigate('Report', {
          image,
          analysisResult: result,
        });
      }, 2000);
    } catch (err) {
      setError('Analysis failed. Please try again.');
      console.error('Analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (isAnalyzing) {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Image source={{uri: image.uri}} style={styles.previewImage} />
          
          <View style={styles.analysisContainer}>
            <ActivityIndicator size="large" color="#3498db" />
            <Text style={styles.analysisText}>Analyzing image...</Text>
            
            <View style={styles.progressSteps}>
              <View style={styles.step}>
                <Icon name="check-circle" size={20} color="#27ae60" />
                <Text style={styles.stepText}>Image uploaded</Text>
              </View>
              <View style={styles.step}>
                <Icon name="radio-button-checked" size={20} color="#3498db" />
                <Text style={styles.stepText}>Detecting tampering...</Text>
              </View>
              <View style={styles.step}>
                <Icon name="radio-button-unchecked" size={20} color="#bdc3c7" />
                <Text style={styles.stepText}>Extracting metadata...</Text>
              </View>
              <View style={styles.step}>
                <Icon name="radio-button-unchecked" size={20} color="#bdc3c7" />
                <Text style={styles.stepText}>Legal analysis...</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Icon name="error" size={60} color="#e74c3c" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <Image source={{uri: image.uri}} style={styles.previewImage} />
        
        {analysisResult && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultTitle}>Analysis Complete</Text>
            <Text style={styles.resultText}>
              Redirecting to forensic report...
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ecf0f1',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 30,
  },
  analysisContainer: {
    alignItems: 'center',
    padding: 30,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 3,
  },
  analysisText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: 20,
    marginBottom: 30,
  },
  progressSteps: {
    width: '100%',
    gap: 15,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  stepText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#2c3e50',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#e74c3c',
    textAlign: 'center',
    marginTop: 20,
  },
  resultContainer: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    elevation: 3,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#27ae60',
    marginBottom: 10,
  },
  resultText: {
    fontSize: 16,
    color: '#2c3e50',
  },
});

export default AnalysisScreen;
