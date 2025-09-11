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
  function renderCharts(users) {
  // 🗺️ Country Distribution
  const countryCounts = {};
  users.forEach(u => {
    const country = u.country || 'Unknown';
    countryCounts[country] = (countryCounts[country] || 0) + 1;
  });

  const countryCtx = document.getElementById('countryChart').getContext('2d');
  new Chart(countryCtx, {
    type: 'bar',
    data: {
      labels: Object.keys(countryCounts),
      datasets: [{
        label: 'Signups by Country',
        data: Object.values(countryCounts),
        backgroundColor: '#4e79a7'
      }]
    }
  });

  // 📈 Signups Over Time
  const dateCounts = {};
  users.forEach(u => {
    const date = u.created_at.split('T')[0];
    dateCounts[date] = (dateCounts[date] || 0) + 1;
  });

  const signupCtx = document.getElementById('signupChart').getContext('2d');
  new Chart(signupCtx, {
    type: 'line',
    data: {
      labels: Object.keys(dateCounts),
      datasets: [{
        label: 'Signups Over Time',
        data: Object.values(dateCounts),
        borderColor: '#f28e2b',
        fill: false
      }]
    }
  });

  // 🧮 Plan Distribution
  const planCounts = {};
  users.forEach(u => {
    const plan = u.plan || 'starter';
    planCounts[plan] = (planCounts[plan] || 0) + 1;
  });

  const planCtx = document.getElementById('planChart').getContext('2d');
  new Chart(planCtx, {
    type: 'doughnut',
    data: {
      labels: Object.keys(planCounts),
      datasets: [{
        label: 'Users by Plan',
        data: Object.values(planCounts),
        backgroundColor: ['#59a14f', '#edc948', '#e15759']
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'bottom' },
        title: { display: true, text: 'Plan Distribution' }
      }
    }
  });
}
}
