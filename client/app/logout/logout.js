const signoutButton = document.getElementById('signoutButton');

const signOutUser = () => {
  localStorage.removeItem('mta_token_fms');
  localStorage.removeItem('mta_user_role_fms');
  window.location = './index.html';
};

signoutButton.addEventListener('click', signOutUser);
