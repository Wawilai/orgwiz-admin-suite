import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import { ThemeProvider } from './components/ThemeProvider'
import { AuthProvider } from './contexts/AuthContext'
import { MasterDataProvider } from './contexts/MasterDataContext'
import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { initializeFocusEnhancement } from './utils/focusManagement.ts'

// Initialize focus management system
document.addEventListener('DOMContentLoaded', () => {
  initializeFocusEnhancement();
});

const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(
    <React.StrictMode>
      <BrowserRouter>
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
          <AuthProvider>
            <MasterDataProvider>
              <App />
              <Toaster />
              <Sonner />
            </MasterDataProvider>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
}
