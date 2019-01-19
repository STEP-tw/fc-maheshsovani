const fs = require('fs');
const comments = require('./comments.json');
const { createTable, arrangeCommentDetails } = require('./main.js');

const getFilePath = function(url) {
  if (url == '/') {
    return './public/flowerCatalog.html';
  }
  return `.${url}`;
};

const sendResponse = function(res, content, statusCode = 200) {
  res.statusCode = statusCode;
  res.write(content);
  res.end();
};

const renderGuestBook = function(req, res) {
  fs.readFile('./public/guestBook.html', (err, data) => {
    data += createTable(comments);
    sendResponse(res, data);
  });
};

const handleGuestForm = function(req, res) {
  let content = '';
  req.on('data', chunk => {
    content += chunk;
  });
  req.on('end', () => {
    comments.unshift(arrangeCommentDetails(content));
    let dataToWrite = JSON.stringify(comments);
    fs.writeFile('./src/comments.json', dataToWrite, err => {
      return;
    });
  });
  renderGuestBook(req, res);
};

const handleRequest = function(req, res) {
  let filePath = getFilePath(req.url);
  fs.readFile(filePath, (err, content) => {
    if (err) {
      sendResponse(res, 'Not Found', 404);
      return;
    }
    sendResponse(res, content);
    return;
  });
};

const app = (req, res) => {
  if (req.url == '/public/guestBook.html' && req.method == 'POST') {
    handleGuestForm(req, res);
    return;
  }

  if (req.url == '/public/guestBook.html' && req.method == 'GET') {
    renderGuestBook(req, res);
    return;
  }
  handleRequest(req, res);
};
module.exports = app;
