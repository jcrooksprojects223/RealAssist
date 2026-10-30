import { useState } from 'react'
import realassistlogo from './assets/real-assist-logo.png'
import realassistIcon from './assets/real-assist-icon.svg'
import './App.css'
function DashboardPage({ clients, resourcesFound, events }) {
  const stats = [
    { label: 'Resources found', count: resourcesFound },
    { label: 'Clients', count: clients.length },
    { label: 'Calendar events', count: events.length },
  ]

  return (
    <section className="dashboard-page">
      <h1>My Dashboard</h1>
      <div className="dashboard-cards">
        {stats.map((stat) => (
          <article className="dashboard-card" key={stat.label}>
            <h2>{stat.count}</h2>
            <p>{stat.label}</p>
          </article>))}
      </div>
    </section> )
}
function ClientsPage({ clients, setClients }) {
  const [name, setName] = useState('')
  const [search, setSearch] = useState('')

  function addClient(event) {
    event.preventDefault()
    const trimmedName = name.trim()
    if (!trimmedName) return

    setClients((current) => [
      ...current,
      { id: crypto.randomUUID(), name: trimmedName },])
    setName('')
  }

  const matchingClients = clients.filter((client) =>
    client.name.toLowerCase().includes(search.trim().toLowerCase()),
  )
  return (
    <section className="clients-page">
      <h1>Clients</h1>
      <form className="clients-form" onSubmit={addClient}>
        <input value={name} onChange={(event) => setName(event.target.value)} placeholder="New client name" aria-label="New client name" required/>
        <button type="submit">Add client</button>
      </form>

      <input className="client-search" type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search clients" aria-label="Search clients"/>

      <ul className="client-list"> {matchingClients.map((client) => (<li key={client.id}>{client.name}</li>))}
      </ul>
      {matchingClients.length === 0 && <p>No matching clients.</p>}
    </section>
  )
}
function ResourcesPage() {
  const [message, setMessage] = useState('')
  
  function handleSearch(event) {
    event.preventDefault()
    setMessage('The search form is ready. Nearby place search will be connected next.')
  }

  return (
    <section className="resources">
      <h1>Locate Resources</h1>
      <p>Search for parks, stores, and bars near a ZIP code.</p>

      <form className="resources-search" onSubmit={handleSearch}>
        <label>ZIP
          <input type="text" inputMode="numeric" pattern="[0-9]{5}" maxLength="5" placeholder="e.g. 90210"required/>
        </label>

        <label>
          <input type="search"name="query"placeholder="e.g. grocery store, playground"/>
        </label>

        <button type="submit">Search</button>
      </form>

      {message && <p className="search-message" role="status">{message}</p>}
    </section>
  )
}

function CalendarPage({ events, setEvents }) {
  const formatDate = (date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const [month, setMonth] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1))
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()))
  const [eventName, setEventName] = useState('')


  const firstWeekday = (new Date(month.getFullYear(), month.getMonth(), 1).getDay() + 6) % 7
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate()

  const calendarDays = Array.from({ length: 42 }, (_, index) => {
    const day = index - firstWeekday + 1
    return day > 0 && day <= daysInMonth ? day : null
  })

  function addEvent(event) {
    event.preventDefault()
    if (!eventName.trim()) return

    setEvents((current) => [...current,{ date: selectedDate, name: eventName.trim() },])
    setEventName('')
  }

  const selectedEvents = events.filter((event) => event.date === selectedDate)

  return (
    <section className="calendar-page">
      <h1>Calendar</h1>

      <div className="calendar-month">
        <button
          type="button"
          onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}
        >
          {'<'}
        </button>

        <h2>{month.toLocaleDateString('en', { month: 'long', year: 'numeric' })}</h2>

        <button
          type="button"
          onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}
        >
          {'>'}
        </button>
      </div>

      <div className="calendar-grid">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (<strong key={day}>{day}</strong>))}

        {calendarDays.map((day, index) => {
          if (!day) return <span key={`empty-${index}`} />

          const date = formatDate(new Date(month.getFullYear(), month.getMonth(), day))

          return (
            <button type="button"key={date} className={date === selectedDate ? 'selected-day' : ''} onClick={() => setSelectedDate(date)}>
              {day}
            </button>)})}
      </div>

      <form className="calendar-event-form" onSubmit={addEvent}>
        <label>
          Selected date
          <input type="date" value={selectedDate} onChange={(event) => setSelectedDate(event.target.value)} />
        </label>

        <label>
          Event
          <input value={eventName} onChange={(event) => setEventName(event.target.value)} placeholder="What’s happening?"
          />
        </label>

        <button type="submit">Add event</button>
      </form>

      <h2>Events on {selectedDate}</h2>
      {selectedEvents.length ? (
        <ul>
          {selectedEvents.map((event, index) => <li key={`${event.date}-${index}`}>{event.name}</li>)}
        </ul>
      ) : (
        <p>No events for this date.</p>
      )}
    </section>
  )
}
function App() {
  const [sidebarOpen, setSidebarOpen] = useState('true')
  const [currentPage, setCurrentPage] = useState('home')
  const [clients, setClients] = useState([])
  const [events, setEvents] = useState([])
  const [resourcesFound] = useState(0)
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
      {currentPage === 'resources' ? (<ResourcesPage/>) : 
       currentPage === 'calendar' ?(<CalendarPage events={events} setEvents={setEvents} />) :
       currentPage === 'clients' ? (<ClientsPage clients={clients} setClients={setClients} />) : 
       currentPage === 'dashboard' ? ( <DashboardPage clients={clients} resourcesFound={resourcesFound} events={events}/>) :
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
