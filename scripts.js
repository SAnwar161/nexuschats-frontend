console.log("✅ scripts.js loaded");

const API_BASE = 'https://api.nexuschats.org';

// =====================
// LOGIN USER
// =====================
window.loginUser = async function(email, password) {
  console.log("🔐 Attempting login with:", email, `(password length: ${password.length})`);
  console.log("🌐 API endpoint:", `${API_BASE}/auth/login`);

  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    console.log("📡 Login response status:", res.status);

    const rawText = await res.text();
    console.log("📜 Raw login response text:", rawText);

    let data;
    try {
      data = JSON.parse(rawText);
    } catch (err) {
      console.error("💥 Failed to parse JSON from login response:", err);
      alert('Server returned invalid response format.');
      return false;
    }

    console.log("📦 Parsed login response JSON:", data);

    if (res.ok && data.token) {
      console.log("✅ Login successful, storing token.");
      localStorage.setItem('jwt', data.token);
      window.location.href = 'dashboard.html';
      return true;
    } else {
      console.warn("❌ Login failed:", data.error || 'Unknown error');
      alert(data.error || 'Login failed');
      return false;
    }
  } catch (err) {
    console.error("💥 loginUser() network error:", err);
    alert('Network error — please try again.');
    return false;
  }
};

// =====================
// VALIDATE SESSION
// =====================
window.validateSession = async function() {
  const token = localStorage.getItem('jwt');
  if (!token) {
    console.log("ℹ️ No token found in localStorage.");
    return null;
  }

  console.log("🔍 Validating session with token:", token.slice(0, 10) + "...");

  try {
    const res = await fetch(`${API_BASE}/auth/me`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token })
    });

    console.log("📡 /auth/me response status:", res.status);

    if (!res.ok) {
      console.warn("⚠️ Session validation failed.");
      return null;
    }

    const data = await res.json();
    console.log("🧾 Session validation result:", data);
    return data.user || null;
  } catch (err) {
    console.error("💥 validateSession() error:", err);
    return null;
  }
};

// =====================
// LOGOUT
// =====================
window.logout = function() {
  console.log("🚪 Logging out, clearing token.");
  localStorage.removeItem('jwt');
  window.location.href = 'login.html';
};
