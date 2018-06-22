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
const viewRequestResolve = document.getElementById('viewRequestResolve');
const viewRequestApprove = document.getElementById('viewRequestApprove');
const viewRequestDisapprove = document.getElementById('viewRequestDisapprove');
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
 * @description - Helps to set view modal buttons for a pending request html elements
 *
 * @param {object} request - JSON object containing request data
 */
const setViewModalPendingRequest = (requestId) => {
  viewRequestResolve.disabled = false;
  viewRequestApprove.disabled = true;
  viewRequestDisapprove.disabled = false;
  viewRequestResolve.onclick = resolveRequest;
  viewRequestDisapprove.className = 'danger';
  viewRequestDisapprove.id = requestId;
  viewRequestResolve.id = requestId;
  viewRequestDisapprove.onclick = rejectRequestReason;
  viewRejectionReason.innerHTML = 'N/A';
};

/**
 * @description - Consumes API to approve a specific user request
 *
 */
function approveRequest() {
  const requestId = this.getAttribute('id');
  const url = `/api/v1/requests/${requestId}/approve`;

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
        setViewModalPendingRequest(body.data[0].id);
        reloadPage = true;
      }
    });
}

/**
 * @description - Helps to set view modal buttons for a new request html elements
 *
 * @param {object} request - JSON object containing request data
 */
const setViewModalNewRequest = (requestId) => {
  viewRequestResolve.disabled = true;
  viewRequestApprove.disabled = false;
  viewRequestDisapprove.disabled = false;
  viewRequestApprove.id = requestId;
  viewRequestApprove.onclick = approveRequest;
  viewRequestDisapprove.className = 'danger';
  viewRequestDisapprove.id = requestId;
  viewRequestDisapprove.onclick = rejectRequestReason;
  viewRejectionReason.innerHTML = 'N/A';
};

/**
 * @description - Helps to set view modal buttons for disapproved request html elements
 *
 * @param {object} request - JSON object containing request data
 */
const setViewModalDisapprovedRequest = (requestId) => {
  viewRequestApprove.id = requestId;
  viewRequestApprove.onclick = approveRequest;
  viewRequestResolve.disabled = true;
  viewRequestApprove.disabled = false;
  viewRequestDisapprove.disabled = true;
};


/**
 * @description - Helps to set view modal buttons for a resolved request html elements
 *
 * @param {object} request - JSON object containing request data
 */
const setViewModalResolvedRequest = () => {
  viewRequestResolve.disabled = true;
  viewRequestApprove.disabled = true;
  viewRequestDisapprove.disabled = true;
};
/**
 * @description - Helps to set view modal html elements
 *
 * @param {object} request - JSON object containing request data
 */
const setViewModalElements = (request) => {
  viewRequestApprove.style.display = 'block';
  viewRequestDisapprove.style.display = 'block';
  viewRequestResolve.style.display = 'block';
  viewRequestTitle.innerHTML = request.title.bold();
  viewRequestDescription.innerHTML = request.description;
  viewRequestUser.innerHTML = request.fullname;
  const date = new Date(request.date);
  viewRequestDate.innerHTML = date.toLocaleDateString('en-US', options);
  viewRequestStatus.innerHTML = request.status;
  if (request.status === 'New') {
    setViewModalNewRequest(request.id);
  } else if (request.status === 'Pending') {
    setViewModalPendingRequest(request.id);
  } else if (request.status === 'Disapproved') {
    setViewModalDisapprovedRequest(request.id);
  } else if (request.status === 'Resolved') {
    setViewModalResolvedRequest(request.id);
  }
  if (request.comment) {
    viewRejectionReason.innerHTML = request.comment;
  } else {
    viewRejectionReason.innerHTML = 'N/A';
  }
};

/**
 * @description - This function is called when a user clicks on request item
 *
 */
function viewClickedRequest() {
  const requestId = this.getAttribute('id');
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
      viewRequestResolve.id = requestId;
      if (body.status === 200 && body.success === true) {
        viewRequestResolve.id = requestId;
        setViewModalElements(body.data[0]);
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
        setViewModalDisapprovedRequest(body.data[0].id);
        reloadPage = true;
      } else {
        displayError(body.error.message, 'errorMessage');
      }
    });
}

/**
 * @description - Helps to populate table with all user request
 *
 * @param {object} requests - JSON object containing request data
 */
const populateTable = (requests) => {
  requests.forEach((request) => {
    const requestRow = requestTableBody.insertRow(-1);

    const cell1 = requestRow.insertCell(0);
    const cell2 = requestRow.insertCell(1);
    const cell3 = requestRow.insertCell(2);
    const cell4 = requestRow.insertCell(3);

    const date = new Date(request.date);
    cell2.colSpan = '3';
    // //name request status date
    cell1.innerHTML = request.title.bold();
    cell2.innerHTML = request.description.substring(0, 70);
    cell3.innerHTML = request.status;
    cell4.innerHTML = date.toLocaleDateString('en-US', options);

    requestRow.onclick = viewClickedRequest;
    requestRow.id = request.id;
  });
};

/**
 * @description - Helps to display pagination for data
 *
 * @param {int} dataLength - Length of all user data
 */
const dataPaginator = (dataLength) => {
  const pageCount = Math.ceil(dataLength / 20);
  const paginationSection = document.getElementById('paginationSection');
  if (pageCount === 1) {
    paginationSection.style.display = 'none';
  } else {
    paginationSection.style.display = 'block';
    for (let index = 1; index <= pageCount; index += 1) {
      const aTag = document.createElement('a');
      aTag.setAttribute('href', `?page=${index}`);
      paginationSection.appendChild(aTag);
    }
  }
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
    const urlParams = new URLSearchParams(window.location.search);
    let url = '/api/v1/requests';
    if (urlParams.has('page')) {
      url = `/api/v1/requests?${urlParams.toString()}`;
    }

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
          dataPaginator(body.total);
        }
      });
  }
};


/**
 * @description - Consumes API to fetch filtered requests
 *
 */
const filterRequests = () => {
  const userRole = localStorage.getItem('mta_user_role_fms');
  if (userRole !== 'Admin') {
    window.location = './index.html';
  } else if (userRole === 'Admin') {
    const searchText = filterRequestInput.value;
    const requestStatus = filterByStatus.value;
    const url = `/api/v1/requests/filter?searchText=${searchText}&status=${requestStatus}&page=1`;

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
          requestTableBody.innerHTML = '';
          populateTable(body.data);
          dataPaginator(body.total);
          window.history.pushState(
            { id: 'adminhomepage' },
            'Track your maintenance request - MTA',
            `./adminhomepage.html?searchText=${searchText}&status=${requestStatus}&page=1`,
          );
        }
      });
  }
};

rejectionReasonForm.addEventListener('submit', rejectRequest);
filterByStatus.addEventListener('change', filterRequests);

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
    const form = rejectionReasonForm;
    const {
      rejectionReason,
    } = form.elements;
    document.getElementById('errorMessage').innerHTML = '';
    rejectionReason.value = '';
    addRejectReasonModal.style.display = 'none';
  }
};
document.addEventListener('DOMContentLoaded', () => {
  if (filterRequestInput != null) {
    filterRequestInput.onkeyup = (evt) => {
      evt.preventDefault();
      if (evt.keyCode === 13) {
        filterRequests();
      }
    };
  }
  if (viewRequestSpan != null) {
    viewRequestSpan.onclick = () => {
      checkReloadPage(viewRequestModal);
    };
  }
  if (addRejectReasonSpan != null) {
    addRejectReasonSpan.onclick = () => {
      const form = rejectionReasonForm;
      document.getElementById('errorMessage').innerHTML = '';
      const {
        rejectionReason,
      } = form.elements;
      rejectionReason.value = '';
      addRejectReasonModal.style.display = 'none';
    };
  }
});

