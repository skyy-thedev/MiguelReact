import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext.js';
import styles from './styles/AppLogin.module.css';
import Logo from '../assets/body/logo+.png';
import FundoScreen from '../assets/heroslider/fundo.jpg';

const AppLogin = () => {
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  const { login } = useAuth(); // Usar o hook para obter a função de login
  const navigate = useNavigate(); // Hook para redirecionamento

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
        throw new Error('Credenciais inválidas');
      }

      const data = await response.json();
      login(data.user); // Usar a função de login do contexto
      
      // Armazenar as informações do usuário
      localStorage.setItem('userName', data.user.name); // Armazenar o nome do usuário
      localStorage.setItem('userId', data.user.id); // Armazenar o ID do usuário

      // Redirecionar para a página de dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao fazer login. Verifique suas credenciais.');
    }
  };

  // UseEffect para verificar se o usuário está logado
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
              <button type="submit">Acessar</button>
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
    </div>
  );
};

export default AppLogin;