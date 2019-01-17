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
    res.statusCode = 200;
    res.write(content);
    res.end();
  });
};

module.exports = app;
