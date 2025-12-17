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
                <h2 className="system-title">راه‌اندازی سیستم</h2>

                <div className="system-content">
                    <p className="system-description">
                        این سیستم در پیرایشگاه شما قابل اجرا است — در صورت تمایل برای راه‌اندازی و دریافت مشاوره با ما تماس بگیرید.
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
