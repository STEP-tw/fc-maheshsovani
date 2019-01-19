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

const isMatching = function(req, route) {
  if (route.handler && !(route.method || route.url)) {
    return true;
  }
  if (route.method == req.method && route.url == req.url) {
    return true;
  }
  return false;
};

class App {
  constructor() {
    this.routes = [];
  }

  handler(req, res) {
    const matchedRoutes = this.routes.filter(isMatching.bind(null, req));
    console.log(matchedRoutes);

    let next = () => {
      if (matchedRoutes.length == 0) {
        return;
      }
      let currentRoute = matchedRoutes[0];
      matchedRoutes.shift();
      currentRoute.handler(req, res, next);
    };
    next();
  }

  get(url, handler) {
    this.routes.push({ url, handler, method: 'GET' });
  }

  post(url, handler) {
    this.routes.push({ url, handler, method: 'POST' });
  }

  use(handler) {
    this.routes.push({ handler });
  }
}
const app = new App();
const requestHandler = app.handler.bind(app);
app.use(renderMedia);
app.post('/public/guestBook.html', handleFormPost);

module.exports = requestHandler;
