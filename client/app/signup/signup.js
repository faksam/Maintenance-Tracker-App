function signUpUser() {
  const data = {};
  const url = '/api/v1/auth/signup';
  const form = document.getElementById('signUpForm');
  const elements = form.elements;
  for (element in elements) {
    if (elements[element].value !== undefined) { data[elements[element].name] = elements[element].value; }
  }

  const fetchData = {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
  };
  console.log(data);
  fetch(url, fetchData)
    .then(resp => resp.json())
    .then((body) => {
      if (body.status === 201 && body.success === true) {
        sessionStorage.setItem('token', body.token);
        console.log(body);
        console.log(sessionStorage.getItem('token'));
        if (body.data.role === 'Admin') { 
          window.location = './adminhomepage.html';
       }
        window.location = './homepage.html';
      } else {
        console.log(body);
      }
    })
    .catch((error) => {
      console.log(JSON.stringify(error));
    });
}

