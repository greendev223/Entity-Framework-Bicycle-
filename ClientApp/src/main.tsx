import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
// ---- 3rd party ----
import './index.scss'
import { App } from './App'

const queryClient = new QueryClient()

ReactDOM.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
    <Router>
    <App />
    </Router>
    </QueryClientProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
