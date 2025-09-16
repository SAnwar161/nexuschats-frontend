const API_BASE = 'https://api.nexuschats.org'; // corrected domain

// 🔐 Login function
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

// 🧠 Session validation
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

// 🚪 Logout
function logout() {
  localStorage.removeItem('jwt');
  window.location.href = 'login.html';
}

// 📊 Chart rendering
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
