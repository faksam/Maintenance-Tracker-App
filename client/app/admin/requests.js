const rejectionReasonForm = document.getElementById('rejectionReasonForm');
const rejectionReasonButton = document.getElementById('rejectionReasonButton');
const filterRequestInput = document.getElementById('filterRequestInput');
const filterByStatus = document.getElementById('filterByStatus');

const viewRequestModal = document.getElementById('viewRequestModal');
const addRejectReasonModal = document.getElementById('addRejectReasonModal');
const addRejectReasonSpan = document.getElementById('addRejectReasonSpan');

const viewRequestTitle = document.getElementById('viewRequestTitle');
const viewRequestDescription = document.getElementById('viewRequestDescription');
const viewRequestUser = document.getElementById('viewRequestUser');
const viewRequestDate = document.getElementById('viewRequestDate');
const viewRequestButton = document.getElementById('viewRequestButton');
const viewRejectionReason = document.getElementById('viewRejectionReason');
const viewRequestStatus = document.getElementById('viewRequestStatus');
const viewRequestSpan = document.getElementById('viewRequestSpan');


const requestTableBody = document.getElementById('requestTableBody');

let reloadPage = false;
const options = {
  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
};
options.timeZone = 'UTC';
options.timeZoneName = 'short';

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
        reloadPage = true;
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
        reloadPage = true;
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
    const requestRow = requestTableBody.insertRow(0);

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
  const userRole = localStorage.getItem('mta_user_role_fms');
  if (userRole !== 'Admin') {
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

/**
 * @description - Filters the Users Request Table By Users Input to Search Field
 *
 */
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

/**
 * @description - Filters the Users Request Table By Request Status
 *
 */
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

rejectionReasonForm.addEventListener('submit', rejectRequest);
filterRequestInput.addEventListener('keyup', filterRequest);
filterByStatus.addEventListener('change', filterRquestByStatus);

window.onload = getRequests();


/**
 * @description - Check reloadPage variable if true or false
 *
 */
const checkReloadPage = (activeModal) => {
  const modal = activeModal;
  modal.style.display = 'none';
  if (reloadPage) {
    window.location.reload(true);
  }
};

window.onclick = (event) => {
  if (event.target === viewRequestModal) {
    checkReloadPage(viewRequestModal);
  } else if (event.target === addRejectReasonModal) {
    addRejectReasonModal.style.display = 'none';
  }
};
document.addEventListener('DOMContentLoaded', () => {
  if (viewRequestSpan != null) {
    viewRequestSpan.onclick = () => {
      checkReloadPage(viewRequestModal);
    };
  }
  if (addRejectReasonSpan != null) {
    addRejectReasonSpan.onclick = () => {
      addRejectReasonModal.style.display = 'none';
    };
  }
});

