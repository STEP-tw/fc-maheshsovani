const hideImage = function() {
  let jar = document.getElementById('jarImage');
  jar.style.visibility = 'hidden';
  setTimeout(() => (jar.style.visibility = 'visible'), 1000);
};
