/* eslint-env jquery */
/* eslint func-names: ["error", "never"] */
$(document).ready(() => {
  // Navigation
  // If a link has a dropdown, add sub menu toggle.
  $('nav ul li a:not(:only-child)').click(function (e) {
    $(this).siblings('.nav-dropdown').toggle();
    // Close one dropdown when selecting another
    $('.nav-dropdown').not($(this).siblings()).hide();
    e.stopPropagation();
  });
  // Clicking away from dropdown will remove the dropdown class
  $('html').click(() => {
    $('.nav-dropdown').hide();
  });
  // Toggle open and close nav styles on click
  $('#nav-toggle').click(() => {
    $('nav ul').slideToggle();
  });
  // Hamburger to X toggle
  $('#nav-toggle').on('click', function () {
    this.classList.toggle('active');
  });

  // Get the signupModal

  // Get the button that opens the modal
  // Get signupModal
  const signUpModal = document.getElementById('signupModal');
  // Get the signinModal
  const signInModal = document.getElementById('signinModal');

  // Get the viewRequestModal
  const viewRequestModal = document.getElementById('viewRequestModal');


  const editRequestModal = document.getElementById('editRequestModal');
  const editRequestSpan = document.getElementById('editRequestSpan');

  const createRequestModal = document.getElementById('createRequestModal');
  const createRequestSpan = document.getElementById('createRequestSpan');
  const viewRequestSpan = document.getElementById('viewRequestSpan');

  // Get the <span> element that closes the modal

  // Get the button that opens the modal
  const signInBtn = document.getElementById('signinBtn');
  const signUpBtn = document.getElementById('signupBtn');

  if (signUpBtn != null || signInBtn != null) {
    const signUpSpan = document.getElementById('signupSpan');
    const signInSpan = document.getElementById('signinSpan');

    // Get the <span> element that closes the modal

    // When the user clicks the button, open the modal
    signUpBtn.onclick = function () {
      signUpModal.style.display = 'block';
    };

    // When the user clicks the button, open the modal
    signInBtn.onclick = function () {
      signInModal.style.display = 'block';
    };

    if (signUpSpan != null || signInSpan != null) {
      // When the user clicks on <span> (x), close the modal
      signUpSpan.onclick = function () {
        signUpModal.style.display = 'none';
      };
      signInSpan.onclick = function () {
        signInModal.style.display = 'none';
      };
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
      if (event.target === signUpModal) {
        signUpModal.style.display = 'none';
      } else if (event.target === signInModal) {
        signInModal.style.display = 'none';
      } else if (event.target === viewRequestModal) {
        viewRequestModal.style.display = 'none';
      }
    };
  }
  if (viewRequestSpan != null) {
    // When the user clicks on <span> (x), close the modal
    viewRequestSpan.onclick = function () {
      viewRequestModal.style.display = 'none';
    };
  }
  window.onclick = function (event) {
    if (event.target === viewRequestModal) {
      viewRequestModal.style.display = 'none';
    }
  };

  if (viewRequestSpan != null || createRequestSpan != null || editRequestSpan != null) {
    // When the user clicks on <span> (x), close the modal
    viewRequestSpan.onclick = function () {
      viewRequestModal.style.display = 'none';
    };
    createRequestSpan.onclick = function () {
      createRequestModal.style.display = 'none';
    };
    editRequestSpan.onclick = function () {
      editRequestModal.style.display = 'none';
    };
  }
  window.onclick = function (event) {
    if (event.target === viewRequestModal) {
      viewRequestModal.style.display = 'none';
    } else if (event.target === createRequestModal) {
      createRequestModal.style.display = 'none';
    } else if (event.target === editRequestModal) {
      editRequestModal.style.display = 'none';
    }
  };

}); // end DOM ready

//when table row is clicked
function clickedRequest(x) {
  viewRequestModal.style.display = 'block';
}
//Approve Request
function approveRequest() {
  viewRequestModal.style.display = 'block';
}
//Reject request
function rejectRequest() {
  viewRequestModal.style.display = 'block';
}

//when table row is clicked
function clickedRequest(x) {
  viewRequestModal.style.display = 'block';
}
function createRequest() {
  createRequestModal.style.display = 'block';
}
function editRequest() {
  editRequestModal.style.display = 'block';
}

function order() {
  signInModal.style.display = "block";
}