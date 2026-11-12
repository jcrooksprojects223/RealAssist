import { useEffect, useState } from 'react'
import realassistlogo from './assets/real-assist-logo.png'
import './App.css'
import ShowingOrdersPage from './ShowingOrders'
import RealAssistOperatingSystem from "./RealAssistOperatingSystem";

import {
  ClipboardList,
  UsersRound,
  Bell,
  UserPlus,
  MessageCircle,
} from 'lucide-react'



// Read a saved list from this browser. The stored value is JSON text, so parse it
// back into JavaScript data; if it is missing, damaged, or not a list, use [] instead.
function loadList(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || '[]')
    return Array.isArray(value) ? value : []
  } 
  catch {
    return []
  }
}

// Show the user's at-a-glance Command Center. The lists and navigation callback
// come from App, so the dashboard displays the same client, search, and event records.
function DashboardPage({ clients, searches, events, showingOrders, onNavigate }) {
  // Use YYYY-MM-DD strings so today's date can be compared with saved event dates.
  const today = new Date().toISOString().slice(0, 10)

  // Keep only events scheduled for today.
  const todayEvents = events.filter((event) => event.date === today)

  // Keep events scheduled today or later, sort them chronologically, and show at most four.
  const upcomingEvents = events
    .filter((event) => event.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 4)

  // Keep the text entered in the assistant box and its on-screen response between renders.
  const [assistantQuery, setAssistantQuery] = useState('')
  const [assistantMessage, setAssistantMessage] = useState('')

  // Describe each dashboard tile: its title, count, destination page, and displayed letter.
  const metrics = [
    { label: 'Showing Orders', count: showingOrders.length, page: 'showing-orders', icon: ClipboardList},
    { label: 'Active Clients', count: clients.length, page: 'clients', icon: UsersRound  },
    { label: 'Task Due', count: searches.length, page: 'resources', icon: Bell },
    { label: 'New Leads', count: todayEvents.length, page: 'calendar', icon: UserPlus  },
    { label: 'Missed Messages', count: upcomingEvents.length, page: 'calendar', icon: MessageCircle  },
  ]

  // Stop the browser from reloading on submit. The AI service is not connected yet,
  // so a non-empty question receives an explanatory message instead of being sent.
  function askAssistant(event) {
    event.preventDefault()
    if (!assistantQuery.trim()) return
    setAssistantMessage('The assistant connection is not set up yet. Your question has not been sent.')
  }
  
  return (
  
    <>
    {/*The dashboard is split into its heading, summary tiles, assistant, and reminder.*/}
    <section className="command-center">
      {/* Page title and the round shortcuts in the upper-right corner. */}
      <div className="command-center-topbar">
        <div>
          <p className="eyebrow">Real Assist Command Center</p>
          <h1>Welcome back, Agent!</h1>
          <p>Here&apos;s what&apos;s happening with your business today.</p>
        </div>
        <div className="command-tools" aria-label="Quick navigation">
          <button type="button" aria-label="Open resources" onClick={() => onNavigate('resources')}>⌕</button>
          <button type="button" aria-label="Open calendar" onClick={() => onNavigate('calendar')}>!</button>
          <button type="button" aria-label="Open clients" onClick={() => onNavigate('clients')}>•••</button>
          <span className="command-user-mark" aria-label="Real Assist account">RA</span>
        </div>
      </div>

      {/* Create one clickable tile for each item in the metrics list above. */}
      <div className="command-metrics">
        {metrics.map(({label, count, page, icon: Icon}) => (
          <button className="command-metric" key={label} onClick={() => onNavigate(page)} type="button">
            <span className="metric-mark" aria-hidden="true"><Icon size={16} strokeWidth={2} /></span>
            <span className="metric-label">{label}</span>
            <strong>{count}</strong>
            <span className="metric-link">View all</span>
          </button>
        ))}
      </div>

      {/* Assistant prompt and branding. Quick-action buttons open existing app screens. */}
      <section className="assistant-panel">
        <div className="assistant-copy">
          <p className="assistant-eyebrow">Your AI Assistant</p>
          <h2>How can I help you today?</h2>
          <form className="assistant-form" onSubmit={askAssistant}>
            <label className="visually-hidden" htmlFor="assistant-question">Ask Real Assist</label>
            <input
              id="assistant-question"
              onChange={(event) => setAssistantQuery(event.target.value)}
              placeholder="Ask me anything..."
              value={assistantQuery}
            />
            <button type="submit" aria-label="Send question">➤</button>
          </form>
          {assistantMessage && <p className="assistant-status" role="status">{assistantMessage}</p>}
          <div className="assistant-actions">
            <button type="button" onClick={() => onNavigate('clients')}>Add a client</button>
            <button type="button" onClick={() => onNavigate('resources')}>Find a resource</button>
            <button type="button" onClick={() => onNavigate('calendar')}>Add an event</button>
          </div>
        </div>

        <div className="assistant-avatar" aria-hidden="true">RA</div>

        <div className="assistant-brand">
          <div className="assistant-logo-frame">
            <img src={realassistlogo} alt="Real Assist" />
          </div>
          <p>Smart. Organized. Connected.</p>
          <strong>I&apos;m here to help you win!</strong>
        </div>
      </section>
      </section>
      {/* A static encouragement message at the bottom of the dashboard. */}
      <section className="encouragement-strip">
        <span className="encouragement-kicker">Today&apos;s encouragement</span>
        <p>You don&apos;t need a perfect day. You need one clear next step.</p>
      </section>
    </>)
}


// Let the user add a client and filter the same shared client list by name.

  // name holds the new-client form value; search holds the list-filter text.
 const clientStatuses = [
  'New Lead',
  'Pre-Approved',
  'Viewing Houses',
  'Under Contract',
  'Closing Scheduled',
  'Closed',
  'Paused',
  'Archived',
]

const statusProgress = {
  'New Lead': 0,
  'Pre-Approved': 20,
  'Viewing Houses': 35,
  'Under Contract': 65,
  'Closing Scheduled': 85,
  Closed: 100,
  Paused: 0,
  Archived: 0,
}

function ClientsPage({ clients, setClients }) {
  const blankClient = {
    name: '',
    phone: '',
    email: '',
    lender: '',
    status: 'New Lead',
  }
  const [newClient, setNewClient] = useState(blankClient)
  const [statusFilter, setStatusFilter] = useState('All')
  const [openProfileId, setOpenProfileId] = useState(null)

  function addClient(event) {
    event.preventDefault()
    if (!newClient.name.trim()) return

    setClients((current) => [
      {
        ...newClient,
        id: crypto.randomUUID(),
        name: newClient.name.trim(),
        nextFollowUp: '',
        notes: [],
        tasks: [],
      },
      ...current,
    ])
    setNewClient(blankClient)
  }

  function updateClient(clientId, updates) {
    setClients((current) =>
      current.map((client) =>
        client.id === clientId ? { ...client, ...updates } : client
      )
    )
  }

  function addEntry(client, field) {
    const value = window.prompt(
      field === 'notes' ? 'Add a note' : 'Add a task'
    )
    if (!value?.trim()) return

    updateClient(client.id, {
      [field]: [...(client[field] || []), value.trim()],
    })
  }

  const visibleClients = clients.filter((client) => {
    const status = client.status || 'New Lead'
    if (statusFilter === 'All') return true
    if (statusFilter === 'Open Goals + Pipeline') {
      return !['Closed', 'Paused', 'Archived'].includes(status)
    }
    return status === statusFilter
  })

  return (
    <section className="clients-board">
      <div className="client-board-panel">
        <h1>Client Connection Board</h1>
        <p>
          Clients connect to lender updates, communication, documents, dream
          sheets, shared properties, tasks, calendar events, resources,
          transactions, and pipeline goals.
        </p>

        <form className="client-board-form" onSubmit={addClient}>
          <input
            aria-label="Client name"
            placeholder="Client name"
            required
            value={newClient.name}
            onChange={(event) =>
              setNewClient({ ...newClient, name: event.target.value })
            }
          />
          <input
            aria-label="Phone"
            placeholder="Phone"
            value={newClient.phone}
            onChange={(event) =>
              setNewClient({ ...newClient, phone: event.target.value })
            }
          />
          <input
            aria-label="Email"
            type="email"
            placeholder="Email"
            value={newClient.email}
            onChange={(event) =>
              setNewClient({ ...newClient, email: event.target.value })
            }
          />
          <input
            aria-label="Lender"
            placeholder="Lender"
            value={newClient.lender}
            onChange={(event) =>
              setNewClient({ ...newClient, lender: event.target.value })
            }
          />
          <select
            aria-label="New client status"
            value={newClient.status}
            onChange={(event) =>
              setNewClient({ ...newClient, status: event.target.value })
            }
          >
            {clientStatuses.map((status) => (
              <option key={status}>{status}</option>
            ))}
          </select>
          <button type="submit">Add Client</button>
        </form>
      </div>

      <div className="client-board-panel">
        <h2>Client Filters</h2>
        <div className="client-filters">
          {['All', ...clientStatuses, 'Open Goals + Pipeline'].map((filter) => (
            <button
              className={statusFilter === filter ? 'active' : ''}
              key={filter}
              onClick={() => setStatusFilter(filter)}
              type="button"
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="client-card-grid">
        {visibleClients.map((client) => {
          const status = client.status || 'New Lead'
          const progress = statusProgress[status] ?? 0

          return (
            <article className="client-card" key={client.id}>
              <div className="client-card-heading">
                <span>{status}</span>
                <strong>{progress}%</strong>
              </div>
              <h2>{client.name}</h2>
              <p>{client.phone || 'No phone'} · {client.email || 'No email'}</p>
              <p>Lender: {client.lender || 'Assign lender'}</p>
              <p>Next follow-up: {client.nextFollowUp || 'Set follow-up'}</p>

              <div
                className="client-progress"
                role="progressbar"
                aria-valuenow={progress}
                aria-valuemin="0"
                aria-valuemax="100"
              >
                <span style={{ width: `${progress}%` }} />
              </div>

              <div className="client-actions">
                <button
                  className="primary"
                  type="button"
                  onClick={() =>
                    setOpenProfileId(
                      openProfileId === client.id ? null : client.id
                    )
                  }
                >
                  {openProfileId === client.id ? 'Close Profile' : 'Open Profile'}
                </button>
                <a href={`sms:${client.phone || ''}`}>Message</a>
                <a href={`tel:${client.phone || ''}`}>Call</a>
                <a href={`mailto:${client.email || ''}`}>Email</a>
                <button type="button" onClick={() => addEntry(client, 'notes')}>
                  Add Note
                </button>
                <button type="button" onClick={() => addEntry(client, 'tasks')}>
                  Add Task
                </button>
              </div>

              <select
                aria-label={`Update ${client.name} status`}
                value={status}
                onChange={(event) =>
                  updateClient(client.id, { status: event.target.value })
                }
              >
                {clientStatuses.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>

              {openProfileId === client.id && (
                <div className="client-profile-details">
                  <strong>Notes</strong>
                  {(client.notes || []).map((note, index) => (
                    <p key={`${client.id}-note-${index}`}>{note}</p>
                  ))}
                  <strong>Tasks</strong>
                  {(client.tasks || []).map((task, index) => (
                    <p key={`${client.id}-task-${index}`}>{task}</p>
                  ))}
                </div>
              )}
            </article>
          )
        })}
      </div>
    </section>
  )
}





// Collect a ZIP code and resource query, then pass the search to App for saving.
function ResourcesPage({ onSaveSearch }) {
  // Show a short confirmation after a search has been saved.
  const [message, setMessage] = useState('')

  // Read the submitted form fields and send one uniquely identified search record to App.
  function handleSearch(event) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)

    // Save the ZIP, query text, unique ID, and time created. Results are not fetched here.
    onSaveSearch({
      id: crypto.randomUUID(),
      zip: String(form.get('zip') || '').trim(),
      query: String(form.get('query') || '').trim(),
      createdAt: new Date().toISOString(),
    })

    setMessage('Search saved.')
    // Clear the visible form after its values have been copied into the saved record.
    event.currentTarget.reset()
  }

  return (
    // This form currently stores search details; connecting a real places API is separate work.
    <section className="resources">
      <h1>Locate Resources</h1>
      <p>Search for parks, stores, and bars near a ZIP code.</p>

      <form className="resources-search" onSubmit={handleSearch}>
        <label>ZIP
          <input name="zip" type="text" inputMode="numeric" pattern="[0-9]{5}" maxLength="5" placeholder="e.g. 90210" required />
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

// Display a month grid, let the user select a date, and add events to App's shared event list.
function CalendarPage({ events, setEvents }) {
  // Convert a Date object to YYYY-MM-DD, the format used by date inputs and saved events.
  const formatDate = (date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  // Keep track of the displayed month, selected calendar day, and event form text.
  const [month, setMonth] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1))
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()))
  const [eventName, setEventName] = useState('')


  // Find the weekday where this month begins and how many numbered days it contains.
  const firstWeekday = (new Date(month.getFullYear(), month.getMonth(), 1).getDay() + 6) % 7
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate()

  // Make a fixed six-week grid: null represents an empty cell before or after this month.
  const calendarDays = Array.from({ length: 42 }, (_, index) => {
    const day = index - firstWeekday + 1
    return day > 0 && day <= daysInMonth ? day : null
  })

  // Save a named event on the selected date, then clear the event-name field.
  function addEvent(event) {
    event.preventDefault()
    if (!eventName.trim()) return

    setEvents((current) => [...current,{ date: selectedDate, name: eventName.trim() },])
    setEventName('')
  }

  // Only list events whose saved date matches the currently selected date.
  const selectedEvents = events.filter((event) => event.date === selectedDate)

  return (
    // The month controls, date grid, event form, and selected-day event list.
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
  // sidebarOpen controls the navigation panel; currentPage selects the main screen.
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [currentPage, setCurrentPage] = useState('dashboard')

  // Load each saved list once when the app starts so every screen shares the same records.
  const [clients, setClients] = useState(() => loadList('ra_clients'))
  const [events, setEvents] = useState(() => loadList('ra_events'))
  const [searches, setSearches] = useState(() => loadList('ra_searches'))
  const [showingOrders, setShowingOrders] = useState(() => loadList('ra_showing_orders'))

  // Keep browser storage synchronized whenever a list changes. This is local to this browser.
  useEffect(() => localStorage.setItem('ra_clients', JSON.stringify(clients)), [clients])
  useEffect(() => localStorage.setItem('ra_events', JSON.stringify(events)), [events])
  useEffect(() => localStorage.setItem('ra_searches', JSON.stringify(searches)), [searches])
  useEffect(() => localStorage.setItem('ra_showing_orders', JSON.stringify(showingOrders)), [showingOrders])

  // Each pair connects the sidebar's visible label to the page key used below.
  const navigation = [
    ['dashboard', 'Dashboard'],
    ['resources', 'Resource Brain'],
    ['showing-orders', 'Showing Orders'],
    ['calendar', 'Calendar'],
    ['clients', 'Clients'],
  ]

  return (
    // The sidebar, collapsed-state reopen button, and selected page share one layout.
    <div className="page-layout command-layout">
      <aside className={`sidebar command-sidebar ${sidebarOpen ? 'open' : 'closed'}`} id="sidebar">
        <button className="sidebar-toggle" type="button" onClick={() => setSidebarOpen(false)} aria-label="Close sidebar">×</button>
        <div className="sidebar-profile">
          <span className="profile-avatar">RA</span>
          <span><strong>Real Assist</strong><small>Real Estate Agent</small></span>
        </div>
        <div className="sidebar-actions">
          <button type="button" onClick={() => setCurrentPage('clients')}>Add a Client</button>
          <button type="button" onClick={() => setCurrentPage('resources')}>Find a Resource</button>
          <button type="button" onClick={() => setCurrentPage('calendar')}>Plan Your Day</button>
        </div>
        <nav aria-label="Main navigation">
          {navigation.map(([page, label]) => (
            <button
              aria-current={currentPage === page ? 'page' : undefined}
              className={currentPage === page ? 'active' : ''}
              key={page}
              onClick={() => setCurrentPage(page)}
              type="button"
            >
              <span className="nav-mark" aria-hidden="true">{page === 'dashboard' ? '⌂' : page === 'resources' ? '⌕' : page === 'calendar' ? '▦' : '♙'}</span>
              {label}
            </button>
          ))}
        </nav>
      </aside>

      {!sidebarOpen && (
        // This button is rendered only while the sidebar is closed, so it can reopen it.
        <button className="sidebar-reopen" type="button" onClick={() => setSidebarOpen(true)} aria-label="Open sidebar">
          ☰
        </button>
      )}

      <main className="page-content">
        {/* Render exactly one screen while passing shared data and update functions to it. */}
        {currentPage === 'resources' ? (
          <ResourcesPage onSaveSearch={(search) => setSearches((current) => [search, ...current])} />
        ) : currentPage === 'showing-orders' ? (
          <ShowingOrdersPage clients={clients} showingOrders={showingOrders} setShowingOrders={setShowingOrders} />
        ) : currentPage === 'calendar' ? (
          <CalendarPage events={events} setEvents={setEvents} />
        ) : currentPage === 'clients' ? (
          <ClientsPage clients={clients} setClients={setClients} />
        ) : (
         <>
         <DashboardPage clients={clients} searches={searches} events={events} showingOrders={showingOrders} onNavigate={setCurrentPage} />
         <RealAssistOperatingSystem navigate={setCurrentPage} />
         </>
        )}
      </main>
    </div>
  )
}

export default App
