import React from 'react';
import './GiftSection.css';
import { Gift, Calendar, Bell, Sparkles } from 'lucide-react';

export default function GiftSection() {
    const features = [
        { icon: <Calendar size={20} />, text: 'مدیریت نوبت‌دهی آنلاین' },
        { icon: <Bell size={20} />, text: 'یادآوری خودکار به مشتریان' },
        { icon: <Sparkles size={20} />, text: 'نظم‌دهی کامل به برنامه' }
    ];

    return (
        <section id="gift" className="gift-section">
            <div className="container">
                <div className="gift-content">
                    <div className="gift-icon-wrapper">
                        <Gift size={48} className="gift-icon" />
                    </div>

                    <h2 className="gift-title">اشانتیون</h2>

                    <p className="gift-description">
                        برای مدیریت نوبت‌دهی آنلاین، یادآوری خودکار و نظم‌دهی به برنامه پیرایشگاه، از سیستم رزرو نوبت استایلیو استفاده کنید.
                    </p>

                    <div className="gift-features">
                        {features.map((feature, idx) => (
                            <div key={idx} className="gift-feature">
                                <span className="gift-feature-icon">{feature.icon}</span>
                                <span className="gift-feature-text">{feature.text}</span>
                            </div>
                        ))}
                    </div>

                    <a
                        href="__STYLIO_LINK__"
                        className="gift-cta"
                        rel="noopener noreferrer"
                    >
                        مشاهده سیستم رزرو نوبت استایلیو
                    </a>
                </div>
            </div>
        </section>
    );
}
