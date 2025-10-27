import React, { useEffect, useState } from 'react';

const VALID_CODES = ['D1CODE', 'D2CODE', 'LIBCODE'];

export default function App() {
  const [user, setUser] = useState(null);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [message, setMessage] = useState('');
  const [slots, setSlots] = useState([]);
  const [codeInput, setCodeInput] = useState('');

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(savedUser);
      const savedSlots = localStorage.getItem(`${savedUser}_slots`);
      setSlots(savedSlots ? JSON.parse(savedSlots) : []);
    }
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', user);
      localStorage.setItem(`${user}_slots`, JSON.stringify(slots));
    }
  }, [user, slots]);

  const loadPasswords = () => {
    try {
      const raw = localStorage.getItem('passwords');
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  };

  const savePasswords = (pwds) => {
    localStorage.setItem('passwords', JSON.stringify(pwds));
  };

  const handleSignup = () => {
    const { username, password } = loginForm;
    if (!username || !password) {
      setMessage('Please enter username and password.');
      return;
    }
    const pwds = loadPasswords();
    if (pwds[username]) {
      setMessage('User already exists. Please login.');
      return;
    }
    pwds[username] = password;
    savePasswords(pwds);
    setMessage('Account created. You can log in now.');
  };

  const handleLogin = () => {
    const { username, password } = loginForm;
    if (!username || !password) {
      setMessage('Please enter username and password.');
      return;
    }
    const pwds = loadPasswords();
    if (pwds[username] && pwds[username] === password) {
      setUser(username);
      const savedSlots = localStorage.getItem(`${username}_slots`);
      setSlots(savedSlots ? JSON.parse(savedSlots) : []);
      setMessage('');
    } else {
      setMessage('Incorrect username or password.');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setLoginForm({ username: '', password: '' });
    setSlots([]);
    localStorage.removeItem('user');
  };

  const addStamp = () => {
    const code = codeInput.trim().toUpperCase();
    if (!VALID_CODES.includes(code)) {
      setMessage('Invalid café code.');
      return;
    }
    if (slots.length >= 10) {
      setMessage('You already have 10 stamps. Reset or redeem the free coffee.');
      return;
    }
    const newSlots = [...slots, true];
    setSlots(newSlots);
    setCodeInput('');
    if (newSlots.length === 10) {
      setMessage('🎉 You earned a free coffee! 🎉');
    } else {
      setMessage(`Stamp added: ${newSlots.length}/10`);
    }
  };

  const resetSlots = () => {
    setSlots([]);
    setMessage('Progress reset.');
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <h1 className="text-3xl font-bold mb-4">Reusable Cup App</h1>

        <input
          aria-label="username"
          className="border p-2 m-1 rounded"
          placeholder="Net ID"
          value={loginForm.username}
          onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
        />

        <input
          aria-label="password"
          type="password"
          className="border p-2 m-1 rounded"
          placeholder="Password"
          value={loginForm.password}
          onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
        />

        <div className="flex gap-2 mt-2">
          <button onClick={handleLogin} className="px-4 py-2 rounded bg-blue-600 text-white">Login</button>
          <button onClick={handleSignup} className="px-4 py-2 rounded bg-green-600 text-white">Sign Up</button>
        </div>

        {message && <p className="mt-3 text-red-600">{message}</p>}

        <div className="mt-6 text-sm text-gray-500">Valid example codes: D1CODE D2CODE LIBCODE</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-4">Welcome, {user}</h1>

      <div className="grid grid-cols-5 gap-2 mb-4">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
              i < slots.length ? 'bg-green-400 border-green-600' : 'bg-gray-200 border-gray-400'
            }`}
          >
            {i < slots.length ? '☕' : i + 1}
          </div>
        ))}
      </div>

      <input
        aria-label="code-input"
        className="border p-2 rounded w-48 text-center mb-2"
        placeholder="Enter café code"
        value={codeInput}
        onChange={(e) => setCodeInput(e.target.value)}
      />

      <div className="flex gap-2 mb-2">
        <button onClick={addStamp} className="px-3 py-2 rounded bg-blue-600 text-white">Add Stamp</button>
        <button onClick={resetSlots} className="px-3 py-2 rounded bg-yellow-500 text-white">Reset</button>
        <button onClick={handleLogout} className="px-3 py-2 rounded bg-red-600 text-white">Logout</button>
      </div>

      {message && <p className="mt-2 text-gray-800 font-medium">{message}</p>}

      <div className="mt-6 text-sm text-gray-500">Valid codes: D1CODE, D2CODE, LIBCODE</div>
    </div>
  );
}
