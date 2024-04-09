const formDOM = document.getElementById('registerForm')
const errorBlock = document.getElementById('errorBlock');

formDOM.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch('/api/v1/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email, password })
    });

    if (!response.ok) {
      errorBlock.innerText = 'Registration failed';
      errorBlock.style.display = 'block';
      return;
    }
    const data = await response.json();
    console.log(data);

    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    localStorage.setItem('userName', data.userName);

    window.location.href = './jobs.html';
  } catch (error) {
    console.error('Error:', error);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userName');
  }

})

