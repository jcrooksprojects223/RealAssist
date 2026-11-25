import { useState } from 'react'

function formatTime(time) {
  if (!time) return ''
  const [hours, minutes] = time.split(':')
  const hour = Number(hours)
  return `${hour % 12 || 12}:${minutes} ${hour >= 12 ? 'PM' : 'AM'}`
}

export default function ShowingOrdersPage({
  clients,
  showingOrders,
  setShowingOrders,
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [showingSearch, setShowingSearch] = useState('')

  const searchText = showingSearch.trim().toLowerCase()
  const filteredShowings = showingOrders.filter((order) =>
    [order.address, order.client, order.date, formatTime(order.time)]
      .join(' ')
      .toLowerCase()
      .includes(searchText)
  )

  function addOrder(event) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)

    const order = {
      id: crypto.randomUUID(),
      address: String(form.get('address') || '').trim(),
      client: String(form.get('client') || '').trim(),
      date: String(form.get('date') || ''),
      time: String(form.get('time') || ''),
      notes: '',
    }

    setShowingOrders((current) => [order, ...current])
    event.currentTarget.reset()
  }

  return (
    <section className="showing-orders-page">
      <h1>Showings</h1>

      <form className="showing-order-form" onSubmit={addOrder}>
        <label>
          Property or Showing Title
          <input name="address" required />
        </label>

        <label>
          Client
          <select name="client" defaultValue="" required>
            <option value="">Select client</option>
            {clients.map((client) => (
              <option key={client.id} value={client.name}>
                {client.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Date
          <input name="date" type="date" />
        </label>

        <label>
          Time
          <input name="time" type="time" />
        </label>

        <button type="submit">Save Showing</button>
      </form>

      <div className="saved-showings-dropdown">
        <button
          type="button"
          className="saved-showings-trigger"
          aria-expanded={dropdownOpen}
          aria-controls="saved-showings-panel"
          onClick={() => setDropdownOpen((open) => !open)}
        >
          <span>Saved Showings ({showingOrders.length})</span>
          <span aria-hidden="true">{dropdownOpen ? '▲' : '▼'}</span>
        </button>

        {dropdownOpen && (
          <div
  className={`saved-showings-panel ${dropdownOpen ? 'is-open' : ''}`}
  id="saved-showings-panel"
  aria-hidden={!dropdownOpen}
>
  <input
    type="search"
    aria-label="Search saved showings"
    placeholder="Search by property, client, date, or time"
    value={showingSearch}
    onChange={(event) => setShowingSearch(event.target.value)}
    tabIndex={dropdownOpen ? 0 : -1}
  />

  <div className="saved-showings-list">
    {filteredShowings.length > 0 ? (
      filteredShowings.map((order) => (
        <article className="saved-showing-item" key={order.id}>
          <strong>{order.address}</strong>
          <p>{order.client} · {order.date} · {formatTime(order.time)}</p>
        </article>
      ))
    ) : (
      <p>No matching showings.</p>
    )}
  </div>
</div>
        )}
      </div>
    </section>
  )
}