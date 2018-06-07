const accountDetailsForm = document.getElementById('accountDetailsForm');
const editAccountForm = document.getElementById('editAccountForm');
const userAccountModal = document.getElementById('userAccountModal');

const token = `Bearer ${sessionStorage.getItem('token')}`;

/**
 * @description - Helps to display Error Recieved from API
 *
 * @param {string} error - Error string to be displayed
 * @param {string} errorElement - HTML Element to display Error
 */
const displayError = (error, errorElement) => {
  const errorMessage = document.getElementById(errorElement);
  if (typeof (error) === 'string') { errorMessage.innerHTML = error; } else if (typeof (error) === 'object') { errorMessage.innerHTML = Object.values(error); }
  errorMessage.style.display = 'block';
  errorMessage.style.color = 'red';
};

/**
 * @description - Consume API to get users account details
 *
 */
const displayAccountDetails = () => {
  const {
    fullName, email, phoneNo, role,
  } = accountDetailsForm.elements;
  const {
    editFullName, editEmail, editPhoneNo,
  } = editAccountForm.elements;
  const url = '/api/v1/users/account';

  const fetchData = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
    },
  };

  fetch(url, fetchData)
    .then(resp => resp.json())
    .then((body) => {
      if (body.status === 200 && body.success === true) {
        fullName.value = body.data.fullName;
        email.value = body.data.email;
        phoneNo.value = body.data.phoneNo;
        role.value = body.data.role;
        editFullName.value = body.data.fullName;
        editEmail.value = body.data.email;
        editPhoneNo.value = body.data.phoneNo;
      }
    });
};

/**
 * @description - Consume API to signup new user
 *
 * @param {Event} evt - Event that trigerred the function
 */
const editAccount = (evt) => {
  evt.preventDefault();
  const {
    editFullName, editEmail, editPhoneNo,
  } = editAccountForm.elements;
  const url = '/api/v1/users/account';

  const data = {
    email: editEmail.value, fullName: editFullName.value, phoneNo: editPhoneNo.value,
  };

  const fetchData = {
    method: 'PUT',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
    },
  };

  fetch(url, fetchData)
    .then(resp => resp.json())
    .then((body) => {
      if (body.status === 200 && body.success === true) {
        displayAccountDetails();
        userAccountModal.style.display = 'none';
      } else {
        displayError(body.error.message, 'errorMessage');
      }
    });
};

window.onload = displayAccountDetails();

editAccountForm.addEventListener('submit', editAccount);
