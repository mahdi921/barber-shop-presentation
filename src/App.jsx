import Navbar from './components/Navbar'
import PanoramaGallery from './components/PanoramaGallery'
import WomenSection from './components/WomenSection'
import SystemOverview from './components/SystemOverview'
import ContactFooter from './components/ContactFooter'
import './App.css'

function App() {
  return (
    <div className="app" dir="rtl" lang="fa">
      <Navbar />
      <main>
        <PanoramaGallery />
        <WomenSection />
        <SystemOverview />
        <ContactFooter />
      </main>
    </div>
  )
}

export default App
