import { useState, useEffect } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import './Navbar.css';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
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
        const id = href.substring(1);
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            setIsMenuOpen(false);
        }
    };

    const handleReturnToDefault = (e) => {
        e.preventDefault();
        toggleToDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setIsMenuOpen(false);
    };

    return (
        <nav className="navbar">
            <div className="container">
                <div className="navbar-wrapper">
                    {/* Brand */}
                    <div className="navbar-brand">
                        <span className="navbar-logo">✂️</span>
                        <span className="navbar-title">استایلیو</span>
                    </div>

                    {/* Desktop Links */}
                    <ul className="navbar-links">
                        {navLinks.map(link => (
                            <li key={link.href}>
                                <a
                                    href={link.href}
                                    className={`navbar-link ${activeSection === link.href.substring(1) ? 'navbar-link-active' : ''}`}
                                    onClick={(e) => handleNavClick(e, link.href)}
                                >
                                    {link.label}
                                </a>
                            </li>
                        ))}
                    </ul>

                    {/* Theme Toggle (Desktop) */}
                    {theme === 'women' && (
                        <button
                            className="navbar-theme-btn"
                            onClick={handleReturnToDefault}
                            aria-label="بازگشت"
                        >
                            <ArrowRight size={18} />
                            <span>بازگشت</span>
                        </button>
                    )}

                    {/* Mobile Toggle */}
                    <button
                        className="navbar-toggle"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="منو"
                        aria-expanded={isMenuOpen}
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="navbar-mobile">
                        <ul className="navbar-mobile-list">
                            {navLinks.map(link => (
                                <li key={link.href}>
                                    <a
                                        href={link.href}
                                        className={`navbar-mobile-link ${activeSection === link.href.substring(1) ? 'navbar-mobile-link-active' : ''}`}
                                        onClick={(e) => handleNavClick(e, link.href)}
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                            {theme === 'women' && (
                                <li>
                                    <button
                                        className="navbar-mobile-theme-btn"
                                        onClick={handleReturnToDefault}
                                    >
                                        <ArrowRight size={18} />
                                        <span>بازگشت</span>
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
