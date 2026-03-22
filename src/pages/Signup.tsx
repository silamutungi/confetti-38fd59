import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please fill in both fields.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setLoading(true);
    const { error: authError } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (authError) {
      setError('Could not create your account. Please try a different email.');
      return;
    }
    navigate('/dashboard');
  };

  return (
    <main className="min-h-screen bg-paper flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <h1 className="font-serif text-3xl font-800 text-ink text-center mb-2">Create your account</h1>
        <p className="font-mono text-sm text-[#6b6862] text-center mb-8">Start creating beautiful event invites in seconds</p>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="font-mono text-sm text-ink block mb-1">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              maxLength={254}
              className="w-full min-h-[44px] px-4 py-2 font-mono text-ink bg-white border border-ink/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="font-mono text-sm text-ink block mb-1">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              maxLength={128}
              className="w-full min-h-[44px] px-4 py-2 font-mono text-ink bg-white border border-ink/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="At least 8 characters"
            />
          </div>
          {error && <p className="font-mono text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3" role="alert">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full min-h-[44px] font-mono bg-primary text-white rounded-lg py-3 hover:opacity-90 transition-opacity disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>
        <p className="font-mono text-sm text-[#6b6862] text-center mt-6">
          Already have an account? <Link to="/login" className="text-primary-dark underline focus:outline-none focus:ring-2 focus:ring-primary">Sign in</Link>
        </p>
      </div>
    </main>
  );
}