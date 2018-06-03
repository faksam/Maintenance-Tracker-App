const signoutButton = document.getElementById('signoutButton');

const signOutUser = () => {
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('user_role');
  window.location = './index.html';
};

signoutButton.addEventListener('click', signOutUser);
