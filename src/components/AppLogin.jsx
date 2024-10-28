import React from 'react';
import './styles/AppLogin.css';
import Logo from '../assets/body/logo+.png';
import FundoScreen from '../assets/heroslider/fundo.jpg';

const AppLogin = () => {
  return (
    <div className="container">
      <div className="homeScreen">
        <img src={Logo} alt="Miguel Iugas" id="LogoIugas" />
        <h2>Gerencie seus agendamentos de forma descomplicada.</h2>
        <div className="form-container">
          <form>
            <h3>Acesse sua conta</h3>
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
              <button type="submit">Acessar</button>
            </div>
          </form>
        </div>
        <div className='textoBottom'>        
            <h4>Não tem uma conta? <a href="/Registrar" alt='Clique aqui para se registrar'>Criar conta agora.</a></h4>
        </div>
      </div>
      <div className="fundoScreen">
        <img src={FundoScreen} alt="Agende sua consulta" id="fundoScreenImage" />
      </div>
    </div>
  );
};

export default AppLogin;