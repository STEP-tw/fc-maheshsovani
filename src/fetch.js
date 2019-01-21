const fetchComments = () => {
  fetch('/public/guestBook.html')
    .then(function(response) {
      return response.text();
    })
    .then(function(data) {
      let doc = document.createElement('html');
      doc.innerHTML = data;
      let id = document.getElementById('userComments');
      id.innerHTML = doc.getElementsByClassName('comments')[0].innerHTML;
    });
};
