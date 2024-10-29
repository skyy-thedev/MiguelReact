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
    initialIndex: 1
};

const HeroSlider = () => {
    const slides = [
        { image: Aulas, header: "Cursos e Mentorias", text: "Aulas", link: "https://hotmart.com/pt-br/marketplace/produtos?initialSelectedCategory=&q=Miguel+Iugas", buttonText: "Aprender mais!" },
        { image: Consultoria, header: "Agendamento", text: "Consultoria", link: "/Login", buttonText: "Saiba mais!" },
        { image: Agenda, header: "Lives e Palestras", text: "Agenda", link: "https://www.instagram.com/migueliugas/", buttonText: "Calendário!" },
    ];

    return (
        <Flickity className={'hero-slider'} elementType={'div'} options={flickityOptions} reloadOnUpdate>
            {slides.map((slide, index) => (
                <div
                    key={index}
                    className={`carousel-cell `}
                    style={{ backgroundImage: `url(${slide.image})`, backgroundColor: '#f4f4f4', backgroundSize: 'cover', backgroundPosition: 'center' }}
                >
                    <div className="info-container">
                        <h3 className="header">{slide.header}</h3>
                        <h2 className="text">{slide.text}</h2>
                        <a href={slide.link} rel="noreferrer">
                            <button>{slide.buttonText}</button>
                        </a>
                    </div>
                </div>
            ))}
        </Flickity>
    );
};



export default HeroSlider;