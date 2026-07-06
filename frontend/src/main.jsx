// frontend/src/main.jsx (NO CHANGES NEEDED)

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import './App.css'
import './styles/Admin.css'
import 'bootstrap/dist/css/bootstrap.min.css';

// Redux Imports
import { Provider } from 'react-redux'
import { store } from './app/store.js'

// Toast Imports
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css' 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Wrap the App in the Redux Provider */}
    <Provider store={store}>
      <App />
      <ToastContainer />
    </Provider>
  </React.StrictMode>,
)