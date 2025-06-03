import React, { useState } from 'react';

const CreateProcedureModal = ({ isOpen, onRequestClose }) => {
  const [procedureName, setProcedureName] = useState('');
  const [procedureValue, setProcedureValue] = useState('');
  const [procedureDescription, setprocedureDescription] = useState('');

  const handleCreateProcedure = async () => {
    if (!procedureName || !procedureValue || !procedureDescription) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    try {
      // Aqui você deve implementar a lógica para inserir o procedimento no banco de dados
      await insertProcedure(procedureName, procedureValue, procedureDescription);
      
      // Limpar os campos após a inserção
      setProcedureName('');
      setProcedureValue('');
      setprocedureDescription('');
      
      // Fechar o modal após a inserção
      onRequestClose();
    } catch (error) {
      console.error("Erro ao criar procedimento:", error);
      alert("Erro ao criar procedimento.");
    }
  };

  const insertProcedure = async (nome, valor) => {
    // Implementar a lógica de inserção no banco de dados
    // Exemplo utilizando fetch para um endpoint da API
    const response = await fetch('http://localhost:5000/api/procedures', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nome, valor }),
    });

    if (!response.ok) {
      throw new Error('Erro ao inserir o procedimento');
    }

    return response.json(); // Retorna a resposta em JSON, se necessário
  };

  return (
    isOpen && (
            <div className='edit-modal' >
                <div className='modal-header'>
                        <h2>Criar Procedimento</h2>
                        <div className='procedures-grid'>
                            <label>
                            Nome do Procedimento:
                            <input
                            type="text"
                            value={procedureName}
                            placeholder='Nome'
                            onChange={(e) => setProcedureName(e.target.value)}
                            />
                        </label>
                        <label>
                            Descrição:
                            <input
                            type="text"
                            value={procedureDescription}
                            placeholder='Descrição'
                            onChange={(e) => setprocedureDescription(e.target.value)}
                            />
                        </label>
                        <label>
                            Valor do Procedimento:
                            <input
                            type="number"
                            value={procedureValue}
                            placeholder='R$ ?'
                            onChange={(e) => setProcedureValue(e.target.value)}
                            />
                        </label>
                        </div>
                </div>
                <div className='bottomBtns'>
                    <button id='confirmBtn' onClick={onRequestClose}>Cancelar</button>
                    <button id='confirmBtn' onClick={handleCreateProcedure}>Confirmar</button>
                </div>
            </div>
    )
  );
};

export default CreateProcedureModal;