import { useState } from 'react';
import { Calendar, ImageIcon, Lightbulb, X } from 'lucide-react';
import './FeatureCards.css';

const FeatureCards = () => {
    const [selectedFeature, setSelectedFeature] = useState(null);

    const features = [
        {
            id: 1,
            icon: <Calendar size={40} />,
            title: 'مدیریت نوبت هوشمند',
            shortDescription: 'سیستم نوبت‌دهی پیشرفته با یادآوری خودکار و تقویم آنلاین',
            fullDescription: 'با سیستم مدیریت نوبت نانوبانانا، دیگر نگران از دست دادن مشتریان نباشید. مشتریان می‌توانند به راحتی نوبت بگیرند، یادآوری خودکار دریافت کنند و شما می‌توانید تقویم کاری خود را به صورت کامل مدیریت کنید.',
        },
        {
            id: 2,
            icon: <ImageIcon size={40} />,
            title: 'پیش‌نمایش قبل و بعد',
            shortDescription: 'نمایش واقع‌گرایانه نتیجه نهایی با هوش مصنوعی پیشرفته',
            fullDescription: 'با استفاده از مدل هوش مصنوعی نانوبانانا، قبل از شروع کار به مشتری نشان دهید که چگونه خواهد شد. این امکان باعث افزایش اعتماد مشتری و کاهش نارضایتی می‌شود. تنها کافی است عکسی از مشتری بگیرید و مدل مورد نظر را انتخاب کنید.',
        },
        {
            id: 3,
            icon: <Lightbulb size={40} />,
            title: 'پیشنهادات هوشمند',
            shortDescription: 'پیشنهاد بهترین مدل‌ها بر اساس فرم صورت و سلیقه مشتری',
            fullDescription: 'هوش مصنوعی ما با تحلیل فرم صورت، نوع مو و سلیقه مشتری، بهترین مدل‌ها را به شما و مشتری پیشنهاد می‌دهد. دیگر نیازی به حدس و گمان نیست، همه چیز علمی و دقیق است.',
        },
    ];

    const openModal = (feature) => {
        setSelectedFeature(feature);
    };

    const closeModal = () => {
        setSelectedFeature(null);
    };

    return (
        <section id="features" className="features">
            <div className="container">
                <div className="features__header">
                    <h2 className="features__title">امکانات ویژه</h2>
                    <p className="features__subtitle">
                        ابزارهای قدرتمند برای بردن آرایشگاه شما به سطح بعدی
                    </p>
                </div>

                <div className="features__grid">
                    {features.map((feature, index) => (
                        <article
                            key={feature.id}
                            className="feature-card"
                            data-index={index}
                        >
                            <div className="feature-card__icon-wrapper">
                                {feature.icon}
                            </div>
                            <h3 className="feature-card__title">{feature.title}</h3>
                            <p className="feature-card__description">
                                {feature.shortDescription}
                            </p>
                            <button
                                className="feature-card__button"
                                onClick={() => openModal(feature)}
                                aria-label={`جزئیات ${feature.title}`}
                            >
                                جزئیات
                            </button>
                        </article>
                    ))}
                </div>
            </div>

            {/* Modal */}
            {selectedFeature && (
                <div
                    className="modal-overlay"
                    onClick={closeModal}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="modal-title"
                >
                    <div
                        className="modal-content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="modal-close"
                            onClick={closeModal}
                            aria-label="بستن"
                        >
                            <X size={24} />
                        </button>
                        <div className="modal-icon">
                            {selectedFeature.icon}
                        </div>
                        <h3 id="modal-title" className="modal-title">
                            {selectedFeature.title}
                        </h3>
                        <p className="modal-description">
                            {selectedFeature.fullDescription}
                        </p>
                    </div>
                </div>
            )}
        </section>
    );
};

export default FeatureCards;
