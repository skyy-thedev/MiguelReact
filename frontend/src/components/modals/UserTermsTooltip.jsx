import React, { useState } from 'react';
import '../styles/UserTermsTooltip.css';

const UserTermsTooltip = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleTooltip = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div className="tooltip-container">
      <button className="tooltip-trigger" onClick={toggleTooltip}>
        termos de uso de dados
      </button>
      
      {isVisible && (
        <div className="tooltip-content">
          <h3 id='headertxty'>Termo de Uso de Dados de Usuário</h3>
          <p>Bem-vindo(a)! Este Termo de Uso de Dados de Usuário descreve como coletamos, usamos, compartilhamos e protegemos suas informações. Ao utilizar nossos serviços, você concorda com as práticas aqui descritas.</p>
          <p><strong>1. Coleta de Dados</strong><br />
            Nós coletamos dados fornecidos diretamente por você, como informações de cadastro, e dados de navegação, que incluem informações sobre seu dispositivo, localização e interações com o site.
          </p>
          <p><strong>2. Uso de Dados</strong><br />
            As informações coletadas são utilizadas para fornecer e melhorar nossos serviços, personalizar a sua experiência, e realizar comunicações necessárias, como envio de atualizações e ofertas.
          </p>
          <p><strong>3. Compartilhamento de Dados</strong><br />
            Não compartilhamos seus dados pessoais com terceiros sem o seu consentimento, exceto para serviços essenciais de parceiros que ajudam a operar nosso site ou conforme exigido por lei.
          </p>
          <p><strong>4. Segurança dos Dados</strong><br />
            Implementamos medidas de segurança para proteger suas informações contra acessos não autorizados, alterações, divulgação ou destruição. Entretanto, é importante ressaltar que nenhuma transmissão de dados pela internet é totalmente segura.
          </p>
          <p><strong>5. Direitos do Usuário</strong><br />
            Você tem o direito de acessar, corrigir ou excluir suas informações pessoais a qualquer momento. Para isso, entre em contato conosco pelos canais disponíveis no site.
          </p>
          <p><strong>6. Alterações no Termo de Uso</strong><br />
            Reservamo-nos o direito de modificar este termo a qualquer momento. Recomendamos que você reveja esta página periodicamente para estar sempre informado(a) sobre como utilizamos seus dados.
          </p>
          <p><strong>7. Contato</strong><br />
            Caso tenha dúvidas sobre este Termo de Uso de Dados, entre em contato conosco pelo nosso suporte ao cliente.
          </p>
          <p>Ao continuar navegando em nosso site, você concorda com os termos acima e autoriza o uso dos seus dados conforme descrito.</p>
        </div>
      )}
    </div>
  );
};

export default UserTermsTooltip;