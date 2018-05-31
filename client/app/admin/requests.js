function getRequests() {
  const data = {};
  const url = '/api/v1/requests/';
  const form = document.getElementById('loginForm');

  const requestTable = document.getElementById('requestTable');
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
        for (const request of data) {
          console.log(request);
          // console.log(data[request].title)
          // if (request.id !== undefined) { data[elements[element].name] = elements[element].value; }
          const requestRow = requestTable.insertRow(1);

          // // Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
          const cell1 = requestRow.insertCell(0);
          const cell2 = requestRow.insertCell(1);
          const cell3 = requestRow.insertCell(2);
          const cell4 = requestRow.insertCell(3);
          const cell5 = requestRow.insertCell(4);
          const cell6 = requestRow.insertCell(5);

          // // Add some text to the new cells:
          cell1.innerHTML = 'NEW CELL1';
          cell2.innerHTML = 'NEW CELL2';
          cell3.innerHTML = 'NEW CELL1';
          cell4.innerHTML = 'NEW CELL2';

          cell2.colSpan = '3';
          // //name request status date
          cell1.innerHTML = request.title.bold();
          cell2.innerHTML = request.description.substring(0, 70);
          cell3.innerHTML = request.status;
          cell4.innerHTML = request.date;
          if (request.status === 'New') {
            requestRow.onclick = viewClickedRequest;
            requestRow.id = request.id;
            const btn = document.createElement('button');
            // editRequest
            btn.onclick = approveRequest;
            btn.id = request.id;
            const iTag = document.createElement('i');
            iTag.innerHTML = 'check';
            iTag.classList.add('material-icons');
            // var t = document.createTextNode(<i class="material-icons">edit</i>);       // Create a text node
            btn.appendChild(iTag);
            cell5.appendChild(btn);
            cell5.classList.add('admin');

            const btn1 = document.createElement('button');
            // editRequest
            btn1.onclick = rejectRequestReason;
            btn1.id = request.id;
            btn1.classList.add('danger');
            const iTag1 = document.createElement('i');
            iTag1.innerHTML = 'close';
            iTag1.classList.add('material-icons');
            // var t = document.createTextNode(<i class="material-icons">edit</i>);       // Create a text node
            btn1.appendChild(iTag1);
            cell6.appendChild(btn1);
          } else {
            requestRow.onclick = viewClickedRequest;
            requestRow.id = request.id;
          }
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
  console.log('in viewclickedrequest');
  const viewRequestTitle = document.getElementById('viewRequestTitle');
  const viewRequestDescription = document.getElementById('viewRequestDescription');
  const viewRequestUser = document.getElementById('viewRequestUser');
  const viewRequestDate = document.getElementById('viewRequestDate');
  const viewRequestButton = document.getElementById('viewRequestButton');
  const viewRequestStatus = document.getElementById('viewRequestStatus');

  const requestId = this.getAttribute('id');
  const url = `/api/v1/requests/${requestId}`;

  console.log(requestId);

  // request a weekday along with a long date
  const options = {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  };
  options.timeZone = 'UTC';
  options.timeZoneName = 'short';
  console.log(url);
  viewRequestModal.style.display = 'block';
  viewRequestButton.style.display = 'none';
  const data = {};

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
        console.log(body.data[0].status);
        if (body.data[0].status === 'New' || body.data[0].status === 'Pending') {
          viewRequestButton.style.display = 'block';
          // viewRequestButton.onclick = resolveRequest;
          viewRequestButton.id = requestId;
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

// Approve Request
function approveRequest() {
  viewRequestModal.style.display = 'block';

  console.log('in viewclickedrequest');
  const viewRequestTitle = document.getElementById('viewRequestTitle');
  const viewRequestDescription = document.getElementById('viewRequestDescription');
  const viewRequestUser = document.getElementById('viewRequestUser');
  const viewRequestDate = document.getElementById('viewRequestDate');
  const viewRequestButton = document.getElementById('viewRequestButton');
  const viewRequestStatus = document.getElementById('viewRequestStatus');
  const requestId = this.getAttribute('id');
  const url = `/api/v1/requests/${requestId}/approve`;
  // request a weekday along with a long date
  const options = {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  };
  options.timeZone = 'UTC';
  options.timeZoneName = 'short';
  console.log(url);
  viewRequestModal.style.display = 'block';
  viewRequestButton.style.display = 'none';
  const data = {};

  console.log('in view requests');

  const fetchData = {
    method: 'PUT',
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
        console.log(body.data[0].status);
        if (body.data[0].status === 'New' || body.data[0].status === 'Approved') {
          viewRequestButton.style.display = 'block';
        }
        console.log(body);
        console.log(sessionStorage.getItem('token'));
        // window.location = './homepage.html';
      } else {
        console.log(body);
      }
      window.location.reload(true);
    })
    .catch((error) => {
      console.log(JSON.stringify(error));
    });
}


// Reject request
function rejectRequest() {
  const data = {};
  viewRequestModal.style.display = 'block';
  const form = document.getElementById('rejectionReasonForm');
  const elements = form.elements;
  for (element in elements) {
    if (elements[element].value !== undefined) { data[elements[element].name] = elements[element].value; }
  }

  console.log('in viewclickedrequest');
  const viewRequestTitle = document.getElementById('viewRequestTitle');
  const viewRequestDescription = document.getElementById('viewRequestDescription');
  const viewRequestUser = document.getElementById('viewRequestUser');
  const viewRequestDate = document.getElementById('viewRequestDate');
  const viewRequestButton = document.getElementById('viewRequestButton');
  const viewRequestStatus = document.getElementById('viewRequestStatus');
  const requestId = this.getAttribute('id');
  const url = `/api/v1/requests/${requestId}/disapprove`;
  // request a weekday along with a long date
  const options = {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  };
  options.timeZone = 'UTC';
  options.timeZoneName = 'short';
  console.log(url);
  viewRequestModal.style.display = 'block';
  viewRequestButton.style.display = 'none';

  console.log('in view requests');

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
      console.log(body);
      if (body.status === 200 && body.success === true) {
        viewRequestTitle.innerHTML = body.data[0].title;
        viewRequestDescription.innerHTML = body.data[0].description;
        viewRequestUser.innerHTML = body.data[0].fullname;
        const date = new Date(body.data[0].date);
        viewRequestDate.innerHTML = date.toLocaleDateString('en-US', options);
        viewRequestStatus.innerHTML = body.data[0].status;
        console.log(body.data[0].status);
        if (body.data[0].status === 'New' || body.data[0].status === 'Approved') {
          viewRequestButton.style.display = 'block';
        }
        console.log(body);
        console.log(sessionStorage.getItem('token'));
        // window.location = './homepage.html';
      } else {
        console.log(body);
      }
      window.location.reload(true);
    })
    .catch((error) => {
      console.log(JSON.stringify(error));
    });
}

// Resolve request
function resolveRequest() {
  console.log('in viewclickedrequest');
  const viewRequestTitle = document.getElementById('viewRequestTitle');
  const viewRequestDescription = document.getElementById('viewRequestDescription');
  const viewRequestUser = document.getElementById('viewRequestUser');
  const viewRequestDate = document.getElementById('viewRequestDate');
  const viewRequestButton = document.getElementById('viewRequestButton');
  const viewRequestStatus = document.getElementById('viewRequestStatus');
  const requestId = this.getAttribute('id');
  const url = `/api/v1/requests/${requestId}/resolve`;
  // request a weekday along with a long date
  const options = {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  };
  options.timeZone = 'UTC';
  options.timeZoneName = 'short';
  console.log(url);
  viewRequestModal.style.display = 'block';
  viewRequestButton.style.display = 'none';
  const data = {};

  console.log('in view requests');

  const fetchData = {
    method: 'PUT',
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
        console.log(body.data[0].status);
        if (body.data[0].status === 'New' || body.data[0].status === 'Pending') {
          viewRequestButton.style.display = 'block';
        }
        console.log(body);
        console.log(sessionStorage.getItem('token'));
        // window.location = './homepage.html';
      } else {
        console.log(body);
      }
      window.location.reload(true);
    })
    .catch((error) => {
      console.log(JSON.stringify(error));
    });
}


// Reject request
function rejectRequestReason() {
  const requestId = this.getAttribute('id');
  console.log(requestId);
  const rejectionReasonButton = document.getElementById('rejectionReasonButton');
  rejectionReasonButton.onclick = rejectRequest;
  rejectionReasonButton.id = requestId;

  // rejectionReasonButton
  addRejectReasonModal.style.display = 'block';
}
