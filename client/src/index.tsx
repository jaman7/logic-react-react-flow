import { createRoot } from 'react-dom/client';
import { PrimeReactProvider } from 'primereact/api';
import reportWebVitals from './reportWebVitals.js';
import App from './App.js';
import './assests/scss/main.scss';

const container = document?.getElementById('root');
const root = createRoot(container!);

root.render(
  <PrimeReactProvider>
    <App />
  </PrimeReactProvider>
);

reportWebVitals();
