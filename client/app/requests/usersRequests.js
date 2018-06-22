const createRequestForm = document.getElementById('createRequestForm');
const createRequestButton = document.getElementById('createRequestButton');
const adminhomepage = document.getElementById('adminhomepage');
const filterRequestInput = document.getElementById('filterRequestInput');
const filterByStatus = document.getElementById('filterByStatus');

const viewRequestModal = document.getElementById('viewRequestModal');
const editRequestModal = document.getElementById('editRequestModal');
const createRequestModal = document.getElementById('createRequestModal');
const confirmDeleteModal = document.getElementById('confirmDeleteModal');

const confirmDeleteSpan = document.getElementById('confirmDeleteSpan');
const viewRequestTitle = document.getElementById('viewRequestTitle');
const viewRequestDescription = document.getElementById('viewRequestDescription');
const viewRequestDate = document.getElementById('viewRequestDate');
const viewRequestStatus = document.getElementById('viewRequestStatus');
const editRequestSpan = document.getElementById('editRequestSpan');
const createRequestSpan = document.getElementById('createRequestSpan');
const viewRequestSpan = document.getElementById('viewRequestSpan');

const requestTitle = document.getElementById('editRequestTitle');
const requestDescription = document.getElementById('editRequestDescription');
const editRequestFormButton = document.getElementById('editRequestFormButton');

const deleteRequest = document.getElementById('deleteRequest');
const cancelDelete = document.getElementById('cancelDelete');

const requestTableBody = document.getElementById('requestTableBody');

let reloadPage = false;

// request a weekday along with a long date
const options = {
  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
};
options.timeZone = 'UTC';
options.timeZoneName = 'short';

const token = `Bearer ${localStorage.getItem('mta_token_fms')}`;

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
  const errorDiv = document.getElementById('errorDiv');
  const errorMessage = document.getElementById(errorElement);
  document.getElementById('titleLabel').style.display = 'none';
  document.getElementById('descriptionLabel').style.display = 'none';
  if (typeof (error) === 'string') {
    errorMessage.innerHTML = error;
    errorMessage.style.display = 'block';
    errorMessage.style.color = 'white';
    errorMessage.style.fontSize = 'large';
    errorDiv.style.backgroundColor = '#e34444';
    errorDiv.style.borderRadius = '10px';
    errorDiv.style.display = 'block';
  } else if (typeof (error) === 'object') {
    errorDiv.style.display = 'none';
    Object.keys(error).forEach((key) => {
      document.getElementById(`${key}Label`).style.display = 'block';
      document.getElementById(`${key}Label`).style.color = 'red';
      document.getElementById(`${key}Label`).innerHTML = error[`${key}`];
    });
  }
};

/**
 * @description - Helps to display Error Recieved from API
 *
 * @param {string} error - Error string to be displayed
 * @param {string} errorElement - HTML Element to display Error
 */
const displayEditError = (error, errorElement) => {
  const editErrorDiv = document.getElementById('editErrorDiv');
  const errorMessage = document.getElementById(errorElement);
  document.getElementById('titleLabelEdit').style.display = 'none';
  document.getElementById('descriptionLabelEdit').style.display = 'none';
  if (typeof (error) === 'string') {
    errorMessage.innerHTML = error;
    errorMessage.style.display = 'block';
    errorMessage.style.color = 'white';
    errorMessage.style.fontSize = 'large';
    editErrorDiv.style.backgroundColor = '#e34444';
    editErrorDiv.style.borderRadius = '10px';
    editErrorDiv.style.display = 'block';
  } else if (typeof (error) === 'object') {
    editErrorDiv.style.display = 'none';
    Object.keys(error).forEach((key) => {
      document.getElementById(`${key}LabelEdit`).style.display = 'block';
      document.getElementById(`${key}LabelEdit`).style.color = 'red';
      document.getElementById(`${key}LabelEdit`).innerHTML = error[`${key}`];
    });
  }
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
 * @description - This function is called when a user clicks on delete request button
 *
 */
function viewDeletedRequest() {
  const requestId = this.getAttribute('id');
  const url = `/api/v1/users/requests/${requestId}`;
  confirmDeleteModal.style.display = 'none';
  const fetchData = {
    method: 'DELETE',
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
 * @description - Check reloadPage variable if true or false
 *
 */
const closeDeleteModal = () => {
  confirmDeleteModal.style.display = 'none';
};

/**
 * @description - This function is called when a user clicks on delete request button
 *
 */
function confirmDeleteRequest(evt) {
  evt.stopPropagation();
  const requestId = this.getAttribute('id');
  deleteRequest.onclick = viewDeletedRequest;
  deleteRequest.id = requestId;
  cancelDelete.onclick = closeDeleteModal;
  confirmDeleteModal.style.display = 'block';
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
        reloadPage = true;
      } else {
        displayEditError(body.error.message, 'editErrorMessage');
      }
    });
  viewRequestModal.style.display = 'block';
}

/**
 * @description - Consumes API and displays edited request
 *
 * @param {Event} evt - Event that trigerred the function
 */
function displayEditUserRequest(evt) {
  evt.preventDefault();
  evt.stopPropagation();
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
  viewRequestModal.style.display = 'none';
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
    cell2.colSpan = '2';
    cell4.colSpan = '2';

    const date = new Date(request.date);

    cell1.innerHTML = request.title.bold();
    cell2.innerHTML = request.description.substring(0, 70);
    cell3.innerHTML = request.status;
    cell4.innerHTML = date.toLocaleDateString('en-US', options);
    requestRow.onclick = viewClickedRequest;
    requestRow.id = request.id;
    if (request.status === 'New') {
      const button = document.createElement('button');
      const button1 = document.createElement('button');
      button.onclick = displayEditUserRequest;
      button1.onclick = confirmDeleteRequest;
      button1.className = 'danger';
      button.id = request.id;
      button1.id = request.id;
      const iTag = document.createElement('i');
      const iTag1 = document.createElement('i');
      iTag.innerHTML = 'edit';
      iTag1.innerHTML = 'delete';
      iTag.classList.add('material-icons');
      iTag1.classList.add('material-icons');
      button.appendChild(iTag);
      button1.appendChild(iTag1);
      cell5.appendChild(button);
      cell6.appendChild(button1);
    }
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
 * @description - Consumes API to fetch all users request
 *
 */
const getRequests = () => {
  const userRole = localStorage.getItem('mta_user_role_fms');

  if (userRole === 'User' || userRole === 'Admin') {
    if (userRole === 'Admin') {
      adminhomepage.style.display = 'block';
    }
    const urlParams = new URLSearchParams(window.location.search);
    let url = '/api/v1/users/requests';
    if (urlParams.has('page')) {
      url = `/api/v1/users/requests?${urlParams.toString()}`;
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
          const { data } = body;
          populateTable(data);
          dataPaginator(body.total);
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
 */
const createRequest = () => {
  createRequestModal.style.display = 'block';
};

/**
 * @description - Consumes API to fetch filtered requests
 *
 */
const filterRequests = () => {
  const userRole = localStorage.getItem('mta_user_role_fms');

  if (userRole === 'User' || userRole === 'Admin') {
    if (userRole === 'Admin') {
      adminhomepage.style.display = 'block';
    }
    const searchText = filterRequestInput.value;
    const requestStatus = filterByStatus.value;
    const url = `/api/v1/users/requests/filter?searchText=${searchText}&status=${requestStatus}&page=1`;

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
            { id: 'homepage' },
            'Track your maintenance request - MTA',
            `./homepage.html?searchText=${searchText}&status=${requestStatus}&page=1`,
          );
        }
      });
  } else {
    window.location = './index.html';
  }
};

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

createRequestForm.addEventListener('submit', createUserRequest);
createRequestButton.addEventListener('click', createRequest);
filterByStatus.addEventListener('change', filterRequests);
window.onload = getRequests();

window.onclick = (event) => {
  if (event.target === viewRequestModal) {
    checkReloadPage(viewRequestModal);
  } else if (event.target === createRequestModal) {
    const form = document.getElementById('createRequestForm');
    const {
      title, description,
    } = form.elements;
    title.value = '';
    description.value = '';
    document.getElementById('createErrorMessage').innerHTML = '';
    checkReloadPage(createRequestModal);
  } else if (event.target === editRequestModal) {
    document.getElementById('editErrorMessage').innerHTML = '';
    viewRequestModal.style.display = 'none';
    checkReloadPage(editRequestModal);
  } else if (event.target === confirmDeleteModal) {
    checkReloadPage(confirmDeleteModal);
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
  if (createRequestSpan != null) {
    createRequestSpan.onclick = () => {
      const form = document.getElementById('createRequestForm');
      const {
        title, description,
      } = form.elements;
      title.value = '';
      description.value = '';
      document.getElementById('createErrorMessage').innerHTML = '';
      checkReloadPage(createRequestModal);
    };
  }
  if (editRequestSpan != null) {
    editRequestSpan.onclick = () => {
      document.getElementById('editErrorMessage').innerHTML = '';
      viewRequestModal.style.display = 'none';
      checkReloadPage(editRequestModal);
    };
  }
  if (confirmDeleteSpan != null) {
    confirmDeleteSpan.onclick = () => {
      checkReloadPage(confirmDeleteModal);
    };
  }
});
