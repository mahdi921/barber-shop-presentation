import { ThemeProvider } from './context/ThemeContext'
import Navbar from './components/Navbar'
import PanoramaGallery from './components/PanoramaGallery'
import SystemOverview from './components/SystemOverview'
import WomenSection from './components/WomenSection'
import GiftSection from './components/GiftSection'
import ContactFooter from './components/ContactFooter'
import './App.css'
import './styles/theme.css'

function App() {
  return (
    <ThemeProvider>
      <div className="app" dir="rtl" lang="fa">
        <Navbar />
        <main>
          <PanoramaGallery />
          <SystemOverview />
          <WomenSection />
          <GiftSection />
          <ContactFooter />
        </main>
      </div>
    </ThemeProvider>
  )
}

export default App
