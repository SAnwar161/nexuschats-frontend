// scripts.js

const API_BASE = 'https://your-backend-domain.com'; // Replace with actual backend URL

async function validateSession(redirectIfInvalid = true) {
  const token = localStorage.getItem('jwt');
  if (!token) {
    if (redirectIfInvalid) window.location.href = 'login.html';
    return null;
  }

  try {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) throw new Error('Invalid token');
    const user = await res.json();
    return user;
  } catch (err) {
    localStorage.removeItem('jwt');
    if (redirectIfInvalid) window.location.href = 'login.html';
    return null;
  }
}

async function handleAuthForm(endpoint, formId, redirectTo) {
  const form = document.getElementById(formId);
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch(`${API_BASE}/auth/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!res.ok) throw new Error('Auth failed');
      const { token } = await res.json();
      localStorage.setItem('jwt', token);
      window.location.href = redirectTo;
    } catch (err) {
      alert('Authentication failed. Please try again.');
    }
  });
}

function logout() {
  localStorage.removeItem('jwt');
  window.location.href = 'login.html';
}
