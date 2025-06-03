import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../components/AuthContext';
import AlertSystem from '../components/alerts/alertSystem';
import useAlert from '../components/alerts/useAlert';
import Footer from '../components/footer';
import Header from '../components/header';
import editBtn from '../assets/icons/edit.png';
import EditAgendamentoModal  from '../components/modals/editModal'; // Renomeado para "EditModal"
import ConfirmModal from '../components/confirmModal';
import ScheduleModal from '../components/ScheduleModal';
import '../components/styles/agendamento.css';

const Agendamentos = () => {
  const { user } = useAuth();
  const { hasPrivileges } = useAuth();
  const [agendamentos, setAgendamentos] = useState([]);
  const [isAscending, setIsAscending] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedAgendamento, setSelectedAgendamento] = useState(null);
  const [agendamentoId, setAgendamentoId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para o modal de agendamento
  const { error, success, showError, showSuccess } = useAlert();

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
      console.log("Usuário:", user);
      console.log("Privilégios do usuário:", user.privilegies);
  
      const response = await fetch('http://localhost:5000/api/agendamentos/agendamentos');
      const data = await response.json();
      let agendamentosFiltrados;
  
      if (hasPrivileges() === 'admin') {
        agendamentosFiltrados = data; // Admin vê todos os agendamentos
      } else {
        // Filtra os agendamentos para exibir apenas os do usuário logado
        agendamentosFiltrados = data.filter(agendamento => agendamento.userName === user.name);
  
        // Ordena os agendamentos por status (Ativo primeiro, Cancelado e Expirado depois)
        agendamentosFiltrados = agendamentosFiltrados.sort((a, b) => {
          const statusOrder = { 'Ativo': 1, 'Reagendado': 2, 'Expirado': 3, 'Cancelado': 4 };
          const statusA = statusOrder[a.status] || 5; // Usa 5 como valor padrão se status estiver indefinido
          const statusB = statusOrder[b.status] || 5;
          return statusA - statusB;
        });
      }
  
      if (agendamentosFiltrados.length === 0) {
        showError("Não foram encontrados agendamentos para você.");
      }
  
      setAgendamentos(agendamentosFiltrados);
    } catch (error) {
      showError("Erro ao buscar agendamentos. Tente novamente mais tarde.");
      console.error("Erro ao buscar agendamentos:", error);
    }
  }, [user, hasPrivileges]);
  
  useEffect(() => {
    if (user) {
      fetchAgendamentos();
    }
  }, [fetchAgendamentos, user]);
  

  // Após buscar os agendamentos
  useEffect(() => {
    console.log("Dados dos agendamentos:", agendamentos); // Verifica os campos dos dados
  }, [agendamentos]);

  // Alternar entre crescente e decrescente
    const toggleOrder = () => setIsAscending(!isAscending);

  // Ordenação por Procedimento (ordem alfabética)
const ordenarPorProcedimento = (agendamentos, isAscending = true) => {
  return agendamentos.sort((a, b) => {
    const procedimentoA = a.procedimento?.toLowerCase() || '';
    const procedimentoB = b.procedimento?.toLowerCase() || '';
    return isAscending 
      ? procedimentoA.localeCompare(procedimentoB)
      : procedimentoB.localeCompare(procedimentoA);
  });
};

// Ordenação por Nome do Paciente (ordem alfabética)
const ordenarPorNomePaciente = (agendamentos, isAscending = true) => {
  return agendamentos.sort((a, b) => {
    const nomeA = a.userName?.toLowerCase() || '';
    const nomeB = b.userName?.toLowerCase() || '';
    return isAscending 
      ? nomeA.localeCompare(nomeB)
      : nomeB.localeCompare(nomeA);
  });
};

// Ordenação por Data (ordem cronológica)
const ordenarPorData = (agendamentos, isAscending = true) => {
  return agendamentos.sort((a, b) => {
    const dataA = new Date(a.date);
    const dataB = new Date(b.date);
    return isAscending ? dataA - dataB : dataB - dataA;
  });
};


// Ordenação por Valor (ordem numérica)
const ordenarPorValor = (agendamentos, isAscending = true) => {
  return agendamentos.sort((a, b) => {
    const valorA = parseFloat(a.valor) || 0;
    const valorB = parseFloat(b.valor) || 0;
    return isAscending ? valorA - valorB : valorB - valorA;
  });
};

  const openConfirmModal = (id) => {
    setAgendamentoId(id);
    setIsConfirmModalOpen(true); // Corrigido para setar o estado corretamente
  };

  const openEditModal = (agendamento) => {
    setSelectedAgendamento(agendamento);
    setEditModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!agendamentoId) return;
  
    try {
      const response = await fetch(`http://localhost:5000/api/agendamentos/${agendamentoId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Cancelado' })
      });
  
      if (!response.ok) {
        throw new Error('Erro ao cancelar agendamento');
      }
  
      setAgendamentos(prevAgendamentos =>
        prevAgendamentos.filter(agendamento => agendamento._id !== agendamentoId)
      );
  
      showSuccess('Seu agendamento foi cancelado com sucesso!');
    } catch (error) {
      console.error("Erro ao cancelar agendamento:", error);
      showError('Erro ao cancelar agendamento');
    } finally {
      setIsConfirmModalOpen(false);
    }
  };

  function getStatusClass(status) {
    switch (status) {
      case 'Ativo':
        return 'green'; // Status ativo - bolinha verde
      case 'Expirado':
      case 'Cancelado':
        return 'red'; // Status expirado ou cancelado - bolinha vermelha
      case 'Reagendado':
        return 'blue'; // Status reagendado - bolinha azul
      default:
        return 'black'; // Caso o status seja algo inesperado, sem classe de cor
    }
  }  

  const filteredAgendamentos = agendamentos.filter(agendamento => {
    const term = searchTerm.toLowerCase(); // Normaliza o termo de busca
    return (
      agendamento.procedimento?.toLowerCase().includes(term) || // Nome do procedimento
      agendamento.userName?.toLowerCase().includes(term) || // Nome do paciente
      agendamento.date?.includes(term) || // Data
      agendamento.horario?.includes(term) || // Horário
      agendamento.valor?.toString().includes(term) || // Valor (convertendo para string para comparação)
      agendamento.status?.includes(term)
    );
  });

  return (
    <>
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
        <h3 className='procedName' id='firstItem' onClick={toggleOrder} >Procedimento</h3>
        {user && hasPrivileges === 'admin' && (
        <h3 className='userName'  onClick={toggleOrder} >Paciente</h3>
        )}
        <h3 className='DateHour' onClick={toggleOrder} >Data/Hora</h3>
        {user && hasPrivileges === 'admin' && (
        <h3 className='price' id='lastItem' onClick={toggleOrder}>Valor</h3>
        )}
      </div>
      <hr />
      <div className="agendamentos-container">
        {filteredAgendamentos.length > 0 ? (        
          <ul>
            {filteredAgendamentos.map(agendamento => (
              <li key={agendamento.id || agendamento._id} className="agendamento-item">
                <div className={`statusBall ${getStatusClass(agendamento.status)}`}>
                </div>
                <div className="nameAgendamento">
                  <h3>{agendamento.procedimento}</h3>
                </div>
                {user && hasPrivileges === 'admin' && (
                  <div className="pacienteAgendamento">
                    <h3>{agendamento.userName}</h3>
                  </div>
                )}
                <div className="dataAgendamento">
                  <h3>{formatarData(agendamento.date)} </h3>
                </div>
                <div className="HoraAgendamento">
                  <h4>as {formatarHorario(agendamento.horario)}Hrs</h4>
                </div>
                {user && hasPrivileges === 'admin' && (
                <div className="priceAgendamento">
                  <h4>R${agendamento.valor},00</h4>
                </div>
                                )}
                <div className="icons">
                  <img src={editBtn} alt="Editar" id='editBtn' onClick={() => openEditModal(agendamento)} />
                  {editModalOpen && selectedAgendamento && (
                    <EditAgendamentoModal  
                      agendamento={selectedAgendamento} 
                      onClose={() => setEditModalOpen(false)} 
                    />
                  )}
                  <button alt="Deletar" id='deleteBtn' onClick={() => openConfirmModal(agendamento.id || agendamento._id)} >Cancelar</button>
                  <ConfirmModal
                    isOpen={isConfirmModalOpen}
                    onConfirm={confirmDelete}
                    onCancel={() => setIsConfirmModalOpen(false)}
                  />
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div>
            <p>Não foram encontrados agendamentos para você.</p>
            <button onClick={fetchAgendamentos}>Tentar novamente</button>
          </div>
        )}
      </div>
      <AlertSystem error={error} success={success} />
      <Footer />
    </>
  );
};

export default Agendamentos;