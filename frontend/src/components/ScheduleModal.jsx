import React, { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthContext';
import AlertSystem from '../components/alerts/alertSystem';
import useAlert from '../components/alerts/useAlert';
import axios from 'axios';
import exitIcon from '../assets/icons/exit.png';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './styles/scheduleModal.css';

const AgendamentoModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const { user } = useAuth();
  const { error, success, showError, showSuccess } = useAlert();
  const [procedures, setProcedures] = useState([]);
  const [appointmentDetails, setAppointmentDetails] = useState({
    procedimento: '',
    date: '',
    horario: '',
    userName: '',
    valor: '',
    status: 'Ativo',
  });
  const [recommendedAppointments, setRecommendedAppointments] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [loadingTimes, setLoadingTimes] = useState(false); // Indica carregamento de horários

  useEffect(() => {
    const fetchProcedures = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/procedures');
        if (response.status === 200) {
          setProcedures(response.data);
        } else {
          showError('Erro ao carregar procedimentos.');
        }
      } catch (error) {
        console.error('Erro ao buscar procedimentos:', error);
        showError('Erro ao carregar procedimentos.');
      }
    };
    if (isOpen) {
      fetchProcedures();
    }
  }, [isOpen, showError]);

  const fetchRecommendedAppointments = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/recomendacoes');
      if (response.status === 200) {
        setRecommendedAppointments(response.data);
      }
    } catch (error) {
      console.error('Erro ao obter recomendações:', error);
    }
  };

  useEffect(() => {
    if (step === 2) {
      fetchRecommendedAppointments();
    }
  }, [step]);

  const handleServiceSelect = (procedimento) => {
    const selectedProcedure = procedures.find((proc) => proc.nome === procedimento);
    setAppointmentDetails((prev) => ({
      ...prev,
      procedimento,
      valor: selectedProcedure?.valor || '', // Atribui o valor do procedimento
      userName: user?.name || '', // Atribui o nome do usuário
    }));
    setStep(2);
  };

  const handleDateSelect = (date) => {
    setAppointmentDetails((prev) => ({ ...prev, date }));
    fetchAvailableTimes(date);
  };

  const fetchAvailableTimes = async (date) => {
    try {
      setLoadingTimes(true); // Inicia carregamento
      const formattedDate = date.toISOString().split('T')[0];
      const response = await axios.get('http://localhost:5000/api/horarios-disponiveis', {
        params: { date: formattedDate, procedure: appointmentDetails.procedimento }
      });
      if (response.status === 200) {
        setAvailableTimes(response.data);
      }
    } catch (error) {
      console.error('Erro ao buscar horários disponíveis:', error);
      showError('Erro ao buscar horários disponíveis.');
    } finally {
      setLoadingTimes(false); // Conclui carregamento
    }
  };

  const handleTimeSelect = (horario) => {
    setAppointmentDetails((prev) => ({ ...prev, horario }));
    setStep(3);
  };

  const criarAgendamentoAPI = async (appointmentDetails) => {
    try {
      console.log("Dados enviados para a API:", appointmentDetails);
      const response = await axios.post('http://localhost:5000/api/agendamentos', appointmentDetails);
  
      console.log("Resposta da API:", response.data); // Verifica o conteúdo da resposta
  
      // Verifica se a mensagem de sucesso está presente na resposta
      if (response.data.message === 'Agendamento criado com sucesso') {
        return { success: true };
      } else {
        return { success: false, error: 'Erro ao agendar. Tente novamente.' };
      }
    } catch (error) {
      console.error('Erro na API de agendamento:', error);
      return { success: false, error: error.message };
    }
  };
  
  const handleSubmit = async () => {
    try {
      showSuccess('Aguarde...');
      const response = await criarAgendamentoAPI(appointmentDetails);
  
      if (response.success) {
        showSuccess('Agendamento concluído com sucesso!');
        // Fecha o modal e atualiza a página
        setTimeout(() => {
          window.location.reload(); // Atualiza a página para mostrar o agendamento atualizado
        }, 1500); // Delay opcional para o usuário ver a mensagem de sucesso
      } else {
        showError(response.error || 'Ocorreu um erro. Tente novamente.');
      }
    } catch (error) {
      showError('Erro no agendamento. Verifique os dados e tente novamente.');
    }
  };  

  const isSunday = (date) => date.getDay() === 0;

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    isOpen && (
      <div className="modal">
        <div className="modal-header">
          <h2>Agendamento</h2>
          <a href="/agendamentos"><img src={exitIcon} alt="Fechar" id='exitIcon'/></a>
        </div>
        <div className="modal-body">
          {step === 1 && (
            <div>
              <h3>Escolha o tipo de procedimento:</h3>
              <div className='procedures-grid'>
                {procedures.length > 0 ? (
                  procedures.map((procedure) => (
                    <button key={procedure.id} onClick={() => handleServiceSelect(procedure.nome)}>
                      {procedure.nome}
                    </button>
                  ))
                ) : (
                  <p>Carregando serviços...</p>
                )}
              </div>
            </div>
          )}
          {step === 2 && (
            <div>
              <h3>Selecione Data e Horário</h3>
                <h4>Datas Recomendadas</h4>
                <div className='dates-grid'>
                {recommendedAppointments.map((appointment, index) => (
                  <button key={index} onClick={() => handleDateSelect(new Date(appointment.date))}>
                    {new Date(appointment.date).toLocaleDateString()} - {appointment.horario}
                  </button>
                ))}
              </div>
              <h4>Ou selecione uma data:</h4>
              <DatePicker
                selected={appointmentDetails.date}
                onChange={(date) => handleDateSelect(date)}
                filterDate={(date) => !isSunday(date)}
                dateFormat="dd/MM/yyyy"
                placeholderText='Selecione uma data específica'
                id='datePicker'
              />
              <div className='times-grid'>
                <h4>Horários Disponíveis</h4>
                <div>
                {loadingTimes ? (
                  <p>Carregando horários...</p>
                ) : (
                  availableTimes.map((horario, idx) => (
                    <button key={idx} onClick={() => handleTimeSelect(horario)}>
                      {horario}
                    </button>
                  ))
                )}
                </div>
              </div>
            </div>
          )}
          {step === 3 && (
            <div className='details-div'>
              <div className='details-agendamento'>
                <h3>Confirme os Detalhes</h3>
                <p>Serviço: {appointmentDetails.procedimento}</p>
                <p>Data: {new Date(appointmentDetails.date).toLocaleDateString()}</p>
                <p>Horário: {appointmentDetails.horario}</p>
                <p>Paciente: {user.name}</p>
              </div>
              <button onClick={handleSubmit}>Confirmar Agendamento</button>
            </div>
          )}
        </div>
        <div className="modal-footer">
          {step > 1 && (
            <button onClick={handleBack} id='backBtn'>Voltar</button>
          )}
        </div>
        <AlertSystem error={error} success={success} />
      </div>
    )
  );
};

export default AgendamentoModal;