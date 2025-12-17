import Navbar from './components/Navbar'
import PanoramaGallery from './components/PanoramaGallery'
import SystemOverview from './components/SystemOverview'
import WomenSection from './components/WomenSection'
import GiftSection from './components/GiftSection'
import ContactFooter from './components/ContactFooter'
import './App.css'

function App() {
  return (
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
  )
}

export default App
