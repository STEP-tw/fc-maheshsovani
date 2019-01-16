const displayImage = function() {
  let jar = document.getElementById('jarImage');
  jar.style.visibility = 'visible';
};

const hideImage = function() {
  let jar = document.getElementById('jarImage');
  jar.style.visibility = 'hidden';
  setTimeout(displayImage, 1000);
};
