const { app } = require('@azure/functions');
const multer = require('multer');
const { randomUUID } = require('crypto');
const path = require('path');
const fs = require('fs').promises;

// Configure multer for file uploads
const upload = multer({
    storage: multer.diskStorage({
        destination: async (req, file, cb) => {
            const uploadDir = path.join(__dirname, 'uploads');
            try {
                await fs.mkdir(uploadDir, { recursive: true });
                cb(null, uploadDir);
            } catch (error) {
                cb(error);
            }
        },
        filename: (req, file, cb) => {
            const uniqueId = randomUUID();
            const extension = path.extname(file.originalname);
            cb(null, `${uniqueId}${extension}`);
        }
    }),
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

app.http('uploadImage', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        try {
            // Use multer middleware to handle file upload
            await new Promise((resolve, reject) => {
                upload.single('image')(request, null, (error) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve();
                    }
                });
            });

            if (!request.file) {
                return {
                    status: 400,
                    jsonBody: {
                        success: false,
                        error: 'No image file provided'
                    }
                };
            }

            const imageId = randomUUID();
            const imagePath = request.file.path;
            
            // Store image metadata for later analysis
            const imageMetadata = {
                id: imageId,
                originalName: request.file.originalname,
                path: imagePath,
                size: request.file.size,
                mimeType: request.file.mimetype,
                uploadTime: new Date().toISOString()
            };

            // In production, you would store this metadata in a database
            // For now, we'll return the image info directly
            
            return {
                status: 200,
                jsonBody: {
                    success: true,
                    imageId: imageId,
                    imagePath: imagePath,
                    metadata: imageMetadata
                }
            };
        } catch (error) {
            context.log.error('Upload error:', error);
            
            if (error.message.includes('Invalid file type')) {
                return {
                    status: 400,
                    jsonBody: {
                        success: false,
                        error: error.message
                    }
                };
            }
            
            if (error.message.includes('File too large')) {
                return {
                    status: 413,
                    jsonBody: {
                        success: false,
                        error: 'File size exceeds 10MB limit'
                    }
                };
            }
            
            return {
                status: 500,
                jsonBody: {
                    success: false,
                    error: 'Image upload failed'
                }
            };
        }
    }
});

// Cleanup function to remove temporary files
app.http('cleanup', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        try {
            const { imageId, imagePath } = request.body;
            
            if (imagePath) {
                try {
                    await fs.unlink(imagePath);
                    context.log.info(`Cleaned up image: ${imagePath}`);
                } catch (error) {
                    context.log.warn(`Failed to cleanup image: ${error.message}`);
                }
            }
            
            return {
                status: 200,
                jsonBody: {
                    success: true,
                    message: 'Cleanup completed'
                }
            };
        } catch (error) {
            context.log.error('Cleanup error:', error);
            return {
                status: 500,
                jsonBody: {
                    success: false,
                    error: 'Cleanup failed'
                }
            };
        }
    }
});
