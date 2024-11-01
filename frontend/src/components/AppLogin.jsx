import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext.js';
import styles from './styles/AppLogin.module.css';
import Logo from '../assets/body/logo+.png';
import FundoScreen from '../assets/heroslider/fundo.jpg';
import AlertSystem from '../components/alerts/alertSystem';
import useAlert from '../components/alerts/useAlert';

const AppLogin = () => {
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  const { login } = useAuth();
  const navigate = useNavigate();
  const { error, success, showError, showSuccess } = useAlert();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao fazer login.');
      }

      const data = await response.json();
      login(data.user);

      localStorage.setItem('userName', data.user.name);
      localStorage.setItem('userId', data.user.id);

      showSuccess('Login realizado com sucesso!');
      // Esperar um tempo antes de redirecionar
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000); // Ajuste o tempo conforme necessário
    } catch (error) {
      console.error('Erro:', error);
      showError('Erro ao fazer login. Verifique suas credenciais.');
    }
  };

  useEffect(() => {
    const storedUserName = localStorage.getItem('userName');
    if (storedUserName) {
      console.log('Usuário logado:', storedUserName);
    }
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.homeScreen}>
        <img src={Logo} alt="Miguel Iugas" className={styles.LogoIugas} />
        <h2>Gerencie seus agendamentos de forma descomplicada.</h2>
        <div className={styles.formContainer}>
          <form onSubmit={handleSubmit}>
            <h3>Acesse sua conta</h3>
            <div className={styles.formGroup}>
              <input
                type="text"
                id="email"
                name="email"
                placeholder="E-mail"
                value={loginData.email}
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
                value={loginData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <button type="submit" >Acessar</button>
            </div>
          </form>
        </div>
        <div className={styles.textoBottom}>
          <h4>Não tem uma conta? <a href="/Registrar" alt='Clique aqui para se registrar'>Criar conta agora.</a></h4>
        </div>
      </div>
      <div className={styles.fundoScreen}>
        <img src={FundoScreen} alt="Agende sua consulta" className={styles.fundoScreenImage} />
      </div>
      <AlertSystem error={error} success={success} /> 
    </div>
  );
};

export default AppLogin;