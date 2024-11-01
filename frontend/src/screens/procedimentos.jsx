import React from 'react';
import Header from '../components/header.jsx';
import Footer from '../components/footer.jsx';
import ScreenProced from '../components/screenProced.jsx';
import '../components/styles/procedimentos.css';

const screenProcedimentos = () => {
  return (
    <>
      <Header />
        <ScreenProced />
      <Footer />
    </>
  );
};

export default screenProcedimentos;