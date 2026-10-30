import { useState } from 'react'
import realassistlogo from './assets/real-assist-logo.png'
import realassistIcon from './assets/real-assist-icon.svg'
import './App.css'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState('true')
  const [currentPage, setCurrentPage] = useState('home')
  return (
    <>
     <div className ="page-layout">
        <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}id="sidebar">
           <button type="button" className="sidebar-logo-button" aria-label="Close menu" onClick={() => setSidebarOpen(false)}>
  <img src={realassistlogo} className="sidebar-logo" alt="Real Assist" />
</button>
          <nav>
            <button onClick={() => setCurrentPage('home')}>Home</button>
            <button type="button" onClick={() => setCurrentPage('dashboard')}>My Dashboard</button>
            <button type="button" onClick={() => setCurrentPage('clients')}>Clients</button>
            <button type="button" onClick={() => setCurrentPage('resources')}>Resources</button>
            <button type="button" onClick={() => setCurrentPage('calendar')}>Calendar</button>
          </nav>
        </aside>
     
      <main className="page-content">
        <button type="button" className={`menu-button ${sidebarOpen ? 'is-open' :''}`} aria-label={sidebarOpen ? 'Close menu' : 'Open menu'} aria-expanded={sidebarOpen} aria-controls="sidebar" onClick={() => setSidebarOpen((open) => !open)}>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        </button>
      {currentPage === 'resources' ? (<section> <h1>Resources</h1></section>) : 
       currentPage === 'calendar' ?(<section><h1>Calendar</h1> </section>) :
       currentPage === 'clients' ? (<section><h1>Clients</h1></section>) : 
       currentPage === 'dashboard' ? (<section><h1>My Dashboard</h1></section>) :
    (<section id="center">
    <img src={realassistlogo} className="base" width="170" height="179" alt="" />
    <img src={realassistIcon} className="framework" alt="React logo" />
    </section>
)}
    </main>
    
  </div>

    </>
  )
}

export default App
