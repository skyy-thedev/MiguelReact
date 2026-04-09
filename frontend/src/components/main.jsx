import React from "react";
import './styles/main.css';
import Logo from "../assets/body/logowhite.png";

const Main = () => (
  <section className="hero-brand">
    <div className="hero-brand__overlay" />
    <div className="hero-brand__content">
      <img
        src={Logo}
        alt="Dr. Miguel Iugas — Farmacêutico"
        className="hero-brand__logo"
      />
      <p className="hero-brand__tagline">Farmácia Clínica · Saúde Integrativa · Longevidade</p>
    </div>
  </section>
);

export default Main;