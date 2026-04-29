const express = require('express');
const multer = require('multer');
const path = require('path');
const { randomUUID } = require('crypto');

const app = express();
const PORT = 3000;

// Configure multer for file uploads
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only JPEG, PNG, and WebP images are allowed.'));
        }
    }
});

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        service: 'SnapProof Local Server',
        timestamp: new Date().toISOString()
    });
});

// Upload endpoint
app.post('/upload', upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: 'No image file provided'
            });
        }

        const imageId = randomUUID();
        
        const imageMetadata = {
            id: imageId,
            originalName: req.file.originalname,
            size: req.file.size,
            mimeType: req.file.mimetype,
            uploadTime: new Date().toISOString()
        };

        res.json({
            success: true,
            imageId: imageId,
            metadata: imageMetadata
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({
            success: false,
            error: 'Image upload failed'
        });
    }
});

// Analysis endpoint
app.post('/analyze', async (req, res) => {
    try {
        const { imageId } = req.body;
        
        // Simulate processing delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const mockResult = {
            tamperingRisk: 'Medium',
            elaScore: 67,
            metadataConsistency: 'Inconsistent timestamps detected',
            compressionAnalysis: 'Multiple compression levels found',
            tamperedRegions: [
                {
                    type: 'Face modification',
                    confidence: 78,
                    bbox: [0.1, 0.08, 0.15, 0.12]
                },
                {
                    type: 'Background clone',
                    confidence: 65,
                    bbox: [0.25, 0.15, 0.18, 0.14]
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
                fileSize: '2.5MB',
                dimensions: '1920x1080',
                format: 'JPEG',
                lastModified: new Date().toISOString()
            }
        };
        
        res.json({
            success: true,
            result: mockResult
        });
    } catch (error) {
        console.error('Analysis error:', error);
        res.status(500).json({
            success: false,
            error: 'Analysis failed'
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 SnapProof Local Server running on http://localhost:${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
    console.log(`📤 Upload endpoint: http://localhost:${PORT}/upload`);
    console.log(`🔍 Analysis endpoint: http://localhost:${PORT}/analyze`);
});

module.exports = app;
