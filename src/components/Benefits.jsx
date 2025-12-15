import { Sparkles, TrendingUp, Clock, Users } from 'lucide-react';
import './Benefits.css';

const Benefits = () => {
    const benefits = [
        {
            icon: <Sparkles size={32} />,
            title: 'کیفیت بی‌نظیر',
            description: 'با استفاده از جدیدترین تکنولوژی هوش مصنوعی، بهترین نتایج را برای مشتریان خود رقم بزنید.',
        },
        {
            icon: <Clock size={32} />,
            title: 'صرفه‌جویی در زمان',
            description: 'فرآیند مشاوره و پیش‌نمایش را از ساعت‌ها به دقایق کاهش دهید و زمان بیشتری برای کار داشته باشید.',
        },
        {
            icon: <TrendingUp size={32} />,
            title: 'افزایش درآمد',
            description: 'با ارائه خدمات پیشرفته‌تر، مشتریان بیشتری جذب کنید و درآمد آرایشگاه خود را افزایش دهید.',
        },
        {
            icon: <Users size={32} />,
            title: 'رضایت مشتری',
            description: 'پیش از اقدام، نتیجه نهایی را به مشتری نشان دهید و اطمینان آن‌ها را جلب کنید.',
        },
    ];

    return (
        <section id="benefits" className="benefits">
            <div className="container">
                <div className="benefits__header">
                    <h2 className="benefits__title">چرا نانوبانانا؟</h2>
                    <p className="benefits__subtitle">
                        مزایای استفاده از پلتفرم پیشرفته ما برای آرایشگاه شما
                    </p>
                </div>

                <div className="benefits__grid">
                    {benefits.map((benefit, index) => (
                        <div
                            key={index}
                            className="benefit-card"
                            data-index={index}
                        >
                            <div className="benefit-card__icon">
                                {benefit.icon}
                            </div>
                            <h3 className="benefit-card__title">{benefit.title}</h3>
                            <p className="benefit-card__description">{benefit.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Benefits;
