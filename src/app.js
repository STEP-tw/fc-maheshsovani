const fs = require('fs');

const getFilePath = function(url) {
  if (url == '/') {
    return './flowerCatalog.html';
  }
  return `.${url}`;
};

const app = (req, res) => {
  let filePath = getFilePath(req.url);
  if (req.method == 'GET') {
    fs.readFile(filePath, (err, content) => {
      try {
        res.statusCode = 200;
        res.write(content);
        res.end();
      } catch (err) {
        res.statusCode = 404;
        res.write('Not Found');
        res.end();
      }
    });
  }
  if (req.url == '/guestBook.html') {
    let content = '';
    req.on('data', chunk => {
      content += chunk;
    });
    req.on('end', () => {
      fs.appendFileSync('./comments.json', '\n' + content, 'utf8');
    });
  }
};

module.exports = app;
