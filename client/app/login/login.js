const loginForm = document.getElementById('loginForm');

/**
 * @description - Helps to display Error Recieved from API
 *
 * @param {string} error - Error string to be displayed
 * @param {string} errorElement - HTML Element to display Error
 */
const displayLoginError = (error, errorElement) => {
  const errorMessage = document.getElementById(errorElement);
  if (typeof (error) === 'string') { errorMessage.innerHTML = error; } else if (typeof (error) === 'object') { errorMessage.innerHTML = Object.entries(error); }
  errorMessage.style.display = 'block';
  errorMessage.style.color = 'red';
};

/**
 * @description - Consume API to login user
 *
 * @param {Event} evt - Event that trigerred the function
 */
const loginUser = (evt) => {
  evt.preventDefault();
  const { email, password } = loginForm.elements;
  const url = '/api/v1/auth/login';

  const data = { email: email.value, password: password.value };
  const fetchData = {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
  };

  fetch(url, fetchData)
    .then(resp => resp.json())
    .then((body) => {
      if (body.status === 200 && body.success === true) {
        sessionStorage.setItem('token', body.token);
        if (body.data.role === 'Admin') {
          window.location = './adminhomepage.html';
        } else {
          window.location = './homepage.html';
        }
      } else {
        displayLoginError(body.error.message, 'loginErrorMessage');
      }
    });
};

loginForm.addEventListener('submit', loginUser);

