console.log("✅ scripts.js loaded");
const API_BASE = 'https://api.nexuschats.org';

async function loginUser(email, password) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();
  if (data.token) {
    localStorage.setItem('jwt', data.token);
    window.location.href = 'dashboard.html';
  } else {
    alert('Login failed');
  }
}

async function validateSession() {
  const token = localStorage.getItem('jwt');
  if (!token) return null;

  const res = await fetch(`${API_BASE}/auth/me`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token })
  });

  if (!res.ok) return null;
  const data = await res.json();
  return data.user || null;
}

function logout() {
  localStorage.removeItem('jwt');
  window.location.href = 'login.html';
}
