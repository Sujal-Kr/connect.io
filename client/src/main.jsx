import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { HelmetProvider } from 'react-helmet-async'
import { BrowserRouter } from 'react-router-dom'
import { CssBaseline } from '@mui/material'
import { Provider } from 'react-redux'
import store from './redux/store.js'

createRoot(document.getElementById('root')).render(
    <CssBaseline>
      <Provider store={store}>
        <BrowserRouter>
          <HelmetProvider>
            <div onContextMenu={(e) => e.preventDefault()}>
              <App />
            </div>
          </HelmetProvider>
        </BrowserRouter>
      </Provider>
    </CssBaseline>
  ,
)
