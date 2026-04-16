import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Share,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {generatePDFReport} from '../services/ReportService';
import ImageOverlay from '../components/ImageOverlay';

const {width: screenWidth} = Dimensions.get('window');

const ReportScreen = ({route, navigation}) => {
  const {image, analysisResult} = route.params;
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const handleGeneratePDF = async () => {
    try {
      setIsGeneratingPDF(true);
      const pdfPath = await generatePDFReport(image, analysisResult);
      Alert.alert(
        'Report Generated',
        `PDF report saved to: ${pdfPath}`,
        [{text: 'OK', onPress: () => {}}],
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to generate PDF report');
      console.error('PDF generation error:', error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleShareReport = async () => {
    try {
      const shareOptions = {
        title: 'SnapProof Forensic Report',
        message: `Forensic Analysis Report\n\nTampering Risk: ${analysisResult.tamperingRisk}\nLegal Violations: ${analysisResult.legalViolations.length} detected\n\nAnalysis Summary: ${analysisResult.summary}`,
      };
      
      await Share.share(shareOptions);
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  const getRiskColor = (risk) => {
    switch (risk.toLowerCase()) {
      case 'high':
        return '#e74c3c';
      case 'medium':
        return '#f39c12';
      case 'low':
        return '#27ae60';
      default:
        return '#95a5a6';
    }
  };

  const getRiskIcon = (risk) => {
    switch (risk.toLowerCase()) {
      case 'high':
        return 'warning';
      case 'medium':
        return 'priority-high';
      case 'low':
        return 'check-circle';
      default:
        return 'help';
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        {/* Image Preview with Overlay */}
        <View style={styles.imageSection}>
          <ImageOverlay
            imageUri={image.uri}
            tamperedRegions={analysisResult.tamperedRegions}
            imageWidth={screenWidth - 40}
            imageHeight={200}
          />
          {analysisResult.tamperedRegions && analysisResult.tamperedRegions.length > 0 && (
            <View style={styles.overlayIndicator}>
              <Icon name="edit" size={16} color="white" />
              <Text style={styles.overlayText}>
                {analysisResult.tamperedRegions.length} regions flagged
              </Text>
            </View>
          )}
        </View>

        {/* Risk Assessment */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="assessment" size={24} color="#2c3e50" />
            <Text style={styles.sectionTitle}>Risk Assessment</Text>
          </View>
          
          <View style={[styles.riskCard, {backgroundColor: getRiskColor(analysisResult.tamperingRisk)}]}>
            <Icon 
              name={getRiskIcon(analysisResult.tamperingRisk)} 
              size={40} 
              color="white" 
            />
            <Text style={styles.riskText}>{analysisResult.tamperingRisk.toUpperCase()} RISK</Text>
            <Text style={styles.riskDescription}>
              {analysisResult.tamperingRisk === 'High' && 'Strong evidence of image manipulation detected'}
              {analysisResult.tamperingRisk === 'Medium' && 'Some inconsistencies found in the image'}
              {analysisResult.tamperingRisk === 'Low' && 'Minimal signs of tampering detected'}
            </Text>
          </View>
        </View>

        {/* Technical Analysis */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="analytics" size={24} color="#2c3e50" />
            <Text style={styles.sectionTitle}>Technical Analysis</Text>
          </View>
          
          <View style={styles.analysisCard}>
            <View style={styles.analysisItem}>
              <Text style={styles.analysisLabel}>Error Level Analysis:</Text>
              <Text style={styles.analysisValue}>{analysisResult.elaScore}% anomalies</Text>
            </View>
            <View style={styles.analysisItem}>
              <Text style={styles.analysisLabel}>Metadata Consistency:</Text>
              <Text style={styles.analysisValue}>{analysisResult.metadataConsistency}</Text>
            </View>
            <View style={styles.analysisItem}>
              <Text style={styles.analysisLabel}>Compression Artifacts:</Text>
              <Text style={styles.analysisValue}>{analysisResult.compressionAnalysis}</Text>
            </View>
            {analysisResult.tamperedRegions && analysisResult.tamperedRegions.length > 0 && (
              <View style={styles.analysisItem}>
                <Text style={styles.analysisLabel}>Suspicious Regions:</Text>
                <Text style={styles.analysisValue}>
                  {analysisResult.tamperedRegions.map((region, index) => 
                    `${region.type} (${region.confidence}%)`
                  ).join(', ')}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Legal Assessment */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="gavel" size={24} color="#2c3e50" />
            <Text style={styles.sectionTitle}>Legal Assessment</Text>
          </View>
          
          {analysisResult.legalViolations.length > 0 ? (
            <View style={styles.legalCard}>
              {analysisResult.legalViolations.map((violation, index) => (
                <View key={index} style={styles.violationItem}>
                  <Icon name="warning" size={20} color="#e74c3c" />
                  <View style={styles.violationContent}>
                    <Text style={styles.violationTitle}>{violation.section}</Text>
                    <Text style={styles.violationDescription}>{violation.description}</Text>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.noViolationCard}>
              <Icon name="check-circle" size={24} color="#27ae60" />
              <Text style={styles.noViolationText}>No specific legal violations detected</Text>
            </View>
          )}
        </View>

        {/* Summary */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="description" size={24} color="#2c3e50" />
            <Text style={styles.sectionTitle}>Forensic Summary</Text>
          </View>
          
          <View style={styles.summaryCard}>
            <Text style={styles.summaryText}>{analysisResult.summary}</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.pdfButton]}
            onPress={handleGeneratePDF}
            disabled={isGeneratingPDF}>
            <Icon name="picture-as-pdf" size={20} color="white" />
            <Text style={styles.buttonText}>
              {isGeneratingPDF ? 'Generating...' : 'Generate PDF Report'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.shareButton]}
            onPress={handleShareReport}>
            <Icon name="share" size={20} color="white" />
            <Text style={styles.buttonText}>Share Report</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.newAnalysisButton]}
            onPress={() => navigation.navigate('Home')}>
            <Icon name="add-photo-alternate" size={20} color="white" />
            <Text style={styles.buttonText}>New Analysis</Text>
          </TouchableOpacity>
        </View>
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
  imageSection: {
    position: 'relative',
    marginBottom: 20,
  },
  reportImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  overlayIndicator: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(231, 76, 60, 0.9)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  overlayText: {
    color: 'white',
    fontSize: 12,
    marginLeft: 5,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginLeft: 10,
  },
  riskCard: {
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 3,
  },
  riskText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  riskDescription: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
  },
  analysisCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    elevation: 3,
  },
  analysisItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  analysisLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    flex: 1,
  },
  analysisValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2c3e50',
    flex: 1,
    textAlign: 'right',
  },
  legalCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    elevation: 3,
  },
  violationItem: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  violationContent: {
    flex: 1,
    marginLeft: 10,
  },
  violationTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  violationDescription: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 2,
  },
  noViolationCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 3,
  },
  noViolationText: {
    fontSize: 14,
    color: '#27ae60',
    marginLeft: 10,
    fontWeight: 'bold',
  },
  summaryCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    elevation: 3,
  },
  summaryText: {
    fontSize: 14,
    color: '#2c3e50',
    lineHeight: 20,
  },
  buttonContainer: {
    gap: 15,
    marginTop: 20,
    marginBottom: 40,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
    elevation: 3,
  },
  pdfButton: {
    backgroundColor: '#e74c3c',
  },
  shareButton: {
    backgroundColor: '#3498db',
  },
  newAnalysisButton: {
    backgroundColor: '#27ae60',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default ReportScreen;
