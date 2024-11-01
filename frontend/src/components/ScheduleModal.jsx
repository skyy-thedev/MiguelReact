import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../components/AuthContext';
import Modal from 'react-modal';
import Calendario from './calendar';
import exitBtn from '../assets/icons/exit.png';
import leftArrow from '../assets/icons/left-arrow.png';
import rightArrow from '../assets/icons/right-arrow.png';
import axios from 'axios';
import './styles/modal.css'; 


const ScheduleModal = ({ isOpen, onRequestClose }) => {
    const { user } = useAuth();
    const [procedures, setProcedures] = useState([]);
    const [selectedProcedure, setSelectedProcedure] = useState(null);
    const [dataSelecionada, setDataSelecionada] = useState(null);
    const [availableTimes, setAvailableTimes] = useState([]);
    const [selectedTime, setSelectedTime] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const carouselRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    // Função para buscar os procedimentos da API
    const fetchProcedimentos = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/users/procedures');
            // Converte o valor para número
            const proceduresWithNumericValues = response.data.map(procedure => ({
                ...procedure,
                price: parseFloat(procedure.valor) || 0,
            }));
            setProcedures(proceduresWithNumericValues);
        } catch (error) {
            console.error('Erro ao buscar procedimentos:', error);
        }
    };


    // useEffect para chamar a função ao montar o componente
    useEffect(() => {
        fetchProcedimentos();
    }, []);

    // Seleciona o procedimento e define os horários disponíveis
    const handleProcedureSelect = (procedure, index) => {
        setSelectedProcedure(procedure);
        setSelectedIndex(index);
        scrollCarousel(index);

        const times = ["08:00", "09:00", "10:00", "11:00", "14:00", "15:00", "17:00"];
        setAvailableTimes(times);
        setSelectedTime(null);
    };

    // Rola o carrossel para o item selecionado
    const scrollCarousel = (index) => {
        if (carouselRef.current) {
            const scrollAmount = index * 450;
            carouselRef.current.scrollTo({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    const handleDateSelect = (date) => {
        setDataSelecionada(date);
    };

    const handleIndicatorClick = (index) => {
        scrollCarousel(index);
        setSelectedIndex(index);
    };

    // Funções de controle para arrastar o carrossel com o mouse
    const handleMouseDown = (e) => {
        if (!carouselRef.current) return; // Verificação de segurança
        setIsDragging(true);
        setStartX(e.pageX - carouselRef.current.offsetLeft);
        setScrollLeft(carouselRef.current.scrollLeft);
    };
    const handleMouseMove = (e) => {
        if (!isDragging || !carouselRef.current) return; // Verificação de segurança
        e.preventDefault();
        const x = e.pageX - carouselRef.current.offsetLeft;
        const walk = (x - startX) * 1.5;
        carouselRef.current.scrollLeft = scrollLeft - walk;
    };
    const handleMouseUp = () => setIsDragging(false);
    const handleMouseLeave = () => setIsDragging(false);

    // Define o horário selecionado e confirma o agendamento
    const handleTimeSelect = (time) => setSelectedTime(time);

    const handleConfirmSelect = async () => {
        if (selectedTime) {
            if (!selectedProcedure || !selectedProcedure.price) {
                console.error("Preço do procedimento não disponível.");
                return;
            }
            const agendamentoData = {
                procedimento: selectedProcedure.nome,
                userName: user.name,
                date: dataSelecionada.toISOString(),
                horario: selectedTime,
                valor: selectedProcedure.price,
            };

            console.log("Data being sent:", agendamentoData);

            try {
                const response = await fetch('http://localhost:5000/api/agendamentos/agendamento', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(agendamentoData),
                });
                console.log('Paciente:', user.name);
                console.log('Procedimento: ', selectedProcedure);
                console.log("Valor do serviço selecionado:", selectedProcedure.price);
                console.log('Data:', dataSelecionada);
                console.log('Horário:', selectedTime);

                if (!response.ok) throw new Error('Erro ao agendar');
                window.location.href = '/Agendamentos';
            } catch (error) {
                console.error('Erro ao confirmar o agendamento:', error);
                alert('Erro ao confirmar o agendamento. Tente novamente mais tarde.');
            }
        } else {
            alert('Por favor, selecione um horário antes de confirmar.');
        }
    };

    return (
        <Modal 
            isOpen={isOpen} 
            onRequestClose={onRequestClose} 
            appElement={document.getElementById('root')} 
            contentLabel="Agendar Consulta"
        >
            <div className='modal-overlay'>
                <div className='modal-content'>
                    <a href='/Procedimentos' onClick={onRequestClose}>
                        <img src={exitBtn} alt="Fechar" id="exitButtonTop" />
                    </a>
                    <h2>Selecione o Procedimento</h2>
                    <div 
                        className='carousel-container'
                        onMouseDown={handleMouseDown}
                        onMouseLeave={handleMouseLeave}
                        onMouseUp={handleMouseUp}
                        onMouseMove={handleMouseMove}
                    >
                        <img 
                            src={leftArrow} 
                            alt="Seta Esquerda" 
                            className='arrow left-arrow' 
                            onClick={() => handleIndicatorClick(Math.max(selectedIndex - 1, 0))} 
                        />
                        <div className='carousel-items' ref={carouselRef}>
                            {procedures.map((proc, index) => (
                                <div 
                                    key={proc.id || index}
                                    className={`carousel-item ${selectedProcedure && selectedProcedure.id === proc.id ? 'active' : ''}`} 
                                    onClick={() => handleProcedureSelect(proc, index)}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e) => e.key === 'Enter' && handleProcedureSelect(proc, index)} 
                                >
                                    <h3>{proc.nome}</h3>
                                    <h4>{proc.valor ? `R$ ${parseFloat(proc.valor).toFixed(2)}` : 'Valor não disponível'}</h4>
                                </div>
                            ))}
                        </div>
                        <img 
                            src={rightArrow} 
                            alt="Seta Direita" 
                            className='arrow right-arrow' 
                            onClick={() => handleIndicatorClick(Math.min(selectedIndex + 1, procedures.length - 1))} 
                        />
                    </div>

                    <div className='indicator-container'>
                        {procedures.map((_, index) => (
                            <span 
                                key={index}
                                className={`indicator ${index === selectedIndex ? 'active' : ''}`} 
                                onClick={() => handleIndicatorClick(index)}
                            ></span>
                        ))}
                    </div>
                </div>

                {selectedProcedure && (
                    <div className='modal-content' id='horarioDiv'>
                        <h3>Escolha uma Data para {selectedProcedure.nome}</h3>
                        <Calendario 
                        onDateSelect={handleDateSelect} selectedDate={handleDateSelect}
                        />
                        {dataSelecionada && (
                            <>
                                <h3>Horários Disponíveis para {dataSelecionada.toLocaleDateString()}</h3>
                                <ul>
                                    {availableTimes.map((time) => (
                                        <li key={time}>
                                            <button 
                                                id='timeBtn' 
                                                onClick={() => handleTimeSelect(time)}
                                                style={{ backgroundColor: selectedTime === time ? '#022031' : '#297D94' }}
                                            >
                                                {time}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                                <button 
                                    id='confirmBtn' 
                                    onClick={handleConfirmSelect}
                                >
                                    Confirmar Agendamento 
                                    Para: {user.name}
                                </button>
                            </>
                        )}
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default ScheduleModal;