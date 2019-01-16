const fs = require('fs');

const app = (req, res) => {
  if (req.url == '/') {
    fs.readFile('./src/indexer.html', 'utf8', (err, data) => {
      res.write(data);
      res.statusCode = 200;
      res.end();
    });
  }
  if (req.url == '/src/images/freshorigins.jpg') {
    fs.readFile('./src/images/freshorigins.jpg', (err, data) => {
      res.write(data);
      res.statusCode = 200;
      res.end();
    });
  }
  if (req.url == '/src/images/animated-flower-image-0021.gif') {
    fs.readFile('./src/images/animated-flower-image-0021.gif', (err, data) => {
      res.write(data);
      res.statusCode = 200;
      res.end();
    });
  }
};

module.exports = app;
