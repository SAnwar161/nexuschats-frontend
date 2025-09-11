// Login handler
document.getElementById('login-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const res = await fetch('https://nexus-auth-service.sadat161.workers.dev/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (res.ok) {
    localStorage.setItem('authToken', data.token);
    window.location.href = 'dashboard.html';
  } else {
    document.getElementById('login-result').textContent = data.error;
  }
});

// Dashboard session check
if (window.location.pathname.endsWith('dashboard.html')) {
  const token = localStorage.getItem('authToken');

  fetch('https://nexus-auth-service.sadat161.workers.dev/auth/me', {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` }
  })
    .then(res => res.json())
    .then(data => {
      if (data.user) {
        document.getElementById('user-info').textContent =
          `Logged in as ${data.user.email} — Plan: ${data.user.plan}`;
      } else {
        window.location.href = 'login.html';
      }
    });
}

// Logout function
function logout() {
  localStorage.removeItem('authToken');
  window.location.href = 'login.html';
}
