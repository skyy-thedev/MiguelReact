import React, { useState, useEffect } from "react";
import editBtn from '../assets/icons/edit.png';
import deleteBtn from '../assets/icons/delete.png';
import ScheduleModal from './ScheduleModal';
import axios from 'axios'; // Importando axios para fazer a chamada à API

const ScreenProced = ({ searchTerm, procedimentos, setProcedimentos }) => {
    const handleDelete = (id) => {
        setProcedimentos(procedimentos.filter(proc => proc.id !== id));
    };

    const handleEdit = (id) => {
        const procedimentoParaEditar = procedimentos.find(proc => proc.id === id);
        alert(`Editando: ${procedimentoParaEditar.nome}`);
    };

    const filteredProcedimentos = procedimentos.filter(proc =>
        proc.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="procedimentos-container">
            <ul>
                {filteredProcedimentos.map(proc => (
                    <li key={proc.id} className="procedimento-item">
                        <div className="nameProced">
                            <h3>{proc.nome}</h3>
                        </div>
                        <div className="valorProced">
                            <h4>R${proc.valor},00</h4>
                        </div>
                        <div className="icons">
                            <img src={editBtn} alt="Editar" onClick={() => handleEdit(proc.id)} style={{ cursor: 'pointer', marginRight: '10px' }} />
                            <img src={deleteBtn} alt="Deletar" onClick={() => handleDelete(proc.id)} style={{ cursor: 'pointer', color: 'red' }} />
                        </div>
                    </li>
                ))}
            </ul>
            <hr />
        </div>
    );
};

const AgendamentoProced = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [procedimentos, setProcedimentos] = useState([]);

    // Função para buscar procedimentos da API
    const fetchProcedimentos = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/users/procedures');
            setProcedimentos(response.data); // Atualiza o estado com os dados recebidos
        } catch (error) {
            console.error('Erro ao buscar procedimentos:', error);
        }
    };

    // useEffect para chamar a função ao montar o componente
    useEffect(() => {
        fetchProcedimentos();
    }, []); // O array vazio garante que isso seja executado apenas uma vez ao montar

    const handleSearch = (e) => {
        e.preventDefault();
        setSearchTerm(e.target.value);
    };

    return (
        <>
            <div className="container"> 
                <div id="leftItems">
                    <h2>Procedimentos</h2>
                    <button id="newProcedbtn" onClick={() => setIsModalOpen(true)}>Agendar Consulta</button>
                    <ScheduleModal
                        isOpen={isModalOpen}
                        onRequestClose={() => setIsModalOpen(false)}
                        procedimentos={procedimentos}
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
                    <button id="filtrarBtn" type="submit" onClick={handleSearch}>Filtrar</button>
                </form>
            </div>
            <hr />
            <div className="container">
                <h3 id="txtproced">Procedimento</h3>
                <h3 id="price">Valor</h3>
            </div>
            <hr />
            <ScreenProced searchTerm={searchTerm} procedimentos={procedimentos} setProcedimentos={setProcedimentos} />
        </>
    );
};

export default AgendamentoProced;