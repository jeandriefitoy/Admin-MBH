import { useState, useEffect } from 'react'
import SideBar from './components/sideBar'
import './App.css'
import TopBar from './components/topBar'
import DashboardPage from './pages/dashboard/page'
import UserPage from './pages/user/page'
import LaporanPage from './pages/laporan/page'
import LokasiPage from './pages/lokasi/page'
import PencocokanPage from './pages/pencocokan/page'
import KlaimSatpamPage from './pages/klaimSatpam/page'
import LoginPage from './auth/signIn/page'
import KategoriPage from './pages/kategori/page'
import authService from './service/authService'

function App() {
  const [activeSection, setActiveSection] = useState('dashboard')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const savedUser = localStorage.getItem('adminUser')
      const token = localStorage.getItem('authToken')
      
      if (savedUser && token && authService.isAuthenticated()) {
        try {
          await authService.getCurrentUser()
          
          setUser(JSON.parse(savedUser))
          setIsAuthenticated(true)
        } catch (error) {
          console.log('Token expired or invalid:', error)
          authService.logout()
        }
      }
      
      setIsLoading(false)
    }

    checkAuth()
  }, [])

  const handleLogin = (userData) => {
    console.log('App received user data:', userData);
    setUser(userData)
    setIsAuthenticated(true)
    localStorage.setItem('adminUser', JSON.stringify(userData))
  }

  const handleLogout = () => {
    console.log('Logging out...');
    setUser(null)
    setIsAuthenticated(false)
    setActiveSection('dashboard')
    authService.logout()
  }

  const renderContent = () => {
    switch(activeSection) {
      case 'dashboard':
        return <DashboardPage />
      case 'user':
        return <UserPage />
      case 'laporan':
        return <LaporanPage />
      case 'kategori':
        return <KategoriPage />
      case 'lokasi':
        return <LokasiPage />
      case 'pencocokan':
        return <PencocokanPage />
      case 'klaimSatpam':
        return <KlaimSatpamPage />
      default:
        return <DashboardPage />
    }
  }

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#1e1a78] to-[#0f172a]">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="w-full h-full no-scroll">
        <LoginPage onLogin={handleLogin} />
      </div>
    )
  }

  return (
    <div className='flex w-full h-full '>
      <div className='w-66 flex-shrink-0 '>
        <SideBar 
          activeSection={activeSection} 
          onSectionChange={setActiveSection}
          onLogout={handleLogout}
          user={user}
        />
      </div>
      
      <div className='flex flex-col flex-1 min-w-0 '>
        <div className='flex-shrink-0 '>
          <TopBar user={user} onLogout={handleLogout} />
        </div>
        
        <div className=' flex-1'>
          <div className='px-4 py-4 content'>
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
