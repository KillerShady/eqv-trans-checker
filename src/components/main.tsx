import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../index.css'
import App from './App.tsx'
import { store } from '../state/store.ts'
import { Provider } from 'react-redux'
import 'bootstrap/dist/css/bootstrap.min.css';
import "katex/dist/katex.min.css";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
)

