import { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import './ContactFooter.css';

const ContactFooter = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    // Iranian mobile number regex: accepts 09xxxxxxxxx, +989xxxxxxxxx, or 9xxxxxxxxx
    const iranianPhoneRegex = /^(?:\+98|0)?9\d{9}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'نام الزامی است';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'ایمیل الزامی است';
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'ایمیل معتبر نیست';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'شماره تلفن الزامی است';
        } else if (!iranianPhoneRegex.test(formData.phone)) {
            newErrors.phone = 'شماره موبایل معتبر نیست (مثال: 09123456789)';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            // TODO: Replace with actual API endpoint or integrate with Formspree/EmailJS
            // Example with fetch:
            /*
            const response = await fetch('/api/contact', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(formData),
            });
      
            if (!response.ok) {
              throw new Error('Failed to send message');
            }
            */

            // Mock submission
            await new Promise(resolve => setTimeout(resolve, 1500));

            setSubmitSuccess(true);
            setFormData({ name: '', email: '', phone: '', message: '' });

            // Reset success message after 5 seconds
            setTimeout(() => setSubmitSuccess(false), 5000);
        } catch (err) {
            console.error('Submit error:', err);
            setErrors({ submit: 'خطا در ارسال پیام. لطفاً دوباره تلاش کنید.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <footer id="contact" className="footer">
            <div className="container">
                <div className="footer__content">
                    {/* Contact Info */}
                    <div className="footer__info">
                        <h3 className="footer__title">تماس با ما</h3>
                        <p className="footer__description">
                            آماده پاسخگویی به سوالات شما هستیم. با ما در ارتباط باشید.
                        </p>

                        <div className="footer__contact-items">
                            <div className="footer__contact-item">
                                <Mail size={20} />
                                <span>info@nanobanana.ir</span>
                            </div>
                            <div className="footer__contact-item">
                                <Phone size={20} />
                                <span>۰۲۱-۱۲۳۴۵۶۷۸</span>
                            </div>
                            <div className="footer__contact-item">
                                <MapPin size={20} />
                                <span>تهران، ایران</span>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="footer__form-wrapper">
                        <h3 className="footer__title">پیام خود را ارسال کنید</h3>

                        {submitSuccess && (
                            <div className="footer__success" role="alert">
                                پیام شما با موفقیت ارسال شد. به زودی با شما تماس می‌گیریم.
                            </div>
                        )}

                        {errors.submit && (
                            <div className="footer__error" role="alert">
                                {errors.submit}
                            </div>
                        )}

                        <form className="footer__form" onSubmit={handleSubmit} noValidate>
                            <div className="footer__field">
                                <label htmlFor="name" className="footer__label">
                                    نام <span className="footer__required">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    className={`footer__input ${errors.name ? 'footer__input--error' : ''}`}
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="نام خود را وارد کنید"
                                    aria-invalid={!!errors.name}
                                    aria-describedby={errors.name ? 'name-error' : undefined}
                                />
                                {errors.name && (
                                    <span id="name-error" className="footer__field-error">
                                        {errors.name}
                                    </span>
                                )}
                            </div>

                            <div className="footer__field">
                                <label htmlFor="email" className="footer__label">
                                    ایمیل <span className="footer__required">*</span>
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    className={`footer__input ${errors.email ? 'footer__input--error' : ''}`}
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="example@domain.com"
                                    aria-invalid={!!errors.email}
                                    aria-describedby={errors.email ? 'email-error' : undefined}
                                />
                                {errors.email && (
                                    <span id="email-error" className="footer__field-error">
                                        {errors.email}
                                    </span>
                                )}
                            </div>

                            <div className="footer__field">
                                <label htmlFor="phone" className="footer__label">
                                    شماره تلفن <span className="footer__required">*</span>
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    className={`footer__input ${errors.phone ? 'footer__input--error' : ''}`}
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="09123456789"
                                    aria-invalid={!!errors.phone}
                                    aria-describedby={errors.phone ? 'phone-error' : undefined}
                                />
                                {errors.phone && (
                                    <span id="phone-error" className="footer__field-error">
                                        {errors.phone}
                                    </span>
                                )}
                            </div>

                            <div className="footer__field footer__field--full">
                                <label htmlFor="message" className="footer__label">
                                    پیام (اختیاری)
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    className="footer__textarea"
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder="پیام خود را بنویسید..."
                                    rows={4}
                                />
                            </div>

                            <button
                                type="submit"
                                className="footer__submit"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="spinner-small"></div>
                                        در حال ارسال...
                                    </>
                                ) : (
                                    <>
                                        <Send size={20} />
                                        ارسال پیام
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Footer Bottom */}
                <div className="footer__bottom">
                    <p className="footer__copyright">
                        © ۱۴۰۳ نانوبانانا. تمامی حقوق محفوظ است.
                    </p>
                    <div className="footer__links">
                        <a href="#privacy" className="footer__link">حریم خصوصی</a>
                        <a href="#terms" className="footer__link">شرایط استفاده</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default ContactFooter;
