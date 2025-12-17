import { useState, useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import "./PanoramaGallery.css";

// Import images - Vite will handle these correctly
import panorama1 from '../assets/panorama-1.jpg';
import panorama2 from '../assets/panorama-2.jpg';
import panorama3 from '../assets/panorama-3.jpg';
import women1 from '../assets/women-1.jpg';
import women2 from '../assets/women-2.jpg';
import women3 from '../assets/women-3.jpg';

const IMAGES_BY_THEME = {
    default: [
        { src: panorama1, alt: "مدل مردانه ۱", caption: "مدل ۱ — توضیح کوتاه" },
        { src: panorama2, alt: "مدل مردانه ۲", caption: "مدل ۲ — توضیح کوتاه" },
        { src: panorama3, alt: "مدل مردانه ۳", caption: "مدل ۳ — توضیح کوتاه" },
    ],
    women: [
        { src: women1, alt: "مدل بانوان ۱", caption: "مدل بانوان ۱ — توضیح کوتاه" },
        { src: women2, alt: "مدل بانوان ۲", caption: "مدل بانوان ۲ — توضیح کوتاه" },
        { src: women3, alt: "مدل بانوان ۳", caption: "مدل بانوان ۳ — توضیح کوتاه" },
    ],
};

export default function PanoramaGallery() {
    const { theme } = useTheme();
    const images = IMAGES_BY_THEME[theme] || IMAGES_BY_THEME.default;

    const scrollerRef = useRef(null);
    const [index, setIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const intervalRef = useRef(null);

    // Defer image loading until after page load
    useEffect(() => {
        // Wait for page to fully load before showing images
        const timer = setTimeout(() => {
            setImagesLoaded(true);
        }, 100); // Small delay to let page render first

        return () => clearTimeout(timer);
    }, []);

    // Auto-scroll functionality
    useEffect(() => {
        if (!imagesLoaded) return; // Don't start auto-scroll until images are ready

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (prefersReducedMotion || isPaused) {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            return;
        }

        // Auto-advance every 4 seconds
        intervalRef.current = setInterval(() => {
            setIndex((prevIndex) => {
                const nextIndex = (prevIndex + 1) % images.length;
                scrollToIndex(nextIndex, true); // Auto-scroll (don't move page)
                return nextIndex;
            });
        }, 4000);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isPaused, images.length, imagesLoaded]);

    // Keyboard navigation
    useEffect(() => {
        const onKey = (e) => {
            if (e.key === "ArrowRight") {
                setIsPaused(true);
                move(1);
            }
            if (e.key === "ArrowLeft") {
                setIsPaused(true);
                move(-1);
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [index]);

    const scrollToIndex = (i, isAutoScroll = false) => {
        const scroller = scrollerRef.current;
        if (!scroller) return;
        const child = scroller.children[i];
        if (!child) return;

        if (isAutoScroll) {
            // For auto-scroll: only scroll the gallery container, not the page
            const scrollLeft = child.offsetLeft - scroller.offsetLeft;
            scroller.scrollTo({ left: scrollLeft, behavior: "smooth" });
            setIndex(i);
        } else {
            // For manual scroll: use scrollIntoView
            child.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
            setIndex(i);
            child.querySelector("img")?.focus();
        }
    };

    const move = (dir) => {
        setIsPaused(true); // Pause auto-scroll when user manually navigates
        let next = index + dir;
        if (next < 0) next = 0;
        if (next >= images.length) next = images.length - 1;
        scrollToIndex(next, false); // Manual scroll
    };

    const handleMouseEnter = () => setIsPaused(true);
    const handleMouseLeave = () => setIsPaused(false);

    return (
        <section id="hero" className="panorama-section" aria-label="نمایش مدل‌ها">
            <div className="container">
                <h2 className="panorama-title">پیش‌نمایش مدل مو و ریش با هوش مصنوعی</h2>

                <div
                    className="panorama-controls"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    <button
                        aria-label="تصویر قبلی"
                        onClick={() => move(-1)}
                        disabled={index === 0}
                        className="panorama-arrow"
                    >
                        ‹
                    </button>

                    <div
                        className="panorama-scroller"
                        ref={scrollerRef}
                        role="list"
                        tabIndex={0}
                        aria-label="گالری پانوراما"
                    >
                        {imagesLoaded ? (
                            images.map((img, i) => (
                                <figure
                                    className="panorama-item"
                                    key={img.src}
                                    role="listitem"
                                    onClick={() => scrollToIndex(i, false)} // Manual click
                                >
                                    <img
                                        src={img.src}
                                        alt={img.alt}
                                        loading="lazy"
                                        tabIndex={-1}
                                        className="panorama-img"
                                    />
                                    <figcaption className="panorama-caption">{img.caption}</figcaption>
                                </figure>
                            ))
                        ) : (
                            // Placeholder while images load
                            <div className="panorama-loader">
                                <div className="spinner"></div>
                            </div>
                        )}
                    </div>

                    <button
                        aria-label="تصویر بعدی"
                        onClick={() => move(1)}
                        disabled={index === images.length - 1}
                        className="panorama-arrow"
                    >
                        ›
                    </button>
                </div>
            </div>
        </section>
    );
}
