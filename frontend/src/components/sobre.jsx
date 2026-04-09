import React, { useEffect, useRef } from 'react';
import './styles/sobre.css';

const Sobre = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('sobre--visible');
          }
        });
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="sobre" id="Sobre" ref={sectionRef}>
      <div className="sobre__container">
        <div className="sobre__photo" aria-label="Dr. Miguel Iugas" />

        <div className="sobre__content">
          <header className="sobre__header">
            <h2 className="sobre__name">Dr. Miguel Iugas</h2>
            <p className="sobre__role">Farmacêutico · Saúde Integrativa</p>
          </header>

          <div className="sobre__text">
            <p>
              <strong>Miguel Iugas</strong> é <strong>farmacêutico</strong>, formado pela{' '}
              <strong>Universidade São Francisco (USF)</strong> de Campinas, e desde 2016 é
              extremamente participante no mundo da <strong>longevidade</strong> e{' '}
              <strong>envelhecimento saudável</strong>. Participação essa, que têm como pilares:
              entender quais são as reais demandas dos pacientes, quais são suas causas e como
              tratá-los em sua integralidade.
            </p>
            <p>
              Foi por muito tempo <strong>propagandista</strong> de uma das maiores farmácias de
              manipulação do Brasil, onde aprendeu a desenvolver profissionais e fórmulas com o
              intuito de promover <strong>longevidade</strong> e um{' '}
              <strong>envelhecimento saudável</strong> ao paciente.
            </p>
            <p>
              Em Campinas e Vinhedo, foi o pioneiro a implementar o{' '}
              <strong>consultório farmacêutico</strong> de forma independente, exercendo proteção,
              promoção e preservação da saúde, utilizando métodos de{' '}
              <strong>farmácia clínica</strong>, <strong>farmácia estética</strong> e{' '}
              <strong>fitoterapia</strong>.
            </p>
            <p>
              Hoje, além do <strong>consultório</strong>, Miguel viaja o Brasil ensinando
              profissionais de saúde a otimizar seus protocolos e forma, através de suas aulas na
              pós-graduação de <strong>farmácia estética</strong>, colegas de profissão que farão a
              diferença na vida de cada paciente.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Sobre;