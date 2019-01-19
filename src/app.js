const fs = require('fs');
const comments = require('./comments.json');
const { createTable, arrangeCommentDetails } = require('./main.js');

const getFilePath = function(url) {
  if (url == '/') {
    return './flowerCatalog.html';
  }
  return `.${url}`;
};

const renderGuestBook = function(res) {
  fs.readFile('./src/guestBook.html', (err, data) => {
    data += createTable(comments);
    res.write(data);
    res.end();
  });
};

const app = (req, res) => {
  if (req.url == '/src/guestBook.html' && req.method == 'POST') {
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
    renderGuestBook(res);
    return;
  }

  if (req.url == '/src/guestBook.html' && req.method == 'GET') {
    renderGuestBook(res);
    return;
  }

  let filePath = getFilePath(req.url);
  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.statusCode = 404;
      res.write('Not Found');
      res.end();
      return;
    }
    res.statusCode = 200;
    res.write(content);
    res.end();
    return;
  });
};
module.exports = app;
