const fs = require('fs');

const getFilePath = function(url) {
  if (url == '/') {
    return './flowerCatalog.html';
  }
  return `.${url}`;
};

const app = (req, res) => {
  let filePath = getFilePath(req.url);

  fs.readFile(filePath, (err, content) => {
    try {
      res.statusCode = 200;
      res.write(content);
      res.end();
    } catch (err) {
      res.statusCode = 404;
      res.write('this file does not exist');
      res.end();
    }
  });
};

module.exports = app;
