import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../components/AuthContext';
import AlertSystem from '../components/alerts/alertSystem';
import useAlert from '../components/alerts/useAlert';
import Header from '../components/header.jsx';
import Footer from '../components/footer.jsx';
import HeroSlider from '../components/heroSlider.jsx';
import ScheduleModal from '../components/ScheduleModal';
import '../components/styles/dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const { hasPrivileges } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [agendamentos, setAgendamentos] = useState([]);
  const { error, success, showError, showSuccess } = useAlert();
  const baseURL = process.env.REACT_APP_API_BASE_URL;

  const dataAtual = (mostrarMes = false) => {
    const hoje = new Date();
    const dia = String(hoje.getDate()).padStart(2, '0');
  
    const meses = [
      "janeiro", "fevereiro", "março", "abril", "maio", "junho",
      "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"
    ];
  
    const mes = meses[hoje.getMonth()];
  
    // Se mostrarMes for true, retorna apenas o mês
    if (mostrarMes) {
      return mes.charAt(0).toUpperCase() + mes.slice(1);  // Exibe o mês com a primeira letra maiúscula
    }
  
    // Caso contrário, retorna o dia e o mês juntos
    return `${dia} de ${mes.charAt(0).toUpperCase() + mes.slice(1)}`;
  };
  
  
  console.log(dataAtual()); // Exemplo de saída: "06/11/2024"
  

  const formatarData = (dataString) => {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR');
  };

  const fetchAgendamentos = useCallback(async () => {
    try {
      const response = await fetch(`${baseURL}/api/agendamentos/agendamentos`);
      const data = await response.json();
      const filteredAgendamentos = hasPrivileges() === 'admin' ? data : data.filter(agendamento => agendamento.userName === user.name);
      setAgendamentos(filteredAgendamentos);
      const sortedAgendamentos = filteredAgendamentos.sort((a, b) => {
        const dateB = new Date(b.date);
        const dateA = new Date(a.date);

        return dateB - dateA; // Ordena de forma decrescente
      });

      setAgendamentos(sortedAgendamentos);
      if (sortedAgendamentos.length === 0) showError("Não foram encontrados agendamentos para você.");
    } catch (error) {
      showError("Erro ao buscar agendamentos. Tente novamente mais tarde.");
    }
  }, [user, hasPrivileges]);

  useEffect(() => {
    if (user) fetchAgendamentos();
  }, [fetchAgendamentos, user]);

  const totalActiveAppointments = () => {
    // Contagem simples dos agendamentos existentes
    return agendamentos.length;
  };

    // Função para calcular o número de cancelamentos e reagendamentos
  const calculateCancellationsAndReschedules = () => {
    const canceledAppointments = agendamentos.filter(
      (agendamento) => agendamento.status === 'Cancelado' || agendamento.status === 'Reagendado'
    );
    return canceledAppointments.length;
  };

  const calculateOccupancyRate = () => {
    // Filtra agendamentos com status "Ativo" ou "Reagendado"
    const activeAppointments = agendamentos.filter(agendamento =>
      agendamento.status === "Ativo" || agendamento.status === "Reagendado"
    );
    
    const slotsPerDay = 17; // Total de intervalos de 30 minutos disponíveis por dia (9h às 12h30 + 13h30 às 17h30)
    const totalSlots = slotsPerDay * new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate(); // Total de slots no mês
  
    // Vamos criar um array que irá representar todos os slots de 30 minutos em um mês
    const slotsOccupied = new Array(totalSlots).fill(false); // Inicializa todos os slots como livres
    
    activeAppointments.forEach(agendamento => {
      const startTime = new Date(agendamento.date); // Hora de início do agendamento
      const startSlot = calculateSlotIndex(startTime); // Calcula o índice do slot correspondente ao início do agendamento
      
      // Marca os slots ocupados pela consulta de 1h30min
      for (let i = 0; i < 3; i++) { // 3 slots de 30 minutos
        slotsOccupied[startSlot + i] = true;
      }
    });
  
    // Conta os slots ocupados
    const occupiedSlots = slotsOccupied.filter(isOccupied => isOccupied).length;
  
    // Calcula a taxa de ocupação
    const occupancyRate = (occupiedSlots / totalSlots) * 100;
    
    return occupancyRate.toFixed(2); // Retorna a taxa de ocupação em porcentagem
  };
  
  // Função para calcular o índice do slot de 30 minutos com base no horário de início do agendamento
  const calculateSlotIndex = (startTime) => {
    const startHour = startTime.getHours();
    const startMinutes = startTime.getMinutes();
    
    // Calcula o índice do slot no período de 9h às 12h30 e 13h30 às 17h30
    if (startHour >= 9 && startHour < 12) {
      return (startHour - 9) * 2 + Math.floor(startMinutes / 30); // Intervalos entre 9h e 12h30
    } else if (startHour >= 13 && startHour < 17) {
      return (startHour - 13 + 3) * 2 + Math.floor(startMinutes / 30); // Intervalos entre 13h30 e 17h30
    }
    return -1; // Retorna -1 se o horário não for válido
  };
  
  const calculateDailyOccupancyRate = () => {
    const hoje = new Date();
    const diaHoje = hoje.getDate(); // Data de hoje
    const slotsPerDay = 17; // Total de intervalos de 30 minutos disponíveis por dia (9h às 12h30 + 13h30 às 17h30)
    const slotsOcupados = new Array(slotsPerDay).fill(false); // Array para marcar slots ocupados
    
    // Filtra os agendamentos do dia de hoje que não estão cancelados ou expirados
    const agendamentosHoje = agendamentos.filter(agendamento => {
      const dataAgendamento = new Date(agendamento.date);
      return (
        dataAgendamento.getDate() === diaHoje && // Verifica se o agendamento é para hoje
        dataAgendamento.getMonth() === hoje.getMonth() && // Verifica se o agendamento é do mês atual
        dataAgendamento.getFullYear() === hoje.getFullYear() && // Verifica se o agendamento é do ano atual
        agendamento.status !== 'Cancelado' && 
        agendamento.status !== 'Expirado'
      );
    });
    
    agendamentosHoje.forEach(agendamento => {
      const startTime = new Date(agendamento.date); // Hora de início do agendamento
      const startSlot = calculateSlotIndex(startTime); // Calcula o índice do slot correspondente ao início do agendamento
      
      // Marca os slots ocupados pela consulta de 1h30min (3 slots de 30 minutos)
      for (let i = 0; i < 3; i++) {
        slotsOcupados[startSlot + i] = true;
      }
    });
    
    // Conta os slots ocupados
    const occupiedSlots = slotsOcupados.filter(isOccupied => isOccupied).length;
    
    // Calcula a taxa de ocupação do dia
    const taxaOcupacao = (occupiedSlots / slotsPerDay) * 100;
    
    // Retorna a taxa de ocupação do dia em porcentagem
    return taxaOcupacao.toFixed(2); // A taxa de ocupação do dia em porcentagem com duas casas decimais
  };  
  
  const calculateWeeklyOccupancyRate = () => {
    const hoje = new Date();
    const diaSemana = hoje.getDay(); // 0 (domingo) até 6 (sábado)
    const diasNaSemana = 7; // Uma semana tem 7 dias
    const slotsPerDay = 17; // Total de intervalos de 30 minutos disponíveis por dia (9h às 12h30 + 13h30 às 17h30)
    
    // Calcula os slots disponíveis na semana inteira
    const slotsDisponiveisSemana = slotsPerDay * diasNaSemana;
    
    // Cria um array representando os slots de 30 minutos da semana inteira
    const slotsOcupados = new Array(slotsDisponiveisSemana).fill(false);
    
    // Calcula a data do início e do fim da semana
    const inicioSemana = new Date(hoje);
    inicioSemana.setDate(hoje.getDate() - diaSemana); // Ajusta para o domingo da semana atual
    inicioSemana.setHours(0, 0, 0, 0); // Zera a hora
    
    const fimSemana = new Date(inicioSemana);
    fimSemana.setDate(inicioSemana.getDate() + diasNaSemana - 1); // Vai até o sábado
    fimSemana.setHours(23, 59, 59, 999); // Zera os milissegundos
  
    // Filtra os agendamentos da semana atual (sem contar com "Cancelado" ou "Expirado")
    const agendamentosSemana = agendamentos.filter(agendamento => {
      const dataAgendamento = new Date(agendamento.date);
      return (
        dataAgendamento >= inicioSemana &&
        dataAgendamento <= fimSemana &&
        agendamento.status !== 'Cancelado' &&
        agendamento.status !== 'Expirado'
      );
    });
  
    agendamentosSemana.forEach(agendamento => {
      const startTime = new Date(agendamento.date); // Hora de início do agendamento
      const startSlot = calculateSlotIndex(startTime); // Calcula o índice do slot correspondente ao início do agendamento
      
      // Marca os slots ocupados pela consulta de 1h30min (3 slots de 30 minutos)
      for (let i = 0; i < 3; i++) {
        slotsOcupados[startSlot + i] = true;
      }
    });
  
    // Conta os slots ocupados
    const occupiedSlots = slotsOcupados.filter(isOccupied => isOccupied).length;
    
    // Calcula a taxa de ocupação da semana
    const taxaOcupacao = (occupiedSlots / slotsDisponiveisSemana) * 100;
  
    // Retorna a taxa de ocupação da semana em porcentagem
    return taxaOcupacao.toFixed(2); // A taxa de ocupação em porcentagem com duas casas decimais
  };  
  
  const calcularValorConsultas = () => {
    const hoje = new Date();
    const proximaData  = new Date();
    proximaData.setDate(hoje.getDate() + 30);

    // Filtra agendamentos dentro dos próximos 30 dias
    const agendamentosFuturos = agendamentos.filter(agendamento => {
      const agendamentoData  = new Date(agendamento.date);
      return (
        agendamentoData >= hoje &&
        agendamentoData <= proximaData &&
        (agendamento.status === "Ativo" || agendamento.status === "Expirado" || agendamento.status === "Reagendado")
      );
    });

    // Calcula o valor total das consultas nos próximos 30 dias
    const valorTotal = agendamentosFuturos.reduce((acc, agendamento) => acc + agendamento.valor, 0);
    return valorTotal;
  };

  const calcularNovasConsultas = () => {
    const hoje = new Date();
    const seteDiasDepois = new Date();
    seteDiasDepois.setDate(hoje.getDate() + 7);
  
    // Filtra os agendamentos que ocorrem nos próximos 7 dias e que ainda não aconteceram
    const novasConsultas = agendamentos.filter(agendamento => {
      const dataAgendamento = new Date(agendamento.date);
      return dataAgendamento >= hoje && dataAgendamento <= seteDiasDepois;
    });
  
    // Retorna o número de novas consultas agendadas
    return novasConsultas.length;
  };

  const calcularConsultasHoje = () => {
    const hoje = new Date();
  
    // Filtra os agendamentos que ocorrem no dia de hoje
    const consultasHoje = agendamentos.filter(agendamento => {
      const dataAgendamento = new Date(agendamento.date);
      return (
        dataAgendamento.getDate() === hoje.getDate() &&
        dataAgendamento.getMonth() === hoje.getMonth() &&
        dataAgendamento.getFullYear() === hoje.getFullYear()
      );
    });
  
    // Retorna o número de consultas agendadas para hoje
    return consultasHoje.length;
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

  const filteredAgendamentos = agendamentos
  .filter(agendamento =>
    agendamento.procedimento?.toLowerCase().includes(searchTerm.toLowerCase())
  )
  .sort((b, a) => new Date(b.date) - new Date(a.date)); // Ordena do mais recente ao mais antigo

  return (
    <>
      <Header />
      <div className="container">
        <div id="leftItems">
          <h2>Bem-vindo, {user.name}!</h2>
          <button id="newAgendamentoBtn" onClick={() => setIsModalOpen(true)}>Novo Agendamento</button>
          <ScheduleModal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)} />
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
      {user && hasPrivileges() === 'admin' && (  
        <div className="adminDashboard">
          <div className="statsContainer">
          <div className="statBox" >
              <h4>Consultas para Hoje</h4>
              <p>{calcularConsultasHoje()}</p>
            </div>
            <div className="statBox" >
              <h4>Cancelamentos/ <br/> Reagendamentos</h4>
              <p>{calculateCancellationsAndReschedules()}</p>
            </div>
            <div className="statBox" >
              <h4>Novas Consultas Essa Semana</h4>
              <p>{calcularNovasConsultas()}</p>
            </div>
            <div className="statBox">
              <h4>Total de Agendamentos</h4>
              <p>{agendamentos.length}</p>
            </div>
            <div className="statBox" >
              <h4>Faturamento Mensal</h4>
              <p>R${calcularValorConsultas().toFixed(2)}</p>
            </div>
            <div className="statBox" >
                <h4>Horários Ocupados Hoje</h4>
                <p>{calculateDailyOccupancyRate()}%</p>
            </div>
              <div className="statBox" >
                <h4>Horários Ocupados Mensal</h4>
                <p>{calculateOccupancyRate()}%</p>
            </div>
            <div className="statBox" >
                <h4>Horários Ocupados Semanal</h4>
                <p>{calculateWeeklyOccupancyRate()}%</p>
            </div>
          </div>
          <div className='infoBox'>
            <div className="infoItem">
              <i className="fas fa-calendar-day icon"></i> 
              <h3>Olá chefe, hoje é {dataAtual()}</h3>
            </div>
            <div className="infoItem">
              <i className="fas fa-calendar-check icon"></i>
              <h3>Você tem {calcularConsultasHoje()} consultas agendadas para hoje.</h3>
            </div>
            <div className="infoItem">
              <i className="fas fa-calendar-check icon"></i>
              <h3>Você tem {totalActiveAppointments()} consultas agendadas este mês.</h3>
            </div>
            <div className="infoItem">
              <i className="fas fa-calendar-plus icon"></i>
              <h3>Você tem {calcularNovasConsultas()} novas consultas agendadas essa semana.</h3>
            </div>
            <div className="infoItem">
              <i className="fas fa-sync-alt icon"></i>
              <h3>{calculateCancellationsAndReschedules()} de suas consultas foram reagendadas ou canceladas.</h3>
            </div>
            <div className="infoItem">
              <i className="fas fa-chart-bar icon"></i>
              <h3>{calculateDailyOccupancyRate()}% dos horários disponíveis hoje já foram ocupados.</h3>
            </div>
            <div className="infoItem">
              <i className="fas fa-chart-line icon"></i>
              <h3>{calculateWeeklyOccupancyRate()}% dos horários disponíveis na semana já foram ocupados.</h3>
            </div>
            <div className="infoItem">
              <i className="fas fa-chart-pie icon"></i>
              <h3>{calculateOccupancyRate()}% dos horários disponíveis no mês de {dataAtual(true)} já foram ocupados.</h3>
            </div>
            <div className="infoItem">
              <i className="fas fa-dollar-sign icon" id='dollar'></i>
              <h3>Se tudo ocorrer como esperado, suas consultas esse mês te renderão R${calcularValorConsultas().toFixed(2)}.</h3>
            </div>
          </div>
        </div>
      )}
      <hr />
      <div className='agendamentodash'>
        <h3>O seu próximo agendamento é:</h3>
      </div>
      <div className="agendaContent">
            {filteredAgendamentos.length > 0 ? (
              <div className="agendamentoList">
                {filteredAgendamentos.map(agendamento => (
                  <div key={agendamento.id || agendamento._id} className="agendamento-itemDash">
                    <div className={`statusBolinha ${getStatusClass(agendamento.status)}`}></div>
                    <div className="nameAgendamentoDash">
                      <h3>{agendamento.procedimento}</h3>
                    </div>
                    {user && hasPrivileges() === 'admin' && (
                      <div className="pacienteAgendamento">
                        <h3>Paciente: <br /> {agendamento.userName}</h3>
                        <h3>Status: <br/> {agendamento.status}</h3>
                      </div>
                    )}
                    <div className="contentInferior">
                      <div className="dataAgendamentoDash">
                        <i className="fas fa-calendar-alt icon"></i>
                        <h3>{formatarData(agendamento.date)}</h3>
                      </div>
                      <div className="HoraAgendamentoDash">
                        <i className="fas fa-clock icon"></i>
                        <h4>às {agendamento.horario} Hrs</h4>
                      </div>
                      <div className="priceAgendamentoDash">
                        <i className="fas fa-dollar-sign icon"></i>
                        <h4>R${agendamento.valor},00</h4>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
        ) : (
          <p>Não foram encontrados agendamentos para você.</p>
        )}
      </div>
      <AlertSystem error={error} success={success} />
      {user && hasPrivileges() !== 'admin' && (
        <HeroSlider />
      )}
      <Footer />
    </>
  );
};

export default Dashboard;