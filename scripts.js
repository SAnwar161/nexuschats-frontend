// SIGNUP FORM HANDLER
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
