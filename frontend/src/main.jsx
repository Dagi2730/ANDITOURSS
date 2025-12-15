// frontend/src/main.jsx (MUST BE UPDATED)

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Redux Imports
import { Provider } from 'react-redux'
import { store } from './app/store.js'

// Toast Imports <-- NEW LINES
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css' 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Wrap the App in the Redux Provider */}
    <Provider store={store}>
      <App />
      <ToastContainer /> {/* <-- NEW LINE */}
    </Provider>
  </React.StrictMode>,
)