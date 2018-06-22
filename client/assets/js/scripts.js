/* eslint-env jquery */
/* eslint func-names: ["error", "never"] */
/**
 * @description - On Dom Content Loaded
 */

document.addEventListener('DOMContentLoaded', () => {
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
});
