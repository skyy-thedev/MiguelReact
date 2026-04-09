
// ROTA: Adicionar horários disponíveis para um procedimento em uma data
router.post('/horariosdisponiveis', async (req, res) => {
  const { nomeProcedimento, data, horariosDisponiveis } = req.body;

  if (!nomeProcedimento || !data || !Array.isArray(horariosDisponiveis)) {
    return res.status(400).json({ message: 'Dados inválidos' });
  }

  const dataFormatada = new Date(data).toISOString().slice(0, 10);

  try {
    const existente = await HorariosDisponiveis.findOne({ nomeProcedimento, data: dataFormatada });

    if (existente) {
      return res.status(400).json({ message: 'Horários já cadastrados para essa data e procedimento' });
    }

    const novo = new HorariosDisponiveis({
      nomeProcedimento,
      data: dataFormatada,
      horariosDisponiveis,
    });

    await novo.save();
    res.status(201).json({ message: 'Horários registrados com sucesso', horarios: novo });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao registrar horários', error: error.message });
  }
});

// ROTA: Consultar horários disponíveis para uma data e procedimento
router.get('/horariosdisponiveis', async (req, res) => {
  const { date, procedimento } = req.query;

  if (!date || !procedimento) {
    return res.status(400).json({ message: 'Data e procedimento são obrigatórios' });
  }

  const dataFormatada = new Date(date).toISOString().slice(0, 10);

  try {
    const registro = await HorariosDisponiveis.findOne({ nomeProcedimento: procedimento, data: dataFormatada });

    if (registro) {
      res.status(200).json(registro.horariosDisponiveis);
    } else {
      const horariosPadrao = [
        '09:00', '10:00', '10:30', '11:00', '11:30', '12:00',
        '12:30', '13:30', '14:00', '14:30', '15:00', '15:30',
        '16:00', '16:30', '17:00',
      ];
      res.status(200).json(horariosPadrao);
    }
  } catch (error) {
    console.error('Erro ao consultar horários disponíveis:', error);
    res.status(500).json({ message: 'Erro interno', error: error.message });
  }
});