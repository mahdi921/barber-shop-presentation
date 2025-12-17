import React from 'react';
import { useTheme } from '../context/ThemeContext';
import './WomenSection.css';
import { Scissors, Sparkles, Heart } from 'lucide-react';

export default function WomenSection() {
    const { toggleToWomen } = useTheme();

    const categories = [
        { icon: <Scissors size={24} />, label: 'مدل مو' },
        { icon: <Sparkles size={24} />, label: 'ناخن' },
        { icon: <Heart size={24} />, label: 'آرایش' }
    ];

    const handleWomenTheme = (e) => {
        e.preventDefault();
        toggleToWomen();
        // Smooth scroll to top to show the theme change
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <section id="women" className="women-section">
            <div className="container">
                <div className="women-content">
                    <h2 className="women-title">بخش بانوان</h2>
                    <p className="women-intro">
                        برای دریافت خدمات تخصصی بانوان، لطفاً به بخش ویژه بانوان مراجعه فرمایید.
                    </p>

                    <div className="women-categories">
                        {categories.map((cat, idx) => (
                            <div key={idx} className="category-item">
                                <span className="category-icon">{cat.icon}</span>
                                <span className="category-label">{cat.label}</span>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={handleWomenTheme}
                        className="women-cta"
                        aria-label="ورود به نسخه بانوان سایت"
                    >
                        <span>ورود به سایت بانوان</span>
                        <Sparkles size={20} />
                    </button>
                </div>
            </div>
        </section>
    );
}
