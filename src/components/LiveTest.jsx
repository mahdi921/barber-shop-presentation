import { useState, useRef, useEffect } from 'react';
import { Camera, Upload, Send, X, RotateCw, Check } from 'lucide-react';
import imageCompression from 'browser-image-compression';
import './LiveTest.css';

const LiveTest = () => {
    const [mode, setMode] = useState(null); // 'camera' | 'upload' | null
    const [imagePreview, setImagePreview] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [modelType, setModelType] = useState('hair'); // 'hair' | 'beard'
    const [selectedPreset, setSelectedPreset] = useState('');
    const [instructions, setInstructions] = useState('');
    const [consentGiven, setConsentGiven] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [processedImage, setProcessedImage] = useState(null);
    const [error, setError] = useState(null);
    const [cameraStream, setCameraStream] = useState(null);

    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const fileInputRef = useRef(null);

    const hairPresets = [
        { id: 'hair_01', label: 'مدل کلاسیک' },
        { id: 'hair_02', label: 'مدل مدرن' },
        { id: 'hair_03', label: 'مدل فید' },
        { id: 'hair_04', label: 'مدل آندرکات' },
    ];

    const beardPresets = [
        { id: 'beard_01', label: 'ریش کوتاه' },
        { id: 'beard_02', label: 'ریش بلند' },
        { id: 'beard_03', label: 'ریش فرانسوی' },
        { id: 'beard_04', label: 'سبیل' },
    ];

    const currentPresets = modelType === 'hair' ? hairPresets : beardPresets;

    // Initialize camera
    const startCamera = async () => {
        try {
            setError(null);
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user' },
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
            setCameraStream(stream);
            setMode('camera');
        } catch (err) {
            console.error('Camera error:', err);
            setError('دسترسی به دوربین امکان‌پذیر نیست. لطفاً دسترسی را بررسی کنید یا از آپلود تصویر استفاده کنید.');
        }
    };

    // Stop camera
    const stopCamera = () => {
        if (cameraStream) {
            cameraStream.getTracks().forEach(track => track.stop());
            setCameraStream(null);
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
    };

    // Capture from camera
    const capturePhoto = () => {
        if (!videoRef.current || !canvasRef.current) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0);

        canvas.toBlob((blob) => {
            const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
            setSelectedFile(file);
            setImagePreview(URL.createObjectURL(blob));
            stopCamera();
            setMode('preview');
        }, 'image/jpeg', 0.9);
    };

    // Handle file upload
    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setError('لطفاً یک فایل تصویری انتخاب کنید.');
            return;
        }

        // Validate file size (8MB)
        if (file.size > 8 * 1024 * 1024) {
            setError('حجم تصویر نباید بیشتر از ۸ مگابایت باشد.');
            return;
        }

        setError(null);

        try {
            // Compress image
            const options = {
                maxSizeMB: 2,
                maxWidthOrHeight: 1024,
                useWebWorker: true,
            };
            const compressedFile = await imageCompression(file, options);

            setSelectedFile(compressedFile);
            setImagePreview(URL.createObjectURL(compressedFile));
            setMode('preview');
        } catch (err) {
            console.error('Compression error:', err);
            setError('خطا در پردازش تصویر. لطفاً دوباره تلاش کنید.');
        }
    };

    // Send to NanoBanana API (mock)
    const handleSubmit = async () => {
        if (!selectedFile || !selectedPreset || !consentGiven) {
            setError('لطفاً تمام موارد را تکمیل کنید و توافقنامه حریم خصوصی را بپذیرید.');
            return;
        }

        setIsProcessing(true);
        setError(null);

        // Prepare FormData
        const formData = new FormData();
        formData.append('image', selectedFile);
        formData.append('preset', selectedPreset);
        formData.append('instructions', instructions);
        formData.append('client_timestamp', new Date().toISOString());
        formData.append('source', mode === 'camera' ? 'camera' : 'upload');

        try {
            // Use environment variable or default to backend endpoint
            const API_ENDPOINT = import.meta.env.VITE_NANOBANANA_API_URL || '/api/nanobanana/process';

            // Simulating API call with mock response
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Mock success response
            const mockResponse = {
                status: 'ok',
                job_id: 'mock-uuid-' + Date.now(),
                result_url: imagePreview, // Using same image as mock result
                meta: {
                    processing_ms: 2000,
                    model_version: 'NanoBanana-v1',
                },
            };

            setProcessedImage(mockResponse.result_url);
            setIsProcessing(false);

            /* 
            // Actual API call (uncomment when backend is ready):
            const response = await fetch(API_ENDPOINT, {
              method: 'POST',
              body: formData,
            });
      
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
      
            const data = await response.json();
            
            if (data.status === 'ok') {
              setProcessedImage(data.result_url);
            } else {
              throw new Error(data.message || 'خطا در پردازش تصویر');
            }
            */
        } catch (err) {
            console.error('API error:', err);
            setError('خطا در ارسال درخواست. لطفاً اتصال اینترنت خود را بررسی کنید و دوباره تلاش کنید.');
            setIsProcessing(false);
        }
    };

    // Reset
    const handleReset = () => {
        setMode(null);
        setImagePreview(null);
        setSelectedFile(null);
        setProcessedImage(null);
        setError(null);
        setInstructions('');
        setConsentGiven(false);
        stopCamera();
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            stopCamera();
            if (imagePreview) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, []);

    return (
        <section id="live-test" className="live-test">
            <div className="container">
                <div className="live-test__header">
                    <h2 className="live-test__title">آزمایش آنلاین رایگان</h2>
                    <p className="live-test__subtitle">
                        عکس خود را آپلود کنید یا با دوربین بگیرید و نتیجه نهایی را ببینید
                    </p>
                </div>

                <div className="live-test__content">
                    {/* Initial State */}
                    {mode === null && !processedImage && (
                        <div className="live-test__start">
                            <button
                                className="live-test__mode-btn live-test__mode-btn--camera"
                                onClick={startCamera}
                                aria-label="استفاده از دوربین"
                            >
                                <Camera size={32} />
                                <span>استفاده از دوربین</span>
                            </button>
                            <button
                                className="live-test__mode-btn live-test__mode-btn--upload"
                                onClick={() => fileInputRef.current?.click()}
                                aria-label="آپلود تصویر"
                            >
                                <Upload size={32} />
                                <span>آپلود تصویر</span>
                            </button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="live-test__file-input"
                                aria-label="انتخاب فایل"
                            />
                        </div>
                    )}

                    {/* Camera View */}
                    {mode === 'camera' && !imagePreview && (
                        <div className="live-test__camera">
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                className="live-test__video"
                            />
                            <canvas ref={canvasRef} style={{ display: 'none' }} />
                            <div className="live-test__camera-controls">
                                <button
                                    className="live-test__btn live-test__btn--capture"
                                    onClick={capturePhoto}
                                >
                                    <Camera size={24} />
                                    ثبت تصویر
                                </button>
                                <button
                                    className="live-test__btn live-test__btn--cancel"
                                    onClick={() => {
                                        stopCamera();
                                        setMode(null);
                                    }}
                                >
                                    انصراف
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Preview & Configuration */}
                    {mode === 'preview' && imagePreview && !processedImage && (
                        <div className="live-test__preview">
                            <div className="live-test__preview-image">
                                <img src={imagePreview} alt="پیش‌نمایش" />
                                <button
                                    className="live-test__reset-btn"
                                    onClick={handleReset}
                                    aria-label="انتخاب تصویر جدید"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="live-test__config">
                                <div className="live-test__field">
                                    <label className="live-test__label">نوع مدل:</label>
                                    <div className="live-test__radio-group">
                                        <label className="live-test__radio">
                                            <input
                                                type="radio"
                                                name="modelType"
                                                value="hair"
                                                checked={modelType === 'hair'}
                                                onChange={(e) => {
                                                    setModelType(e.target.value);
                                                    setSelectedPreset('');
                                                }}
                                            />
                                            <span>مدل مو</span>
                                        </label>
                                        <label className="live-test__radio">
                                            <input
                                                type="radio"
                                                name="modelType"
                                                value="beard"
                                                checked={modelType === 'beard'}
                                                onChange={(e) => {
                                                    setModelType(e.target.value);
                                                    setSelectedPreset('');
                                                }}
                                            />
                                            <span>مدل ریش</span>
                                        </label>
                                    </div>
                                </div>

                                <div className="live-test__field">
                                    <label className="live-test__label" htmlFor="preset">
                                        انتخاب مدل:
                                    </label>
                                    <select
                                        id="preset"
                                        className="live-test__select"
                                        value={selectedPreset}
                                        onChange={(e) => setSelectedPreset(e.target.value)}
                                    >
                                        <option value="">انتخاب کنید</option>
                                        {currentPresets.map((preset) => (
                                            <option key={preset.id} value={preset.id}>
                                                {preset.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="live-test__field">
                                    <label className="live-test__label" htmlFor="instructions">
                                        دستورات اختیاری:
                                    </label>
                                    <textarea
                                        id="instructions"
                                        className="live-test__textarea"
                                        placeholder="مثلاً: کمی روی موهای کناره را کوتاه کن و حجم را بیشتر کن"
                                        value={instructions}
                                        onChange={(e) => setInstructions(e.target.value)}
                                        rows={3}
                                    />
                                </div>

                                <div className="live-test__field">
                                    <label className="live-test__checkbox">
                                        <input
                                            type="checkbox"
                                            checked={consentGiven}
                                            onChange={(e) => setConsentGiven(e.target.checked)}
                                        />
                                        <span>
                                            می‌پذیرم که تصویر من برای پردازش به سرویس نانوبانانا ارسال شود و به اشتراک گذاشته نخواهد شد.
                                        </span>
                                    </label>
                                </div>

                                {error && (
                                    <div className="live-test__error" role="alert">
                                        {error}
                                    </div>
                                )}

                                <button
                                    className="live-test__btn live-test__btn--submit"
                                    onClick={handleSubmit}
                                    disabled={isProcessing || !selectedPreset || !consentGiven}
                                >
                                    {isProcessing ? (
                                        <>
                                            <div className="spinner-small"></div>
                                            در حال پردازش...
                                        </>
                                    ) : (
                                        <>
                                            <Send size={20} />
                                            ارسال و مشاهده نتیجه
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Result */}
                    {processedImage && (
                        <div className="live-test__result">
                            <h3 className="live-test__result-title">
                                <Check size={24} />
                                نتیجه پردازش
                            </h3>
                            <div className="live-test__comparison">
                                <div className="live-test__comparison-item">
                                    <p className="live-test__comparison-label">قبل</p>
                                    <img src={imagePreview} alt="تصویر اصلی" />
                                </div>
                                <div className="live-test__comparison-item">
                                    <p className="live-test__comparison-label">بعد</p>
                                    <img src={processedImage} alt="تصویر پردازش شده" />
                                </div>
                            </div>
                            <div className="live-test__actions">
                                <button
                                    className="live-test__btn live-test__btn--download"
                                    onClick={() => {
                                        const a = document.createElement('a');
                                        a.href = processedImage;
                                        a.download = 'nanobanana-result.jpg';
                                        a.click();
                                    }}
                                >
                                    دانلود نتیجه
                                </button>
                                <button
                                    className="live-test__btn live-test__btn--retry"
                                    onClick={handleReset}
                                >
                                    <RotateCw size={20} />
                                    آزمایش دوباره
                                </button>
                            </div>
                        </div>
                    )}

                    {error && mode === null && (
                        <div className="live-test__error live-test__error--standalone" role="alert">
                            {error}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default LiveTest;
