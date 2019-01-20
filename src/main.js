const withTag = function(content, tag) {
  return `<${tag}>${content}</${tag}>`;
};

const createTableRow = function(object) {
  let row = '';
  row = row + withTag(object.time, 'td');
  row = row + withTag(object.name, 'td');
  row = row + withTag(object.comment, 'td');
  return withTag(row, 'tr');
};

const createTable = function(list) {
  let table = '';
  table += '<th>DATE_TIME</th><th>NAME</th><th>COMMENTS_LIST</th>';
  table += list.map(element => createTableRow(element)).join('');
  return withTag(table, 'table');
};

const arrangeCommentDetails = function(details) {
  let time = new Date().toLocaleString();
  let name = details.split('&')[0].split('=')[1];
  let comment = details.split('&')[1].split('=')[1];
  return { name, comment, time };
};

module.exports = { createTable, arrangeCommentDetails };
