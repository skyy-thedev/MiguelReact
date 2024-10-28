import React from 'react';
import './styles/AppRegister.css';
import Logo from '../assets/body/logo+.png';
import FundoScreen from '../assets/heroslider/fundo.jpg';

const AppRegister = () => {
  return (
    <div className="container">
      <div className="homeScreen">
        <img src={Logo} alt="Miguel Iugas" id="LogoIugas" />
        <h2>Crie sua conta agora mesmo.</h2>
        <div className="form-container">
          <form>
            <h3>Preencha os campos abaixo</h3>
            <div className="form-group">
              <input
                type="text"
                id="name"
                name="nome"
                placeholder="Nome"
                required
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                id="login"
                name="login"
                placeholder="E-mail"
                required
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Senha"
                required
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                id="confirmpassword"
                name="confirmpassword"
                placeholder="Confirme sua senha"
                required
              />
            </div>
            <div className="form-group">
              <button type="submit">Acessar</button>
            </div>
          </form>
        </div>
        <div className='textoBottom'>        
            <h4>Já tem uma conta? <a href="/Login">Acessar agora!</a></h4>
        </div>
      </div>
      <div className="fundoScreen">
        <img src={FundoScreen} alt="Agende sua consulta" id="fundoScreenImage" />
      </div>
    </div>
  );
};

export default AppRegister;