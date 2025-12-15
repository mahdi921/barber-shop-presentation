import { useRef, useEffect, useState } from 'react';
import Plyr from 'plyr';
import 'plyr/dist/plyr.css';
import './HeroVideo.css';

const HeroVideo = () => {
    const [videoLoaded, setVideoLoaded] = useState(false);
    const videoRef = useRef(null);
    const playerRef = useRef(null);

    useEffect(() => {
        if (videoRef.current && !playerRef.current) {
            // Initialize Plyr
            playerRef.current = new Plyr(videoRef.current, {
                controls: [
                    'play-large',
                    'play',
                    'progress',
                    'current-time',
                    'mute',
                    'volume',
                    'fullscreen',
                ],
                autoplay: true,
                muted: true,
                clickToPlay: true,
                resetOnEnd: true,
            });

            // Handle events
            playerRef.current.on('ready', () => {
                setVideoLoaded(true);
                // Attempt autoplay (will only work if muted)
                playerRef.current.play().catch(() => {
                    console.log('Autoplay prevented by browser');
                });
            });

            // Cleanup
            return () => {
                if (playerRef.current) {
                    playerRef.current.destroy();
                }
            };
        }
    }, []);

    const scrollToLiveTest = () => {
        const element = document.getElementById('live-test');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section id="hero" className="hero">
            <div className="container">
                <div className="hero__content">
                    <div className="hero__text">
                        <h1 className="hero__title">
                            تحول دیجیتال در صنعت زیبایی
                        </h1>
                        <p className="hero__subtitle">
                            با هوش مصنوعی نانوبانانا، آرایشگاه خود را به سطح بعدی ببرید
                        </p>
                        <button
                            className="hero__cta"
                            onClick={scrollToLiveTest}
                            aria-label="آزمایش رایگان آنلاین"
                        >
                            آزمایش آنلاین رایگان
                        </button>
                        <p className="hero__video-note">
                            <small>
                                ویدیو به صورت خودکار و بی‌صدا پخش می‌شود. برای شنیدن صدا، روی دکمه صدا کلیک کنید.
                            </small>
                        </p>
                    </div>

                    <div className="hero__video-wrapper">
                        {!videoLoaded && (
                            <div className="hero__video-loading">
                                <div className="spinner"></div>
                                <p>در حال بارگذاری ویدیو...</p>
                            </div>
                        )}
                        <video
                            ref={videoRef}
                            className="plyr-video"
                            playsInline
                            poster="/poster-placeholder.jpg"
                        >
                            <source
                                src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                                type="video/mp4"
                            />
                            مرورگر شما از تگ ویدیو پشتیبانی نمی‌کند.
                        </video>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroVideo;
