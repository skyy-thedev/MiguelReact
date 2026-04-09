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
  const baseURL = process.env.REACT_APP_LOCAL_API_URL;
  const [procedures, setProcedures] = useState([]);
  const [appointmentDetails, setAppointmentDetails] = useState({
    procedimento: '',
    date: null,
    horario: '',
    userName: '',
    valor: '',
    status: 'Ativo',
  });
  const [recommendedAppointments, setRecommendedAppointments] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [loadingTimes, setLoadingTimes] = useState(false);

  useEffect(() => {
    const fetchProcedures = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/procedures`);
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
      const response = await axios.get(`${baseURL}/api/recomendacoes`);
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
      valor: selectedProcedure?.valor || '',
      userName: user?.name || '',
    }));
    setStep(2);
  };

  const handleDateSelect = (date) => {
    setAppointmentDetails((prev) => ({ ...prev, date }));
    fetchAvailableTimes(date);
  };

  const fetchAvailableTimes = async (date) => {
    try {
      setLoadingTimes(true);
      const formattedDate = date.toISOString().split('T')[0];
      const response = await axios.get(`${baseURL}/api/horariosdisponiveis`, {
        params: { date: formattedDate, procedure: appointmentDetails.procedimento }
      });
      if (response.status === 200) {
        setAvailableTimes(response.data);
      }
    } catch (error) {
      console.error('Erro ao buscar horários disponíveis:', error);
      showError('Erro ao buscar horários disponíveis.');
    } finally {
      setLoadingTimes(false);
    }
  };

  const handleTimeSelect = (horario) => {
    setAppointmentDetails((prev) => ({ ...prev, horario }));
    setStep(3);
  };

  const criarAgendamentoAPI = async (appointmentDetails) => {
    try {
      const response = await axios.post(`${baseURL}/api/agendamentos`, appointmentDetails);
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
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        showError(response.error || 'Ocorreu um erro. Tente novamente.');
      }
    } catch (error) {
      showError('Erro no agendamento. Verifique os dados e tente novamente.');
    }
  };

  const isSunday = (date) => date.getDay() === 0;
  const handleBack = () => step > 1 && setStep(step - 1);

  return (
    isOpen && (
      <div className="modal">
        <div className="modal-header">
          <h2>Agendamento</h2>
          <a href="/agendamentos"><img src={exitIcon} alt="Fechar" id='exitIcon' /></a>
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
                {recommendedAppointments.map((appointment) => (
                  <button
                    key={`${appointment.date}-${appointment.horario}`}
                    onClick={() => handleDateSelect(new Date(appointment.date))}
                  >
                    {new Date(appointment.date).toLocaleDateString()} - {appointment.horario}
                  </button>
                ))}
              </div>
              <h4>Ou selecione uma data:</h4>
              <DatePicker
                selected={appointmentDetails.date}
                onChange={handleDateSelect}
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
                      <button key={`${horario}-${idx}`} onClick={() => handleTimeSelect(horario)}>
                        {horario}
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h3>Confirme os dados:</h3>
              <p><strong>Procedimento:</strong> {appointmentDetails.procedimento}</p>
              <p><strong>Data:</strong> {appointmentDetails.date?.toLocaleDateString()}</p>
              <p><strong>Horário:</strong> {appointmentDetails.horario}</p>
              <p><strong>Valor:</strong> R$ {appointmentDetails.valor}</p>
              <div className='confirm-buttons'>
                <button onClick={handleBack}>Voltar</button>
                <button onClick={handleSubmit}>Confirmar</button>
              </div>
            </div>
          )}
        </div>
        {error && <AlertSystem type="error" message={error} />}
        {success && <AlertSystem type="success" message={success} />}
      </div>
    )
  );
};

export default AgendamentoModal;