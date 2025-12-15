import Navbar from './components/Navbar';
import HeroVideo from './components/HeroVideo';
import Benefits from './components/Benefits';
import FeatureCards from './components/FeatureCards';
import LiveTest from './components/LiveTest';
import Plans from './components/Plans';
import ContactFooter from './components/ContactFooter';
import './App.css';

function App() {
  return (
    <div className="app">
      <Navbar />
      <main>
        <HeroVideo />
        <Benefits />
        <FeatureCards />
        <LiveTest />
        <Plans />
      </main>
      <ContactFooter />
    </div>
  );
}

export default App;
