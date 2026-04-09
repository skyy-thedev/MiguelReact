import React, { useEffect, useRef } from 'react';
import './styles/locations.css';

const Locations = () => {
  const cardRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('location--visible');
        });
      },
      { threshold: 0.2 }
    );
    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="locations">
      <div className="locations__container">
        <div className="location-card" ref={cardRef}>
          <div className="location-card__map">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3675.40857791223!2d-47.064645688266836!3d-22.898296037482687!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94c8c8adcaf00001%3A0x9bae52c8409c8a50!2sAv.%20Orosimbo%20Maia%2C%20360%20-%206%C2%BA%20andar%20-%20Vila%20Mariana%2C%20Campinas%20-%20SP%2C%2004035-001!5e0!3m2!1spt-BR!2sbr!4v1706103694268!5m2!1spt-BR!2sbr"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Consultório Campinas"
            />
          </div>
          <div className="location-card__info">
            <h3 className="location-card__title">Consultório Campinas</h3>
            <address className="location-card__address">
              <p>Av Orosimbo Maia, 360 - 6º Andar</p>
              <p>Vila Itapura · Campinas/SP</p>
              <p>13010-211</p>
            </address>
            <a
              href="https://www.google.com/maps/dir/?api=1&destination=Av.+Orosimbo+Maia,+360+-+6º+andar,+Campinas+-+SP"
              target="_blank"
              rel="noreferrer"
              className="location-card__btn"
            >
              📍 Como chegar
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Locations;