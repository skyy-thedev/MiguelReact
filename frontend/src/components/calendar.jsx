import React from 'react';

const Calendario = ({ onDateSelect, selectedDate }) => {
    const diasFuturos = [];
    const hoje = new Date();

    for (let i = 0; i < 7; i++) {
        const proximoDia = new Date(hoje);
        proximoDia.setDate(hoje.getDate() + i);
        diasFuturos.push(proximoDia);
    }

    const isSelectedDate = (date) => {
        // Verifica se selectedDate é uma instância de Date
        return selectedDate instanceof Date && selectedDate.toISOString() === date.toISOString();
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', overflow: 'scroll' }}>
            {diasFuturos.map((date) => (
                <div
                    className='datas'
                    key={date.toISOString()}
                    onClick={() => onDateSelect(date)}
                    style={{ backgroundColor: isSelectedDate ? '#022031' : '' , color: '#fff'}}
                >
                    {date.toLocaleDateString()}
                </div>
            ))}
        </div>
    );
};

export default Calendario;