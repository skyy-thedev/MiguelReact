import React from 'react';
import Header from '../components/header.jsx';
import Main from '../components/main.jsx';
import HeroSlider from '../components/heroSlider.jsx';
import AgendamentoWhatsapp from '../components/AgendamentoWhatsapp.jsx';
import Sobre from '../components/sobre.jsx';
import Localizacao from '../components/localizacao.jsx';
import Locations from '../components/locations.jsx';
import Contato from '../components/Contato.jsx';
import Footer from '../components/footer.jsx';

const Home = () => {
  return (
    <>
      <Header />
      <Main />
      <HeroSlider />
      <Sobre />
      <Localizacao />
      <Locations />
      <AgendamentoWhatsapp />
      <Contato />
      <Footer />
    </>
  );
};

export default Home;