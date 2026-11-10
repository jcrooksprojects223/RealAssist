// StrictMode enables extra development checks that help reveal unsafe React patterns.
import { StrictMode } from 'react'
// createRoot connects React to the empty mount element in index.html.
import { createRoot } from 'react-dom/client'
// Load the shared page theme before rendering the application.
import './index.css'
// Import the top-level component that contains the app's pages and navigation.
import App from './App.jsx'

// Find the HTML mount point and render the app inside React's development checks.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
