const fs = require('fs');
const App = require('./framework.js');
const app = new App();
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
  return;
};

const renderGuestBook = function(req, res) {
  fs.readFile('./public/guestBook.html', (err, data) => {
    data += createTable(comments);
    sendResponse(res, data);
    return;
  });
};

const renderMedia = function(req, res) {
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

const handleFormPost = function(req, res) {
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

app.post('/public/guestBook.html', handleFormPost);
app.get('/public/guestBook.html', renderGuestBook);
app.use(renderMedia);

module.exports = app.handler.bind(app);
