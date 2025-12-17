import { useState, useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import "./PanoramaGallery.css";

const IMAGES_BY_THEME = {
    default: [
        { src: "/src/assets/panorama-1.jpg", alt: "مدل مردانه ۱", caption: "مدل ۱ — توضیح کوتاه" },
        { src: "/src/assets/panorama-2.jpg", alt: "مدل مردانه ۲", caption: "مدل ۲ — توضیح کوتاه" },
        { src: "/src/assets/panorama-3.jpg", alt: "مدل مردانه ۳", caption: "مدل ۳ — توضیح کوتاه" },
    ],
    women: [
        { src: "/src/assets/women-1.jpg", alt: "مدل بانوان ۱", caption: "مدل بانوان ۱ — توضیح کوتاه" },
        { src: "/src/assets/women-2.jpg", alt: "مدل بانوان ۲", caption: "مدل بانوان ۲ — توضیح کوتاه" },
        { src: "/src/assets/women-3.jpg", alt: "مدل بانوان ۳", caption: "مدل بانوان ۳ — توضیح کوتاه" },
    ],
};

export default function PanoramaGallery() {
    const { theme } = useTheme();
    const images = IMAGES_BY_THEME[theme] || IMAGES_BY_THEME.default;

    const scrollerRef = useRef(null);
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const scroller = scrollerRef.current;
        if (!scroller) return;

        const onKey = (e) => {
            if (e.key === "ArrowRight") move(1);
            if (e.key === "ArrowLeft") move(-1);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    const scrollToIndex = (i) => {
        const scroller = scrollerRef.current;
        if (!scroller) return;
        const child = scroller.children[i];
        if (!child) return;
        child.scrollIntoView({ behavior: "smooth", inline: "center" });
        setIndex(i);
        child.querySelector("img")?.focus();
    };

    const move = (dir) => {
        let next = index + dir;
        if (next < 0) next = 0;
        if (next >= images.length) next = images.length - 1;
        scrollToIndex(next);
    };

    return (
        <section id="hero" className="panorama-section" aria-label="نمایش مدل‌ها">
            <div className="container">
                <h2 className="panorama-title">پیش‌نمایش مدل مو و ریش با هوش مصنوعی</h2>

                <div className="panorama-controls">
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
                        {images.map((img, i) => (
                            <figure
                                className="panorama-item"
                                key={img.src}
                                role="listitem"
                                onClick={() => scrollToIndex(i)}
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
                        ))}
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
