import React from 'react';
import './SystemOverview.css';
import { CheckCircle, Zap, Shield } from 'lucide-react';

export default function SystemOverview() {
    const benefits = [
        { icon: <Zap size={24} />, text: 'نصب و راه‌اندازی سریع در کمتر از یک روز' },
        { icon: <Shield size={24} />, text: 'پشتیبانی فنی و آموزش کامل تیم' },
        { icon: <CheckCircle size={24} />, text: 'بروزرسانی‌های رایگان و مداوم سیستم' }
    ];

    const handleScrollToContact = () => {
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <section id="system" className="system-section">
            <div className="container">
                <h2 className="system-title">پیش‌نمایش هوشمند مدل مو و ریش روی تصویر کاربر با فناوری هوش مصنوعی</h2>

                <div className="system-content">
                    <p className="system-description">
                        با نصب این سیستم در پیرایشگاه، مشتریان شما می‌توانند پیش از اقدام، نتیجه نهایی کار خود را با کمک هوش مصنوعی مشاهده کنند. برای دریافت مشاوره و راه‌اندازی، همین حالا با ما تماس بگیرید.
                    </p>

                    <ul className="system-benefits">
                        {benefits.map((benefit, idx) => (
                            <li key={idx} className="benefit-item">
                                <span className="benefit-icon">{benefit.icon}</span>
                                <span className="benefit-text">{benefit.text}</span>
                            </li>
                        ))}
                    </ul>

                    <button
                        onClick={handleScrollToContact}
                        className="system-cta"
                        type="button"
                    >
                        درخواست راه‌اندازی
                    </button>
                </div>
            </div>
        </section>
    );
}
