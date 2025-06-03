import React, { useState, useEffect } from 'react';
import AlertSystem from '../alerts/alertSystem';
import useAlert from '../alerts/useAlert';

const EditAgendamentoModal = ({ agendamento, onClose }) => {
  const [data, setData] = useState(agendamento.date);
  const [horario, setHorario] = useState(agendamento.horario);
  const { error, success, showError, showSuccess } = useAlert();

  useEffect(() => {
    if (agendamento) {
      setData(agendamento.date.split('T')[0]);
      setHorario(agendamento.horario.split(':')[0] + ':00');
    }
  }, [agendamento]);

  const handleHorarioChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,2}:\d{0,2}$/.test(value)) {
      const parts = value.split(':');
      if (parseInt(parts[0], 10) > 23) {
        return;
      }
      setHorario(value);
    }
  };


  const handleUpdate = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/agendamentos/${agendamento._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: data,
          horario: horario,
          status: 'Reagendado'
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao atualizar agendamento');
      }

      const result = await response.json();
      const successMessage = typeof result.message === 'string' ? result.message : 'Atualização realizada com sucesso!';
      
      showSuccess(successMessage);
      onClose(); // Fechar modal

      // Atualização da página após 3 segundos
      setTimeout(() => {
        window.location.reload();
      }, 3000);
      
    } catch (error) {
      console.error('Erro ao atualizar agendamento:', error);
      showError('Erro ao atualizar agendamento');
    }
  };

  return (

    <>
      <div className='editModalOverlay'>
      <div className='editModalContent'>
        <h2>Editar Agendamento</h2>
        
        <div>
          <label>
            Data:
            <input id='leftInput' type="date" value={data} onChange={(e) => setData(e.target.value)} />
          </label>

          <label>
            Horário:
            <input
              id='rightInput' 
              type="time" 
              value={horario} 
              onChange={handleHorarioChange} 
              placeholder="HH:MM"
            />
          </label>
        </div>

        <button id='delBtn' onClick={handleUpdate}>Confirmar Alteração</button>
        <button id='delBtn' onClick={onClose}>Cancelar</button>
      </div>
    </div>
    <AlertSystem error={error} success={success} />
    </>
    
  );
};

export default EditAgendamentoModal;