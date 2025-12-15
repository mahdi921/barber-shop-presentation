import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('hero');

    const navLinks = [
        { id: 'hero', label: 'خانه' },
        { id: 'benefits', label: 'مزایا' },
        { id: 'features', label: 'امکانات' },
        { id: 'live-test', label: 'آزمایش آنلاین' },
        { id: 'plans', label: 'پلن‌ها' },
        { id: 'contact', label: 'تماس با ما' },
    ];

    useEffect(() => {
        const handleScroll = () => {
            const sections = navLinks.map(link => document.getElementById(link.id));
            const scrollPosition = window.scrollY + 100;

            for (let i = sections.length - 1; i >= 0; i--) {
                const section = sections[i];
                if (section && section.offsetTop <= scrollPosition) {
                    setActiveSection(navLinks[i].id);
                    break;
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleNavClick = (e, id) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            setIsOpen(false);
        }
    };

    const handleCTAClick = (e) => {
        handleNavClick(e, 'contact');
    };

    return (
        <nav className="navbar" role="navigation" aria-label="منوی اصلی">
            <div className="container">
                <div className="navbar__wrapper">
                    <div className="navbar__brand">
                        <span className="navbar__logo">🍌</span>
                        <span className="navbar__title">نانوبانانا</span>
                    </div>

                    {/* Desktop Navigation */}
                    <ul className="navbar__links">
                        {navLinks.map(link => (
                            <li key={link.id}>
                                <a
                                    href={`#${link.id}`}
                                    className={`navbar__link ${activeSection === link.id ? 'navbar__link--active' : ''}`}
                                    onClick={(e) => handleNavClick(e, link.id)}
                                    aria-current={activeSection === link.id ? 'page' : undefined}
                                >
                                    {link.label}
                                </a>
                            </li>
                        ))}
                    </ul>

                    <button
                        className="navbar__cta"
                        onClick={handleCTAClick}
                        aria-label="تماس با ما"
                    >
                        درخواست دمو
                    </button>

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
                                <li key={link.id}>
                                    <a
                                        href={`#${link.id}`}
                                        className={`navbar__mobile-link ${activeSection === link.id ? 'navbar__mobile-link--active' : ''}`}
                                        onClick={(e) => handleNavClick(e, link.id)}
                                        aria-current={activeSection === link.id ? 'page' : undefined}
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                            <li>
                                <button
                                    className="navbar__mobile-cta"
                                    onClick={handleCTAClick}
                                >
                                    درخواست دمو
                                </button>
                            </li>
                        </ul>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
