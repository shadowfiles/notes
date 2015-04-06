window.onload = function () {
	var localStorage = window.localStorage;
	if(typeof(Storage) !== "undefined") {
		var session = new NoteSession(localStorage);
		session.load();
		

		// Add event handlers for syncing.
	  var inputs = document.getElementsByClassName("input");
	  for (var i = 0; i < inputs.length; i++) {
	  	inputs[i].addEventListener("change", session.sync);
	  	inputs[i].addEventListener("click", session.sync);
	  }

	} else {
	   // No local storage support! 
	   titleBody.innerHTML = "Your browser does not support local storage!" 
	   											+ " Unfortunately, Notes will not work properly. ";
	}
}

function NoteSession (s) {
	var storage = s;
	var notebook = new Notebook(); 
	var page = 1; 

	var titleBody = document.getElementById("note-title");
	var textBody = document.getElementById("note-body");

	this.sync = function () {
		notebook.setPageTitle(page, getTitle());
		notebook.setPageContent(page, getText());

		storage.notebook = notebook.serialize();
		storage.page = page;
	}

	this.load = function () {
		if (storage.notebook) {
			page = storage.page * 1;

			notebook = new Notebook(JSON.parse(storage.notebook));
			if (notebook.pageCount() < 1) {
				notebook.addPage(new Note({"title": getTitle(), "content": getText()}));
				page = 1;
			}

			setText(notebook.getPageContent(page));
			setTitle(notebook.getPageTitle(page));
		} else {
			notebook = new Notebook({"title": "Default Notebook"});
			notebook.addPage(new Note({"title": getTitle(), "content": getText()}));
		}
	}

	function setText (text) {
		textBody.value = text;
		textBody.innerHTML = text;
	}

	function setTitle (title) {
		titleBody.value = title;
	}

	function getText () {
		return textBody.value || textBody.innerHTML;
	}

	function getTitle () {
		return titleBody.value;
	}
}