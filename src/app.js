const fs = require('fs');

const app = (req, res) => {
  if (req.url == '/favicon.ico') {
    res.statusCode = 404;
    res.end();
  }
  if (req.url) {
    fs.readFile('.' + req.url, (err, content) => {
      res.statusCode = 200;
      res.write(content);
      res.end();
    });
  } else {
    res.statusCode = 404;
    res.end();
  }
};

module.exports = app;
