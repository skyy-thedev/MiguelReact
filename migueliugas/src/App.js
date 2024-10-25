import Header from './components/header.jsx';
import Main from './components/main.jsx';
import HeroSlider from './components/heroSlider.jsx';
import Localizacao from './components/localizacao.jsx';
import Sobre from './components/sobre.jsx';
import Footer from './components/footer.jsx';
import Locations from './components/locations.jsx';

function App() {
  return (
    <div className="App">
        <Header />

        <Main />

        <HeroSlider />

        <Sobre />

        <Localizacao />

        <Locations />

        <Footer />
    </div>
  );
}

export default App;