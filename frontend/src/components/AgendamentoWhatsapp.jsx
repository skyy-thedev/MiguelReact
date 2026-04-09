import React, { useState } from 'react';
import './styles/agendamentoWhatsapp.css';
import Wapp from '../assets/icons/wapp.svg';

const procedimentos = [
  'Consultoria Farmacêutica',
  'Farmácia Clínica',
  'Farmácia Estética',
  'Fitoterapia',
  'Suplementação Endovenosa',
  'Suplementação Intramuscular',
  'Saúde Integrativa',
  'Longevidade e Envelhecimento Saudável',
];

const WHATSAPP_NUMBER = '5511933058210';

const AgendamentoWhatsapp = () => {
  const [nome, setNome] = useState('');
  const [procedimentoSelecionado, setProcedimentoSelecionado] = useState('');
  const [observacao, setObservacao] = useState('');
  const [enviado, setEnviado] = useState(false);

  const montarMensagem = () => {
    let msg = `Olá! Gostaria de agendar um atendimento com Dr. Miguel Iugas.\n\n`;
    msg += `*Nome:* ${nome}\n`;
    msg += `*Procedimento:* ${procedimentoSelecionado}\n`;
    if (observacao.trim()) {
      msg += `*Observação:* ${observacao}\n`;
    }
    msg += `\n*Endereço:* Av Orosimbo Maia, 360 - 6º Andar, Campinas/SP`;
    return encodeURIComponent(msg);
  };

  const handleEnviar = (e) => {
    e.preventDefault();

    if (!nome.trim() || !procedimentoSelecionado) {
      return;
    }

    const mensagem = montarMensagem();
    const url = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${mensagem}`;
    
    setEnviado(true);
    setTimeout(() => {
      window.open(url, '_blank');
      setEnviado(false);
    }, 600);
  };

  return (
    <section className="agendamento-section" id="Agendar">
      <div className="agendamento-container">
        <div className="agendamento-header">
          <h2>Agende seu Atendimento</h2>
          <p>Escolha o procedimento desejado e entre em contato diretamente pelo WhatsApp. Simples e rápido!</p>
        </div>

        <form className="agendamento-form" onSubmit={handleEnviar}>
          <div className="form-group">
            <label htmlFor="nome">Seu Nome</label>
            <input
              type="text"
              id="nome"
              placeholder="Digite seu nome completo"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="procedimento">Procedimento</label>
            <select
              id="procedimento"
              value={procedimentoSelecionado}
              onChange={(e) => setProcedimentoSelecionado(e.target.value)}
              required
            >
              <option value="" disabled>Selecione um procedimento</option>
              {procedimentos.map((proc, index) => (
                <option key={index} value={proc}>{proc}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="observacao">Observação (opcional)</label>
            <textarea
              id="observacao"
              placeholder="Alguma informação adicional? (ex: preferência de horário, etc.)"
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              rows={3}
            />
          </div>

          <button
            type="submit"
            className={`btn-whatsapp ${enviado ? 'enviado' : ''}`}
            disabled={!nome.trim() || !procedimentoSelecionado}
          >
            <img src={Wapp} alt="WhatsApp" className="wapp-icon" />
            {enviado ? 'Redirecionando...' : 'Agendar pelo WhatsApp'}
          </button>
        </form>
      </div>
    </section>
  );
};

export default AgendamentoWhatsapp;
