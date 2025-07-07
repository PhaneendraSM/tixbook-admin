import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AuthRoutes from './routes/authroutes';
import ProtectedRoutes from './routes/routes';


function App() {
  return (
    <Router>
      <Toaster position="top-right"  toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 2000,
            iconTheme: {
              primary: '#4ade80',
              secondary: '#fff',
            },
          },
          error: {
            duration: 3000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }} />
    <Routes>
      {/* Redirect root path to /login */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Public (auth) routes */}
      <Route path="/login/*" element={<AuthRoutes />} />

      {/* Protected routes */}
      <Route path="/*" element={<ProtectedRoutes />} />

      {/* Redirect unknown paths */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  </Router>
  );
}

export default App;
