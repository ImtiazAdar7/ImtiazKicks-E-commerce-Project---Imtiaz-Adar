import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global.css';
import './index.css'
import App from './App.jsx'
/**
 * @author Imtiaz Adar
 * @email imtiazadarofficial@gmail.com
 */
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)