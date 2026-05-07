import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { API_URL } from './api';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (res.ok) {
        // Automatically login
        const loginData = new URLSearchParams();
        loginData.append('username', username);
        loginData.append('password', password);

        const loginRes = await fetch(`${API_URL}/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: loginData.toString()
        });

        if (loginRes.ok) {
          const authData = await loginRes.json();
          localStorage.setItem('token', authData.access_token);
          navigate('/bookshelf');
        } else {
          navigate('/login');
        }
      } else {
        const data = await res.json();
        setError(data.detail || 'Registration failed');
      }
    } catch (e) {
      setError('Failed to connect to the server');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-900 px-6 font-sans">
      <div className="w-full max-w-md">
        <Link to="/bookshelf" className="inline-flex items-center space-x-2 text-slate-400 hover:text-slate-950 font-bold tracking-tight transition-colors mb-8">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm uppercase tracking-widest">Back</span>
        </Link>
        
        <header className="mb-8">
          <h2 className="text-4xl font-extrabold tracking-tight text-slate-950 mb-2">
            Register
          </h2>
          <p className="text-slate-500">Create an account to track your volumes.</p>
        </header>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          {error && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-medium">{error}</div>}
          <form onSubmit={handleRegister} className="flex flex-col space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-widest text-slate-400">Username</label>
              <input 
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:border-transparent transition-all" 
                placeholder="Choose a username" 
                value={username} onChange={e => setUsername(e.target.value)} 
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-widest text-slate-400">Password</label>
              <input 
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:border-transparent transition-all" 
                type="password" placeholder="Choose a password" 
                value={password} onChange={e => setPassword(e.target.value)} 
                required
              />
            </div>
            <button 
              className="w-full inline-flex items-center justify-center px-10 py-4 bg-slate-900 text-white rounded-full hover:bg-slate-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 font-semibold text-lg mt-4" 
              type="submit"
            >
              Register
            </button>
          </form>
          <div className="mt-8 text-center">
            <Link to="/login" className="text-slate-500 hover:text-slate-950 font-semibold transition-colors">
              Already have an account? Login.
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
