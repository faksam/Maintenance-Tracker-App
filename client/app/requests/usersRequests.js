function getRequests() {
  const data = {};
  const url = '/api/v1/users/requests/';
  const form = document.getElementById('loginForm');

  const requestTable = document.getElementById('requestTable');

  const token = `Bearer ${sessionStorage.getItem('token')}`;
  const fetchData = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sessionStorage.getItem('token')}`,
    },
  };
  fetch(url, fetchData)
    .then(resp => resp.json())
    .then((body) => {
      if (body.status === 200 && body.success === true) {
        const data = body.data;
        console.log(data);
        for (request in data) {
          if (data[request].value !== undefined) { data[elements[element].name] = elements[element].value; }
          const requestRow = requestTable.insertRow(1);

          // Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
          const cell1 = requestRow.insertCell(0);
          const cell2 = requestRow.insertCell(1);
          const cell3 = requestRow.insertCell(2);
          const cell4 = requestRow.insertCell(3);
          const cell5 = requestRow.insertCell(4);

          // Add some text to the new cells:
          cell1.innerHTML = 'NEW CELL1';
          cell2.innerHTML = 'NEW CELL2';
          cell3.innerHTML = 'NEW CELL1';
          cell4.innerHTML = 'NEW CELL2';

          cell2.colSpan = '2';
          cell4.colSpan = '2';
          // name request status date
          cell1.innerHTML = data[request].title.bold();
          cell2.innerHTML = data[request].description.substring(0, 70);
          cell3.innerHTML = data[request].status;
          cell4.innerHTML = data[request].date;
          if (data[request].status === 'New') {
            const btn = document.createElement('button');
            // editRequest
            btn.onclick = displayEditUserRequest;
            btn.id = data[request].id;
            const iTag = document.createElement('i');
            iTag.innerHTML = 'edit';
            iTag.classList.add('material-icons');
            // var t = document.createTextNode(<i class="material-icons">edit</i>);       // Create a text node
            btn.appendChild(iTag);
            cell5.appendChild(btn);
          } else {
            requestRow.onclick = viewClickedRequest;
            requestRow.id = data[request].id;
          }
          // cell5.innerHTML = data[request].description;
        }
        console.log(body);
        console.log(sessionStorage.getItem('token'));
        // window.location = './homepage.html';
      } else {
        console.log(body);
      }
    })
    .catch((error) => {
      console.log(JSON.stringify(error));
    });
}


function viewClickedRequest() {
  const viewRequestTitle = document.getElementById('viewRequestTitle');
  const viewRequestDescription = document.getElementById('viewRequestDescription');
  const viewRequestUser = document.getElementById('viewRequestUser');
  const viewRequestDate = document.getElementById('viewRequestDate');
  const viewRequestStatus = document.getElementById('viewRequestStatus');
  const requestId = this.getAttribute('id');
  const url = `/api/v1/users/requests/${requestId}`;
  // request a weekday along with a long date
  const options = {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  };
  options.timeZone = 'UTC';
  options.timeZoneName = 'short';
  console.log(url);
  viewRequestModal.style.display = 'block';

  const data = {};
  const form = document.getElementById('createRequestForm');
  const elements = form.elements;

  console.log('in view requests');

  const fetchData = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sessionStorage.getItem('token')}`,
    },
  };
  console.log(data);
  fetch(url, fetchData)
    .then(resp => resp.json())
    .then((body) => {
      console.log(body);
      if (body.status === 200 && body.success === true) {
        viewRequestTitle.innerHTML = body.data[0].title;
        viewRequestDescription.innerHTML = body.data[0].description;
        viewRequestUser.innerHTML = body.data[0].fullname;
        const date = new Date(body.data[0].date);
        viewRequestDate.innerHTML = date.toLocaleDateString('en-US', options);
        viewRequestStatus.innerHTML = body.data[0].status;
        console.log(body);
        console.log(sessionStorage.getItem('token'));
        // window.location = './homepage.html';
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

  console.log('in create requests');
  for (element in elements) {
    if (elements[element].value !== undefined) { data[elements[element].name] = elements[element].value; }
  }
  console.log(data);

  const fetchData = {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sessionStorage.getItem('token')}`,
    },
  };
  console.log(data);
  fetch(url, fetchData)
    .then(resp => resp.json())
    .then((body) => {
      if (body.status === 201 && body.success === true) {
        console.log(body);
        console.log(sessionStorage.getItem('token'));
        window.location.reload(true);
      } else {
        console.log(body);
      }
    })
    .catch((error) => {
      console.log(JSON.stringify(error));
    });
}

function editUserRequest() {
  const requestId = this.getAttribute('id');
  const data = {};
  const url = `/api/v1/users/requests/${requestId}`;
  const form = document.getElementById('editRequestForm');
  const elements = form.elements;

  console.log('in create requests');
  for (element in elements) {
    if (elements[element].value !== undefined) { data[elements[element].name] = elements[element].value; }
  }
  console.log(data);

  const fetchData = {
    method: 'PUT',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sessionStorage.getItem('token')}`,
    },
  };
  console.log(data);
  fetch(url, fetchData)
    .then(resp => resp.json())
    .then((body) => {
      if (body.status === 200 && body.success === true) {
        console.log(body);
        console.log(sessionStorage.getItem('token'));
        window.location.reload(true);
      } else {
        console.log(body);
      }
    })
    .catch((error) => {
      console.log(JSON.stringify(error));
    });
}

function displayEditUserRequest() {
  const requestId = this.getAttribute('id');
  editRequestModal.style.display = 'block';

  const requestTitle = document.getElementById('editRequestTitle');
  const requestDescription = document.getElementById('editRequestDescription');
  const editRequestFormButton = document.getElementById('editRequestFormButton');
  editRequestFormButton.id = requestId;
  editRequestFormButton.onclick = editUserRequest;
  // editRequestFormButton
  const data = {};
  const url = `/api/v1/users/requests/${requestId}`;
  const form = document.getElementById('createRequestForm');
  const elements = form.elements;

  console.log('in create requests');
  console.log(form);
  for (element in elements) {
    if (elements[element].value !== undefined) { data[elements[element].name] = elements[element].value; }
  }
  console.log(requestTitle);

  const fetchData = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sessionStorage.getItem('token')}`,
    },
  };
  console.log(data);
  fetch(url, fetchData)
    .then(resp => resp.json())
    .then((body) => {
      if (body.status === 200 && body.success === true) {
        console.log(body);
        requestTitle.value = body.data[0].title;
        requestDescription.value = body.data[0].description;
        console.log(requestTitle);
      } else {
        console.log(body);
      }
    })
    .catch((error) => {
      console.log(JSON.stringify(error));
    });
}
