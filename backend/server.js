const express = require('express');
const cors = require('cors');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
require('dotenv').config();

const app = express();
const upload = multer();

// CORS configuration
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost',
    credentials: true
}));

app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        message: 'Backend is running',
        timestamp: new Date().toISOString()
    });
});

// NanoBanana proxy endpoint
app.post('/api/nanobanana/process', upload.single('image'), async (req, res) => {
    try {
        const { preset, instructions, client_timestamp, source } = req.body;
        const imageFile = req.file;

        console.log('📸 Received image processing request:', {
            preset,
            source,
            hasImage: !!imageFile,
            timestamp: client_timestamp
        });

        // Validation
        if (!imageFile) {
            return res.status(400).json({
                status: 'error',
                message: 'تصویر یافت نشد',
                code: 400
            });
        }

        if (!preset) {
            return res.status(400).json({
                status: 'error',
                message: 'مدل انتخاب نشده است',
                code: 400
            });
        }

        // Check if API key is configured
        if (!process.env.NANOBANANA_API_KEY) {
            console.error('❌ NANOBANANA_API_KEY not configured');
            return res.status(500).json({
                status: 'error',
                message: 'API key تنظیم نشده است',
                code: 500
            });
        }

        // Prepare request to NanoBanana API
        const formData = new FormData();
        formData.append('image', imageFile.buffer, {
            filename: imageFile.originalname,
            contentType: imageFile.mimetype
        });
        formData.append('preset', preset);
        formData.append('instructions', instructions || '');
        formData.append('client_timestamp', client_timestamp);
        formData.append('source', source);

        console.log('🚀 Sending request to NanoBanana API...');

        // Send request to NanoBanana with API Key
        const response = await axios.post(
            `${process.env.NANOBANANA_API_URL}/process`,
            formData,
            {
                headers: {
                    'Authorization': `Bearer ${process.env.NANOBANANA_API_KEY}`,
                    ...formData.getHeaders()
                },
                timeout: 120000, // 2 minutes timeout for image processing
            }
        );

        console.log('✅ NanoBanana API response received');

        // Return the response
        res.json(response.data);

    } catch (error) {
        console.error('❌ NanoBanana API Error:', error.message);

        if (error.response) {
            // API returned an error
            console.error('API Error Response:', error.response.data);
            res.status(error.response.status).json({
                status: 'error',
                message: error.response.data?.message || 'خطا در پردازش تصویر',
                code: error.response.status
            });
        } else if (error.code === 'ECONNABORTED') {
            // Timeout
            res.status(504).json({
                status: 'error',
                message: 'زمان پردازش تصویر به پایان رسید. لطفاً دوباره تلاش کنید.',
                code: 504
            });
        } else if (error.code === 'ECONNREFUSED') {
            // Connection refused
            res.status(503).json({
                status: 'error',
                message: 'ارتباط با سرویس NanoBanana برقرار نشد',
                code: 503
            });
        } else {
            // Other errors
            res.status(500).json({
                status: 'error',
                message: 'خطای داخلی سرور',
                code: 500
            });
        }
    }
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        status: 'error',
        message: 'Endpoint not found',
        code: 404
    });
});

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
    console.log('🚀 ========================================');
    console.log(`✅ Backend server running on port ${PORT}`);
    console.log(`📌 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🔗 API endpoint: http://localhost:${PORT}/api/nanobanana/process`);
    console.log(`🌐 FRONTEND_URL: ${process.env.FRONTEND_URL || 'http://localhost'}`);
    console.log(`🔑 API Key configured: ${process.env.NANOBANANA_API_KEY ? 'Yes' : 'No'}`);
    console.log('🚀 ========================================');
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('📴 SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.log('✅ HTTP server closed');
    });
});
