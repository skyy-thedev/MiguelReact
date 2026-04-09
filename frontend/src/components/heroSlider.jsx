import React from "react";
import Flickity from 'react-flickity-component';
import 'flickity/dist/flickity.min.css'; 
import Consultoria from "../assets/body/fundo1.png";
import Agenda from "../assets/heroslider/pict.jpg";
import Aulas from "../assets/heroslider/foto.jpg";
import './styles/heroSlider.css';

const flickityOptions = {
  wrapAround: true,
  autoPlay: 6000,
  pauseAutoPlayOnHover: true,
  prevNextButtons: true,
  contain: true,
  initialIndex: 1,
  cellAlign: 'center',
};

const slides = [
  {
    image: Aulas,
    id: 'Aulas',
    header: 'Cursos e Mentorias',
    text: 'Aulas',
    link: 'https://hotmart.com/pt-br/marketplace/produtos?initialSelectedCategory=&q=Miguel+Iugas',
    buttonText: 'Aprender mais!',
  },
  {
    image: Consultoria,
    id: 'Consultoria',
    header: 'Agendamento',
    text: 'Consultoria',
    link: '/#Agendar',
    buttonText: 'Agendar agora!',
  },
  {
    image: Agenda,
    id: 'Agenda',
    header: 'Lives e Palestras',
    text: 'Agenda',
    link: 'https://www.instagram.com/migueliugas/',
    buttonText: 'Calendário!',
  },
];

const HeroSlider = () => (
  <section className="slider" aria-label="Destaques">
    <Flickity className="slider__track" elementType="div" options={flickityOptions} reloadOnUpdate>
      {slides.map((slide, i) => (
        <div
          key={i}
          className="slider__cell"
          style={{ backgroundImage: `url(${slide.image})` }}
        >
          <div className="slider__overlay" />
          <div className="slider__content">
            <span className="slider__label">{slide.header}</span>
            <h2 className="slider__title">{slide.text}</h2>
            <a href={slide.link} rel="noreferrer" className="slider__btn">
              {slide.buttonText}
            </a>
          </div>
        </div>
      ))}
    </Flickity>
  </section>
);

export default HeroSlider;