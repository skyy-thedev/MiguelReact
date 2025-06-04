import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Para redirecionar
import { useAuth } from './AuthContext.js'; // Importar o hook do contexto
import UserTermsTooltip from './modals/UserTermsTooltip.jsx';
import styles from './styles/AppRegister.module.css';
import Logo from '../assets/body/logo+.png';
import FundoScreen from '../assets/heroslider/fundo.jpg';
import axios from 'axios'; // Não esqueça de importar o Axios

const AppRegister = () => {
  const baseURL = process.env.REACT_APP_API_BASE_URL;
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    confirmpassword: ''

  });

  const { login } = useAuth(); // Usar o hook para obter a função de login
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRegisterData({
      ...registerData,
      privilegies: false,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (registerData.password !== registerData.confirmpassword) {
      alert('As senhas não coincidem!');
      return;
    }

    console.log("Dados de registro:", registerData);
    try {
      const response = await axios.post(`${baseURL}/api/users/register`, registerData);
      login(response.data.user); // Armazenar o usuário em cookies
      navigate('/Agendamentos');
    } catch (error) {
      if (error.response) {
        console.error('Erro:', error.response.data);
        alert(`Erro ao registrar: ${error.response.data.message || "Tente novamente."}`);
      } else {
        console.error('Erro desconhecido:', error.message);
        alert('Erro desconhecido. Verifique a conexão.');
      }
    }    
  };

  return (
    <div className={styles.container}>
      <div className={styles.homeScreen}>
        <img src={Logo} alt="Miguel Iugas" className={styles.LogoIugas} />
        <h2>Crie sua conta agora mesmo.</h2>
        <div className={styles.formContainer}>
          <form onSubmit={handleSubmit}>
            <h3>Preencha os campos abaixo</h3>
            <div className={styles.formGroup}>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Nome"
                value={registerData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="E-mail"
                value={registerData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Senha"
                value={registerData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <input
                type="password"
                id="confirmpassword"
                name="confirmpassword"
                placeholder="Confirme sua senha"
                value={registerData.confirmpassword}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.termsCheckbox}>
              <input 
                type="checkbox" 
                name="termsCheckbox" 
                id="termsCheckbox"
                required
                />
                <h5>Confirmo que minhas informações são reais e concordo com os <UserTermsTooltip /> de dados do usuário.</h5>
            </div>
            <div className={styles.formGroup}>
              <button type="submit">Acessar</button>
            </div>
          </form>
        </div>
        
        <div className={styles.textoBottom}>
          <h4>Já tem uma conta? <a href="/Login">Acessar agora!</a></h4>
        </div>
      </div>
      <div className={styles.fundoScreen}>
        <img src={FundoScreen} alt="Agende sua consulta" id='fundoScreenImage' className={styles.fundoScreenImage} />
      </div>
    </div>
  );
};

export default AppRegister;