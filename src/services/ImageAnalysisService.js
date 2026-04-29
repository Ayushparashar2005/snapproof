import axios from 'axios';

// Mock service for image analysis - in production, this would connect to your cloud backend
const analyzeImage = async (image) => {
  try {
    // Simulate API call to cloud backend
    // In production, upload image to cloud storage and trigger analysis
    
    // Mock analysis result for demonstration
    const mockResult = {
      tamperingRisk: 'Medium',
      elaScore: 67,
      metadataConsistency: 'Inconsistent timestamps detected',
      compressionAnalysis: 'Multiple compression levels found',
      tamperedRegions: [
        {
          type: 'Face modification',
          confidence: 78,
          bbox: [120, 80, 200, 160]
        },
        {
          type: 'Background clone',
          confidence: 65,
          bbox: [300, 200, 400, 300]
        }
      ],
      legalViolations: [
        {
          section: 'IT Act 2000 - Section 66A',
          description: 'Potential electronic evidence tampering detected'
        },
        {
          section: 'Indian Evidence Act - Section 65B',
          description: 'Questionable authenticity of electronic record'
        }
      ],
      summary: 'The image shows signs of digital manipulation with inconsistent metadata and multiple compression artifacts. Face modification and background cloning detected with medium to high confidence. These alterations could potentially constitute evidence tampering under relevant cyber laws. Further forensic examination recommended for legal proceedings.',
      analysisTimestamp: new Date().toISOString(),
      imageMetadata: {
        fileSize: image.fileSize || 'Unknown',
        dimensions: '1920x1080',
        format: 'JPEG',
        lastModified: image.lastModified || 'Unknown'
      }
    };

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return mockResult;
  } catch (error) {
    console.error('Image analysis error:', error);
    throw new Error('Failed to analyze image');
  }
};

// Local development function to upload image
const uploadImageToCloud = async (imageUri) => {
  try {
    const formData = new FormData();
    formData.append('image', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'analysis_image.jpg',
    });

    const response = await axios.post(
      'http://localhost:3000/upload',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000,
      }
    );

    return response.data;
  } catch (error) {
    console.error('Upload error:', error);
    throw new Error('Failed to upload image');
  }
};

// Local development function to trigger analysis
const triggerCloudAnalysis = async (imageId) => {
  try {
    const response = await axios.post(
      'http://localhost:3000/analyze',
      { imageId },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 60000, // 1 minute timeout for analysis
      }
    );

    return response.data;
  } catch (error) {
    console.error('Analysis error:', error);
    throw new Error('Failed to trigger analysis');
  }
};

export {
  analyzeImage,
  uploadImageToCloud,
  triggerCloudAnalysis,
};
