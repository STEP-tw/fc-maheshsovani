const fs = require('fs');
const forms = require('../public/formTemplates');
const App = require('./framework.js');
const app = new App();
const comments = require('./comments.json');
const { createTable, arrangeCommentDetails } = require('./main.js');
const guestBookTemplate = fs.readFileSync('./public/guestBook.html', 'utf8');

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
  let table = createTable(comments);
  let data = guestBookTemplate.replace('_commentsTable_', table);
  if (req.cookies.username) {
    let userName = req.cookies.username;
    let content = data.replace('_form_', forms.commentForm(userName));
    sendResponse(res, content);
    return;
  }
  sendResponse(res, data.replace('_form_', forms.login()));
  return;
};

const renderMedia = function(req, res) {
  let filePath = getFilePath(req.url);
  fs.readFile(filePath, (err, content) => {
    if (err) return sendResponse(res, 'Not Found', 404);
    sendResponse(res, content);
  });
};

const recordComments = function(req, res, content) {
  let userName = req.cookies.username;
  let userDetails = 'username=' + userName + '&' + content;
  comments.unshift(arrangeCommentDetails(userDetails));
  let dataToWrite = JSON.stringify(comments);
  fs.writeFile('./src/comments.json', dataToWrite, err => {
    renderGuestBook(req, res);
    res.end();
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

const renderLoginPage = function(req, res, next) {
  let content = '';
  req.on('data', chunk => (content += chunk));
  req.on('end', () => {
    let username = content.split('=')[1];
    res.setHeader('Set-Cookie', 'username=' + username);

    res.writeHead(302, {
      Location: '/guestBook.html'
    });
    res.end();
  });
};

const renderLogoutPage = function(req, res, next) {
  res.setHeader(
    'Set-Cookie',
    'username=;expires=Thu, 01 Jan 1970 00:00:00 UTC'
  );
  res.writeHead(302, {
    Location: '/guestBook.html'
  });
  res.end();
};

const loadCookies = function(req, res, next) {
  let cookie = req.headers['cookie'];
  let cookies = {};
  if (cookie) {
    cookie.split(';').forEach(element => {
      let [name, value] = element.split('=');
      cookies[name] = value;
    });
  }
  req.cookies = cookies;
  next();
};

app.use(loadCookies);
app.post('/login', renderLoginPage);
app.post('/logout', renderLogoutPage);
app.post('/guestBook.html', readBody);
app.get('/guestBook.html', renderGuestBook);
app.use(renderMedia);

module.exports = app.handler.bind(app);
