import { useState, useEffect } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import './Navbar.css';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('hero');
    const { theme, toggleToDefault } = useTheme();

    const navLinks = [
        { href: '#hero', label: 'صفحه اصلی' },
        { href: '#system', label: 'پلتفرم هوشمند' },
        { href: '#women', label: 'بخش بانوان' },
        { href: '#gift', label: 'اشانتیون' },
        { href: '#contact', label: 'تماس با ما' },
    ];

    useEffect(() => {
        const handleScroll = () => {
            // Extract IDs from hrefs for scroll tracking
            const sectionIds = navLinks.map(link => link.href.substring(1));
            const sections = sectionIds.map(id => document.getElementById(id));
            const scrollPosition = window.scrollY + 100;

            for (let i = sections.length - 1; i >= 0; i--) {
                const section = sections[i];
                if (section && section.offsetTop <= scrollPosition) {
                    setActiveSection(sectionIds[i]);
                    break;
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleNavClick = (e, href) => {
        e.preventDefault();
        const id = href.substring(1); // Remove # from href
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            setIsOpen(false);
        }
    };

    const handleReturnToDefault = (e) => {
        e.preventDefault();
        toggleToDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setIsOpen(false);
    };

    return (
        <nav className="navbar" role="navigation" aria-label="منوی اصلی">
            <div className="container">
                <div className="navbar__wrapper">
                    <div className="navbar__brand">
                        <span className="navbar__logo">✂️</span>
                        <span className="navbar__title">استایلیو</span>
                    </div>

                    {/* Desktop Navigation */}
                    <ul className="navbar__links">
                        {navLinks.map(link => (
                            <li key={link.href}>
                                <a
                                    href={link.href}
                                    className={`navbar__link ${activeSection === link.href.substring(1) ? 'navbar__link--active' : ''}`}
                                    onClick={(e) => handleNavClick(e, link.href)}
                                    aria-current={activeSection === link.href.substring(1) ? 'page' : undefined}
                                >
                                    {link.label}
                                </a>
                            </li>
                        ))}
                    </ul>

                    {/* Return to Default Theme Button (visible only in women theme) */}
                    {theme === 'women' && (
                        <button
                            className="navbar__theme-toggle"
                            onClick={handleReturnToDefault}
                            aria-label="بازگشت"
                            title="بازگشت"
                        >
                            <ArrowRight size={18} />
                            <span className="navbar__theme-toggle-text">بازگشت</span>
                        </button>
                    )}

                    {/* Mobile Menu Button */}
                    <button
                        className="navbar__toggle"
                        onClick={() => setIsOpen(!isOpen)}
                        aria-expanded={isOpen}
                        aria-label="منوی موبایل"
                    >
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {isOpen && (
                    <div className="navbar__mobile" role="dialog" aria-modal="true">
                        <ul className="navbar__mobile-links">
                            {navLinks.map(link => (
                                <li key={link.href}>
                                    <a
                                        href={link.href}
                                        className={`navbar__mobile-link ${activeSection === link.href.substring(1) ? 'navbar__mobile-link--active' : ''}`}
                                        onClick={(e) => handleNavClick(e, link.href)}
                                        aria-current={activeSection === link.href.substring(1) ? 'page' : undefined}
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                            {theme === 'women' && (
                                <li>
                                    <button
                                        className="navbar__mobile-theme-toggle"
                                        onClick={handleReturnToDefault}
                                    >
                                        <ArrowRight size={18} />
                                        <span>بازگشت به نسخه عمومی</span>
                                    </button>
                                </li>
                            )}
                        </ul>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
