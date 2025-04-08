
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { defineCustomElements } from '@ionic/pwa-elements/loader'; // Capacitor elements
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Create a client
const queryClient = new QueryClient()

// Call the element loader after the platform has been bootstrapped
defineCustomElements(window);

// Add viewport-fit=cover for iOS notches
const meta = document.createElement('meta');
meta.setAttribute('name', 'viewport');
meta.setAttribute('content', 'width=device-width, initial-scale=1.0, viewport-fit=cover');
document.head.appendChild(meta);

// Add status bar meta tags
const statusBarStyle = document.createElement('meta');
statusBarStyle.setAttribute('name', 'apple-mobile-web-app-status-bar-style');
statusBarStyle.setAttribute('content', 'black-translucent');
document.head.appendChild(statusBarStyle);

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);
