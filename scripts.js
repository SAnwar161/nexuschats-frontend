// Handle Signup
function handleSignup(event) {
  event.preventDefault();
  const name = document.getElementById('signupName').value.trim();
  const email = document.getElementById('signupEmail').value.trim();
  const password = document.getElementById('signupPassword').value;
  const confirm = document.getElementById('signupConfirm').value;

  if (password !== confirm) {
    alert("Passwords do not match!");
    return;
  }

  // Save user to localStorage (simulated DB)
  localStorage.setItem('nexusUser', JSON.stringify({ name, email, password }));
  alert("Signup successful! Please log in.");
  window.location.href = 'login.html';
}

// Handle Login
function handleLogin(event) {
  event.preventDefault();
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;

  const storedUser = JSON.parse(localStorage.getItem('nexusUser'));
  if (storedUser && storedUser.email === email && storedUser.password === password) {
    localStorage.setItem('nexusLoggedIn', 'true');
    window.location.href = 'dashboard.html';
  } else {
    alert("Invalid email or password.");
  }
}

// Handle Chat Send
function sendMessage() {
  const input = document.getElementById('messageInput');
  const chatBox = document.getElementById('chatBox');
  if (input.value.trim() !== '') {
    const msg = document.createElement('p');
    msg.innerHTML = `<strong>You:</strong> ${input.value}`;
    chatBox.appendChild(msg);
    input.value = '';
    chatBox.scrollTop = chatBox.scrollHeight;
  }
}

// Protect Dashboard
function protectDashboard() {
  if (localStorage.getItem('nexusLoggedIn') !== 'true') {
    alert("Please log in first.");
    window.location.href = 'login.html';
  }
}
