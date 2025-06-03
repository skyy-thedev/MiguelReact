import React, { useState, useEffect } from "react";
import { useAuth } from '../components/AuthContext';
import AlertSystem from '../components/alerts/alertSystem';
import useAlert from '../components/alerts/useAlert';
import editBtn from '../assets/icons/edit.png';
import deleteBtn from '../assets/icons/delete.png';
import CreateProcedureModal from './modals/createProcedModal';
import ConfirmModal from "./confirmModal";
import axios from 'axios';

const ScreenProced = ({ searchTerm, procedimentos, setProcedimentos }) => {
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const { error, success, showError, showSuccess } = useAlert();
    const [procedimentoNome, setProcedimentoNome] = useState(null); // Usar nome do procedimento
    const { user, hasPrivileges } = useAuth();

    const confirmDelete = async () => {
        if (!procedimentoNome) return; // Verifica se procedimentoNome está definido
      
        try {
            const response = await fetch(`http://localhost:5000/api/procedures/${encodeURIComponent(procedimentoNome)}`, { // Endpoint alterado para buscar pelo nome
                method: 'DELETE',
            });
      
            if (!response.ok) {
                throw new Error('Erro ao excluir procedimento');
            }
      
            setProcedimentos(prevProcedimentos =>
                prevProcedimentos.filter(proc => proc.nome !== procedimentoNome) // Filtra com base no nome do procedimento
            );
      
            showSuccess('Procedimento excluído com sucesso!');
        } catch (error) {
            console.error("Erro ao cancelar procedimento:", error);
            showError('Erro ao cancelar procedimento');
        } finally {
            setIsConfirmModalOpen(false);
        }
    };

    const openConfirmModal = (nome) => { // Alterado para usar nome
        setProcedimentoNome(nome); // Define o nome do procedimento para exclusão
        setIsConfirmModalOpen(true);
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
                        {user && hasPrivileges() === 'admin' && (
                        <div className="valorProced">
                            <h4>R${proc.valor},00</h4>
                        </div>
                        )}
                        {user && hasPrivileges() === 'admin' && (
                        <div className="icons">
                            <img src={editBtn} alt="Editar" onClick={() => handleEdit(proc.id)} style={{ cursor: 'pointer', marginRight: '10px' }} />
                            <img src={deleteBtn} alt="Deletar" onClick={() => openConfirmModal(proc.nome)} style={{ cursor: 'pointer', color: 'red' }} /> {/* Passa o nome */}
                            <ConfirmModal
                                isOpen={isConfirmModalOpen}
                                onConfirm={confirmDelete}
                                onCancel={() => setIsConfirmModalOpen(false)}
                            />
                        </div>
                        )}
                    </li>
                ))}
            </ul>
            <hr />
            <AlertSystem error={error} success={success} />
        </div>
    );
};

const AgendamentoProced = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [procedimentos, setProcedimentos] = useState([]);
    const { user, hasPrivileges } = useAuth();

    const fetchProcedimentos = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/users/procedures');
            setProcedimentos(response.data);
        } catch (error) {
            console.error('Erro ao buscar procedimentos:', error);
        }
    };

    useEffect(() => {
        fetchProcedimentos();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        setSearchTerm(e.target.value);
    };

    return (
        <>
            <div className="container"> 
                <div id="leftItems">
                    <h2>Procedimentos</h2>
                    {user && hasPrivileges() === 'admin' && (
                    <button id="newProcedbtn" onClick={() => setIsModalOpen(true)}>Novo Procedimento</button>
                )}
                    <CreateProcedureModal
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
                {user && hasPrivileges() === 'admin' && (
                <h3 id="price">Valor</h3>
            )}
            </div>
            <hr />
            <ScreenProced searchTerm={searchTerm} procedimentos={procedimentos} setProcedimentos={setProcedimentos} />
        </>
    );
};

export default AgendamentoProced;