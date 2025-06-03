import React from 'react';
import './styles/modal.css'

const ConfirmModal = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-confirmoverlay">
      <div className="modal-confirmcontent">
        <div className='textConfirmModal'>
          <h3>Confirmar Exclusão</h3>
          <p>Tem certeza de que deseja cancelar este agendamento?</p>
        </div>

        <div>
          <button id='delBtn' onClick={onConfirm}>Confirmar</button>
          <button id='delBtn' onClick={onCancel}>Voltar</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;