import { useState } from 'react';
import { Check } from 'lucide-react';
import './Plans.css';

const Plans = () => {
    const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' | 'yearly'

    const plans = [
        {
            id: 'basic',
            name: 'پایه',
            monthlyPrice: '۲۹۹,۰۰۰',
            yearlyPrice: '۲,۹۹۰,۰۰۰',
            features: [
                '۱۰۰ عملیات پردازش تصویر در ماه',
                'دسترسی به مدل‌های اصلی',
                'پشتیبانی ایمیلی',
                'مدیریت نوبت پایه',
            ],
            popular: false,
        },
        {
            id: 'pro',
            name: 'حرفه‌ای',
            monthlyPrice: '۵۹۹,۰۰۰',
            yearlyPrice: '۵,۹۹۰,۰۰۰',
            features: [
                '۵۰۰ عملیات پردازش تصویر در ماه',
                'دسترسی به تمام مدل‌ها',
                'پشتیبانی تلفنی',
                'مدیریت نوبت پیشرفته',
                'پیشنهادات هوشمند',
                'گزارش‌های تحلیلی',
            ],
            popular: true,
        },
        {
            id: 'enterprise',
            name: 'سازمانی',
            monthlyPrice: 'تماس بگیرید',
            yearlyPrice: 'تماس بگیرید',
            features: [
                'عملیات نامحدود',
                'دسترسی API اختصاصی',
                'پشتیبانی ۲۴/۷',
                'مدیریت چند شعبه',
                'یکپارچه‌سازی سفارشی',
                'مشاور اختصاصی',
            ],
            popular: false,
        },
    ];

    const scrollToContact = () => {
        const element = document.getElementById('contact');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section id="plans" className="plans">
            <div className="container">
                <div className="plans__header">
                    <h2 className="plans__title">پلن‌های قیمتی</h2>
                    <p className="plans__subtitle">
                        بسته مناسب برای کسب‌وکار خود را انتخاب کنید
                    </p>

                    <div className="plans__toggle">
                        <button
                            className={`plans__toggle-btn ${billingCycle === 'monthly' ? 'plans__toggle-btn--active' : ''}`}
                            onClick={() => setBillingCycle('monthly')}
                        >
                            ماهانه
                        </button>
                        <button
                            className={`plans__toggle-btn ${billingCycle === 'yearly' ? 'plans__toggle-btn--active' : ''}`}
                            onClick={() => setBillingCycle('yearly')}
                        >
                            سالانه
                            <span className="plans__toggle-badge">۲۰٪ تخفیف</span>
                        </button>
                    </div>
                </div>

                <div className="plans__grid">
                    {plans.map((plan, index) => (
                        <article
                            key={plan.id}
                            className={`plan-card ${plan.popular ? 'plan-card--popular' : ''}`}
                            data-index={index}
                        >
                            {plan.popular && (
                                <div className="plan-card__badge">محبوب‌ترین</div>
                            )}

                            <h3 className="plan-card__name">{plan.name}</h3>

                            <div className="plan-card__price">
                                <span className="plan-card__price-amount">
                                    {billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice}
                                </span>
                                {plan.id !== 'enterprise' && (
                                    <span className="plan-card__price-period">
                                        تومان / {billingCycle === 'monthly' ? 'ماه' : 'سال'}
                                    </span>
                                )}
                            </div>

                            <ul className="plan-card__features">
                                {plan.features.map((feature, idx) => (
                                    <li key={idx} className="plan-card__feature">
                                        <Check size={20} className="plan-card__check" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <button
                                className="plan-card__cta"
                                onClick={scrollToContact}
                                aria-label={`انتخاب پلن ${plan.name}`}
                            >
                                {plan.id === 'enterprise' ? 'تماس با فروش' : 'شروع کنید'}
                            </button>
                        </article>
                    ))}
                </div>

                <p className="plans__note">
                    تمامی قیمت‌ها به تومان می‌باشد. امکان پرداخت با درگاه‌های ایرانی فراهم است.
                </p>
            </div>
        </section>
    );
};

export default Plans;
