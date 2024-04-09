const loginForm = document.getElementById('loginForm')
const errorBlock = document.getElementById('errorBlock');

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch('/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    })

    if (!response.ok) {
      errorBlock.innerText = 'Login failed';
      errorBlock.style.display = 'block';
      return;
    }
    const data = await response.json();
    console.log(data)

    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    localStorage.setItem('userName', data.name)

    window.location.href = './jobs.html';

  } catch (error) {
    console.error('Error:', error);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userName');
  }
})