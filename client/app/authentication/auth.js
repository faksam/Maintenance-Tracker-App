const loginForm = document.getElementById('loginForm');
const signUpTab = document.getElementById('signUpTab');
const signInTab = document.getElementById('signInTab');

/**
 * @description - Helps to display Error Recieved from API
 *
 * @param {string} error - Error string to be displayed
 * @param {string} errorElement - HTML Element to display Error
 */
const displayLoginError = (error, errorElement) => {
  const errorDiv = document.getElementById('loginErrorDiv');
  const errorMessage = document.getElementById(errorElement);
  if (typeof (error) === 'string') {
    errorMessage.innerHTML = error;
    errorMessage.style.display = 'block';
    errorMessage.style.color = 'white';
    errorMessage.style.fontSize = 'large';
    errorDiv.style.backgroundColor = '#e34444';
    errorDiv.style.borderRadius = '10px';
    errorDiv.style.display = 'block';
  } else if (typeof (error) === 'object') {
    errorMessage.innerHTML = Object.values(error);
  }
};

/**
 * @description - Helps to clear all label and error texts recieved from API
 *
 */
const clearErrorLoginText = () => {
  document.getElementById('loginErrorMessage').innerHTML = '';
  document.getElementById('loginErrorDiv').style.display = 'none';
};

/**
 * @description - Helps to clear all label and error texts recieved from API
 *
 */
const clearErrorText = () => {
  document.getElementById('passwordLabel').innerHTML = '';
  document.getElementById('emailLabel').innerHTML = '';
  document.getElementById('fullNameLabel').innerHTML = '';
  document.getElementById('confirmPasswordLabel').innerHTML = '';
  document.getElementById('signupErrorMessage').innerHTML = '';
  document.getElementById('errorDiv').style.display = 'none';

  document.getElementById('confirmPassword').style.borderColor = '#ddd9d5';
  document.getElementById('password').style.borderColor = '#ddd9d5';
  document.getElementById('email').style.borderColor = '#ddd9d5';
  document.getElementById('fullName').style.borderColor = '#ddd9d5';
  document.getElementById('signupErrorMessage').style.borderColor = '#ddd9d5';
};

/**
 * @description - Consume API to login user
 *
 * @param {Event} evt - Event that trigerred the function
 */
const loginUser = (evt) => {
  evt.preventDefault();
  clearErrorLoginText();
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
        localStorage.setItem('mta_token_fms', body.token);
        localStorage.setItem('mta_user_role_fms', body.data.role);
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

const openForm = (formName) => {
  let i;
  const tabcontent = document.getElementsByClassName('tabcontent');
  for (i = 0; i < tabcontent.length; i += 1) {
    tabcontent[i].style.display = 'none';
  }
  const tablinks = document.getElementsByClassName('tablinks');
  for (i = 0; i < tablinks.length; i += 1) {
    tablinks[i].className = tablinks[i].className.replace(' active', '');
  }
  document.getElementById(formName).style.display = 'block';
  if (formName === 'signInTabForm') {
    signInTab.className += ' active';
  } else {
    signUpTab.className += ' active';
  }
  // evt.currentTarget.className += " active";
  clearErrorText();
  clearErrorLoginText();
};


loginForm.addEventListener('submit', loginUser);

document.addEventListener('DOMContentLoaded', () => {
  signUpTab.addEventListener('click', openForm('signUpTabForm'));
  if (signUpTab != null) {
    signUpTab.onclick = () => {
      const form = document.getElementById('signUpForm');
      const {
        fullName, email, password, confirmPassword,
      } = form.elements;
      fullName.value = '';
      email.value = '';
      password.value = '';
      confirmPassword.value = '';
      openForm('signUpTabForm');
    };
  }
  if (signInTab != null) {
    signInTab.onclick = () => {
      const {
        email, password,
      } = loginForm.elements;
      email.value = '';
      password.value = '';
      openForm('signInTabForm');
    };
  }
});


// Sign Up
const signUpForm = document.getElementById('signUpForm');
/**
 * @description - Helps to display Error Recieved from API
 *
 * @param {string} error - Error string to be displayed
 * @param {string} errorElement - HTML Element to display Error
 */
const displaySignUpError = (error, errorElement) => {
  const errorDiv = document.getElementById('errorDiv');
  const errorMessage = document.getElementById(errorElement);
  if (typeof (error) === 'string') {
    errorMessage.innerHTML = error;
    errorMessage.style.display = 'block';
    errorMessage.style.color = 'white';
    errorMessage.style.fontSize = 'large';
    errorDiv.style.backgroundColor = '#e34444';
    errorDiv.style.borderRadius = '10px';
    errorDiv.style.display = 'block';
  } else if (typeof (error) === 'object') {
    Object.keys(error).forEach((key) => {
      document.getElementById(`${key}Label`).style.color = 'red';
      document.getElementById(`${key}Label`).innerHTML = error[`${key}`];

      document.getElementById(key).style.borderColor = 'red';
      document.getElementById(key).style.boxShadow = 'none';
    });
  }
};

/**
 * @description - Consume API to signup new user
 *
 * @param {Event} evt - Event that trigerred the function
 */
const signUpUser = (evt) => {
  evt.preventDefault();
  clearErrorText();
  const {
    fullName, email, password, confirmPassword,
  } = signUpForm.elements;
  const url = '/api/v1/auth/signup';

  const data = {
    email: email.value,
    password: password.value,
    confirmPassword: confirmPassword.value,
    fullName: fullName.value,
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
        localStorage.setItem('mta_token_fms', body.token);
        localStorage.setItem('mta_user_role_fms', body.data.role);
        window.location = './homepage.html';
      } else {
        displaySignUpError(body.error.message, 'signupErrorMessage');
      }
    });
};

signUpForm.addEventListener('submit', signUpUser);
