import React from 'react';
import App from './App.jsx';
import { createRoot } from 'react-dom/client';

import { UserProvider } from "./context/UserContext";


createRoot(document.getElementById('root')).render(
  <UserProvider>
    <App />
  </UserProvider>
);
