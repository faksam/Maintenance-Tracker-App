const checkLoggedInUser = () => {
  const userRole = sessionStorage.getItem('user_role');
  if (userRole === 'User') {
    window.location = './homepage.html';
  } else if (userRole === 'Admin') {
    window.location = './adminhomepage.html';
  }
};

window.onload = checkLoggedInUser();
