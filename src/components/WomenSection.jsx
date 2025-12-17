import React from 'react';
import './WomenSection.css';
import { ExternalLink, Scissors, Sparkles, Heart } from 'lucide-react';

export default function WomenSection() {
    const categories = [
        { icon: <Scissors size={24} />, label: 'مدل مو' },
        { icon: <Sparkles size={24} />, label: 'ناخن' },
        { icon: <Heart size={24} />, label: 'آرایش' }
    ];

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

                    <a
                        href="#"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="women-cta"
                        aria-label="ورود به سایت بانوان"
                    >
                        <span>ورود به سایت بانوان</span>
                        <ExternalLink size={20} />
                    </a>
                </div>
            </div>
        </section>
    );
}
