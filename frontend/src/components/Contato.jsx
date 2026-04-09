import React from "react";
import './styles/contato.css';
import Face from '../assets/icons/facebook.svg';
import Insta from '../assets/icons/instagram.svg';
import Wapp from '../assets/icons/wapp.svg';

const Contato = () => (
  <section className="contato" id="Contato">
    <div className="contato__container">

      <p className="contato__cta">Siga-me nas redes sociais!</p>
      <div className="contato__social">
        <a href="https://www.facebook.com/migueliugasfarmaceutico" target="_blank" rel="noreferrer" className="contato__social-link" aria-label="Facebook">
          <img src={Face} alt="Facebook" />
        </a>
        <a href="https://www.instagram.com/migueliugas/" target="_blank" rel="noreferrer" className="contato__social-link" aria-label="Instagram">
          <img src={Insta} alt="Instagram" />
        </a>
        <a href="https://api.whatsapp.com/send?phone=5511933058210" target="_blank" rel="noreferrer" className="contato__social-link" aria-label="WhatsApp">
          <img src={Wapp} alt="WhatsApp" />
        </a>
      </div>
    </div>
  </section>
);

export default Contato;