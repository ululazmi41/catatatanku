import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'

// Styles
import './styles/dots.css';
import './styles/style.css';
import './styles/loading.css';
import './styles/toaster.css';
import './styles/tailwind.css';
import './styles/noteInput.css';

const element = document.getElementById('root')!
const root = ReactDOM.createRoot(element)

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
