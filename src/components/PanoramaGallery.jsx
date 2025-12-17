import React, { useRef, useState, useEffect } from "react";
import "./PanoramaGallery.css";

const IMAGES = [
    { src: "/src/assets/panorama-1.jpg", alt: "مدل ۱", caption: "مدل ۱ — توضیح کوتاه" },
    { src: "/src/assets/panorama-2.jpg", alt: "مدل ۲", caption: "مدل ۲ — توضیح کوتاه" },
    { src: "/src/assets/panorama-3.jpg", alt: "مدل ۳", caption: "مدل ۳ — توضیح کوتاه" },
];

export default function PanoramaGallery() {
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
        if (next >= IMAGES.length) next = IMAGES.length - 1;
        scrollToIndex(next);
    };

    return (
        <section id="hero" className="panorama-section" aria-label="نمونه مدل‌ها">
            <div className="container">
                <h2 className="panorama-title">نمونه‌های قبل و بعد</h2>

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
                        {IMAGES.map((img, i) => (
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
                        disabled={index === IMAGES.length - 1}
                        className="panorama-arrow"
                    >
                        ›
                    </button>
                </div>

                <div className="panorama-actions">
                    <button
                        type="button"
                        className="btn-outline"
                        onClick={() => scrollToIndex(0)}
                    >
                        مشاهده تمام تصاویر
                    </button>
                </div>
            </div>
        </section>
    );
}
