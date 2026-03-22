import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';

function NotFound() {
  return (
    <main className="min-h-screen bg-paper flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="font-serif text-6xl font-800 text-ink mb-4">404</h1>
        <p className="font-mono text-ink/70 mb-6">This page doesn't exist — maybe the party moved?</p>
        <a href="/" className="font-mono min-h-[44px] inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary">
          Back to home
        </a>
      </div>
    </main>
  );
}

export default function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}