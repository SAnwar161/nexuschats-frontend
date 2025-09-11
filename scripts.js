/****************************************************
 * NexusChats Authentication Scripts
 * Handles: Signup + Login flows
 * Backend: https://nexus-auth-service.yourdomain.com
 ****************************************************/

/* ---------------- SIGNUP FORM HANDLER ---------------- */
const signupForm = document.getElementById('signup-form');

if (signupForm) {
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const errorEl = document.getElementById('signup-error');

    // Reset error
    errorEl.textContent = '';

    // Client-side validation
    if (!name || !email || !password || !confirmPassword) {
      errorEl.textContent = 'All fields are required.';
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errorEl.textContent = 'Please enter a valid email address.';
      return;
    }
    if (password.length < 8) {
      errorEl.textContent = 'Password must be at least 8 characters.';
      return;
    }
    if (password !== confirmPassword) {
      errorEl.textContent = 'Passwords do not match.';
      return;
    }

    try {
      // Disable button to prevent double submit
      const submitBtn = signupForm.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Signing up...';

      const res = await fetch('https://nexus-auth-service.yourdomain.com/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        errorEl.textContent = data.error || 'Signup failed. Please try again.';
        submitBtn.disabled = false;
        submitBtn.textContent = 'Sign Up';
        return;
      }

      // Store JWT and redirect
      localStorage.setItem('token', data.token);
      window.location.href = '/dashboard.html';

    } catch (err) {
      console.error(err);
      errorEl.textContent = 'Network error. Please try again later.';
      const submitBtn = signupForm.querySelector('button[type="submit"]');
      submitBtn.disabled = false;
      submitBtn.textContent = 'Sign Up';
    }
  });
}

/* ---------------- LOGIN FORM HANDLER ---------------- */
const loginForm = document.getElementById('login-form');

if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    const errorEl = document.getElementById('login-error');

    // Reset error
    errorEl.textContent = '';

    // Client-side validation
    if (!email || !password) {
      errorEl.textContent = 'Both fields are required.';
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errorEl.textContent = 'Please enter a valid email address.';
      return;
    }

    try {
      // Disable button to prevent double submit
      const submitBtn = loginForm.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Logging in...';

      const res = await fetch('https://nexus-auth-service.yourdomain.com/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        errorEl.textContent = data.error || 'Login failed. Please check your credentials.';
        submitBtn.disabled = false;
        submitBtn.textContent = 'Log In';
        return;
      }

      // Store JWT and redirect
      localStorage.setItem('token', data.token);
      window.location.href = '/dashboard.html';

    } catch (err) {
      console.error(err);
      errorEl.textContent = 'Network error. Please try again later.';
      const submitBtn = loginForm.querySelector('button[type="submit"]');
      submitBtn.disabled = false;
      submitBtn.textContent = 'Log In';
    }
  });
}

/* ---------------- OPTIONAL: TOKEN CHECK FOR PROTECTED PAGES ---------------- */
// This can be used in dashboard.html or any protected page
async function verifyToken() {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '/login.html';
    return;
  }

  try {
    const res = await fetch('https://nexus-auth-service.yourdomain.com/auth/me', {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!res.ok) {
      localStorage.removeItem('token');
      window.location.href = '/login.html';
    }
  } catch (err) {
    console.error('Token verification failed:', err);
    localStorage.removeItem('token');
    window.location.href = '/login.html';
  }
}
