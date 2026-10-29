import { useState } from 'react'
import realassistlogo from './assets/real-assist-logo.png'
import realassistIcon from './assets/real-assist-icon.svg'
import './App.css'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <>
     <div className ="page-layout">
        <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}id="sidebar">
           <button type="button" className="sidebar-logo-button" aria-label="Close menu" onClick={() => setSidebarOpen(false)}>
  <img src={realassistlogo} className="sidebar-logo" alt="Real Assist" />
</button>
          <nav>
            <a href="#center">Home</a>
            <a href="#next-steps">Connect</a>
          </nav>
        </aside>
     
      <main className="page-content">
        <button type="button" className={`menu-button ${sidebarOpen ? 'is-open' :''}`} aria-label={sidebarOpen ? 'Close menu' : 'Open menu'} aria-expanded={sidebarOpen} aria-controls="sidebar" onClick={() => setSidebarOpen((open) => !open)}>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        </button>
       <section id="center">
          <img src={realassistlogo} className="base" width="170" height="179" alt="" />
          <img src={realassistIcon} className="framework" alt="React logo" />
      </section>
    </main>
    </div>
    </>
  )
}

export default App
