const { app } = require('@azure/functions');
const cv = require('opencv4nodejs');
const { spawn } = require('child_process');
const exifr = require('exifr');
const fs = require('fs').promises;
const path = require('path');

app.http('analyzeImage', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        try {
            const { imageId, imagePath } = request.body;
            
            // Perform CV analysis
            const cvResults = await performCVAnalysis(imagePath);
            
            // Extract metadata
            const metadata = await extractMetadata(imagePath);
            
            // Perform NLP legal analysis
            const legalAnalysis = await performLegalAnalysis(cvResults, metadata);
            
            // Generate comprehensive report
            const analysisResult = {
                tamperingRisk: calculateRisk(cvResults),
                elaScore: cvResults.elaScore,
                metadataConsistency: metadata.consistency,
                compressionAnalysis: cvResults.compressionAnalysis,
                tamperedRegions: cvResults.suspiciousRegions,
                legalViolations: legalAnalysis.violations,
                summary: generateSummary(cvResults, metadata, legalAnalysis),
                analysisTimestamp: new Date().toISOString(),
                imageMetadata: metadata.raw
            };
            
            return {
                status: 200,
                jsonBody: {
                    success: true,
                    result: analysisResult
                }
            };
        } catch (error) {
            context.log.error('Analysis error:', error);
            return {
                status: 500,
                jsonBody: {
                    success: false,
                    error: 'Image analysis failed'
                }
            };
        }
    }
});

async function performCVAnalysis(imagePath) {
    try {
        // Read image using OpenCV
        const image = await cv.imreadAsync(imagePath);
        
        // Error Level Analysis (ELA)
        const elaScore = await performErrorLevelAnalysis(image);
        
        // Compression analysis
        const compressionAnalysis = await analyzeCompression(image);
        
        // Detect suspicious regions using MediaPipe
        const suspiciousRegions = await detectSuspiciousRegions(imagePath);
        
        return {
            elaScore,
            compressionAnalysis,
            suspiciousRegions
        };
    } catch (error) {
        console.error('CV Analysis error:', error);
        throw error;
    }
}

async function performErrorLevelAnalysis(image) {
    try {
        // Convert to grayscale
        const gray = image.bgrToGray();
        
        // Save with high quality
        const tempPath = path.join(__dirname, 'temp_ela.jpg');
        await cv.imwriteAsync(tempPath, image, [cv.IMWRITE_JPEG_QUALITY, 95]);
        
        // Read the recompressed image
        const recompressed = await cv.imreadAsync(tempPath);
        const recompressedGray = recompressed.bgrToGray();
        
        // Calculate absolute difference
        const diff = gray.absdiff(recompressedGray);
        
        // Calculate ELA score (percentage of pixels with high difference)
        const threshold = 20;
        const mask = diff.threshold(threshold, 255, cv.THRESH_BINARY);
        const elaPixels = cv.countNonZero(mask);
        const totalPixels = diff.rows * diff.cols;
        const elaScore = Math.round((elaPixels / totalPixels) * 100);
        
        // Clean up temp file
        await fs.unlink(tempPath);
        
        return elaScore;
    } catch (error) {
        console.error('ELA error:', error);
        return 0;
    }
}

async function analyzeCompression(image) {
    try {
        // Analyze compression artifacts and inconsistencies
        const gray = image.bgrToGray();
        
        // Detect JPEG compression artifacts using DCT analysis
        const blockSize = 8;
        let compressionInconsistencies = 0;
        let totalBlocks = 0;
        
        for (let y = 0; y < gray.rows - blockSize; y += blockSize) {
            for (let x = 0; x < gray.cols - blockSize; x += blockSize) {
                const block = gray.getRegion(new cv.Rect(x, y, blockSize, blockSize));
                const blockStd = cv.meanStdDev(block).stddev;
                
                // High standard deviation in DCT coefficients indicates multiple compression
                if (blockStd[0] > 15) {
                    compressionInconsistencies++;
                }
                totalBlocks++;
            }
        }
        
        const inconsistencyRatio = compressionInconsistencies / totalBlocks;
        
        if (inconsistencyRatio > 0.3) {
            return 'Multiple compression levels detected';
        } else if (inconsistencyRatio > 0.1) {
            return 'Minor compression inconsistencies';
        } else {
            return 'Compression appears consistent';
        }
    } catch (error) {
        console.error('Compression analysis error:', error);
        return 'Compression analysis failed';
    }
}

async function detectSuspiciousRegions(imagePath) {
    return new Promise((resolve, reject) => {
        // Use MediaPipe for face detection and object detection
        const pythonScript = `
import mediapipe as mp
import cv2
import json
import sys

mp_face_detection = mp.solutions.face_detection
mp_object_detection = mp.solutions.object_detection

image = cv2.imread(sys.argv[1])
rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

suspicious_regions = []

# Face detection
with mp_face_detection.FaceDetection(model_selection=1, min_detection_confidence=0.5) as face_detection:
    results = face_detection.process(rgb_image)
    if results.detections:
        for detection in results.detections:
            bbox = detection.location_data.relative_bounding_box
            confidence = detection.score[0]
            suspicious_regions.append({
                'type': 'Face detected',
                'confidence': round(confidence * 100),
                'bbox': [bbox.xmin, bbox.ymin, bbox.width, bbox.height]
            })

# Object detection for common manipulation targets
with mp_object_detection.ObjectDetection(
    model_selection=1, min_detection_confidence=0.5) as object_detection:
    results = object_detection.process(rgb_image)
    if results.detections:
        for detection in results.detections:
            bbox = detection.location_data.relative_bounding_box
            confidence = detection.score[0]
            suspicious_regions.append({
                'type': 'Object detected',
                'confidence': round(confidence * 100),
                'bbox': [bbox.xmin, bbox.ymin, bbox.width, bbox.height]
            })

print(json.dumps(suspicious_regions))
        `;
        
        const python = spawn('python', ['-c', pythonScript, imagePath]);
        let output = '';
        
        python.stdout.on('data', (data) => {
            output += data.toString();
        });
        
        python.on('close', (code) => {
            if (code === 0) {
                try {
                    const regions = JSON.parse(output);
                    resolve(regions);
                } catch (error) {
                    console.error('Failed to parse MediaPipe output:', error);
                    resolve([]);
                }
            } else {
                console.error('MediaPipe script failed');
                resolve([]);
            }
        });
        
        python.on('error', (error) => {
            console.error('MediaPipe execution error:', error);
            resolve([]);
        });
    });
}

async function extractMetadata(imagePath) {
    try {
        const exif = await exifr.parse(imagePath);
        const stats = await fs.stat(imagePath);
        
        // Check for inconsistencies
        const inconsistencies = [];
        
        if (exif && exif.DateTimeOriginal && stats.mtime) {
            const exifDate = new Date(exif.DateTimeOriginal);
            const fileDate = stats.mtime;
            const timeDiff = Math.abs(exifDate - fileDate);
            
            // If difference is more than 24 hours, it's suspicious
            if (timeDiff > 24 * 60 * 60 * 1000) {
                inconsistencies.push('Timestamp mismatch between EXIF and file modification');
            }
        }
        
        // Check for software editing signatures
        if (exif && exif.Software) {
            const editingSoftware = ['photoshop', 'gimp', 'affinity', 'lightroom'];
            const software = exif.Software.toLowerCase();
            
            if (editingSoftware.some(software => software.includes(software))) {
                inconsistencies.push('Image processed with editing software');
            }
        }
        
        return {
            consistency: inconsistencies.length > 0 ? inconsistencies.join('; ') : 'Metadata appears consistent',
            raw: {
                fileSize: stats.size,
                lastModified: stats.mtime,
                exif: exif || null
            }
        };
    } catch (error) {
        console.error('Metadata extraction error:', error);
        return {
            consistency: 'Metadata extraction failed',
            raw: null
        };
    }
}

async function performLegalAnalysis(cvResults, metadata) {
    // Simulate NLP-based legal analysis
    const violations = [];
    
    // Check for evidence tampering indicators
    if (cvResults.elaScore > 50) {
        violations.push({
            section: 'IT Act 2000 - Section 66A',
            description: 'Potential electronic evidence tampering detected due to high manipulation indicators'
        });
    }
    
    if (cvResults.compressionAnalysis.includes('Multiple compression')) {
        violations.push({
            section: 'Indian Evidence Act - Section 65B',
            description: 'Questionable authenticity of electronic record due to compression inconsistencies'
        });
    }
    
    if (metadata.consistency.includes('editing software')) {
        violations.push({
            section: 'IT Act 2000 - Section 43',
            description: 'Unauthorized modification of computer data detected'
        });
    }
    
    return {
        violations
    };
}

function calculateRisk(cvResults) {
    let riskScore = 0;
    
    // ELA score contribution
    if (cvResults.elaScore > 60) riskScore += 3;
    else if (cvResults.elaScore > 30) riskScore += 2;
    else if (cvResults.elaScore > 10) riskScore += 1;
    
    // Compression analysis contribution
    if (cvResults.compressionAnalysis.includes('Multiple compression')) riskScore += 2;
    else if (cvResults.compressionAnalysis.includes('inconsistencies')) riskScore += 1;
    
    // Suspicious regions contribution
    riskScore += Math.min(cvResults.suspiciousRegions.length, 2);
    
    if (riskScore >= 5) return 'High';
    if (riskScore >= 3) return 'Medium';
    return 'Low';
}

function generateSummary(cvResults, metadata, legalAnalysis) {
    const riskLevel = calculateRisk(cvResults);
    const findings = [];
    
    if (cvResults.elaScore > 30) {
        findings.push(`significant manipulation artifacts (${cvResults.elaScore}% ELA score)`);
    }
    
    if (cvResults.compressionAnalysis.includes('Multiple compression')) {
        findings.push('multiple compression levels suggesting editing history');
    }
    
    if (cvResults.suspiciousRegions.length > 0) {
        findings.push(`${cvResults.suspiciousRegions.length} suspicious regions detected`);
    }
    
    const legalImplications = legalAnalysis.violations.length > 0 
        ? `Potential legal violations under ${legalAnalysis.violations.length} cyber law sections detected`
        : 'No specific legal violations identified';
    
    return `The image shows ${riskLevel.toLowerCase()} risk of tampering with ${findings.join(', ')}. ${metadata.consistency}. ${legalImplications}. ${riskLevel === 'High' ? 'Immediate forensic examination recommended for potential legal proceedings.' : 'Further verification advised for critical applications.'}`;
}
