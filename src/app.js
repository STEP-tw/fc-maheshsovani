const fs = require('fs');
const App = require('./framework.js');
const app = new App();
const comments = require('./comments.json');
const { createTable, arrangeCommentDetails } = require('./main.js');

const getFilePath = function(url) {
  if (url == '/') return './public/flowerCatalog.html';
  return `./public${url}`;
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

const renderMedia = function(req, res) {
  let filePath = getFilePath(req.url);
  fs.readFile(filePath, (err, content) => {
    if (err) return sendResponse(res, 'Not Found', 404);
    sendResponse(res, content);
  });
};

const recordComments = function(req, res, content) {
  comments.unshift(arrangeCommentDetails(content));
  let dataToWrite = JSON.stringify(comments);
  fs.writeFile('./src/comments.json', dataToWrite, err => {
    renderGuestBook(req, res);
  });
};

const readBody = function(req, res) {
  let content = '';
  req.on('data', chunk => {
    content += chunk;
  });
  req.on('end', () => {
    recordComments(req, res, content);
  });
};

app.post('/guestBook.html', readBody);
app.get('/guestBook.html', renderGuestBook);
app.use(renderMedia);

module.exports = app.handler.bind(app);
