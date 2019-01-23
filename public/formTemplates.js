const forms = {
  login: () => `<h2 style="margin-left:20px;">Login to comment</h2>
  <form action="/login" method="POST" style="padding:10px; margin-left: 30px;">
  Name:
  <input type="text" name="name" required>
  <input type="submit" value="Login" style="background-color: lightgray" >
  </form>
  <br><br>`,
  commentForm: function(name) {
    return `
	<h2 style="margin-left:20px;">Leave a comment</h2>
	<form action="/logout" method="POST" style="padding:10px; margin-left: 30px;">
		Name: ${name}
		<input type="submit" value="Logout" style="background-color: lightgray" >
		</form>
		<div style="padding:10px; margin-left: 30px;">
		<form method="POST">
		Comment:
		<textarea name="comment" type="text" id="comment" style="width:150px; height:8"></textarea>
		<br><br>
		<input type="submit" style="background-color: lightgray" value="Submit">
		</form>
		</div>`;
  }
};

module.exports = forms;
