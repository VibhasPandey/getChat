
if (typeof global === 'undefined') {
  window.global = window;
}
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Routes ,Route} from 'react-router'
import { AppRoutes } from './config/route-config.jsx'
import { Toaster } from 'react-hot-toast'
import { ChatProvider } from './ChatContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <Toaster/>
    <ChatProvider>
      <AppRoutes/>
    </ChatProvider>
    </BrowserRouter>
  </StrictMode>,
)
