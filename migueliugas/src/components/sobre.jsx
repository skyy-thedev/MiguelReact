import React from 'react';
import './styles/sobre.css';

const Sobre = () => {
    return (
        <section id="Sobre">   
            <div className="Container">
                <div className="foto" id="userpic">
                    
                </div>
                <div className="content" id="animatedtxt">
                    <div className="destaqueSobre">
                        <h1><strong>Dr. Miguel Iugas</strong></h1><br />
                        <h3>Farmacêutico  •  Saúde Integrativa</h3><br />
                    </div>
                    <div className="textoSobre">
                        <p><strong>Miguel Iugas</strong> é <strong>farmacêutico</strong>, formado pela <strong>Universidade São Francisco (USF)</strong> de Campinas, e desde 2016 é extremamente participante no mundo da <strong>longevidade</strong> e <strong>envelhecimento saudável</strong>. Participação essa, que têm como pilares: entender quais são as reais demandas dos pacientes, quais são suas causas de tais demandas e como tratá-los em sua integralidade.</p>
                        <p>Foi por muito tempo, <strong>propagandista</strong> de uma das maiores farmácias de manipulação do Brasil, onde aprendeu a desenvolver profissionais e fórmulas com o intuito de promover <strong>longevidade</strong> e um <strong>envelhecimento saudável</strong> ao paciente que buscasse o consultório de qualquer profissional atendido por ele.</p>
                        <p>Em Campinas e Vinhedo, foi o pioneiro a implementar o <strong>consultório farmacêutico</strong> de forma independente, conseguindo assim, exercer proteção, promoção e preservação da saúde do paciente que o procura, sempre utilizando métodos e conceitos aprendidos em suas especializações de <strong>farmácia clínica</strong>, <strong>farmácia estética</strong>, e <strong>fitoterapia</strong>.</p>
                        <p>Hoje, além do <strong>consultório</strong>, Miguel viaja o Brasil ensinando profissionais de saúde a como otimizar cada vez mais seus protocolos e como torná-los valorosos perante os olhos de seus pacientes. Bem como, forma através de suas aulas na pós-graduação de <strong>farmácia estética</strong> cada vez mais colegas de profissão que farão verdadeiramente a diferença na vida de um paciente.</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Sobre;