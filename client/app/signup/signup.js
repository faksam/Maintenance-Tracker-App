const signUpForm = document.getElementById('signUpForm');

/**
 * @description - Helps to display Error Recieved from API
 *
 * @param {string} error - Error string to be displayed
 * @param {string} errorElement - HTML Element to display Error
 */
const displaySignUpError = (error, errorElement) => {
  const errorMessage = document.getElementById(errorElement);
  if (typeof (error) === 'string') { errorMessage.innerHTML = error; } else if (typeof (error) === 'object') { errorMessage.innerHTML = Object.entries(error); }
  errorMessage.style.display = 'block';
  errorMessage.style.color = 'red';
};

/**
 * @description - Consume API to signup new user
 *
 * @param {Event} evt - Event that trigerred the function
 */
const signUpUser = (evt) => {
  evt.preventDefault();
  const {
    fullName, email, password, phoneNo,
  } = signUpForm.elements;
  const url = '/api/v1/auth/signup';

  const data = {
    email: email.value, password: password.value, fullName: fullName.value, phoneNo: phoneNo.value,
  };

  const fetchData = {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
  };

  fetch(url, fetchData)
    .then(resp => resp.json())
    .then((body) => {
      if (body.status === 201 && body.success === true) {
        sessionStorage.setItem('token', body.token);
        window.location = './homepage.html';
      } else {
        displaySignUpError(body.error.message, 'signupErrorMessage');
      }
    });
};

signUpForm.addEventListener('submit', signUpUser);
