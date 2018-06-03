const rejectionReasonForm = document.getElementById('rejectionReasonForm');
const rejectionReasonButton = document.getElementById('rejectionReasonButton');

const viewRequestModal = document.getElementById('viewRequestModal');
const addRejectReasonModal = document.getElementById('addRejectReasonModal');

const viewRequestTitle = document.getElementById('viewRequestTitle');
const viewRequestDescription = document.getElementById('viewRequestDescription');
const viewRequestUser = document.getElementById('viewRequestUser');
const viewRequestDate = document.getElementById('viewRequestDate');
const viewRequestButton = document.getElementById('viewRequestButton');
const viewRejectionReason = document.getElementById('viewRejectionReason');
const viewRequestStatus = document.getElementById('viewRequestStatus');

const requestTable = document.getElementById('requestTable');

const options = {
  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
};
options.timeZone = 'UTC';
options.timeZoneName = 'short';

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
 * @description - Consumes API to resolve a specific user request
 *
 */
function resolveRequest() {
  const requestId = this.getAttribute('id');
  const url = `/api/v1/requests/${requestId}/resolve`;

  const fetchData = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
    },
  };
  fetch(url, fetchData)
    .then(resp => resp.json())
    .then((body) => {
      if (body.status === 200 && body.success === true) {
        window.location.reload(true);
      }
    });
}

/**
 * @description - Helps to set view modal html elements
 *
 * @param {object} request - JSON object containing request data
 */
const setViewModalElements = (request) => {
  viewRequestTitle.innerHTML = request.title;
  viewRequestDescription.innerHTML = request.description;
  viewRequestUser.innerHTML = request.fullname;
  const date = new Date(request.date);
  viewRequestDate.innerHTML = date.toLocaleDateString('en-US', options);
  viewRequestStatus.innerHTML = request.status;
  if (request.status === 'Pending') {
    viewRequestButton.style.display = 'block';
    viewRequestButton.onclick = resolveRequest;
    viewRejectionReason.innerHTML = 'N/A';
  } else if (request.comment) {
    viewRejectionReason.innerHTML = request.comment;
  } else {
    viewRejectionReason.innerHTML = 'N/A';
    viewRequestButton.style.display = 'none';
  }
};

/**
 * @description - This function is called when a user clicks on request item
 *
 */
function viewClickedRequest() {
  const requestId = this.getAttribute('id');
  viewRequestButton.style.display = 'none';
  const url = `/api/v1/requests/${requestId}`;

  viewRequestModal.style.display = 'block';
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
      viewRequestButton.id = requestId;
      if (body.status === 200 && body.success === true) {
        viewRequestButton.id = requestId;
        setViewModalElements(body.data[0]);
      }
    });
}

/**
 * @description - Consumes API to approve a specific user request
 *
 */
function approveRequest() {
  const requestId = this.getAttribute('id');
  const url = `/api/v1/requests/${requestId}/approve`;

  viewRequestButton.style.display = 'none';

  const fetchData = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
    },
  };
  fetch(url, fetchData)
    .then(resp => resp.json())
    .then((body) => {
      if (body.status === 200 && body.success === true) {
        viewRequestStatus.innerHTML = body.data[0].status;
        viewRequestModal.style.display = 'block';
      }
    });
}


/**
 * @description - Consumes API to reject a specific user request
 *
 * @param {Event} evt - Event that trigerred the function
 */
function rejectRequest(evt) {
  evt.preventDefault();
  viewRequestButton.style.display = 'none';

  const requestId = this.getAttribute('id');
  const url = `/api/v1/requests/${requestId}/disapprove`;

  viewRequestModal.style.display = 'block';
  const { rejectionReason } = rejectionReasonForm.elements;

  const data = { comment: rejectionReason.value };

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
        setViewModalElements(body.data[0]);
        addRejectReasonModal.style.display = 'none';
      } else {
        displayError(body.error.message, 'errorMessage');
      }
    });
}

/**
 * @description - This function is called when a admin clicks on reject request button
 *
 */
function rejectRequestReason() {
  const requestId = this.getAttribute('id');
  rejectionReasonForm.id = requestId;
  rejectionReasonButton.id = requestId;
  addRejectReasonModal.style.display = 'block';
  addRejectReasonModal.style.zIndex = 3;
}

/**
 * @description - Helps to populate table with all user request
 *
 * @param {object} requests - JSON object containing request data
 */
const populateTable = (requests) => {
  requests.forEach((request) => {
    const requestRow = requestTable.insertRow(1);

    const cell1 = requestRow.insertCell(0);
    const cell2 = requestRow.insertCell(1);
    const cell3 = requestRow.insertCell(2);
    const cell4 = requestRow.insertCell(3);
    const cell5 = requestRow.insertCell(4);
    const cell6 = requestRow.insertCell(5);

    const date = new Date(request.date);
    cell2.colSpan = '3';
    // //name request status date
    cell1.innerHTML = request.title.bold();
    cell2.innerHTML = request.description.substring(0, 70);
    cell3.innerHTML = request.status;
    cell4.innerHTML = date.toLocaleDateString('en-US', options);

    requestRow.onclick = viewClickedRequest;
    requestRow.id = request.id;
    if (request.status === 'New') {
      const button = document.createElement('button');

      button.onclick = approveRequest;
      button.id = request.id;
      const iTag = document.createElement('i');
      iTag.innerHTML = 'check';
      iTag.classList.add('material-icons');
      button.appendChild(iTag);
      cell5.appendChild(button);
      cell5.classList.add('admin');

      const button1 = document.createElement('button');
      button1.onclick = rejectRequestReason;
      button1.id = request.id;
      button1.classList.add('danger');
      const iTag1 = document.createElement('i');
      iTag1.innerHTML = 'close';
      iTag1.classList.add('material-icons');
      button1.appendChild(iTag1);
      cell6.appendChild(button1);
    }
  });
};

/**
 * @description - Consumes API to fetch all requests
 *
 */
const getRequests = () => {
  const userRole = sessionStorage.getItem('user_role');
  if (userRole !== 'Admin')  {
    window.location = './index.html';
  } else if (userRole === 'Admin') {
    const url = '/api/v1/requests/';
  
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
          populateTable(body.data);
        }
      });
  } 
};

rejectionReasonForm.addEventListener('submit', rejectRequest);

window.onload = getRequests();
