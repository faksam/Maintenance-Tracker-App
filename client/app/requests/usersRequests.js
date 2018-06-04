const createRequestForm = document.getElementById('createRequestForm');
const createRequestButton = document.getElementById('createRequestButton');
const adminhomepage = document.getElementById('adminhomepage');
const filterRequestInput = document.getElementById('filterRequestInput');
const filterByStatus = document.getElementById('filterByStatus');

const viewRequestModal = document.getElementById('viewRequestModal');
const editRequestModal = document.getElementById('editRequestModal');
const createRequestModal = document.getElementById('createRequestModal');

const viewRequestTitle = document.getElementById('viewRequestTitle');
const viewRequestDescription = document.getElementById('viewRequestDescription');
const viewRequestDate = document.getElementById('viewRequestDate');
const viewRequestStatus = document.getElementById('viewRequestStatus');

const requestTitle = document.getElementById('editRequestTitle');
const requestDescription = document.getElementById('editRequestDescription');
const editRequestFormButton = document.getElementById('editRequestFormButton');

const requestTableBody = document.getElementById('requestTableBody');


// request a weekday along with a long date
const options = {
  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
};
options.timeZone = 'UTC';
options.timeZoneName = 'short';

const token = `Bearer ${sessionStorage.getItem('token')}`;

/**
 * @description - Helps to set view modal html elements
 *
 * @param {object} request - JSON object containing request data
 */
const setViewModalElements = (request) => {
  viewRequestTitle.innerHTML = request.title;
  viewRequestDescription.innerHTML = request.description;
  const date = new Date(request.date);
  viewRequestDate.innerHTML = date.toLocaleDateString('en-US', options);
  viewRequestStatus.innerHTML = request.status;
};

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
 * @description - This function is called when a user clicks on request item
 *
 */
function viewClickedRequest() {
  const requestId = this.getAttribute('id');
  const url = `/api/v1/users/requests/${requestId}`;

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
        setViewModalElements(body.data[0]);
      }
    });
  viewRequestModal.style.display = 'block';
}

/**
 * @description - Sets view modal html elements with edited request item
 *
 * @param {object} request - JSON object containing request data
 */
const setViewModalEditedElements = (request) => {
  viewRequestTitle.innerHTML = request.title;
  viewRequestDescription.innerHTML = request.description;
  const date = new Date(request.date);
  viewRequestDate.innerHTML = date.toLocaleDateString('en-US', options);
  viewRequestStatus.innerHTML = request.status;
};

/**
 * @description - Consumes API and edits a specific request
 *
 * @param {Event} evt - Event that trigerred the function
 */
function editUserRequest(evt) {
  evt.preventDefault();
  const requestId = this.getAttribute('id');
  const url = `/api/v1/users/requests/${requestId}`;
  const form = document.getElementById('editRequestForm');
  const {
    title, description,
  } = form.elements;
  const data = {
    title: title.value, description: description.value,
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
        setViewModalEditedElements(body.data);
        editRequestModal.style.display = 'none';
      } else {
        displayError(body.error.message, 'editErrorMessage');
      }
    });
}

/**
 * @description - Consumes API and displays edited request
 *
 * @param {Event} evt - Event that trigerred the function
 */
function displayEditUserRequest(evt) {
  evt.preventDefault();
  const requestId = this.getAttribute('id');
  editRequestFormButton.id = requestId;
  editRequestFormButton.onclick = editUserRequest;
  const url = `/api/v1/users/requests/${requestId}`;

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
        requestTitle.value = body.data[0].title;
        requestDescription.value = body.data[0].description;
      }
    });
  editRequestModal.style.zIndex = 3;
  editRequestModal.style.display = 'block';
}

/**
 * @description - Helps to populate table with all user request
 *
 * @param {object} requests - JSON object containing request data
 */
const populateTable = (requests) => {
  requests.forEach((request) => {
    const requestRow = requestTableBody.insertRow(0);
    const cell1 = requestRow.insertCell(0);
    const cell2 = requestRow.insertCell(1);
    const cell3 = requestRow.insertCell(2);
    const cell4 = requestRow.insertCell(3);
    const cell5 = requestRow.insertCell(4);
    cell2.colSpan = '2';
    cell4.colSpan = '2';


    cell1.innerHTML = request.title.bold();
    cell2.innerHTML = request.description.substring(0, 70);
    cell3.innerHTML = request.status;
    cell4.innerHTML = request.date;
    requestRow.onclick = viewClickedRequest;
    requestRow.id = request.id;
    if (request.status === 'New') {
      const button = document.createElement('button');
      button.onclick = displayEditUserRequest;
      button.id = request.id;
      const iTag = document.createElement('i');
      iTag.innerHTML = 'edit';
      iTag.classList.add('material-icons');
      button.appendChild(iTag);
      cell5.appendChild(button);
    }
  });
};

/**
 * @description - Consumes API to fetch all users request
 *
 */
const getRequests = () => {
  const userRole = sessionStorage.getItem('user_role');

  if (userRole === 'User' || userRole === 'Admin') {
    if (userRole === 'Admin') {
      adminhomepage.style.display = 'block';
    }
    const url = '/api/v1/users/requests/';

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
          const { data } = body;
          populateTable(data);
        }
      });
  } else {
    window.location = './index.html';
  }
};

/**
 * @description - Consumes API to create new user request
 *
 * @param {Event} evt - Event that trigerred the function
 */
const createUserRequest = (evt) => {
  evt.preventDefault();
  const url = '/api/v1/users/requests';
  const form = document.getElementById('createRequestForm');
  const {
    title, description,
  } = form.elements;
  const data = {
    title: title.value, description: description.value,
  };

  const fetchData = {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
    },
  };
  fetch(url, fetchData)
    .then(resp => resp.json())
    .then((body) => {
      if (body.status === 201 && body.success === true) {
        window.location.reload(true);
      } else {
        displayError(body.error.message, 'createErrorMessage');
      }
    });
};

/**
 * @description - Displays create request modal
 *
 * @param {Event} evt - Event that trigerred the function
 */
const createRequest = () => {
  createRequestModal.style.display = 'block';
};

const filterRequest = () => {
  const filter = filterRequestInput.value.toLowerCase();
  const requestTableRows = Object.values(requestTableBody.rows);
  requestTableRows.forEach((row, index) => {
    if (row.innerText.toLowerCase().indexOf(filter) > -1) {
      requestTableRows[index].style.display = 'table-row';
    } else if (row.innerText.toLowerCase().indexOf(filter) < 0) {
      requestTableRows[index].style.display = 'none';
    }
  });
};

const filterRquestByStatus = () => {
  filterRequestInput.value = '';
  const requestTableRows = Object.values(requestTableBody.rows);
  requestTableRows.forEach((row, index) => {
    const { cells } = requestTableRows[index];
    if (filterByStatus.value.toLowerCase() === 'all') {
      requestTableRows[index].style.display = 'table-row';
    } else if (cells[2].innerText.toLowerCase() === filterByStatus.value.toLowerCase()) {
      requestTableRows[index].style.display = 'table-row';
    } else {
      requestTableRows[index].style.display = 'none';
    }
  });
};

createRequestForm.addEventListener('submit', createUserRequest);
createRequestButton.addEventListener('click', createRequest);
filterRequestInput.addEventListener('keyup', filterRequest);
filterByStatus.addEventListener('change', filterRquestByStatus);

window.onload = getRequests();
