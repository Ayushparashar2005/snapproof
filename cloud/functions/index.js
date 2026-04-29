const { app } = require('@azure/functions');

// Simple health check endpoint
app.http('health', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        return {
            status: 200,
            jsonBody: {
                status: 'healthy',
                service: 'SnapProof Cloud Functions',
                timestamp: new Date().toISOString()
            }
        };
    }
});

// Mock analysis endpoint for testing
app.http('mockAnalyze', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        try {
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
            
            return {
                status: 200,
                jsonBody: {
                    success: true,
                    result: mockResult
                }
            };
        } catch (error) {
            context.log.error('Mock analysis error:', error);
            return {
                status: 500,
                jsonBody: {
                    success: false,
                    error: 'Analysis failed'
                }
            };
        }
    }
});
