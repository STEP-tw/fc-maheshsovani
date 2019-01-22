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
  let heading = ['NAME', 'DATE_TIME', 'COMMENT_LIST'];
  table += heading.map(e => withTag(e, 'th')).join('');
  table += list.map(element => createTableRow(element)).join('');
  table = withTag(table, 'table');
  return "<div id='userComments' class='comments'>" + table + '</div>';
};

const arrangeCommentDetails = function(details) {
  let time = new Date().toLocaleString();
  let name = details.split(/&|=/)[1];
  let comment = details.split(/&|=/)[3];
  [name, comment] = [name, comment].map(x => unescape(x).replace(/\+/g, ' '));
  return { name, comment, time };
};

module.exports = { createTable, arrangeCommentDetails };
