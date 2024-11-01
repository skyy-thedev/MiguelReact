import React from 'react';
import Header from '../components/header.jsx';
import Footer from '../components/footer.jsx';
import ScreenProcedimentos from '../components/screenProced.jsx'

const Dashboard = () => {
  return (
    <>
      <Header />
        <ScreenProcedimentos />
      <Footer />
    </>
  );
};

export default Dashboard;