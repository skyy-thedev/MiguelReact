import React, { useEffect, useRef, useState, useCallback } from 'react';
import logo from '../assets/header/logo.png';
import '../components/styles/header.css';
import Wapp from '../assets/icons/wapp.svg';
import Insta from '../assets/icons/instagram.svg';
import Face from '../assets/icons/facebook.svg';

const Header = () => {
  const contatoBtnRef = useRef(null);
  const socialIconsRef = useRef(null);
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const submenuRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Scroll-aware header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuOpen && !e.target.closest('.header')) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [menuOpen]);

  // Close menu on anchor click (smooth scroll)
  const handleNavClick = useCallback(() => {
    setMenuOpen(false);
    setSubmenuOpen(false);
  }, []);

  useEffect(() => {
    const contatoBtn = contatoBtnRef.current;
    const socialIcons = socialIconsRef.current;

    const handleContatoClick = () => {
      socialIcons.classList.toggle('visible');
      socialIcons.classList.toggle('hidden');
    };

    if (contatoBtn) {
      contatoBtn.addEventListener('click', handleContatoClick);
    }

    return () => {
      if (contatoBtn) {
        contatoBtn.removeEventListener('click', handleContatoClick);
      }
    };
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    if (!menuOpen) setSubmenuOpen(false);
  };

  const handleSubmenuToggle = (e) => {
    e.stopPropagation();
    setSubmenuOpen(!submenuOpen);
  };

  return (
    <header className={`header ${scrolled ? 'header--scrolled' : ''}`}>
      <div className="header__container">
        <a href="/Home" className="header__logo-link">
          <img src={logo} alt="Dr. Miguel Iugas" className="header__logo" />
        </a>

        <button 
          className={`header__hamburger ${menuOpen ? 'header__hamburger--active' : ''}`} 
          onClick={toggleMenu}
          aria-label="Menu"
          aria-expanded={menuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav className={`header__nav ${menuOpen ? 'header__nav--open' : ''}`}>
          <ul className="header__menu">
            <li><a href="/#Agendar" onClick={handleNavClick}>Agendar</a></li>
            <li><a href="/#Sobre" onClick={handleNavClick}>Sobre</a></li>
            <li><a href="/#Localizacao" onClick={handleNavClick}>Localização</a></li>
            <li className="header__dropdown">
              <button onClick={handleSubmenuToggle} className="header__dropdown-btn">
                Cursos <span className={`header__arrow ${submenuOpen ? 'header__arrow--open' : ''}`}>›</span>
              </button>
              <ul ref={submenuRef} className={`header__submenu ${submenuOpen ? 'header__submenu--open' : ''}`}>
                <li><a href="https://hotmart.com/pt-br/marketplace/produtos/suplementacao-endovenosa-e-intramuscular" target="_blank" rel="noopener noreferrer">Suplementação Endovenosa e Intramuscular</a></li>
                <li><a href="https://hotmart.com/pt-br/marketplace/produtos/prescricoes" target="_blank" rel="noopener noreferrer">Prescrições na Saúde Estética</a></li>
                <li><a href="https://go.hotmart.com/L102020947D" target="_blank" rel="noopener noreferrer">Formação em Saúde Integrativa</a></li>
                <li><a href="https://go.hotmart.com/O104135207P" target="_blank" rel="noopener noreferrer">Workshop de Modulação Intestinal</a></li>
                <li><a href="https://hotmart.com/pt-br/marketplace/produtos?initialSelectedCategory=&q=Miguel+Iugas" target="_blank" rel="noopener noreferrer">Ver todos os cursos →</a></li>
              </ul>
            </li>
            <li className="header__contact-wrapper">
              <button className="header__contact-btn" ref={contatoBtnRef}>Contato</button>
              <div id="social-icons" ref={socialIconsRef} className="header__social hidden">
                <a href="https://api.whatsapp.com/send?phone=5511933058210&text=Ol%C3%A1%21%20Eu%20gostaria%20de%20agendar%20um%20atendimento%20com%20Dr.%20Miguel%20Iugas%20%5B2652%5D" target="_blank" rel="noopener noreferrer" title="WhatsApp">
                  <img src={Wapp} alt="WhatsApp" />
                </a>
                <a href="https://www.instagram.com/migueliugas/" target="_blank" rel="noopener noreferrer" title="Instagram">
                  <img src={Insta} alt="Instagram" />
                </a>
                <a href="https://www.facebook.com/migueliugasfarmaceutico" target="_blank" rel="noopener noreferrer" title="Facebook">
                  <img src={Face} alt="Facebook" />
                </a>
              </div>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;