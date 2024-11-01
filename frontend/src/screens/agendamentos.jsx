import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../components/AuthContext';
import AlertSystem from '../components/alerts/alertSystem';
import Footer from '../components/footer';
import Header from '../components/header';
import editBtn from '../assets/icons/edit.png';
import deleteBtn from '../assets/icons/delete.png';
import ScheduleModal from '../components/ScheduleModal';
import '../components/styles/agendamento.css';

const Agendamentos = () => {
  const { user } = useAuth();
  const [agendamentos, setAgendamentos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [alert, setAlert] = useState(null); // Para armazenar o alerta

  const formatarData = (dataString) => {
    const data = new Date(dataString);
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = String(data.getFullYear()).slice(-2);
    return `${dia}/${mes}/${ano}`;
  };

  const formatarHorario = (horario) => {
    const partes = horario.split(':');
    if (partes.length !== 2) {
      console.error('Formato de horário inválido:', horario);
      return horario; 
    }
    return horario; 
  };

  const fetchAgendamentos = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:5000/api/agendamentos/agendamentos');
      const data = await response.json();
      const userPrivilegies = user.privilegies;
      let agendamentosFiltrados;
  
      if (userPrivilegies === true) {
        agendamentosFiltrados = data;
      } else {
        agendamentosFiltrados = data.filter(agendamento => agendamento.userName === user.name);
      }
      setAgendamentos(agendamentosFiltrados);
    } catch (error) {
      console.error("Erro ao buscar agendamentos:", error);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchAgendamentos();
    }
  }, [fetchAgendamentos, user]); 

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/agendamentos/${id}`, {
        method: 'DELETE',
      });
  
      if (!response.ok) {
        throw new Error('Erro ao excluir agendamento');
      }
  
      // Remover o agendamento do estado local
      setAgendamentos(prevAgendamentos => 
        prevAgendamentos.filter(agendamento => agendamento.id !== id)
      );
  
      setAlert({ type: 'success', message: 'Agendamento excluído com sucesso!' });
    } catch (error) {
      console.error("Erro ao excluir agendamento:", error);
      setAlert({ type: 'error', message: error.message || 'Erro desconhecido' });
    }
  };

  const handleEdit = (id) => {
    const agendamentoParaEditar = agendamentos.find(agendamento => agendamento.id === id);
    if (agendamentoParaEditar) {
      setAlert({ type: 'info', message: `Editando: ${agendamentoParaEditar.procedimento}` });
    }
  };

  const filteredAgendamentos = agendamentos.filter(agendamento =>
    agendamento.procedimento?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <AlertSystem alert={alert} setAlert={setAlert} />
      <Header />
      <div className="container">
        <div id="leftItems">
          <h2>Agendamentos</h2>
          <button id="newAgendamentoBtn" onClick={() => setIsModalOpen(true)}>Novo Agendamento</button>
          <ScheduleModal
            isOpen={isModalOpen}
            onRequestClose={() => setIsModalOpen(false)}
          />
        </div>
        <form id="rightItems" onSubmit={(e) => e.preventDefault()}>
          <input
            type="text"
            id="searchInput"
            placeholder="Pesquisar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button id="filtrarBtn" type="submit">Filtrar</button>
        </form>
      </div>
      <hr />
      <div className="container2">
        <h3 id='firstItem'>Procedimento</h3>
        <h3>Paciente</h3>
        <h3>Data e Hora</h3>
        <h3>Valor</h3>
      </div>
      <hr />
      <div className="agendamentos-container">
        {filteredAgendamentos.length > 0 ? (
          <ul>
            {filteredAgendamentos.map(agendamento => (
              <li key={agendamento.id || agendamento._id} className="agendamento-item">
                <div className="nameAgendamento">
                  <h3>{agendamento.procedimento}</h3>
                </div>
                {user ? (
                    <div className="pacienteAgendamento">
                      <h3>{agendamento.userName}</h3>
                    </div>
                    ) : (null) }
                <div className="dataAgendamento">
                  <h3>{formatarData(agendamento.date)}</h3>
                </div>
                <div className="HoraAgendamento">
                  <h4>as {formatarHorario(agendamento.horario)}</h4>
                </div>
                <div className="priceAgendamento">
                  <h4>R${agendamento.valor},00</h4>
                </div>
                <div className="icons">
                  <img src={editBtn} alt="Editar" id='editBtn' onClick={() => handleEdit(agendamento.id || agendamento._id)} />
                  <img src={deleteBtn} alt="Deletar" id='deleteBtn' onClick={() => handleDelete(agendamento.id)} />
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div>
                <p>Não foram encontrados agendamentos para você.</p>
                <button onClick={() => fetchAgendamentos()}>Tentar novamente</button>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Agendamentos;