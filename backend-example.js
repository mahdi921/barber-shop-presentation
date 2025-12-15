const express = require('express');
const cors = require('cors');
const multer = require('multer');
const axios = require('axios');
require('dotenv').config();

const app = express();
const upload = multer();

// CORS configuration
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5174',
    credentials: true
}));

app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Backend is running' });
});

// NanoBanana proxy endpoint
app.post('/api/nanobanana/process', upload.single('image'), async (req, res) => {
    try {
        const { preset, instructions, client_timestamp, source } = req.body;
        const imageFile = req.file;

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

        // Prepare request to NanoBanana API
        const FormData = require('form-data');
        const formData = new FormData();
        formData.append('image', imageFile.buffer, {
            filename: imageFile.originalname,
            contentType: imageFile.mimetype
        });
        formData.append('preset', preset);
        formData.append('instructions', instructions || '');
        formData.append('client_timestamp', client_timestamp);
        formData.append('source', source);

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

        // Return the response
        res.json(response.data);

    } catch (error) {
        console.error('NanoBanana API Error:', error.message);

        if (error.response) {
            // API returned an error
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

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`✅ Backend server running on port ${PORT}`);
    console.log(`📌 Health check: http://localhost:${PORT}/api/health`);
});
