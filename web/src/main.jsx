import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import './index.css';
import AuthProvider from './context/AuthProvider.jsx';
import RouterConfig from './routes/RouterConfig.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <RouterConfig />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
