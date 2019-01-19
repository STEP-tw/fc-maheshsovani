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

class App {
  constructor() {
    this.routes = [];
  }

  handler(req, res) {
    const matchedRoutes = this.routes.filter(
      route => route.method == req.method && route.url == req.url
    );

    if (matchedRoutes.length > 0) {
      matchedRoutes[0].handler(req, res);
      return;
    }

    res.write('Sorry i dont have that info.');
    res.end();
  }

  get(url, handler) {
    this.routes.push({ url, handler, method: 'GET' });
  }

  post(url, handler) {
    this.routes.push({ url, handler, method: 'POST' });
  }
}
const app = new App();
const requestHandler = app.handler.bind(app);
app.get('/', renderMedia);
app.get('/public/images/animated-flower-image-0021.gif', renderMedia);
app.get('/public/images/pbase-Abeliophyllum.jpg', renderMedia);
app.get('/public/images/pbase-agerantum.jpg', renderMedia);
app.get('/public/images/freshorigins.jpg', renderMedia);
app.get('/public/media/Abeliophyllum.pdf', renderMedia);
app.get('/public/media/Ageratum.pdf', renderMedia);
app.get('/public/abeliophyllum.html', renderMedia);
app.get('/public/ageratum.html', renderMedia);
app.get('/public/flowerDescription.css', renderMedia);
app.get('/public/guestBook.css', renderMedia);
app.get('/public/stylesheet.css', renderMedia);
app.get('/public/guestBook.html', renderGuestBook);
app.post('/public/guestBook.html', handleFormPost);

module.exports = requestHandler;
