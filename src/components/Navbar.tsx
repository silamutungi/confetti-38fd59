import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-ink border-b border-white/10">
      <nav className="max-w-5xl mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/" className="font-serif text-xl font-600 text-paper focus:outline-none focus:ring-2 focus:ring-primary rounded">
          Confetti
        </Link>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="min-h-[44px] min-w-[44px] flex items-center justify-center sm:hidden text-paper focus:outline-none focus:ring-2 focus:ring-primary rounded"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {menuOpen ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
        <div className={`${menuOpen ? 'flex' : 'hidden'} sm:flex flex-col sm:flex-row absolute sm:static top-16 left-0 right-0 bg-ink sm:bg-transparent p-4 sm:p-0 gap-3 sm:gap-4 items-start sm:items-center border-b sm:border-0 border-white/10`}>
          {user ? (
            <>
              <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="font-mono text-sm text-[#c8c4bc] hover:text-paper min-h-[44px] flex items-center focus:outline-none focus:ring-2 focus:ring-primary rounded px-1">
                Dashboard
              </Link>
              <span className="font-mono text-xs text-[#c8c4bc] hidden md:block">{user.email}</span>
              <button onClick={handleLogout} className="font-mono text-sm text-[#c8c4bc] hover:text-paper min-h-[44px] flex items-center focus:outline-none focus:ring-2 focus:ring-primary rounded px-1">
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)} className="font-mono text-sm text-[#c8c4bc] hover:text-paper min-h-[44px] flex items-center focus:outline-none focus:ring-2 focus:ring-primary rounded px-1">
                Sign in
              </Link>
              <Link to="/signup" onClick={() => setMenuOpen(false)} className="font-mono text-sm min-h-[44px] flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-ink">
                Get started
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}