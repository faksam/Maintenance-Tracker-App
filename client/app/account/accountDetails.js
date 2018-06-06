const accountDetailsForm = document.getElementById('accountDetailsForm');
const token = `Bearer ${sessionStorage.getItem('token')}`;

/**
 * @description - Consume API to get users account details
 *
 */
const displayAccountDetails = () => {
  const { fullName, email, phoneNo, role } = accountDetailsForm.elements;
  const url = '/api/v1/users/account';

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
        console.log(body);
      if (body.status === 200 && body.success === true) {
        console.log(fullName)
        fullName.value = body.data.fullName;
        email.value = body.data.email;
        phoneNo.value = body.data.phoneNo;
        role.value = body.data.role;
      }
    });
};

window.onload = displayAccountDetails();
