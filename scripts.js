console.log("✅ scripts.js loaded");

const API_BASE = 'https://api.nexuschats.org';

window.loginUser = async function(email, password) {
  console.log("🔐 Attempting login with:", email);

  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();
  console.log("📥 Login response:", data);

  if (data.token) {
    localStorage.setItem('jwt', data.token);
    window.location.href = 'dashboard.html';
  } else {
    alert(data.error || 'Login failed');
  }
};

window.validateSession = async function() {
  const token = localStorage.getItem('jwt');
  if (!token) return null;

  const res = await fetch(`${API_BASE}/auth/me`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token })
  });

  if (!res.ok) return null;

  const data = await res.json();
  console.log("🧾 Session validation result:", data);
  return data.user || null;
};

window.logout = function() {
  localStorage.removeItem('jwt');
  window.location.href = 'login.html';
};
