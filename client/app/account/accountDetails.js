const accountDetailsForm = document.getElementById('accountDetailsForm');
const editAccountForm = document.getElementById('editAccountForm');
const editAccountPasswordForm = document.getElementById('editAccountPasswordForm');

const userAccountModal = document.getElementById('userAccountModal');
const userAccountPasswordModal = document.getElementById('userAccountPasswordModal');
const userAccountSpan = document.getElementById('userAccountSpan');
const userAccountPasswordSpan = document.getElementById('userAccountPasswordSpan');

const changePasswordButton = document.getElementById('changePasswordButton');

const token = `Bearer ${localStorage.getItem('mta_token_fms')}`;

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
    fullName, email, phoneNo,
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
        editFullName.value = body.data.fullName;
        editEmail.value = body.data.email;
        editPhoneNo.value = body.data.phoneNo;
      }
    });
};

/**
 * @description - Consume API to edit user account details
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


/**
 * @description - Display User Account Password Modal
 *
 */
const displayPasswordModal = () => {
  userAccountPasswordModal.style.display = 'block';
};

/**
 * @description - Hide User Account Password Modal
 *
 */
const hidePasswordModal = (editAccountFormElements) => {
  const {
    currentAccountPassword, newAccountPassword, confirmAccountPassword,
  } = editAccountFormElements.elements;
  userAccountPasswordModal.style.display = 'none';
  currentAccountPassword.value = '';
  newAccountPassword.value = '';
  confirmAccountPassword.value = '';
  const passwordErrorMessage = document.getElementById('passwordErrorMessage');
  passwordErrorMessage.innerHTML = '';
  passwordErrorMessage.style.display = 'none';
};

/**
 * @description - Display User Account Modal
 *
 */
const displayUserAccountModal = (evt) => {
  evt.preventDefault();
  userAccountModal.style.display = 'block';
};

  /**
   * @description - Consume API to edit user account password
   *
   * @param {Event} evt - Event that trigerred the function
   */
const editAccountPassword = (evt) => {
  evt.preventDefault();
  userAccountPasswordModal.style.display = 'block';
  const {
    currentAccountPassword, newAccountPassword, confirmAccountPassword,
  } = editAccountPasswordForm.elements;

  const url = '/api/v1/users/account/password';

  const data = {
    password: currentAccountPassword.value,
    newPassword: newAccountPassword.value,
    confirmNewPassword: confirmAccountPassword.value,
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
        hidePasswordModal(editAccountPasswordForm);
      } else {
        displayError(body.error.message, 'passwordErrorMessage');
      }
    });
};

window.onload = displayAccountDetails();

editAccountForm.addEventListener('submit', editAccount);
changePasswordButton.addEventListener('click', displayPasswordModal);
editAccountPasswordForm.addEventListener('submit', editAccountPassword);
accountDetailsForm.addEventListener('submit', displayUserAccountModal);


window.onclick = (event) => {
  if (event.target === userAccountModal) {
    userAccountModal.style.display = 'none';
  } else if (event.target === userAccountPasswordModal) {
    userAccountPasswordModal.style.display = 'none';
  }
};
document.addEventListener('DOMContentLoaded', () => {
  if (userAccountPasswordSpan != null) {
    userAccountPasswordSpan.onclick = () => {
      userAccountPasswordModal.style.display = 'none';
    };
  }
  if (userAccountSpan != null) {
    userAccountSpan.onclick = () => {
      userAccountModal.style.display = 'none';
    };
  }
});

