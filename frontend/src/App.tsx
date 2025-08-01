import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AppProvider } from '@shopify/polaris'
import '@shopify/polaris/build/esm/styles.css'
import './mobile.css'
import { HomePage } from './components/pages/HomePage'
import CryptoDetail from './CryptoDetail'

/**
 * Main App component with routing
 */
function App() {
  return (
    <AppProvider i18n={{}}>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/crypto/:id" element={<CryptoDetail />} />
        </Routes>
      </Router>
    </AppProvider>
  )
}

export default App
