import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initializeFocusEnhancement } from './utils/focusManagement.ts'

// Initialize focus management system
document.addEventListener('DOMContentLoaded', () => {
  initializeFocusEnhancement();
});

// Create a simple fallback component
const FallbackApp = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100vh',
    fontFamily: 'system-ui',
    backgroundColor: '#f8fafc'
  }}>
    <div style={{ textAlign: 'center' }}>
      <h1 style={{ color: '#334155', marginBottom: '10px' }}>Enterprise Management System</h1>
      <p style={{ color: '#64748b' }}>กำลังโหลด...</p>
    </div>
  </div>
);

const rootElement = document.getElementById("root");
if (rootElement) {
  try {
    // Try loading the full app first
    createRoot(rootElement).render(<App />);
  } catch (error) {
    console.error('Error loading full app, using fallback:', error);
    // If full app fails, use fallback
    createRoot(rootElement).render(<FallbackApp />);
  }
}
