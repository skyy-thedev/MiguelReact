import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import logo from '../assets/header/logo.png';
import '../components/styles/header.css';
import Wapp from '../assets/icons/wapp.svg';
import Insta from '../assets/icons/instagram.svg';
import Face from '../assets/icons/facebook.svg';

const Header = () => {
  const { user, logout } = useAuth(); // Obtendo o usuário do contexto de autenticação
  const navigate = useNavigate(); // Hook para redirecionamento
  const contatoBtnRef = useRef(null);
  const socialIconsRef = useRef(null);
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const submenuRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);

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
  };

  const handleSubmenuToggle = () => {
    setSubmenuOpen(!submenuOpen);
  }; 

  const handleLogout = () => {
    logout(); // Chama a função de logout para limpar a autenticação
    navigate('/'); // Redireciona para a página inicial
  };

  return (
    <header className="header">
      <div className="ContainerFlex">
        <a href="/"><img src={logo} alt="Logo" id="logo" /></a>
        <div className="menu-toggle" onClick={toggleMenu}>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <nav className={menuOpen ? 'open' : ''}>
          <ul>
          {user ? (
              <>
                <li>
                  <button className='logoutbtn' onClick={handleLogout} href='/.'>Sair</button>
                </li>
                <li className='headerEff'><a href='/dashboard'>Olá, {user.name}!</a></li>
              </>
            ) : (
              <li><a href="/login">Login</a></li>
            )}
            <li><a href="/.#Sobre">Sobre</a></li>
            <li>
              <button onClick={handleSubmenuToggle} id='submenubtn'>Cursos</button>
              <ul ref={submenuRef} className={`submenu ${submenuOpen ? 'open' : 'closed'}`}>
                <li><a href="https://hotmart.com/pt-br/marketplace/produtos/suplementacao-endovenosa-e-intramuscular">Mentoria em Suplementação Endovenosa e Intramuscular</a></li>
                <li><a href="https://hotmart.com/pt-br/marketplace/produtos/prescricoes">Prescrições na Saúde Estética</a></li>
                <li><a href="https://hotmart.com/pt-br/marketplace/produtos?initialSelectedCategory=&q=Miguel+Iugas">Ver todos</a></li>
              </ul>
            </li>
            <li>
              <button id='contato-btn' ref={contatoBtnRef}>Contato</button>
            </li>
            <div id="social-icons" ref={socialIconsRef} className="hidden">
              <a href="https://api.whatsapp.com/send?phone=5511933058210&text=Ol%C3%A1%21%20Eu%20gostaria%20de%20agendar%20um%20atendimento%20com%20Dr.%20Miguel%20Iugas%20%5B2652%5D" className="whatsapp-icon" target="_blank" rel="noopener noreferrer" title="whatsapp">
                <img src={Wapp} alt="WhatsApp" id="whatsapp-icon"/>
              </a>
              <a href="https://www.instagram.com/migueliugas/" className="instagram-icon" target="_blank" rel="noopener noreferrer" title="instagram">
                <img src={Insta} alt="Instagram" id="instagram-icon"/>
              </a>
              <a href="https://www.facebook.com/migueliugasfarmaceutico" className="facebook-icon" target="_blank" rel="noopener noreferrer" title="facebook">
                <img src={Face} alt="Facebook" id="facebook-icon"/>
              </a>
            </div>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;