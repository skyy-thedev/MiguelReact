import React from 'react';
import './styles/locations.css'

const Locations = () => {
  const locations = [
    {
      title: 'Unidade Campinas Cambuí (CAM)',
      addressLines: [
        'Avenida Orosimbo Maia, 360 - 6º andar',
        'Vila Itapura',
        'Campinas/SP',
        '13010-211',
      ],
      mapSrc: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3675.40857791223!2d-47.064645688266836!3d-22.898296037482687!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94c8c8adcaf00001%3A0x9bae52c8409c8a50!2sAv.%20Orosimbo%20Maia%2C%20360%20-%206%C2%BA%20andar%20-%20Vila%20Mariana%2C%20Campinas%20-%20SP%2C%2004035-001!5e0!3m2!1spt-BR!2sbr!4v1706103694268!5m2!1spt-BR!2sbr',
    },
    {
      title: 'Unidade Vila Mariana (VMA)',
      addressLines: [
        'Rua Domingos de Morais, 2781 - 14º andar',
        'Vila Mariana',
        'São Paulo/SP',
        '04035-001',
      ],
      mapSrc: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3656.0959784935185!2d-46.63900428824684!3d-23.600890562958746!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce5a33fb8eae55%3A0xb6b0b2b56f51869!2sR.%20Domingos%20de%20Morais%2C%202781%20-%2014%C2%BA%20-%20Vila%20Mariana%2C%20S%C3%A3o%20Paulo%20-%20SP%2C%2004035-001!5e0!3m2!1spt-BR!2sbr!4v1706103723793!5m2!1spt-BR!2sbr',
    },
    {
      title: 'Unidade Alphaville (ALP)',
      addressLines: [
        'Alameda Grajaú, 98 - 18º Andar',
        'Alphaville Industrial',
        'Barueri/SP',
        '06454-050',
      ],
      mapSrc: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3658.9708517802264!2d-46.84873338824969!3d-23.497559359164637!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94cf0222c8b61a41%3A0x1c80b19f868076c!2sAlameda%20Graja%C3%BA%2C%2098%20-%2018%C2%BA%20-%20Alphaville%20Industrial%2C%20Barueri%20-%20SP%2C%2006450-050!5e0!3m2!1spt-BR!2sbr!4v1706103753793!5m2!1spt-BR!2sbr',
    },
  ];

  return (
      <div className="Containi Row">
        {locations.map((location, index) => (
          <div className="map" key={index}>
        <div className="maptitle" 
                style={{ 
                    fontSize: '1em', 
                    color: '#022031', 
                    textShadow: '1px 1px 2px #297D94',
                    marginBottom: '-10px', 
                    fontWeight: '200' 
                }}>
              <br />
              <h3>{location.title}</h3>
              <br />
              <div className="mapframe">
                <iframe
                  src={location.mapSrc}
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={location.title}
                />
              </div>
              <br />
              {location.addressLines.map((line, idx) => (
                <h4 key={idx} style={{ fontSize: '1em', color: 'black', marginBottom: '0px', marginTop: '0px', fontWeight: 'bold' }}>
                    {line}
                </h4>
                ))}
              <br />
            </div>
          </div>
        ))}
      </div>
  );
};

export default Locations;