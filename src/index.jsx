import React from 'react';
import { createRoot } from 'react-dom/client';

// Styles
import './styles/dots.css';
import './styles/style.css';
import './styles/loading.css';
import './styles/toaster.css';
import './styles/tailwind.css';
import './styles/noteInput.css';

// Components
import App from './App';

const element = document.getElementById('root');
const root = createRoot(element);

root.render(<App />);