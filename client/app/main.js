const checkLoggedInUser = () => {
  const userRole = localStorage.getItem('mta_user_role_fms');
  if (userRole === 'User') {
    window.location = './homepage.html';
  } else if (userRole === 'Admin') {
    window.location = './adminhomepage.html';
  }
};

window.onload = checkLoggedInUser();
