function getRequests() {
  const data = {};
  const url = '/api/v1/users/requests';
  const form = document.getElementById('loginForm');
  const elements = form.elements;

  for (element in elements) {
    if (elements[element].value !== undefined) { data[elements[element].name] = elements[element].value; }
  }

  const fetchData = {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '+sessionStorage.getItem("token")
   },
  };
  console.log(data);
  fetch(url, fetchData)
    .then(resp => resp.json())
    .then((body) => {
      if (body.status === 200 && body.success === true) {
        sessionStorage.setItem('token', body.token);
        console.log(body);
        console.log(sessionStorage.getItem('token'));
        window.location = './homepage.html';
      } else {
        console.log(body);
      }
    })
    .catch((error) => {
      console.log(JSON.stringify(error));
    });
}

function createUserRequest() {
  const data = {};
  const url = '/api/v1/users/requests';
  const form = document.getElementById('createRequestForm');
  const elements = form.elements;

  console.log("in create requests");
  for (element in elements) {
    if (elements[element].value !== undefined) { data[elements[element].name] = elements[element].value; }
  }
  console.log(data);

  const fetchData = {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '+sessionStorage.getItem("token")
   },
  };
  console.log(data);
  fetch(url, fetchData)
    .then(resp => resp.json())
    .then((body) => {
      if (body.status === 201 && body.success === true) {
        console.log(body);
        console.log(sessionStorage.getItem('token'));
        //window.location = './homepage.html';
      } else {
        console.log(body);
      }
    })
    .catch((error) => {
      console.log(JSON.stringify(error));
    });
}

function editUserRequest() {
  const data = {};
  const url = '/api/v1/users/requests';
  const form = document.getElementById('createRequestForm');
  const elements = form.elements;

  console.log("in create requests");
  console.log(form);
  for (element in elements) {
    if (elements[element].value !== undefined) { data[elements[element].name] = elements[element].value; }
  }

  const fetchData = {
    method: 'PUT',
    body: JSON.stringify(data),
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '+sessionStorage.getItem("token")
   },
  };
  console.log(data);
  fetch(url, fetchData)
    .then(resp => resp.json())
    .then((body) => {
      if (body.status === 201 && body.success === true) {
        sessionStorage.setItem('token', body.token);
        console.log(body);
        console.log(sessionStorage.getItem('token'));
        window.location = './homepage.html';
      } else {
        console.log(body);
      }
    })
    .catch((error) => {
      console.log(JSON.stringify(error));
    });
}
