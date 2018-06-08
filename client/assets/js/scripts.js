/* eslint-env jquery */
/* eslint func-names: ["error", "never"] */
/**
 * @description - On Page Ready
 */
$(document).ready(() => {
  $('nav ul li a:not(:only-child)').click(function (e) {
    $(this).siblings('.nav-dropdown').toggle();

    $('.nav-dropdown').not($(this).siblings()).hide();
    e.stopPropagation();
  });

  $('html').click(() => {
    $('.nav-dropdown').hide();
  });

  $('#nav-toggle').click(() => {
    $('nav ul').slideToggle();
  });

  $('#nav-toggle').on('click', function () {
    this.classList.toggle('active');
  });

  const signUpModal = document.getElementById('signupModal');

  const signInModal = document.getElementById('signinModal');

  const signInBtn = document.getElementById('signinBtn');
  const signUpBtn = document.getElementById('signupBtn');

  if (signUpBtn != null || signInBtn != null) {
    const signUpSpan = document.getElementById('signupSpan');
    const signInSpan = document.getElementById('signinSpan');

    signUpBtn.onclick = function () {
      signUpModal.style.display = 'block';
    };
    signInBtn.onclick = function () {
      signInModal.style.display = 'block';
    };

    if (signUpSpan != null || signInSpan != null) {
      signUpSpan.onclick = function () {
        signUpModal.style.display = 'none';
      };
      signInSpan.onclick = function () {
        signInModal.style.display = 'none';
      };
    }

    /**
     *
     * @param {event} event window click event anywhere outside of the modal
     */
    window.onclick = function (event) {
      if (event.target === signUpModal) {
        signUpModal.style.display = 'none';
      } else if (event.target === signInModal) {
        signInModal.style.display = 'none';
      }
    };
  }
});
