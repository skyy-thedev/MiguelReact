import React from "react";
import './styles/contato.css';
import Fone from '../assets/icons/fone.png';
import Eicon from '../assets/icons/email.png';
import Face from '../assets/icons/facebook.svg';
import Insta from '../assets/icons/instagram.svg';
import Wapp from '../assets/icons/wapp.svg';



const Contato = () => (

    <div className="Contato">

        <div className="fone-mail"> 
            <a href="https://api.whatsapp.com/send?phone=5511933058210"><img src={Fone} alt="Telefone" id="telefone"/>
            <h3>(19) 4042-2652</h3></a>
            <a href="mailto:contato@migueliugas.com.br?subject=SUPORTE"><img src={Eicon} alt="Enviar e-mail" id="email"/>
            <h3>contato@migueliugas.com.br</h3></a><hr/>
        </div>
        <div className="social-icons">
            <h3>Siga-me nas redes sociais!</h3>
                <a href="https://www.facebook.com/migueliugasfarmaceutico" target="_blank" rel="noreferrer"><img src={Face} alt="Facebook" id="Facebook"/></a>
                <a href="https://www.instagram.com/migueliugas/" target="_blank" rel="noreferrer"><img src={Insta} alt="Instagram" id="Instagram"/></a>
                <a href="https://api.whatsapp.com/send?phone=5511933058210" target="_blank" rel="noreferrer"><img src={Wapp} alt="Whatsapp" id="Whatsapp"/></a>
        </div>
        
    </div>  

);

export default Contato;